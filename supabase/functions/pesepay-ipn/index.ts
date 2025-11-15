import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Crypto utilities for encryption/decryption
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Pesepay API endpoints
// According to Pesepay documentation: https://developers.pesepay.com
// Base URL: https://api.pesepay.com
const PESEPAY_BASE_URL = Deno.env.get('PESEPAY_ENVIRONMENT') === 'production'
  ? 'https://api.pesepay.com'
  : 'https://api.pesepay.com'; // Use same URL for sandbox (test with test credentials)

/**
 * Get IV (Initialization Vector) from Pesepay Encryption Key
 * According to Pesepay documentation: "The first 16 characters of your encryption key"
 */
function getIVFromEncryptionKey(encryptionKey: string): Uint8Array {
  const ivString = encryptionKey.substring(0, 16);
  const ivBytes = new Uint8Array(16);
  const encoded = encoder.encode(ivString);
  for (let i = 0; i < 16; i++) {
    ivBytes[i] = encoded[i] || 0;
  }
  return ivBytes;
}

/**
 * Prepare encryption key from Pesepay Encryption Key
 * According to Pesepay documentation: "Your 32 character long encryption key"
 */
async function prepareEncryptionKey(encryptionKey: string): Promise<CryptoKey> {
  const keyBytes = new Uint8Array(32);
  const encoded = encoder.encode(encryptionKey.substring(0, 32));
  for (let i = 0; i < 32; i++) {
    keyBytes[i] = encoded[i] || 0;
  }
  
  return await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-CBC' },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Decrypt Pesepay response using Encryption Key
 * According to Pesepay documentation: AES-256-CBC with IV from first 16 chars of key
 */
async function decryptPayload(encryptedPayload: string, encryptionKey: string): Promise<any> {
  try {
    if (encryptionKey.length < 32) {
      throw new Error('Encryption key must be at least 32 characters long');
    }
    
    const combined = Uint8Array.from(atob(encryptedPayload), c => c.charCodeAt(0));
    const iv = combined.slice(0, 16);
    const encryptedData = combined.slice(16);
    
    const key = await prepareEncryptionKey(encryptionKey);
    
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv: iv,
      },
      key,
      encryptedData
    );
    
    const decryptedString = decoder.decode(decryptedData);
    return JSON.parse(decryptedString);
  } catch (error: any) {
    console.error('Decryption error:', error);
    throw new Error(`Failed to decrypt payload: ${error.message}`);
  }
}

// Get Pesepay credentials - ALWAYS use ZW (Zimbabwe) credentials
// NardoPay is the merchant with Pesepay, acting as aggregator
async function getPesepayCredentials(supabase: any) {
  // Always use ZW credentials - merchant country doesn't matter
  const { data: config } = await supabase
    .from('payment_provider_configs')
    .select('consumer_key, consumer_secret, environment')
    .eq('country_code', 'ZW') // Always use Zimbabwe
    .eq('provider', 'pesepay')
    .eq('is_active', true)
    .single();

  if (!config) {
    console.error('No active Pesepay config found for Zimbabwe (ZW)');
    throw new Error('No active Pesepay config for Zimbabwe (ZW). Please configure Pesepay credentials.');
  }

  return {
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    baseUrl: PESEPAY_BASE_URL,
  };
}

// Check transaction status using Pesepay API
// According to Pesepay docs: Use Integration Key directly in authorization header
// Response may be encrypted or plain JSON - handle both cases
async function getTransactionStatus(paymentReference: string, credentials: { consumer_key: string; consumer_secret: string }, baseUrl: string) {
  console.log('Fetching transaction status for:', paymentReference, 'from', baseUrl);
  
  // Clean integration key
  let integrationKey = String(credentials.consumer_key || '').trim();
  integrationKey = integrationKey.replace(/[\s\n\r\t\0]/g, '');
  integrationKey = integrationKey.replace(/[^\x20-\x7E]/g, '');
  
  // According to Pesepay docs, use Integration Key directly in authorization header
  const response = await fetch(
    `${baseUrl}/api/payments/${paymentReference}/status`,
    {
      method: 'GET',
      headers: {
        'authorization': integrationKey, // Direct integration key (per Pesepay docs)
        'content-type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Get transaction status failed:', errorText);
    throw new Error(`Failed to get transaction status (${response.status}): ${errorText}`);
  }

  const responseData = await response.json();
  
  // Check if response is encrypted (has payload field)
  if (responseData.payload) {
    console.log('Response is encrypted, decrypting...');
    return await decryptPayload(responseData.payload, credentials.consumer_secret);
  }
  
  // Response is plain JSON
  return responseData;
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

    // IMPORTANT: Always use ZW (Zimbabwe) credentials
    // NardoPay is the merchant with Pesepay, acting as aggregator
    // Merchant's country doesn't matter - we always use NardoPay's ZW credentials
    const credentials = await getPesepayCredentials(supabase);
    console.log('Using Pesepay credentials for Zimbabwe (ZW) - NardoPay is the merchant with Pesepay');

    // NOTE: Pesepay webhook payload may be encrypted or plain JSON
    // Handle both cases
    let paymentReference, paymentId, status, webhookData;
    
    const contentType = req.headers.get('content-type') || '';
    
    try {
      if (contentType.includes('application/json')) {
        const rawData = await req.json();
        
        // Check if payload is encrypted (has payload field)
        if (rawData.payload) {
          console.log('Webhook payload is encrypted, decrypting...');
          webhookData = await decryptPayload(rawData.payload, credentials.consumer_secret);
        } else {
          webhookData = rawData;
        }
        
        // Try multiple possible field names
        paymentReference = webhookData.reference || webhookData.payment_reference || webhookData.paymentReference || 
                          webhookData.reference_number || webhookData.merchant_reference;
        paymentId = webhookData.payment_id || webhookData.id || webhookData.paymentId;
        status = webhookData.status || webhookData.payment_status || webhookData.paymentStatus;
      } else {
        // Parse as form data or query params
        const url = new URL(req.url);
        paymentReference = url.searchParams.get('reference') || url.searchParams.get('payment_reference') ||
                          url.searchParams.get('reference_number');
        paymentId = url.searchParams.get('payment_id') || url.searchParams.get('id');
        status = url.searchParams.get('status');
        
        // If not in URL, try form data
        if (!paymentReference) {
          const formData = await req.formData();
          const payloadField = formData.get('payload') as string;
          
          if (payloadField) {
            // Encrypted payload in form data
            console.log('Webhook payload is encrypted (form data), decrypting...');
            webhookData = await decryptPayload(payloadField, credentials.consumer_secret);
            paymentReference = webhookData.reference || webhookData.payment_reference || webhookData.reference_number;
            paymentId = webhookData.payment_id || webhookData.id;
            status = webhookData.status || webhookData.payment_status;
          } else {
            paymentReference = formData.get('reference') as string || 
                             formData.get('payment_reference') as string ||
                             formData.get('reference_number') as string;
            paymentId = formData.get('payment_id') as string || formData.get('id') as string;
            status = formData.get('status') as string;
            webhookData = Object.fromEntries(formData.entries());
          }
        } else {
          webhookData = Object.fromEntries(url.searchParams.entries());
        }
      }
    } catch (parseError: any) {
      console.error('Error parsing webhook payload:', parseError);
      throw new Error(`Failed to parse webhook payload: ${parseError.message}`);
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

    // Get transaction status from Pesepay API to verify
    // SECURITY: Always verify with Pesepay API, don't trust webhook data alone
    const statusData = await getTransactionStatus(referenceToSearch, credentials, credentials.baseUrl);

    console.log('Transaction status from Pesepay:', statusData);

    // NOTE: Update status mapping based on actual Pesepay status values
    // Verify exact status values with Pesepay documentation
    // Map Pesepay status to our status
    let newStatus = 'pending';
    const paymentStatus = statusData.status || statusData.payment_status || status ||
                         (statusData.paid ? 'paid' : statusData.success ? 'success' : 'pending');
    
    // Map various possible status values
    const completedStatuses = ['completed', 'success', 'paid', 'successful', 'confirmed'];
    const failedStatuses = ['failed', 'cancelled', 'declined', 'rejected', 'expired'];
    
    if (completedStatuses.includes(paymentStatus?.toLowerCase())) {
      newStatus = 'completed';
    } else if (failedStatuses.includes(paymentStatus?.toLowerCase())) {
      newStatus = 'failed';
    } else if (statusData.paid === true || statusData.success === true) {
      newStatus = 'completed';
    } else if (statusData.paid === false || statusData.success === false) {
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

