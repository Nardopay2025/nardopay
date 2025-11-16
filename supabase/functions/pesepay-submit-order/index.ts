import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Crypto utilities for encryption/decryption
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const APP_ORIGIN = Deno.env.get('PUBLIC_APP_ORIGIN') || '';

const corsHeaders = {
  // Restrict to the public app origin when configured; fall back to "*" for local/dev.
  'Access-Control-Allow-Origin': APP_ORIGIN || '*',
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
  // For catalogue links we can receive a full cart instead of a single item/quantity.
  // This is an array of items already priced in the catalogue currency.
  cartItems: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive().max(1000),
    }),
  ).optional(),
  // Currency conversion for cross-border payments (e.g., RWF -> USD for ZW clients)
  // Both must be provided together or both omitted
  convertedAmount: z.number().positive().optional(),
  convertedCurrency: z.string().length(3).optional(),
});

// Pesepay API endpoints
// According to Pesepay documentation: https://developers.pesepay.com/api-reference/initiate-transaction
// Base URL: https://api.pesepay.com
// Endpoint: /api/payments-engine/v1/payments/initiate
const PESEPAY_BASE_URL = Deno.env.get('PESEPAY_ENVIRONMENT') === 'production'
  ? 'https://api.pesepay.com'
  : 'https://api.pesepay.com'; // Use same URL for sandbox (test with test credentials)

/**
 * Get IV (Initialization Vector) from Pesepay Encryption Key
 * According to Pesepay documentation: "The first 16 characters of your encryption key"
 */
function getIVFromEncryptionKey(encryptionKey: string): Uint8Array {
  // Use the first 16 characters of the encryption key as IV
  // According to Pesepay: "The first 16 characters of your encryption key"
  const ivString = encryptionKey.substring(0, 16);
  // Ensure we have exactly 16 bytes
  const ivBytes = new Uint8Array(16);
  const encoded = encoder.encode(ivString);
  for (let i = 0; i < 16; i++) {
    ivBytes[i] = encoded[i] || 0; // Pad with 0 if key is shorter than 16 chars
  }
  return ivBytes;
}

/**
 * Prepare encryption key from Pesepay Encryption Key
 * According to Pesepay documentation: "Your 32 character long encryption key"
 * The key should be used directly (not hashed) for AES-256
 */
async function prepareEncryptionKey(encryptionKey: string): Promise<CryptoKey> {
  // Pesepay uses a 32-character encryption key directly
  // Convert the key string to bytes (32 characters = 32 bytes for ASCII)
  // Ensure we have exactly 32 bytes
  const keyBytes = new Uint8Array(32);
  const encoded = encoder.encode(encryptionKey.substring(0, 32));
  for (let i = 0; i < 32; i++) {
    keyBytes[i] = encoded[i] || 0; // Pad with 0 if key is shorter than 32 chars
  }
  
  // Import the key directly as a CryptoKey for AES-CBC
  return await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-CBC' },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt payload using AES-256-CBC with Pesepay Encryption Key
 * 
 * According to Pesepay documentation:
 * - Algorithm: AES-256-CBC
 * - Key: Your 32 character long encryption key (used directly)
 * - IV: The first 16 characters of your encryption key (NOT random!)
 * - Output: Base64 encoded string (IV + encrypted data)
 */
async function encryptPayload(payload: any, encryptionKey: string): Promise<string> {
  try {
    // Validate encryption key length
    if (encryptionKey.length < 32) {
      throw new Error('Encryption key must be at least 32 characters long');
    }
    
    // Convert payload to JSON string
    const payloadString = JSON.stringify(payload);
    const payloadData = encoder.encode(payloadString);
    
    // Prepare encryption key (use directly, not hashed)
    const key = await prepareEncryptionKey(encryptionKey);
    
    // Get IV from first 16 characters of encryption key (per Pesepay spec)
    const iv = getIVFromEncryptionKey(encryptionKey);
    
    // Encrypt the payload
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-CBC',
        iv: iv,
      },
      key,
      payloadData
    );
    
    // Pesepay derives the IV from the encryption key themselves
    // So we should NOT prepend the IV - send only the encrypted data
    const encryptedBytes = new Uint8Array(encryptedData);
    
    // Convert to base64 - handle large arrays properly
    let base64String: string;
    if (encryptedBytes.length > 65535) {
      // For large arrays, convert in chunks to avoid stack overflow
      const chunks: string[] = [];
      for (let i = 0; i < encryptedBytes.length; i += 65535) {
        const chunk = encryptedBytes.slice(i, i + 65535);
        chunks.push(String.fromCharCode(...chunk));
      }
      base64String = btoa(chunks.join(''));
    } else {
      base64String = btoa(String.fromCharCode(...encryptedBytes));
    }
    
    return base64String;
  } catch (error: any) {
    console.error('Encryption error:', error);
    throw new Error(`Failed to encrypt payload: ${error.message}`);
  }
}

/**
 * Decrypt Pesepay response using Encryption Key
 * 
 * According to Pesepay documentation:
 * - Input: Base64 encoded string (IV + encrypted data)
 * - Algorithm: AES-256-CBC
 * - Key: Your 32 character long encryption key (used directly)
 * - IV: The first 16 characters of your encryption key
 */
async function decryptPayload(encryptedPayload: string, encryptionKey: string): Promise<any> {
  try {
    // Validate encryption key length
    if (encryptionKey.length < 32) {
      throw new Error('Encryption key must be at least 32 characters long');
    }
    
    // Decode base64 - Pesepay sends only the encrypted data (no IV prepended)
    const encryptedData = Uint8Array.from(atob(encryptedPayload), c => c.charCodeAt(0));
    
    // Prepare decryption key (use directly, not hashed)
    const key = await prepareEncryptionKey(encryptionKey);
    
    // Get IV from first 16 characters of encryption key (same as encryption)
    const iv = getIVFromEncryptionKey(encryptionKey);
    
    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv: iv,
      },
      key,
      encryptedData
    );
    
    // Convert decrypted data to string and parse JSON
    const decryptedString = decoder.decode(decryptedData);
    return JSON.parse(decryptedString);
  } catch (error: any) {
    console.error('Decryption error:', error);
    throw new Error(`Failed to decrypt payload: ${error.message}`);
  }
}

// Get Pesepay credentials - ALWAYS use ZW (Zimbabwe) credentials
// NardoPay is the merchant with Pesepay, acting as aggregator
// Merchant's country doesn't matter - we always use NardoPay's ZW credentials
async function getPesepayCredentials(supabaseClient: any) {
  // Always use ZW credentials - merchant country doesn't matter
  const { data: platformConfig } = await supabaseClient
    .from('payment_provider_configs')
    .select('*')
    .eq('provider', 'pesepay')
    .eq('country_code', 'ZW') // Always use Zimbabwe
    .eq('environment', Deno.env.get('PESEPAY_ENVIRONMENT') || 'sandbox')
    .eq('is_active', true)
    .maybeSingle();

  if (platformConfig) {
    console.log('Using platform credentials for Zimbabwe (ZW) - NardoPay is the merchant with Pesepay');
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
    console.log('Using fallback environment credentials for Zimbabwe (ZW)');
    return {
      consumer_key: envKey,
      consumer_secret: envSecret,
      ipn_id: envIpnId,
    };
  }

  // No credentials found - throw helpful error
  console.error('No Pesepay credentials found for Zimbabwe (ZW)');
  console.error('Checked: payment_provider_configs (country_code=ZW) and environment variables');
  throw new Error('PESEPAY_NOT_CONFIGURED: Pesepay credentials for Zimbabwe (ZW) are not configured. Please configure Pesepay credentials in payment_provider_configs table.');
}

// NOTE: Current integration assumes Pesepay uses the Integration Key directly in the
// Authorization header (no separate token exchange). If Pesepay introduces a formal
// token-based auth flow in future, implement it in a dedicated helper instead of
// leaving speculative, unused code here.

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let body: any;
    try {
      body = await req.json();
    console.log('Received request body:', JSON.stringify(body, null, 2));
      
      // Ensure convertedAmount is a number if provided
      if (body.convertedAmount !== undefined && body.convertedAmount !== null) {
        if (typeof body.convertedAmount === 'string') {
          body.convertedAmount = parseFloat(body.convertedAmount);
        }
        // Remove if invalid
        if (isNaN(body.convertedAmount) || body.convertedAmount <= 0) {
          delete body.convertedAmount;
          delete body.convertedCurrency;
        }
      }
    } catch (parseError: any) {
      console.error('Failed to parse request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'INVALID_REQUEST', code: 'E001', message: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate input
    let validatedData;
    try {
      validatedData = submitOrderSchema.parse(body);
    } catch (validationError: any) {
      console.error('Validation error:', validationError);
      console.error('Request body:', JSON.stringify(body, null, 2));
      return new Response(
        JSON.stringify({ 
          error: 'VALIDATION_ERROR', 
          code: 'E002', 
          message: validationError.errors?.[0]?.message || 'Invalid request data',
          details: validationError.errors 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const {
      linkCode,
      linkType,
      payerName,
      payerEmail,
      paymentMethod,
      itemId,
      quantity,
      donationAmount,
      cartItems,
      convertedAmount,
      convertedCurrency,
    } = validatedData;

    console.log('Processing order for:', { 
      linkCode, 
      linkType, 
      payerEmail,
      convertedAmount,
      convertedCurrency,
      hasConvertedAmount: !!convertedAmount,
      hasConvertedCurrency: !!convertedCurrency
    });

    // IMPORTANT: Pesepay is for Zimbabwe payments only
    // NardoPay is the merchant with Pesepay (in Zimbabwe)
    // NardoPay acts as aggregator - any merchant can use Pesepay through NardoPay
    // We ALWAYS use ZW (Zimbabwe) credentials, regardless of merchant's location

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
      
      // Validate amount exists and is valid
      if (!data.amount || data.amount === null || data.amount === undefined) {
        console.error('Payment link has no amount:', data);
        throw new Error(`Payment link ${linkCode} has no amount set. Please set an amount for this payment link.`);
      }
      
      // Use converted amount/currency if provided (e.g., RWF -> USD for ZW clients)
      // Otherwise use the original amount/currency from the payment link
      if (convertedAmount !== undefined && convertedAmount !== null && convertedCurrency) {
        console.log(`Using converted amount: ${convertedAmount} ${convertedCurrency} (original: ${data.amount} ${data.currency})`);
        amount = Number(convertedAmount);
        currency = String(convertedCurrency);
      } else {
        console.log(`Using original amount: ${data.amount} ${data.currency}`);
        amount = parseFloat(data.amount.toString());
      currency = data.currency;
      }
      
      description = data.product_name || 'Payment';
      userId = data.user_id;
      
      // Validate required fields
      if (isNaN(amount) || amount <= 0) {
        console.error('Invalid amount parsed:', { raw: data.amount, parsed: amount, convertedAmount, convertedCurrency });
        throw new Error(`Invalid amount: ${amount}. Amount must be a positive number.`);
      }
      if (!currency) {
        throw new Error('Currency is required');
      }
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      // Note: Merchant country is not used for Pesepay credential lookup
      // We always use ZW (Zimbabwe) credentials as NardoPay is the merchant with Pesepay
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
      description = data.title || 'Donation';
      userId = data.user_id;
      
      // If a converted amount/currency was provided (e.g., RWF -> USD for ZW clients),
      // override the original amount/currency for the provider call.
      if (convertedAmount && convertedCurrency) {
        console.log(`Using converted donation amount: ${convertedAmount} ${convertedCurrency} (original: ${amount} ${currency})`);
        amount = Number(convertedAmount);
        currency = String(convertedCurrency);
      }
      
      // Validate required fields
      if (!amount || isNaN(amount) || amount <= 0) {
        throw new Error(`Invalid donation amount: ${donationAmount}`);
      }
      if (!currency) {
        throw new Error('Currency is required');
      }
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      // Note: Merchant country is not used for Pesepay credential lookup
      // We always use ZW (Zimbabwe) credentials as NardoPay is the merchant with Pesepay
    } else if (linkType === 'catalogue') {
      // For catalogue links we support two patterns:
      // 1) New flow: full cart passed from frontend (cartItems)
      // 2) Legacy flow: single itemId + quantity
      // In both cases, the authoritative currency comes from the catalogue row.

      // First, load the catalogue itself by link code
      const { data: catalogueRow, error: catalogueError } = await supabase
        .from('catalogues')
        .select('*')
        .eq('link_code', linkCode)
        .eq('status', 'active')
        .single();

      if (catalogueError || !catalogueRow) {
        console.error('[Internal] Catalogue not found for link code:', linkCode, catalogueError);
        throw new Error('Resource not found');
      }

      linkData = catalogueRow;
      currency = catalogueRow.currency;
      userId = catalogueRow.user_id;

      if (cartItems && cartItems.length > 0) {
        // New multi-item cart flow: compute amount from cartItems
        amount = cartItems.reduce((sum: number, item: any) => {
          const lineTotal = Number(item.price) * Number(item.quantity || 0);
          return sum + (isNaN(lineTotal) ? 0 : lineTotal);
        }, 0);
        description = `Catalogue purchase (${cartItems.length} item${cartItems.length > 1 ? 's' : ''})`;
      } else {
        // Legacy single-item flow using itemId + quantity
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
        description = `${catalogueItem.name || 'Item'} x ${quantity || 1}`;
        userId = catalogueItem.catalogues.user_id;
      }
      
      // If a converted amount/currency was provided (e.g., RWF -> USD for ZW clients),
      // override the original amount/currency for the provider call.
      if (convertedAmount && convertedCurrency) {
        console.log(`Using converted catalogue amount: ${convertedAmount} ${convertedCurrency} (original: ${amount} ${currency})`);
        amount = Number(convertedAmount);
        currency = String(convertedCurrency);
      }
      
      // Validate required fields
      if (!amount || isNaN(amount) || amount <= 0) {
        console.error('Invalid catalogue amount computed:', { amount, cartItems, itemId, quantity });
        throw new Error('Invalid catalogue amount. Please check item prices and quantities.');
      }
      if (!currency) {
        throw new Error('Currency is required');
      }
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      // Note: Merchant country is not used for Pesepay credential lookup
      // We always use ZW (Zimbabwe) credentials as NardoPay is the merchant with Pesepay
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
      description = data.plan_name || 'Subscription';
      userId = data.user_id;

      // If a converted amount/currency was provided (e.g., RWF -> USD for ZW clients),
      // override the original amount/currency for the provider call.
      if (convertedAmount && convertedCurrency) {
        console.log(
          `Using converted subscription amount: ${convertedAmount} ${convertedCurrency} (original: ${amount} ${currency})`,
        );
        amount = Number(convertedAmount);
        currency = String(convertedCurrency);
      }

      // Validate required fields
      if (!amount || isNaN(amount) || amount <= 0) {
        throw new Error(`Invalid subscription amount: ${data.amount}`);
      }
      if (!currency) {
        throw new Error('Currency is required');
      }
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      // Note: Merchant country is not used for Pesepay credential lookup
      // We always use ZW (Zimbabwe) credentials as NardoPay is the merchant with Pesepay
    }

    // Create transaction record
    const transactionId = crypto.randomUUID();
    
    // Extract phone number from request body if available
    const customerPhone = (body as any).customerDetails?.phone || '';

    // Map linkType to internal transaction.type:
    // - 'payment' and 'catalogue' are both recorded as 'payment'
    // - 'donation' and 'subscription' use their own types
    // This keeps the DB within the CHECK constraint:
    //   type IN ('payment','donation','subscription','transfer','deposit','withdrawal')
    const transactionType =
      linkType === 'catalogue'
        ? 'payment'
        : linkType === 'payment'
        ? 'payment'
        : linkType === 'donation'
        ? 'donation'
        : linkType === 'subscription'
        ? 'subscription'
        : 'payment';
    
    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        id: transactionId,
        user_id: userId,
        amount,
        currency,
        type: transactionType,
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
          cart_items: cartItems,
        },
      });

    if (txError) {
      console.error('Transaction insert error:', txError);
      throw new Error('Failed to create transaction');
    }

    // Get Pesepay credentials
    // IMPORTANT: Always use ZW (Zimbabwe) credentials
    // NardoPay is the merchant with Pesepay in Zimbabwe, acting as aggregator
    // Merchant's country doesn't matter - we always use NardoPay's ZW credentials
    // Note: Pesepay uses "Integration Key" (consumer_key) and "Encryption Key" (consumer_secret)
    const credentials = await getPesepayCredentials(supabase);

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
    // NOTE: Verify exact payment method codes with Pesepay documentation
    // Common codes: MOBILE_MONEY, BANK_TRANSFER, CARD, etc.
    let paymentMethodCode = 'MOBILE_MONEY'; // Default
    if (paymentMethod) {
      if (paymentMethod === 'mobile_money' || paymentMethod === 'mobile-money') {
        paymentMethodCode = 'MOBILE_MONEY';
      } else if (paymentMethod === 'bank_transfer' || paymentMethod === 'bank-transfer') {
        paymentMethodCode = 'BANK_TRANSFER';
      } else if (paymentMethod === 'card' || paymentMethod === 'credit_card') {
        paymentMethodCode = 'CARD';
      } else {
        // Use the provided method code as-is if it's already in the correct format
        paymentMethodCode = paymentMethod.toUpperCase();
      }
    }
    
    // Validate all required fields before building payload
    // Double-check amount (should have been validated earlier, but check again)
    if (amount === null || amount === undefined || isNaN(amount) || amount <= 0) {
      console.error('Amount validation failed:', { amount, type: typeof amount });
      throw new Error(`Invalid amount: ${amount}. Amount must be a positive number. Please check the payment link configuration.`);
    }
    if (!currency || currency.trim() === '') {
      throw new Error('Currency is required. Please check the payment link configuration.');
    }
    if (!payerEmail || payerEmail.trim() === '') {
      throw new Error('Payer email is required');
    }
    if (!payerName || payerName.trim() === '') {
      throw new Error('Payer name is required');
    }
    
    console.log('All validations passed:', { amount, currency, payerEmail, payerName });
    
    // Build transaction payload (before encryption)
    const transactionPayload = {
      amountDetails: {
        amount: amount,
        currencyCode: currency,
      },
      merchantReference: transactionId,
      reasonForPayment: description || 'Payment',
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
    
    console.log('Pesepay transaction payload (before encryption):', JSON.stringify(transactionPayload, null, 2));

    // Encrypt the payload using Encryption Key
    let encryptedPayload: string;
    try {
      // Validate encryption key before attempting encryption
      if (!credentials.consumer_secret || credentials.consumer_secret.length < 32) {
        throw new Error(`Encryption key is invalid or too short. Expected at least 32 characters, got ${credentials.consumer_secret?.length || 0}`);
      }
      
      console.log('Encrypting payload with key length:', credentials.consumer_secret.length);
      encryptedPayload = await encryptPayload(transactionPayload, credentials.consumer_secret);
      console.log('Payload encrypted successfully, length:', encryptedPayload.length);
    } catch (encryptError: any) {
      console.error('Encryption failed:', encryptError);
      console.error('Encryption key length:', credentials.consumer_secret?.length || 0);
      console.error('Encryption key preview:', credentials.consumer_secret ? credentials.consumer_secret.substring(0, 4) + '...' : 'missing');
      throw new Error(`ENCRYPTION_FAILED: ${encryptError.message}. Please verify your Encryption Key is correct and at least 32 characters long.`);
    }
    
    // Make request with encrypted payload
    // According to Pesepay documentation: https://developers.pesepay.com/api-reference/initiate-transaction
    // Endpoint: POST /api/payments-engine/v1/payments/initiate
    // Authorization header: Set value to integration key (direct, no Bearer prefix)
    // Request body: { "payload": "encrypted_json_string" }
    
    // Clean the integration key to remove any whitespace/newlines that might cause "invalid HTTP header" error
    let integrationKey = String(credentials.consumer_key || '').trim();
    
    // Remove only whitespace, newlines, tabs (keep hyphens for UUIDs)
    integrationKey = integrationKey.replace(/[\s\n\r\t\0]/g, '');
    
    // Validate integration key format
    if (!integrationKey || integrationKey.length === 0) {
      console.error('Integration key is empty after cleaning');
      throw new Error('Integration Key is empty or invalid. Please check your Pesepay credentials configuration.');
    }
    
    // Log key info for debugging (without exposing full key)
    console.log('Integration key info:', {
      length: integrationKey.length,
      firstChars: integrationKey.substring(0, 8),
      lastChars: integrationKey.substring(integrationKey.length - 8),
      isValidUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(integrationKey),
    });
    
    // Correct endpoint according to Pesepay documentation
    const initiateUrl = `${PESEPAY_BASE_URL}/api/payments-engine/v1/payments/initiate`;
    console.log('Calling Pesepay Initiate Transaction API:', initiateUrl);
    console.log('Request payload length:', encryptedPayload.length);
    
    // According to Pesepay docs: authorization header should be set to integration key (no Bearer prefix)
    // Ensure the header value is a plain ASCII string with no encoding issues
    // Create a fresh string by reconstructing it character by character to avoid any encoding issues
    const authHeaderValue = String(integrationKey);
    
    // Validate it's pure ASCII (UUID format should be)
    const isASCII = /^[\x00-\x7F]*$/.test(authHeaderValue);
    if (!isASCII) {
      console.error('Authorization header value contains non-ASCII characters!');
      throw new Error('Integration Key contains invalid characters');
    }
    
    console.log('Request headers (sanitized):', {
      'authorization': `${authHeaderValue.substring(0, 8)}...${authHeaderValue.substring(authHeaderValue.length - 8)}`,
      'content-type': 'application/json',
    });
    
    // Build headers as an array of tuples - Deno fetch might handle this better
    // Pesepay docs specify lowercase 'authorization'
    const authHeaderStr = String(authHeaderValue);
    const contentTypeStr = 'application/json';
    
    // Validate header values
    if (/[\r\n]/.test(authHeaderStr)) {
      throw new Error('Authorization header contains invalid characters (CR/LF)');
    }
    
    // Log what we're about to send
    console.log('Final header values check:', {
      authHeaderLength: authHeaderStr.length,
      authHeaderType: typeof authHeaderStr,
      authHeaderValue: authHeaderStr, // Log full value for debugging
    });
    
    // Try minimal plain object approach - Deno fetch normalizes to lowercase anyway
    // Use the exact format that works with Deno's fetch implementation
    const requestHeaders = {
      'authorization': authHeaderStr,
      'content-type': contentTypeStr,
    };
    
    // Verify headers before sending
    console.log('Headers object verification:', {
      authHeader: requestHeaders['authorization'],
      contentType: requestHeaders['content-type'],
      authLength: requestHeaders['authorization'].length,
    });
    
    // WORKAROUND: Deno's fetch has a bug with Authorization headers containing UUIDs
    // Try using native Deno HTTP client as a workaround
    let finalResponse: Response;
    try {
      // Parse URL to get host and path
      const url = new URL(initiateUrl);
      const requestBody = JSON.stringify({
        payload: encryptedPayload,
      });
      
      // Use Deno's native connectTLS for HTTPS
      const conn = await Deno.connectTls({
        hostname: url.hostname,
        port: 443,
      });
      
      // Build HTTP request manually
      const requestLines = [
        `POST ${url.pathname} HTTP/1.1`,
        `Host: ${url.hostname}`,
        `authorization: ${authHeaderStr}`,
        `content-type: ${contentTypeStr}`,
        `content-length: ${requestBody.length}`,
        '',
        requestBody,
      ];
      
      const requestText = requestLines.join('\r\n');
      const requestBytes = encoder.encode(requestText);
      
      // Send request
      await conn.write(requestBytes);
      
      // Read response in chunks
      let responseBuffer = new Uint8Array(0);
      const chunkSize = 8192;
      let totalBytesRead = 0;
      
      while (true) {
        const chunk = new Uint8Array(chunkSize);
        const bytesRead = await conn.read(chunk);
        
        if (bytesRead === null) {
          break;
        }
        
        // Append chunk to response buffer
        const newBuffer = new Uint8Array(totalBytesRead + bytesRead);
        newBuffer.set(responseBuffer);
        newBuffer.set(chunk.slice(0, bytesRead), totalBytesRead);
        responseBuffer = newBuffer;
        totalBytesRead += bytesRead;
        
        // Check if we've received the full response (look for double CRLF)
        const responseText = decoder.decode(responseBuffer);
        if (responseText.includes('\r\n\r\n')) {
          // Check if we have Content-Length header to know if we need more data
          const headersMatch = responseText.match(/(.*?)\r\n\r\n(.*)/s);
          if (headersMatch) {
            const headersText = headersMatch[1];
            const bodyStart = headersMatch[2];
            const contentLengthMatch = headersText.match(/content-length:\s*(\d+)/i);
            if (contentLengthMatch) {
              const contentLength = parseInt(contentLengthMatch[1]);
              const bodyLength = encoder.encode(bodyStart).length;
              if (bodyLength >= contentLength) {
                break; // We have the full response
              }
            } else {
              // No Content-Length, assume we have the full response
              break;
            }
          }
        }
      }
      
      conn.close();
      
      // Parse HTTP response
      const responseText = decoder.decode(responseBuffer);
      const responseParts = responseText.split('\r\n\r\n');
      if (responseParts.length < 2) {
        throw new Error('Invalid HTTP response format');
      }
      
      const headersText = responseParts[0];
      let bodyText = responseParts.slice(1).join('\r\n\r\n'); // Handle case where body contains \r\n\r\n
      
      const statusLine = headersText.split('\r\n')[0];
      const statusMatch = statusLine.match(/HTTP\/1\.\d (\d{3})/);
      const status = statusMatch ? parseInt(statusMatch[1]) : 500;
      
      // Check if response uses chunked transfer encoding
      const isChunked = headersText.toLowerCase().includes('transfer-encoding: chunked');
      
      if (isChunked) {
        // Parse chunked encoding
        // Format: <chunk-size-hex>\r\n<chunk-data>\r\n<chunk-size-hex>\r\n<chunk-data>\r\n...0\r\n\r\n
        const chunks: string[] = [];
        let remaining = bodyText;
        
        while (remaining.length > 0) {
          // Find the first \r\n to get chunk size
          const crlfIndex = remaining.indexOf('\r\n');
          if (crlfIndex === -1) break;
          
          const chunkSizeHex = remaining.substring(0, crlfIndex).trim();
          if (chunkSizeHex === '0') break; // Last chunk
          
          // Parse hex chunk size
          const chunkSize = parseInt(chunkSizeHex, 16);
          if (isNaN(chunkSize) || chunkSize <= 0) break;
          
          // Extract chunk data (skip \r\n after size, then read chunkSize bytes, then skip \r\n)
          const chunkStart = crlfIndex + 2;
          const chunkEnd = chunkStart + chunkSize;
          
          if (chunkEnd > remaining.length) break;
          
          const chunkData = remaining.substring(chunkStart, chunkEnd);
          chunks.push(chunkData);
          
          // Move to next chunk (skip chunk data and trailing \r\n)
          remaining = remaining.substring(chunkEnd + 2);
        }
        
        bodyText = chunks.join('');
        console.log('Decoded chunked response, total chunks:', chunks.length);
      }
      
      // Log response for debugging
      console.log('Response status:', status);
      console.log('Response body preview:', bodyText.substring(0, 200));
      
      // Create Response object manually
      finalResponse = new Response(bodyText, {
        status: status,
        statusText: statusLine,
      headers: {
        'Content-Type': 'application/json',
      },
      });
      
      console.log('Successfully sent request using native Deno HTTP client, status:', status);
    } catch (nativeError: any) {
      console.error('Native HTTP client error, falling back to fetch:', nativeError);
      // Fallback to fetch if native client fails
      try {
        finalResponse = await fetch(initiateUrl, {
          method: 'POST',
          headers: requestHeaders,
      body: JSON.stringify({
        payload: encryptedPayload,
      }),
    });
      } catch (fetchError: any) {
        console.error('Fetch error details:', {
          name: fetchError?.name,
          message: fetchError?.message,
          stack: fetchError?.stack,
        });
        console.error('Headers that caused error:', JSON.stringify(requestHeaders, null, 2));
        const authBytes = new TextEncoder().encode(authHeaderStr);
        console.error('Authorization header bytes:', Array.from(authBytes).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' '));
        throw new Error(`Both native HTTP client and fetch failed. Native error: ${nativeError.message}, Fetch error: ${fetchError.message}`);
      }
    }
    
    if (!finalResponse.ok) {
      const errorText = await finalResponse.text();
      console.error('Pesepay order error:', errorText);
      console.error('Response status:', finalResponse.status, finalResponse.statusText);
      throw new Error(`Pesepay order submission failed (${finalResponse.status}): ${errorText}`);
    }

    // Get response text first to handle potential parsing issues
    const responseText = await finalResponse.text();
    console.log('Pesepay response received, length:', responseText.length);
    console.log('Response preview:', responseText.substring(0, 200));
    
    // Parse JSON response
    let responseData: any;
    try {
      responseData = JSON.parse(responseText);
      console.log('Pesepay response parsed successfully');
    } catch (parseError: any) {
      console.error('Failed to parse Pesepay response as JSON:', parseError);
      console.error('Response text:', responseText);
      throw new Error(`Failed to parse Pesepay response: ${parseError.message}. Response: ${responseText.substring(0, 100)}`);
    }

    // Decrypt the response payload
    let orderData: any;
    try {
      if (!responseData.payload) {
        throw new Error('No payload field in response');
      }
      console.log('Decrypting response payload, length:', responseData.payload.length);
      orderData = await decryptPayload(responseData.payload, credentials.consumer_secret);
      console.log('Response decrypted successfully:', JSON.stringify(orderData).substring(0, 200));
    } catch (decryptError: any) {
      console.error('Decryption failed:', decryptError);
      console.error('Encrypted payload preview:', responseData.payload?.substring(0, 100));
      throw new Error(`DECRYPTION_FAILED: ${decryptError.message}. Please verify your Encryption Key is correct.`);
    }

    // Update transaction with Pesepay tracking ID (preserving existing metadata)
    const { data: existingTx } = await supabase
      .from('transactions')
      .select('metadata')
      .eq('id', transactionId)
      .single();

    // Pesepay response structure (after decryption):
    // For Initiate Transaction API, response should contain:
    // - redirectUrl: URL to redirect customer to complete payment
    // - referenceNumber: Reference number for status checking
    // - success: Boolean indicating if request was successful
    const referenceNumber = orderData.referenceNumber || orderData.merchantReference || orderData.reference || transactionId;
    const redirectUrl = orderData.redirectUrl || orderData.pollUrl || orderData.paymentUrl || orderData.redirect_url;

    await supabase
      .from('transactions')
      .update({
        reference: referenceNumber,
        metadata: {
          ...(existingTx?.metadata || {}),
          pesepay_reference: referenceNumber,
          pesepay_poll_url: redirectUrl,
          pesepay_redirect_url: redirectUrl,
          pesepay_response: orderData,
        },
      })
      .eq('id', transactionId);

    // Pesepay returns redirectUrl for redirecting customer
    if (!redirectUrl) {
      console.error('Pesepay response data:', JSON.stringify(orderData, null, 2));
      throw new Error('No redirect URL (redirectUrl) received from Pesepay. Check API response structure.');
    }

    return new Response(
      JSON.stringify({
        success: true,
        redirect_url: redirectUrl,
        order_tracking_id: referenceNumber,
        transaction_id: transactionId,
      }),
      { 
        status: 200, // 2XX - Success (per Pesepay API documentation)
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error: any) {
    console.error('[Internal] Error in pesepay-submit-order:', error);
    console.error('Error stack:', error?.stack || 'No stack trace');
    console.error('Error name:', error?.name || 'Unknown');
    console.error('Error message:', error?.message || 'Unknown error');
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    // Return detailed error to client for debugging, log full details server-side
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
      return new Response(
        JSON.stringify({ 
          error: 'INVALID_INPUT', 
          code: 'E003', 
          details: error.errors,
          message: 'Invalid input parameters'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check for specific error types
    const errorMessage = error.message || 'Unknown error occurred';
    const errorCode = error.code || 'E004';
    
    // Determine appropriate status code
    let statusCode = 500;
    if (errorMessage.includes('ENCRYPTION_FAILED') || errorMessage.includes('DECRYPTION_FAILED')) {
      statusCode = 400; // Client error - wrong encryption key
    } else if (errorMessage.includes('COUNTRY_NOT_SUPPORTED') || errorMessage.includes('not found')) {
      statusCode = 404;
    } else if (errorMessage.includes('INVALID_INPUT') || errorMessage.includes('Invalid')) {
      statusCode = 400;
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'PAYMENT_FAILED', 
        code: errorCode, 
        message: errorMessage,
        // Include error type for debugging (remove in production if sensitive)
        type: error.name || 'Error'
      }),
      { status: statusCode, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

