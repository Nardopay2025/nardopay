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

async function getPesapalToken(countryCode: string, supabase: any) {
  console.log('Getting Pesapal token for country:', countryCode);
  
  const { data: config } = await supabase
    .from('payment_provider_configs')
    .select('consumer_key, consumer_secret, environment')
    .eq('country_code', countryCode)
    .eq('provider', 'pesapal')
    .eq('is_active', true)
    .single();

  if (!config) {
    throw new Error(`No active Pesapal config for country ${countryCode}`);
  }

  const baseUrl = config.environment === 'production'
    ? 'https://pay.pesapal.com/v3'
    : 'https://cybqa.pesapal.com/pesapalv3';

  const response = await fetch(`${baseUrl}/api/Auth/RequestToken`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      consumer_key: config.consumer_key,
      consumer_secret: config.consumer_secret,
    }),
  });

  if (!response.ok) {
    throw new Error('Pesapal authentication failed');
  }

  const data = await response.json();
  return { token: data.token, baseUrl };
}

async function getTransactionStatus(orderTrackingId: string, token: string, baseUrl: string) {
  console.log('Checking status for:', orderTrackingId);
  
  const response = await fetch(
    `${baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
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
      throw new Error('Transaction has no Pesapal reference');
    }

    // Get user's country
    const { data: profile } = await supabase
      .from('profiles')
      .select('country')
      .eq('id', transaction.user_id)
      .single();

    const countryCode = profile?.country || 'KE';

    // Get Pesapal token and check status
    const { token, baseUrl } = await getPesapalToken(countryCode, supabase);
    const statusData = await getTransactionStatus(transaction.reference, token, baseUrl);

    console.log('Pesapal status:', statusData);

    // Map status
    let newStatus = 'pending';
    if (statusData.payment_status_description === 'Completed') {
      newStatus = 'completed';
    } else if (statusData.payment_status_description === 'Failed' || statusData.payment_status_description === 'Invalid') {
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
          pesapal_status: statusData.payment_status_description,
          pesapal_method: statusData.payment_method,
          confirmation_code: statusData.confirmation_code,
        },
      })
      .eq('id', transaction.id);

    if (updateError) {
      console.error('Failed to update transaction:', updateError);
    }

    // If completed, update balances and send emails
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
        pesapal_status: statusData.payment_status_description,
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
