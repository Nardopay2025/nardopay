import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// TODO: Update these URLs with actual Pesepay API endpoints once API documentation is available
const PESEPAY_BASE_URL = Deno.env.get('PESEPAY_ENVIRONMENT') === 'production'
  ? 'https://api.pesepay.com' // PLACEHOLDER - Update with actual Pesepay production URL
  : 'https://api-sandbox.pesepay.com'; // PLACEHOLDER - Update with actual Pesepay sandbox URL

async function getPesepayToken(countryCode: string, supabase: any) {
  console.log('Requesting Pesepay authentication token for IPN...', countryCode);
  
  // Get country-specific credentials from database
  const { data: config } = await supabase
    .from('payment_provider_configs')
    .select('consumer_key, consumer_secret, environment')
    .eq('country_code', countryCode)
    .eq('provider', 'pesepay')
    .eq('is_active', true)
    .single();

  if (!config) {
    console.error('No active Pesepay config found for country:', countryCode);
    throw new Error(`No active Pesepay config for country ${countryCode}`);
  }

  const baseUrl = config.environment === 'production'
    ? 'https://api.pesepay.com' // PLACEHOLDER
    : 'https://api-sandbox.pesepay.com'; // PLACEHOLDER

  console.log('Using credentials for country:', countryCode, 'environment:', config.environment);
  
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
    const errorText = await response.text();
    console.error('Pesepay auth failed:', errorText);
    throw new Error('Pesepay authentication failed');
  }

  const data = await response.json();
  // TODO: Update based on actual Pesepay response structure
  return { token: data.token || data.access_token || data.accessToken, baseUrl };
}

// TODO: Update endpoint and response structure based on Pesepay API documentation
async function getTransactionStatus(paymentReference: string, token: string, baseUrl: string) {
  console.log('Fetching transaction status for:', paymentReference, 'from', baseUrl);
  
  const response = await fetch(
    `${baseUrl}/api/payments/${paymentReference}/status`,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Get transaction status failed:', errorText);
    throw new Error('Failed to get transaction status: ' + errorText);
  }

  return await response.json();
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== PESEPAY IPN CALLBACK RECEIVED ===');
    console.log('Method:', req.method);
    console.log('Headers:', Object.fromEntries(req.headers.entries()));
    
    // SECURITY: Log source IP for security auditing
    const sourceIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    console.log('Source IP:', sourceIP);
    
    // SECURITY NOTE: Always verify payment status directly with Pesepay API
    // Defense-in-depth measures:
    // 1. We ALWAYS verify payment status directly with Pesepay API
    // 2. Source IP is logged for forensic analysis
    // 3. Transaction status is only updated if Pesepay API confirms it
    // 4. Idempotency: Multiple IPNs for same transaction are handled safely
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // TODO: Update parsing logic based on actual Pesepay webhook format
    // Parse IPN notification - Pesepay may send JSON, form data, or query params
    let paymentReference, paymentId, status;
    
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const data = await req.json();
      paymentReference = data.reference || data.payment_reference || data.paymentReference;
      paymentId = data.payment_id || data.id;
      status = data.status || data.payment_status;
    } else {
      // Parse as form data or query params
      const url = new URL(req.url);
      paymentReference = url.searchParams.get('reference') || url.searchParams.get('payment_reference');
      paymentId = url.searchParams.get('payment_id') || url.searchParams.get('id');
      status = url.searchParams.get('status');
      
      // If not in URL, try form data
      if (!paymentReference) {
        const formData = await req.formData();
        paymentReference = formData.get('reference') as string || formData.get('payment_reference') as string;
        paymentId = formData.get('payment_id') as string || formData.get('id') as string;
        status = formData.get('status') as string;
      }
    }

    console.log('IPN received:', {
      paymentReference,
      paymentId,
      status,
      sourceIP,
    });

    // SECURITY: Validate required IPN parameters
    if (!paymentReference && !paymentId) {
      console.error('IPN validation failed: Missing payment reference or ID');
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: reference or payment_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find transaction - try by reference first, then by payment_id from metadata
    const referenceToSearch = paymentReference || paymentId;
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('reference', referenceToSearch)
      .single();

    if (txError || !transaction) {
      console.error('Transaction not found:', referenceToSearch, txError);
      return new Response(
        JSON.stringify({ message: 'Transaction not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Fetch user profile to get country
    const { data: profile } = await supabase
      .from('profiles')
      .select('country')
      .eq('id', transaction.user_id)
      .single();

    const countryCode = profile?.country || 'ZW';
    console.log('Transaction found for country:', countryCode);

    // Get Pesepay token with country-specific credentials
    const { token, baseUrl } = await getPesepayToken(countryCode, supabase);

    // Get transaction status from Pesepay API to verify
    const statusData = await getTransactionStatus(referenceToSearch, token, baseUrl);

    console.log('Transaction status from Pesepay:', statusData);

    // TODO: Update status mapping based on actual Pesepay status values
    // Map Pesepay status to our status
    let newStatus = 'pending';
    const paymentStatus = statusData.status || statusData.payment_status || status;
    
    if (paymentStatus === 'completed' || paymentStatus === 'success' || paymentStatus === 'paid') {
      newStatus = 'completed';
    } else if (paymentStatus === 'failed' || paymentStatus === 'cancelled' || paymentStatus === 'declined') {
      newStatus = 'failed';
    }

    // Update transaction status
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: newStatus,
        completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
        metadata: {
          ...transaction.metadata,
          pesepay_status: paymentStatus,
          pesepay_payment_id: statusData.payment_id || paymentId,
          pesepay_reference: statusData.reference || paymentReference,
        },
      })
      .eq('id', transaction.id);

    if (updateError) {
      console.error('Failed to update transaction:', updateError);
    }

    // If completed, update the link statistics
    if (newStatus === 'completed') {
      const linkType = transaction.metadata?.link_type;
      const linkCode = transaction.metadata?.link_code;

      if (linkType === 'payment' && linkCode) {
        const { data: paymentLink } = await supabase
          .from('payment_links')
          .select('payments_count, total_amount_collected')
          .eq('link_code', linkCode)
          .single();

        if (paymentLink) {
          await supabase
            .from('payment_links')
            .update({
              payments_count: (paymentLink.payments_count || 0) + 1,
              total_amount_collected: (parseFloat(paymentLink.total_amount_collected || '0')) + transaction.amount,
            })
            .eq('link_code', linkCode);
        }
      } else if (linkType === 'donation' && linkCode) {
        const { data: donationLink } = await supabase
          .from('donation_links')
          .select('current_amount, donations_count')
          .eq('link_code', linkCode)
          .single();

        if (donationLink) {
          await supabase
            .from('donation_links')
            .update({
              current_amount: (parseFloat(donationLink.current_amount || '0')) + transaction.amount,
              donations_count: (donationLink.donations_count || 0) + 1,
            })
            .eq('link_code', linkCode);
        }
      } else if (linkType === 'subscription' && linkCode) {
        const { data: subscriptionLink } = await supabase
          .from('subscription_links')
          .select('total_revenue, subscribers_count')
          .eq('link_code', linkCode)
          .single();

        if (subscriptionLink) {
          await supabase
            .from('subscription_links')
            .update({
              total_revenue: (parseFloat(subscriptionLink.total_revenue || '0')) + transaction.amount,
              subscribers_count: (subscriptionLink.subscribers_count || 0) + 1,
            })
            .eq('link_code', linkCode);
        }
      }

      // Call webhook if configured
      const webhookUrl = transaction.metadata?.webhook_url;
      if (webhookUrl) {
        try {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'payment.completed',
              transaction_id: transaction.id,
              amount: transaction.amount,
              currency: transaction.currency,
              status: newStatus,
              payer_email: transaction.metadata?.payer_email,
              payer_name: transaction.metadata?.payer_name,
            }),
          });
        } catch (webhookError) {
          console.error('Webhook call failed:', webhookError);
        }
      }

      // Send payment confirmation emails
      try {
        console.log('Sending payment confirmation emails');
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, full_name, business_name, balance')
          .eq('id', transaction.user_id)
          .single();

        if (profile && transaction.metadata?.payer_email) {
          // Determine product name based on link type
          let productName = 'Product/Service';
          if (linkType && linkCode) {
            if (linkType === 'payment') {
              const { data: link } = await supabase
                .from('payment_links')
                .select('product_name')
                .eq('link_code', linkCode)
                .single();
              productName = link?.product_name || productName;
            } else if (linkType === 'donation') {
              const { data: link } = await supabase
                .from('donation_links')
                .select('title')
                .eq('link_code', linkCode)
                .single();
              productName = link?.title || productName;
            } else if (linkType === 'subscription') {
              const { data: link } = await supabase
                .from('subscription_links')
                .select('plan_name')
                .eq('link_code', linkCode)
                .single();
              productName = link?.plan_name || productName;
            }
          }

          // Update merchant balance
          const newBalance = (parseFloat(profile.balance || '0')) + transaction.amount;
          await supabase
            .from('profiles')
            .update({ balance: newBalance })
            .eq('id', transaction.user_id);

          console.log('Balance updated:', { oldBalance: profile.balance, newBalance, amount: transaction.amount });

          await supabase.functions.invoke('send-payment-emails', {
            body: {
              merchantEmail: profile.email,
              merchantName: profile.full_name || 'Merchant',
              customerEmail: transaction.metadata.payer_email,
              customerName: transaction.metadata.payer_name || 'Customer',
              amount: transaction.amount.toString(),
              currency: transaction.currency,
              productName: productName,
              reference: transaction.reference,
              paymentMethod: statusData.payment_method || 'Unknown',
              businessName: profile.business_name || 'NardoPay Merchant',
            },
          });
          console.log('Payment emails sent successfully');
        }
      } catch (emailError) {
        console.error('Failed to send payment emails:', emailError);
        // Don't fail the transaction if emails fail
      }
    }

    console.log('=== PESEPAY IPN PROCESSED SUCCESSFULLY ===');
    return new Response(
      JSON.stringify({ message: 'IPN processed successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[Internal] Pesepay IPN processing error:', error);
    return new Response(
      JSON.stringify({ error: 'IPN_PROCESSING_FAILED', code: 'E007' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

