import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

// Pesepay API endpoints
const PESEPAY_BASE_URL = Deno.env.get('PESEPAY_ENVIRONMENT') === 'production'
  ? 'https://api.pesepay.com'
  : 'https://api.pesepay.com'; // TODO: Confirm sandbox URL if different

// Get Pesepay credentials for a specific merchant/country
async function getPesepayCredentials(supabaseClient: any, userId: string, countryCode: string) {
  // First check if merchant has their own credentials
  const { data: merchantConfig } = await supabaseClient
    .from('merchant_payment_configs')
    .select('*')
    .eq('user_id', userId)
    .eq('provider', 'pesepay')
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
    .eq('provider', 'pesepay')
    .eq('country_code', countryCode)
    .eq('environment', Deno.env.get('PESEPAY_ENVIRONMENT') || 'sandbox')
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
  const envKey = Deno.env.get('PESEPAY_CONSUMER_KEY');
  const envSecret = Deno.env.get('PESEPAY_CONSUMER_SECRET');
  const envIpnId = Deno.env.get('PESEPAY_IPN_ID');
  
  if (envKey && envSecret) {
    console.log('Using fallback environment credentials');
    return {
      consumer_key: envKey,
      consumer_secret: envSecret,
      ipn_id: envIpnId,
    };
  }

  // No credentials found - throw helpful error
  throw new Error(`COUNTRY_NOT_SUPPORTED: Pesepay is not currently available in ${countryCode}. Please try a different payment method or contact support.`);
}

// TODO: Update authentication method based on Pesepay API documentation
async function getPesepayToken(credentials: { consumer_key: string; consumer_secret: string }) {
  console.log('Requesting Pesepay authentication token...');
  
  // PLACEHOLDER: Update endpoint and request format based on Pesepay API documentation
  const response = await fetch(`${PESEPAY_BASE_URL}/api/auth/token`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: credentials.consumer_key,
      api_secret: credentials.consumer_secret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Pesepay auth error:', errorText);
    throw new Error(`Pesepay authentication failed: ${errorText}`);
  }

  const data = await response.json();
  console.log('Pesepay token received successfully');
  // TODO: Update based on actual Pesepay response structure
  return data.token || data.access_token || data.accessToken;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    console.log('Received request body:', JSON.stringify(body, null, 2));
    
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
    let merchantCountry = 'ZW'; // Default to Zimbabwe

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
      merchantCountry = profile?.country || 'ZW';
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
      merchantCountry = profile?.country || 'ZW';
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
      merchantCountry = profile?.country || 'ZW';
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
      merchantCountry = profile?.country || 'ZW';
    }

    // Create transaction record
    const transactionId = crypto.randomUUID();
    
    // Extract phone number from request body if available
    const customerPhone = (body as any).customerDetails?.phone || '';
    
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
          payer_phone: customerPhone,
          item_id: itemId,
          quantity: quantity,
        },
      });

    if (txError) {
      console.error('Transaction insert error:', txError);
      throw new Error('Failed to create transaction');
    }

    // Get Pesepay credentials based on merchant's country
    // Note: Pesepay uses "Integration Key" (consumer_key) and "Encryption Key" (consumer_secret)
    const credentials = await getPesepayCredentials(supabase, userId, merchantCountry);
    console.log(`Using credentials for country: ${merchantCountry}`);

    // Prepare callback URLs - use the app's actual domain
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const projectId = supabaseUrl.replace('https://', '').split('.')[0];
    const resultUrl = `https://${projectId}.lovable.app/payment-callback?transaction_id=${transactionId}`;
    const returnUrl = `https://${projectId}.lovable.app/payment-cancel?transaction_id=${transactionId}`;
    
    console.log('Result URL:', resultUrl);

    // Submit order to Pesepay
    // Based on Pesepay API: https://api.pesepay.com/api/payments-engine/v2/payments/make-payment
    // Integration Key goes in Authorization header
    // Request body must be encrypted using Encryption Key
    console.log('Submitting order to Pesepay...');
    
    // Map payment method to Pesepay payment method codes
    // TODO: Confirm exact payment method codes with Pesepay documentation
    const paymentMethodCode = paymentMethod === 'mobile_money' ? 'MOBILE_MONEY' : 'BANK_TRANSFER';
    
    // Build transaction payload (before encryption)
    const transactionPayload = {
      amountDetails: {
        amount: amount,
        currencyCode: currency,
      },
      merchantReference: transactionId,
      reasonForPayment: description,
      resultUrl: resultUrl,
      returnUrl: returnUrl,
      paymentMethodCode: paymentMethodCode,
      customer: {
        email: payerEmail,
        phoneNumber: customerPhone || '',
        name: payerName,
      },
      // paymentMethodRequiredFields: {} // Optional - add if needed for specific payment methods
    };

    // Encrypt the payload using Encryption Key
    const encryptedPayload = await encryptPayload(transactionPayload, credentials.consumer_secret);
    
    // Make request with encrypted payload
    const orderResponse = await fetch(`${PESEPAY_BASE_URL}/api/payments-engine/v2/payments/make-payment`, {
      method: 'POST',
      headers: {
        'Authorization': credentials.consumer_key, // Integration Key in Authorization header
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payload: encryptedPayload,
      }),
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error('Pesepay order error:', errorText);
      throw new Error(`Pesepay order submission failed: ${errorText}`);
    }

    const responseData = await orderResponse.json();
    console.log('Pesepay response received (encrypted):', responseData);

    // Decrypt the response payload
    const orderData = await decryptPayload(responseData.payload, credentials.consumer_secret);
    console.log('Order submitted successfully (decrypted):', orderData);

    // Update transaction with Pesepay tracking ID (preserving existing metadata)
    const { data: existingTx } = await supabase
      .from('transactions')
      .select('metadata')
      .eq('id', transactionId)
      .single();

    // Pesepay response structure (after decryption):
    // - pollUrl: URL to redirect customer to complete payment
    // - referenceNumber: Reference number for status checking
    // - success: Boolean indicating if request was successful
    const referenceNumber = orderData.referenceNumber || orderData.merchantReference || transactionId;
    const pollUrl = orderData.pollUrl || orderData.paymentUrl || orderData.redirectUrl;

    await supabase
      .from('transactions')
      .update({
        reference: referenceNumber,
        metadata: {
          ...(existingTx?.metadata || {}),
          pesepay_reference: referenceNumber,
          pesepay_poll_url: pollUrl,
          pesepay_response: orderData,
        },
      })
      .eq('id', transactionId);

    // Pesepay returns pollUrl for redirecting customer
    if (!pollUrl) {
      throw new Error('No redirect URL (pollUrl) received from Pesepay');
    }

    return new Response(
      JSON.stringify({
        success: true,
        redirect_url: pollUrl,
        order_tracking_id: referenceNumber,
        transaction_id: transactionId,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[Internal] Error in pesepay-submit-order:', error);
    console.error('Error stack:', error.stack);
    
    // Return generic error to client, log details server-side
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
      return new Response(
        JSON.stringify({ error: 'INVALID_INPUT', code: 'E003', details: error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'PAYMENT_FAILED', code: 'E004', message: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

