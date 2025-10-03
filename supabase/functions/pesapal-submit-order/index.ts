import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PESAPAL_BASE_URL = Deno.env.get('PESAPAL_ENVIRONMENT') === 'production'
  ? 'https://pay.pesapal.com/v3'
  : 'https://cybqa.pesapal.com/pesapalv3';

async function getPesapalToken() {
  const consumer_key = Deno.env.get('PESAPAL_CONSUMER_KEY');
  const consumer_secret = Deno.env.get('PESAPAL_CONSUMER_SECRET');

  console.log('Requesting Pesapal authentication token...');
  
  const response = await fetch(`${PESAPAL_BASE_URL}/api/Auth/RequestToken`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      consumer_key,
      consumer_secret,
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

    // Health check endpoint for admin UI: do not hit external APIs, just report configuration status
    if (body?.test === true) {
      const configured = Boolean(
        Deno.env.get('PESAPAL_CONSUMER_KEY') &&
        Deno.env.get('PESAPAL_CONSUMER_SECRET') &&
        Deno.env.get('PESAPAL_ENVIRONMENT')
      );
      return new Response(
        JSON.stringify({ configured }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const {
      linkCode,
      linkType, // 'payment', 'donation', 'catalogue', 'subscription'
      payerName,
      payerEmail,
      paymentMethod,
      itemId, // For catalogue items
      quantity, // For catalogue items
      donationAmount, // For donations
    } = body;

    console.log('Processing order for:', { linkCode, linkType, payerEmail });

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

      if (error || !data) throw new Error('Payment link not found');
      
      linkData = data;
      amount = parseFloat(data.amount);
      currency = data.currency;
      description = data.product_name;
      userId = data.user_id;
    } else if (linkType === 'donation') {
      const { data, error } = await supabase
        .from('donation_links')
        .select('*')
        .eq('link_code', linkCode)
        .eq('status', 'active')
        .single();

      if (error || !data) throw new Error('Donation link not found');
      
      linkData = data;
      // For donations, amount comes from the form
      amount = parseFloat(donationAmount);
      currency = data.currency;
      description = data.title;
      userId = data.user_id;
    } else if (linkType === 'catalogue') {
      const { data: catalogueItem, error: itemError } = await supabase
        .from('catalogue_items')
        .select('*, catalogues!inner(*)')
        .eq('id', itemId)
        .single();

      if (itemError || !catalogueItem) throw new Error('Catalogue item not found');

      linkData = catalogueItem;
      amount = parseFloat(catalogueItem.price) * (quantity || 1);
      currency = catalogueItem.catalogues.currency;
      description = `${catalogueItem.name} x ${quantity || 1}`;
      userId = catalogueItem.catalogues.user_id;
    } else if (linkType === 'subscription') {
      const { data, error } = await supabase
        .from('subscription_links')
        .select('*')
        .eq('link_code', linkCode)
        .eq('status', 'active')
        .single();

      if (error || !data) throw new Error('Subscription link not found');
      
      linkData = data;
      amount = parseFloat(data.amount);
      currency = data.currency;
      description = data.plan_name;
      userId = data.user_id;
    }

    // Create transaction record
    const transactionId = crypto.randomUUID();
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

    // Get Pesapal token
    const token = await getPesapalToken();

    // Get IPN notification ID (you'll need to register this first)
    const ipnId = Deno.env.get('PESAPAL_IPN_ID') || '';

    // Prepare callback URLs
    const baseUrl = Deno.env.get('SUPABASE_URL')?.replace('https://', '').split('.')[0] || '';
    const callbackUrl = `https://${baseUrl}.lovable.app/payment-callback?transaction_id=${transactionId}`;
    const cancelUrl = `https://${baseUrl}.lovable.app/payment-cancel?transaction_id=${transactionId}`;

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

    // Update transaction with Pesapal tracking ID
    await supabase
      .from('transactions')
      .update({
        reference: orderData.order_tracking_id,
        metadata: {
          link_code: linkCode,
          link_type: linkType,
          payer_name: payerName,
          payer_email: payerEmail,
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
    console.error('Error in pesapal-submit-order:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
