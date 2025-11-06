import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Input validation schema
const checkStatusSchema = z.object({
  transactionId: z.string().uuid(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// TODO: Update these URLs with actual Pesepay API endpoints once API documentation is available
const PESEPAY_BASE_URL = Deno.env.get('PESEPAY_ENVIRONMENT') === 'production'
  ? 'https://api.pesepay.com' // PLACEHOLDER - Update with actual Pesepay production URL
  : 'https://api-sandbox.pesepay.com'; // PLACEHOLDER - Update with actual Pesepay sandbox URL

async function getPesepayToken(countryCode: string, supabase: any) {
  console.log('Getting Pesepay token for country:', countryCode);
  
  const { data: config } = await supabase
    .from('payment_provider_configs')
    .select('consumer_key, consumer_secret, environment')
    .eq('country_code', countryCode)
    .eq('provider', 'pesepay')
    .eq('is_active', true)
    .single();

  if (!config) {
    throw new Error(`No active Pesepay config for country ${countryCode}`);
  }

  const baseUrl = config.environment === 'production'
    ? 'https://api.pesepay.com' // PLACEHOLDER
    : 'https://api-sandbox.pesepay.com'; // PLACEHOLDER

  // TODO: Update authentication endpoint and request format based on Pesepay API documentation
  const response = await fetch(`${baseUrl}/api/auth/token`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: config.consumer_key,
      api_secret: config.consumer_secret,
    }),
  });

  if (!response.ok) {
    throw new Error('Pesepay authentication failed');
  }

  const data = await response.json();
  // TODO: Update based on actual Pesepay response structure
  return { token: data.token || data.access_token || data.accessToken, baseUrl };
}

// Based on Pesepay API: Uses check_payment method with reference number
async function getTransactionStatus(paymentReference: string, credentials: { consumer_key: string; consumer_secret: string }, baseUrl: string) {
  console.log('Checking status for:', paymentReference);
  
  // Pesepay uses check_payment endpoint with Integration Key and Encryption Key
  const response = await fetch(
    `${baseUrl}/api/payments/check`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        integration_key: credentials.consumer_key,
        encryption_key: credentials.consumer_secret,
        reference_number: paymentReference,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get transaction status');
  }

  return await response.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'AUTH_REQUIRED' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify JWT
    const jwtToken = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwtToken);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'INVALID_TOKEN' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const validatedData = checkStatusSchema.parse(body);
    const { transactionId } = validatedData;

    // Get transaction and verify ownership
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .eq('user_id', user.id) // Verify ownership
      .single();

    if (txError || !transaction) {
      return new Response(
        JSON.stringify({ error: 'TRANSACTION_NOT_FOUND' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!transaction.reference) {
      throw new Error('Transaction has no Pesepay reference');
    }

    // Get user's country
    const { data: profile } = await supabase
      .from('profiles')
      .select('country')
      .eq('id', transaction.user_id)
      .single();

    const countryCode = profile?.country || 'ZW';

    // Get Pesepay credentials and check status
    // Pesepay uses Integration Key/Encryption Key directly, not token-based auth
    const { data: config } = await supabase
      .from('payment_provider_configs')
      .select('consumer_key, consumer_secret, environment')
      .eq('country_code', countryCode)
      .eq('provider', 'pesepay')
      .eq('is_active', true)
      .single();

    if (!config) {
      throw new Error(`No active Pesepay config for country ${countryCode}`);
    }

    const baseUrl = config.environment === 'production'
      ? 'https://api.pesepay.com' // TODO: Update with actual URL
      : 'https://api-sandbox.pesepay.com'; // TODO: Update with actual URL

    const credentials = {
      consumer_key: config.consumer_key,
      consumer_secret: config.consumer_secret,
    };

    const statusData = await getTransactionStatus(transaction.reference, credentials, baseUrl);

    console.log('Pesepay status:', statusData);

    // Based on Pesepay API: Response includes 'success' boolean and 'paid' boolean
    // Map status
    let newStatus = 'pending';
    const isPaid = statusData.paid || statusData.success === true && statusData.paid === true;
    const isSuccess = statusData.success === true;
    
    if (isPaid || (isSuccess && statusData.paid)) {
      newStatus = 'completed';
    } else if (statusData.success === false || statusData.paid === false) {
      newStatus = 'failed';
    }

    // Update transaction
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: newStatus,
        completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
        metadata: {
          ...transaction.metadata,
          pesepay_status: paymentStatus,
          pesepay_payment_id: statusData.payment_id,
          pesepay_reference: statusData.reference,
        },
      })
      .eq('id', transaction.id);

    if (updateError) {
      console.error('Failed to update transaction:', updateError);
    }

    // If completed, update balances
    if (newStatus === 'completed') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', transaction.user_id)
        .single();

      const newBalance = (parseFloat(profile?.balance || '0')) + transaction.amount;
      await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', transaction.user_id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: newStatus,
        pesepay_status: paymentStatus,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[Internal] Error checking status:', error);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'INVALID_INPUT', code: 'E005' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'STATUS_CHECK_FAILED', code: 'E006' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

