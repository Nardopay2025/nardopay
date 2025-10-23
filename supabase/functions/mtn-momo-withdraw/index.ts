import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WithdrawRequest {
  amount: number;
}

interface MTNTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface MTNWithdrawResponse {
  referenceId: string;
  status: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization token from the request
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Decode JWT to extract user ID
    const token = authHeader.replace('Bearer ', '');
    
    let userId: string;
    try {
      const base64Payload = token.split('.')[1];
      const payload = JSON.parse(atob(base64Payload));
      userId = payload.sub;
      
      if (!userId) {
        throw new Error('No user ID in token');
      }
      
      console.log('User authenticated:', userId);
    } catch (decodeError) {
      console.error('JWT decode error:', decodeError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role client for all operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { amount }: WithdrawRequest = await req.json();

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid withdrawal amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user profile with withdrawal details
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('balance, currency, withdrawal_account_type, mobile_provider, mobile_number, country, plan, full_name, email')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError);
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check environment and handle sandbox EUR requirement
    const environment = Deno.env.get('MTN_MOMO_ENVIRONMENT') || 'sandbox';
    const isSandbox = environment === 'sandbox';
    const transactionCurrency = isSandbox ? 'EUR' : profile.currency;
    
    console.log('Environment configuration:', { 
      environment,
      isSandbox,
      profileCurrency: profile.currency,
      transactionCurrency
    });

    // Calculate fee based on plan
    const feePercent = profile.plan === 'business' ? 1 : profile.plan === 'professional' ? 2 : 5;
    const feeAmount = amount * (feePercent / 100);
    const totalRequired = amount + feeAmount;

    if (Number(profile.balance) < totalRequired) {
      return new Response(
        JSON.stringify({ 
          error: 'Insufficient balance',
          required: totalRequired,
          available: profile.balance
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate mobile money account is configured
    if (profile.withdrawal_account_type !== 'mobile' || !profile.mobile_number) {
      return new Response(
        JSON.stringify({ error: 'Mobile money account not configured for MTN MoMo withdrawals' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get MTN MoMo credentials
    const apiUser = Deno.env.get('MOMO_MTN_API_USER');
    const apiKey = Deno.env.get('MOMO_MTN_API_KEY');
    const subscriptionKey = Deno.env.get('MOMO_MTN_SUBSCRIPTION_KEY');
    
    if (!apiUser || !apiKey || !subscriptionKey) {
      console.error('MTN MoMo credentials not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Payment provider not configured',
          details: 'MTN MoMo Disbursement credentials (API User, API Key, Subscription Key) are required'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('=== MTN MOMO CREDENTIALS CHECK ===');
    console.log('API User exists:', !!apiUser);
    console.log('API User format:', apiUser?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) ? 'Valid UUID' : 'Invalid UUID');
    console.log('API Key exists:', !!apiKey);
    console.log('API Key length:', apiKey?.length);
    console.log('Subscription Key exists:', !!subscriptionKey);
    console.log('Subscription Key length:', subscriptionKey?.length);
    console.log('=================================');

    // Determine base URL and target environment based on configuration
    const baseUrl = isSandbox 
      ? 'https://sandbox.momodeveloper.mtn.com'
      : 'https://momodeveloper.mtn.com';
    const targetEnvironment = isSandbox ? 'sandbox' : 'mtncameroon'; // Production target varies by country

    // Step 1: Get Access Token
    console.log('\n========================================');
    console.log('=== STEP 1: MTN MOMO TOKEN REQUEST ===');
    console.log('========================================');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Environment:', environment);
    console.log('Is Sandbox:', isSandbox);
    console.log('Base URL:', baseUrl);
    console.log('Target Environment (for transfer only):', targetEnvironment);
    console.log('\n--- CREDENTIALS ---');
    console.log('API User:', apiUser);
    console.log('API User Length:', apiUser?.length);
    console.log('API User is UUID:', apiUser?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) ? 'YES' : 'NO');
    console.log('API Key:', apiKey);
    console.log('API Key Length:', apiKey?.length);
    console.log('Subscription Key:', subscriptionKey);
    console.log('Subscription Key Length:', subscriptionKey?.length);
    
    const authString = btoa(`${apiUser}:${apiKey}`);
    console.log('Auth String (Base64):', authString);
    console.log('Auth String Length:', authString.length);
    
    const tokenHeaders = {
      'Authorization': `Basic ${authString}`,
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    };
    
    console.log('\n--- REQUEST DETAILS ---');
    console.log('URL:', `${baseUrl}/disbursement/token/`);
    console.log('Method:', 'POST');
    console.log('Headers:', JSON.stringify(tokenHeaders, null, 2));
    console.log('Body:', 'none (POST request with empty body)');
    console.log('========================================\n');
    
    let tokenResponse;
    try {
      tokenResponse = await fetch(`${baseUrl}/disbursement/token/`, {
        method: 'POST',
        headers: tokenHeaders,
      });
      console.log('Token request fetch completed successfully');
    } catch (fetchError) {
      console.error('FATAL: Token request fetch failed with exception:', fetchError);
      const error = fetchError as Error;
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      throw new Error(`Network error calling MTN MoMo token endpoint: ${error.message}`);
    }

    console.log('\n========================================');
    console.log('=== MTN MOMO TOKEN RESPONSE ===');
    console.log('========================================');
    console.log('Timestamp:', new Date().toISOString());
    console.log('HTTP Status Code:', tokenResponse.status);
    console.log('HTTP Status Text:', tokenResponse.statusText);
    console.log('Response OK:', tokenResponse.ok);
    console.log('Response Type:', tokenResponse.type);
    console.log('Response URL:', tokenResponse.url);
    
    console.log('\n--- RESPONSE HEADERS (ALL) ---');
    const responseHeaders = Object.fromEntries(tokenResponse.headers.entries());
    console.log(JSON.stringify(responseHeaders, null, 2));
    console.log('Content-Type:', tokenResponse.headers.get('content-type'));
    console.log('Content-Length:', tokenResponse.headers.get('content-length'));
    
    let tokenResponseText;
    let tokenResponseData;
    
    try {
      tokenResponseText = await tokenResponse.text();
      console.log('\n--- RESPONSE BODY ---');
      console.log('Body (raw text):', tokenResponseText);
      console.log('Body length:', tokenResponseText.length);
      console.log('Body is empty:', tokenResponseText.length === 0);
    } catch (textError) {
      console.error('ERROR reading response body as text:', textError);
      tokenResponseText = '';
    }
    
    try {
      if (tokenResponseText && tokenResponseText.length > 0) {
        tokenResponseData = JSON.parse(tokenResponseText);
        console.log('Body (parsed JSON):', JSON.stringify(tokenResponseData, null, 2));
      } else {
        console.log('Body is empty - cannot parse as JSON');
        tokenResponseData = '';
      }
    } catch (parseError) {
      console.error('ERROR parsing response body as JSON:', parseError);
      console.log('Body is not valid JSON, using raw text');
      tokenResponseData = tokenResponseText;
    }
    console.log('========================================\n');

    if (!tokenResponse.ok) {
      console.error('\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.error('!!! MTN MOMO TOKEN REQUEST FAILED !!!');
      console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.error('HTTP Status:', tokenResponse.status);
      console.error('HTTP Status Text:', tokenResponse.statusText);
      console.error('Response Body:', tokenResponseData);
      console.error('Response Body Type:', typeof tokenResponseData);
      console.error('Response Body is Empty:', tokenResponseData === '' || tokenResponseData === null);
      
      const errorInfo = {
        httpStatus: tokenResponse.status,
        httpStatusText: tokenResponse.statusText,
        responseBody: tokenResponseData,
        responseBodyType: typeof tokenResponseData,
        responseBodyIsEmpty: tokenResponseData === '' || tokenResponseData === null,
        requestUrl: `${baseUrl}/disbursement/token/`,
        requestMethod: 'POST',
        requestHeaders: tokenHeaders,
        apiUser: apiUser,
        apiUserLength: apiUser?.length,
        apiUserIsUUID: apiUser?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) ? true : false,
        apiKey: apiKey,
        apiKeyLength: apiKey?.length,
        subscriptionKey: subscriptionKey,
        subscriptionKeyLength: subscriptionKey?.length,
        authString: authString,
        baseUrl: baseUrl,
        environment: environment,
        isSandbox: isSandbox,
      };
      
      console.error('\n--- COMPLETE ERROR INFO ---');
      console.error(JSON.stringify(errorInfo, null, 2));
      
      console.error('\n--- DIAGNOSIS ---');
      if (tokenResponse.status === 400 && (tokenResponseData === '' || tokenResponseData === null)) {
        console.error('Empty 400 Bad Request response detected!');
        console.error('This typically means one of the following:');
        console.error('1. API User UUID does not exist in MTN MoMo system');
        console.error('2. API Key does not match the API User');
        console.error('3. Subscription Key is incorrect');
        console.error('4. Credentials are for wrong product (Collections vs Disbursements)');
        console.error('5. API User was not created in the correct environment (sandbox vs production)');
      } else if (tokenResponse.status === 401) {
        console.error('401 Unauthorized - Authentication credentials are invalid');
      } else if (tokenResponse.status === 403) {
        console.error('403 Forbidden - Subscription key may be invalid');
      } else {
        console.error('Unexpected error status:', tokenResponse.status);
      }
      console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n');
      
      let errorMessage = 'MTN MoMo Disbursement authentication failed';
      if (typeof tokenResponseData === 'object' && tokenResponseData !== null) {
        if (tokenResponseData.message) errorMessage += `: ${tokenResponseData.message}`;
        if (tokenResponseData.error) errorMessage += `: ${tokenResponseData.error}`;
      } else if (tokenResponse.status === 400 && tokenResponseData === '') {
        errorMessage += ': Empty 400 response - API User/Key/Subscription Key invalid or not configured for Disbursements product. IMPORTANT: Each MTN MoMo product (Collections, Disbursements, Remittance) requires separate credentials. Verify you created these credentials specifically for the Disbursement product, not Collections.';
      }
      
      // Return more helpful error to client
      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          details: {
            status: tokenResponse.status,
            message: 'Authentication with MTN MoMo Disbursement API failed',
            possibleCauses: [
              'API User ID is incorrect or does not exist for Disbursements',
              'API Key does not match the API User for Disbursements',
              'Subscription Key is incorrect or not for Disbursements product',
              'Credentials were created for Collections/RequestToPay instead of Disbursements',
              'API User was not created in the sandbox environment',
            ],
            action: 'Verify that MOMO_MTN_API_USER, MOMO_MTN_API_KEY, and MOMO_MTN_SUBSCRIPTION_KEY are specifically for the Disbursement product. If you only have Collections credentials, you need to create separate credentials for Disbursements.',
          }
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let tokenData: MTNTokenResponse;
    try {
      tokenData = JSON.parse(tokenResponseText);
      console.log('\n========================================');
      console.log('=== TOKEN REQUEST SUCCESSFUL ===');
      console.log('========================================');
      console.log('Access Token Received:', tokenData.access_token);
      console.log('Token Type:', tokenData.token_type);
      console.log('Expires In:', tokenData.expires_in, 'seconds');
      console.log('========================================\n');
    } catch (jsonError) {
      console.error('FATAL: Could not parse successful token response as JSON');
      console.error('Parse error:', jsonError);
      throw new Error('Invalid JSON in successful token response');
    }

    // Step 2: Generate unique reference ID (UUID v4)
    const referenceId = crypto.randomUUID();
    const withdrawalReference = `WD-MTN-${userId.slice(0, 8)}-${Date.now()}`;
    
    console.log('\n========================================');
    console.log('=== STEP 2: PREPARING WITHDRAWAL ===');
    console.log('========================================');
    console.log('Generated Reference ID:', referenceId);
    console.log('Generated External ID:', withdrawalReference);
    console.log('User ID:', userId);
    console.log('Withdrawal Amount:', amount);
    console.log('Transaction Currency:', transactionCurrency);
    console.log('Profile Currency:', profile.currency);
    console.log('Mobile Number:', profile.mobile_number);
    console.log('Mobile Number (cleaned):', profile.mobile_number.replace(/\+/g, ''));
    console.log('========================================\n');

    // Step 3: Submit withdrawal request
    const withdrawalPayload = {
      amount: amount.toString(),
      currency: transactionCurrency,
      externalId: withdrawalReference,
      payee: {
        partyIdType: 'MSISDN',
        partyId: profile.mobile_number.replace(/\+/g, ''),
      },
      payerMessage: `Withdrawal of ${transactionCurrency} ${amount}`,
      payeeNote: `Withdrawal from NardoPay`,
    };

    const withdrawalHeaders = {
      'Authorization': `Bearer ${tokenData.access_token}`,
      'X-Reference-Id': referenceId,
      'X-Target-Environment': targetEnvironment,
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      'Content-Type': 'application/json',
    };

    console.log('\n========================================');
    console.log('=== STEP 3: MTN MOMO WITHDRAWAL REQUEST ===');
    console.log('========================================');
    console.log('Timestamp:', new Date().toISOString());
    console.log('\n--- REQUEST DETAILS ---');
    console.log('URL:', `${baseUrl}/disbursement/v1_0/transfer`);
    console.log('Method:', 'POST');
    console.log('Content-Type:', 'application/json');
    
    console.log('\n--- REQUEST HEADERS (ALL) ---');
    console.log(JSON.stringify(withdrawalHeaders, null, 2));
    console.log('Authorization header length:', withdrawalHeaders.Authorization.length);
    console.log('Access Token:', tokenData.access_token);
    console.log('X-Reference-Id:', referenceId);
    console.log('X-Target-Environment:', targetEnvironment);
    console.log('Ocp-Apim-Subscription-Key:', subscriptionKey);
    
    console.log('\n--- REQUEST PAYLOAD (FULL) ---');
    console.log(JSON.stringify(withdrawalPayload, null, 2));
    console.log('Payload amount:', withdrawalPayload.amount);
    console.log('Payload currency:', withdrawalPayload.currency);
    console.log('Payload externalId:', withdrawalPayload.externalId);
    console.log('Payload payee.partyIdType:', withdrawalPayload.payee.partyIdType);
    console.log('Payload payee.partyId:', withdrawalPayload.payee.partyId);
    console.log('Payload payerMessage:', withdrawalPayload.payerMessage);
    console.log('Payload payeeNote:', withdrawalPayload.payeeNote);
    
    console.log('\n--- REQUEST BODY (STRINGIFIED) ---');
    const requestBodyString = JSON.stringify(withdrawalPayload);
    console.log(requestBodyString);
    console.log('Body length:', requestBodyString.length);
    console.log('========================================\n');

    let withdrawResponse;
    try {
      withdrawResponse = await fetch(`${baseUrl}/disbursement/v1_0/transfer`, {
        method: 'POST',
        headers: withdrawalHeaders,
        body: requestBodyString,
      });
      console.log('Withdrawal request fetch completed successfully');
    } catch (fetchError) {
      console.error('FATAL: Withdrawal request fetch failed with exception:', fetchError);
      const error = fetchError as Error;
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      throw new Error(`Network error calling MTN MoMo transfer endpoint: ${error.message}`);
    }

    console.log('\n========================================');
    console.log('=== MTN MOMO WITHDRAWAL RESPONSE ===');
    console.log('========================================');
    console.log('Timestamp:', new Date().toISOString());
    console.log('HTTP Status Code:', withdrawResponse.status);
    console.log('HTTP Status Text:', withdrawResponse.statusText);
    console.log('Response OK:', withdrawResponse.ok);
    console.log('Response Type:', withdrawResponse.type);
    console.log('Response URL:', withdrawResponse.url);
    
    console.log('\n--- RESPONSE HEADERS (ALL) ---');
    const withdrawResponseHeaders = Object.fromEntries(withdrawResponse.headers.entries());
    console.log(JSON.stringify(withdrawResponseHeaders, null, 2));
    console.log('Content-Type:', withdrawResponse.headers.get('content-type'));
    console.log('Content-Length:', withdrawResponse.headers.get('content-length'));
    
    let responseText;
    let responseData;
    
    try {
      responseText = await withdrawResponse.text();
      console.log('\n--- RESPONSE BODY ---');
      console.log('Body (raw text):', responseText);
      console.log('Body length:', responseText.length);
      console.log('Body is empty:', responseText.length === 0);
    } catch (textError) {
      console.error('ERROR reading response body as text:', textError);
      responseText = '';
    }
    
    try {
      if (responseText && responseText.length > 0) {
        responseData = JSON.parse(responseText);
        console.log('Body (parsed JSON):', JSON.stringify(responseData, null, 2));
      } else {
        console.log('Body is empty - cannot parse as JSON');
        responseData = '';
      }
    } catch (parseError) {
      console.error('ERROR parsing response body as JSON:', parseError);
      console.log('Body is not valid JSON, using raw text');
      responseData = responseText;
    }
    console.log('========================================\n');

    if (!withdrawResponse.ok) {
      console.error('\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.error('!!! MTN MOMO WITHDRAWAL FAILED !!!');
      console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.error('HTTP Status:', withdrawResponse.status);
      console.error('HTTP Status Text:', withdrawResponse.statusText);
      console.error('Response Body:', responseData);
      console.error('Response Body Type:', typeof responseData);
      console.error('Response Body is Empty:', responseData === '' || responseData === null);
      
      const errorInfo = {
        httpStatus: withdrawResponse.status,
        httpStatusText: withdrawResponse.statusText,
        responseBody: responseData,
        responseBodyType: typeof responseData,
        responseBodyIsEmpty: responseData === '' || responseData === null,
        requestUrl: `${baseUrl}/disbursement/v1_0/transfer`,
        requestMethod: 'POST',
        requestHeaders: withdrawalHeaders,
        requestPayload: withdrawalPayload,
        referenceId: referenceId,
        externalId: withdrawalReference,
        amount: amount,
        currency: transactionCurrency,
        mobileNumber: profile.mobile_number,
        cleanedMobileNumber: profile.mobile_number.replace(/\+/g, ''),
      };
      
      console.error('\n--- COMPLETE ERROR INFO ---');
      console.error(JSON.stringify(errorInfo, null, 2));
      
      console.error('\n--- DIAGNOSIS ---');
      if (withdrawResponse.status === 400) {
        console.error('400 Bad Request - Possible causes:');
        console.error('1. Invalid currency for environment (sandbox requires EUR)');
        console.error('2. Invalid mobile number format');
        console.error('3. Invalid amount');
        console.error('4. Missing required fields in payload');
        console.error('5. X-Reference-Id already used');
      } else if (withdrawResponse.status === 401) {
        console.error('401 Unauthorized - Access token may be invalid or expired');
      } else if (withdrawResponse.status === 403) {
        console.error('403 Forbidden - Insufficient permissions or invalid subscription key');
      } else if (withdrawResponse.status === 409) {
        console.error('409 Conflict - Reference ID already used');
      } else if (withdrawResponse.status === 500) {
        console.error('500 Internal Server Error - MTN MoMo service error');
      } else {
        console.error('Unexpected error status:', withdrawResponse.status);
      }
      
      // Identify specific error types
      let errorMessage = 'MTN MoMo withdrawal failed';
      if (typeof responseData === 'object' && responseData !== null) {
        if (responseData.message) errorMessage += `: ${responseData.message}`;
        if (responseData.error) errorMessage += `: ${responseData.error}`;
        if (responseData.code) errorMessage += ` (Code: ${responseData.code})`;
      } else if (typeof responseData === 'string') {
        if (responseData.toLowerCase().includes('currency')) {
          errorMessage = 'Incorrect currency for target environment';
        } else if (responseData.toLowerCase().includes('reference')) {
          errorMessage = 'ReferenceId already in use';
        } else {
          errorMessage += `: ${responseData}`;
        }
      }
      console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n');
      
      throw new Error(`${errorMessage} | Status: ${withdrawResponse.status} | Details: ${JSON.stringify(responseData)}`);
    }

    console.log('\n========================================');
    console.log('=== WITHDRAWAL SUBMITTED SUCCESSFULLY ===');
    console.log('========================================');
    console.log('Reference ID:', referenceId);
    console.log('External ID:', withdrawalReference);
    console.log('Amount:', amount, transactionCurrency);
    console.log('========================================\n');

    // Step 4: Check transaction status (optional but recommended)
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    
    const statusResponse = await fetch(`${baseUrl}/disbursement/v1_0/transfer/${referenceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'X-Target-Environment': targetEnvironment,
        'Ocp-Apim-Subscription-Key': subscriptionKey,
      },
    });

    let withdrawalStatus = 'pending';
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      withdrawalStatus = statusData.status?.toLowerCase() || 'pending';
      console.log('MTN MoMo withdrawal status:', statusData);
    }

    // Create transaction record
    const { data: transaction, error: txError } = await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'withdrawal',
        amount: totalRequired,
        currency: transactionCurrency, // Use sandbox/production currency
        status: withdrawalStatus === 'successful' ? 'completed' : 'pending',
        reference: withdrawalReference,
        payment_method: 'MTN Mobile Money',
        description: `MTN MoMo withdrawal of ${transactionCurrency} ${amount} (Fee: ${feeAmount.toFixed(2)})`,
        metadata: {
          mtn_reference_id: referenceId,
          provider: 'mtn_momo',
          withdrawal_amount: amount,
          fee_amount: feeAmount,
          account_type: 'mobile',
          mobile_number: profile.mobile_number,
          environment: environment,
          sandbox_mode: isSandbox,
          profile_currency: profile.currency,
          transaction_currency: transactionCurrency,
        }
      })
      .select()
      .single();

    if (txError) {
      console.error('Transaction creation error:', txError);
      throw new Error('Failed to create transaction record');
    }

    // Deduct amount from user balance
    const { error: balanceError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        balance: Number(profile.balance) - totalRequired 
      })
      .eq('id', userId);

    if (balanceError) {
      console.error('Balance update error:', balanceError);
      throw new Error('Failed to update balance');
    }

    // Send withdrawal initiated email
    try {
      await supabaseAdmin.functions.invoke('send-payment-emails', {
        body: {
          type: 'withdrawal-initiated',
          to: profile.email,
          merchantName: profile.full_name || 'Merchant',
          amount: amount.toFixed(2),
          currency: transactionCurrency,
          feeAmount: feeAmount.toFixed(2),
          netAmount: amount.toFixed(2),
          accountType: 'MTN Mobile Money',
          accountDetails: profile.mobile_number,
          reference: withdrawalReference,
        },
      });
      console.log('Withdrawal initiated email sent');
    } catch (emailError) {
      console.error('Error sending withdrawal email:', emailError);
      // Don't fail the withdrawal if email fails
    }

    console.log('MTN MoMo withdrawal processed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        transaction_id: transaction.id,
        reference: withdrawalReference,
        mtn_reference_id: referenceId,
        amount: amount,
        fee: feeAmount,
        total_deducted: totalRequired,
        status: withdrawalStatus,
        message: 'MTN MoMo withdrawal initiated successfully',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in mtn-momo-withdraw function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
