import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schemas
const submitOrderSchema = z.object({
  linkCode: z.string().length(16),
  linkType: z.enum(['payment', 'donation', 'catalogue', 'subscription']),
  payerName: z.string().trim().min(1).max(100),
  payerEmail: z.string().email().max(255),
  paymentMethod: z.string().max(50).optional(),
  itemId: z.string().uuid().optional(),
  quantity: z.number().int().positive().max(1000).optional(),
  donationAmount: z.number().positive().max(10000000).optional(),
});

const PESAPAL_BASE_URL = Deno.env.get('PESAPAL_ENVIRONMENT') === 'production'
  ? 'https://pay.pesapal.com/v3'
  : 'https://cybqa.pesapal.com/pesapalv3';

// Get Pesapal credentials for a specific merchant/country
async function getPesapalCredentials(supabaseClient: any, userId: string, countryCode: string) {
  // First check if merchant has their own credentials
  const { data: merchantConfig } = await supabaseClient
    .from('merchant_payment_configs')
    .select('*')
    .eq('user_id', userId)
    .eq('provider', 'pesapal')
    .eq('is_active', true)
    .maybeSingle();

  if (merchantConfig) {
    console.log('Using merchant-specific credentials');
    return {
      consumer_key: merchantConfig.consumer_key,
      consumer_secret: merchantConfig.consumer_secret,
      ipn_id: merchantConfig.ipn_id,
    };
  }

  // Otherwise use platform credentials for the country
  const { data: platformConfig } = await supabaseClient
    .from('payment_provider_configs')
    .select('*')
    .eq('provider', 'pesapal')
    .eq('country_code', countryCode)
    .eq('environment', Deno.env.get('PESAPAL_ENVIRONMENT') || 'sandbox')
    .eq('is_active', true)
    .maybeSingle();

  if (platformConfig) {
    console.log(`Using platform credentials for country: ${countryCode}`);
    return {
      consumer_key: platformConfig.consumer_key,
      consumer_secret: platformConfig.consumer_secret,
      ipn_id: platformConfig.ipn_id,
    };
  }

  // Fallback to environment variables
  console.log('Using fallback environment credentials');
  return {
    consumer_key: Deno.env.get('PESAPAL_CONSUMER_KEY'),
    consumer_secret: Deno.env.get('PESAPAL_CONSUMER_SECRET'),
    ipn_id: Deno.env.get('PESAPAL_IPN_ID'),
  };
}

async function getPesapalToken(credentials: { consumer_key: string; consumer_secret: string }) {
  console.log('Requesting Pesapal authentication token...');
  
  const response = await fetch(`${PESAPAL_BASE_URL}/api/Auth/RequestToken`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      consumer_key: credentials.consumer_key,
      consumer_secret: credentials.consumer_secret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Pesapal auth error:', errorText);
    throw new Error(`Pesapal authentication failed: ${errorText}`);
  }

  const data = await response.json();
  console.log('Pesapal token received successfully');
  return data.token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    
    // Validate input
    const validatedData = submitOrderSchema.parse(body);
    const {
      linkCode,
      linkType,
      payerName,
      payerEmail,
      paymentMethod,
      itemId,
      quantity,
      donationAmount,
    } = validatedData;

    console.log('Processing order for:', { linkCode, linkType, payerEmail });

    // Variable to store merchant country for credential lookup
    let merchantCountry = 'KE'; // Default to Kenya

    // Fetch link details based on type
    let linkData;
    let amount;
    let currency;
    let description;
    let userId;

    if (linkType === 'payment') {
      const { data, error } = await supabase
        .from('payment_links')
        .select('*')
        .eq('link_code', linkCode)
        .eq('status', 'active')
        .single();

      if (error || !data) {
        console.error('[Internal] Payment link not found:', linkCode, error);
        throw new Error('Resource not found');
      }
      
      linkData = data;
      amount = parseFloat(data.amount);
      currency = data.currency;
      description = data.product_name;
      userId = data.user_id;
      
      // Get merchant country
      const { data: profile } = await supabase
        .from('profiles')
        .select('country')
        .eq('id', userId)
        .single();
      merchantCountry = profile?.country || 'KE';
    } else if (linkType === 'donation') {
      const { data, error } = await supabase
        .from('donation_links')
        .select('*')
        .eq('link_code', linkCode)
        .eq('status', 'active')
        .single();

      if (error || !data) {
        console.error('[Internal] Donation link not found:', linkCode, error);
        throw new Error('Resource not found');
      }
      
      linkData = data;
      // For donations, amount comes from the form
      if (!donationAmount) {
        console.error('[Internal] Donation amount required for link:', linkCode);
        throw new Error('Invalid request');
      }
      amount = parseFloat(donationAmount.toString());
      currency = data.currency;
      description = data.title;
      userId = data.user_id;
      
      // Get merchant country
      const { data: profile } = await supabase
        .from('profiles')
        .select('country')
        .eq('id', userId)
        .single();
      merchantCountry = profile?.country || 'KE';
    } else if (linkType === 'catalogue') {
      const { data: catalogueItem, error: itemError } = await supabase
        .from('catalogue_items')
        .select('*, catalogues!inner(*)')
        .eq('id', itemId)
        .single();

      if (itemError || !catalogueItem) {
        console.error('[Internal] Catalogue item not found:', itemId, itemError);
        throw new Error('Resource not found');
      }

      linkData = catalogueItem;
      amount = parseFloat(catalogueItem.price) * (quantity || 1);
      currency = catalogueItem.catalogues.currency;
      description = `${catalogueItem.name} x ${quantity || 1}`;
      userId = catalogueItem.catalogues.user_id;
      
      // Get merchant country
      const { data: profile } = await supabase
        .from('profiles')
        .select('country')
        .eq('id', userId)
        .single();
      merchantCountry = profile?.country || 'KE';
    } else if (linkType === 'subscription') {
      const { data, error } = await supabase
        .from('subscription_links')
        .select('*')
        .eq('link_code', linkCode)
        .eq('status', 'active')
        .single();

      if (error || !data) {
        console.error('[Internal] Subscription link not found:', linkCode, error);
        throw new Error('Resource not found');
      }
      
      linkData = data;
      amount = parseFloat(data.amount);
      currency = data.currency;
      description = data.plan_name;
      userId = data.user_id;
      
      // Get merchant country
      const { data: profile } = await supabase
        .from('profiles')
        .select('country')
        .eq('id', userId)
        .single();
      merchantCountry = profile?.country || 'KE';
    }

    // Create transaction record
    const transactionId = crypto.randomUUID();
      // DATA PRIVACY NOTE: Customer PII stored in metadata includes:
      // - payer_name, payer_email (required for payment processing and receipts)
      // - link_code, link_type (for transaction reconciliation)
      // - item details (for order fulfillment)
      // 
      // DATA RETENTION: Implement retention policies per business/legal requirements
      // ACCESS CONTROL: Protected by RLS - only transaction owner (merchant) can view
      // COMPLIANCE: Consider GDPR right-to-erasure and data anonymization for analytics
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          id: transactionId,
          user_id: userId,
          amount,
          currency,
          type: linkType,
          status: 'pending',
          payment_method: paymentMethod,
          description,
          metadata: {
            link_code: linkCode,
            link_type: linkType,
            payer_name: payerName,
            payer_email: payerEmail,
            item_id: itemId,
            quantity: quantity,
          },
        });

    if (txError) {
      console.error('Transaction insert error:', txError);
      throw new Error('Failed to create transaction');
    }

    // Get Pesapal credentials based on merchant's country
    const credentials = await getPesapalCredentials(supabase, userId, merchantCountry);
    console.log(`Using credentials for country: ${merchantCountry}`);

    // Get Pesapal token
    const token = await getPesapalToken(credentials);

    // Get IPN notification ID from credentials
    const ipnId = credentials.ipn_id || '';

    // Prepare callback URLs - use the app's actual domain
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const projectId = supabaseUrl.replace('https://', '').split('.')[0];
    const callbackUrl = `https://${projectId}.lovable.app/payment-callback?transaction_id=${transactionId}`;
    const cancelUrl = `https://${projectId}.lovable.app/payment-cancel?transaction_id=${transactionId}`;
    
    console.log('Callback URL:', callbackUrl);

    // Submit order to Pesapal
    console.log('Submitting order to Pesapal...');
    const orderResponse = await fetch(`${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: transactionId,
        currency,
        amount,
        description,
        callback_url: callbackUrl,
        cancellation_url: cancelUrl,
        notification_id: ipnId,
        billing_address: {
          email_address: payerEmail,
          phone_number: '',
          country_code: '',
          first_name: payerName.split(' ')[0] || payerName,
          last_name: payerName.split(' ')[1] || '',
          line_1: '',
          line_2: '',
          city: '',
          state: '',
          postal_code: '',
          zip_code: '',
        },
      }),
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error('Pesapal order error:', errorText);
      throw new Error(`Pesapal order submission failed: ${errorText}`);
    }

    const orderData = await orderResponse.json();
    console.log('Order submitted successfully:', orderData);

    // Update transaction with Pesapal tracking ID (preserving existing metadata)
    const { data: existingTx } = await supabase
      .from('transactions')
      .select('metadata')
      .eq('id', transactionId)
      .single();

    await supabase
      .from('transactions')
      .update({
        reference: orderData.order_tracking_id,
        metadata: {
          ...(existingTx?.metadata || {}),
          pesapal_merchant_reference: orderData.merchant_reference,
          pesapal_redirect_url: orderData.redirect_url,
        },
      })
      .eq('id', transactionId);

    return new Response(
      JSON.stringify({
        success: true,
        redirect_url: orderData.redirect_url,
        order_tracking_id: orderData.order_tracking_id,
        transaction_id: transactionId,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[Internal] Error in pesapal-submit-order:', error);
    
    // Return generic error to client, log details server-side
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'INVALID_INPUT', code: 'E003' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'PAYMENT_FAILED', code: 'E004' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
