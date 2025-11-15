import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Crypto utilities for encryption/decryption
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Input validation schema
const checkStatusSchema = z.object({
  transactionId: z.string().uuid(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
  console.log('Checking status for:', paymentReference);
  
  // Clean integration key
  let integrationKey = String(credentials.consumer_key || '').trim();
  integrationKey = integrationKey.replace(/[\s\n\r\t\0]/g, '');
  integrationKey = integrationKey.replace(/[^\x20-\x7E]/g, '');
  
  // According to Pesepay docs, use Integration Key directly in authorization header
  // Try GET endpoint first (may return plain JSON or encrypted)
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
    console.error('Status check failed:', errorText);
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

    // IMPORTANT: Always use ZW (Zimbabwe) credentials
    // NardoPay is the merchant with Pesepay, acting as aggregator
    // Merchant's country doesn't matter - we always use NardoPay's ZW credentials
    const credentials = await getPesepayCredentials(supabase);
    console.log('Using Pesepay credentials for Zimbabwe (ZW) - NardoPay is the merchant with Pesepay');

    const statusData = await getTransactionStatus(transaction.reference, credentials, credentials.baseUrl);

    console.log('Pesepay status:', statusData);

    // Based on Pesepay API: Response includes 'success' boolean and 'paid' boolean
    // Map status - verify actual status values with Pesepay documentation
    let newStatus = 'pending';
    const paymentStatus = statusData.status || statusData.payment_status || 
                         (statusData.paid ? 'paid' : statusData.success ? 'success' : 'pending');
    const isPaid = statusData.paid === true || paymentStatus === 'paid' || paymentStatus === 'completed';
    const isSuccess = statusData.success === true || paymentStatus === 'success';
    
    if (isPaid || (isSuccess && statusData.paid === true)) {
      newStatus = 'completed';
    } else if (statusData.success === false || statusData.paid === false || 
               paymentStatus === 'failed' || paymentStatus === 'cancelled' || paymentStatus === 'declined') {
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
          pesepay_payment_id: statusData.payment_id || statusData.id,
          pesepay_reference: statusData.reference || statusData.reference_number || transaction.reference,
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
        transaction_id: transaction.id,
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

