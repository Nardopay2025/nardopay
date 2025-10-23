import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WithdrawRequest {
  amount: number;
}

interface PesapalAuthResponse {
  token: string;
  expiryDate: string;
}

interface PesapalWithdrawResponse {
  order_tracking_id: string;
  merchant_reference: string;
  status: string;
  status_code: number;
  message: string;
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

    // Decode JWT to extract user ID (JWT format: "Bearer <token>")
    const token = authHeader.replace('Bearer ', '');
    
    let userId: string;
    try {
      // JWT payload is the middle part of token (header.payload.signature)
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
      .select('balance, currency, withdrawal_account_type, mobile_provider, mobile_number, bank_name, bank_account_number, bank_account_name, country, plan, full_name, email')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError);
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    // Validate withdrawal account is configured
    if (!profile.withdrawal_account_type) {
      return new Response(
        JSON.stringify({ error: 'Withdrawal account not configured. Please set up in Settings.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Pesapal access token
    const consumerKey = Deno.env.get('PESAPAL_CONSUMER_KEY');
    const consumerSecret = Deno.env.get('PESAPAL_CONSUMER_SECRET');
    const environment = Deno.env.get('PESAPAL_ENVIRONMENT') || 'sandbox';
    
    const baseUrl = environment === 'production' 
      ? 'https://pay.pesapal.com/v3'
      : 'https://cybqa.pesapal.com/pesapalv3';

    console.log('Authenticating with Pesapal...');
    const authResponse = await fetch(`${baseUrl}/api/Auth/RequestToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
      }),
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error('Pesapal auth failed:', errorText);
      throw new Error('Failed to authenticate with payment provider');
    }

    const authData: PesapalAuthResponse = await authResponse.json();
    console.log('Pesapal authentication successful');

    // Generate unique reference
    const withdrawalReference = `WD-${userId.slice(0, 8)}-${Date.now()}`;

    // Prepare withdrawal payload based on account type
    let withdrawalPayload: any = {
      merchant_reference: withdrawalReference,
      amount: amount,
      currency: profile.currency,
      description: `Withdrawal to ${profile.withdrawal_account_type === 'mobile' ? 'mobile money' : 'bank account'}`,
    };

    if (profile.withdrawal_account_type === 'mobile') {
      // Mobile money withdrawal
      if (!profile.mobile_number || !profile.mobile_provider) {
        return new Response(
          JSON.stringify({ error: 'Mobile money account details incomplete' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      withdrawalPayload = {
        ...withdrawalPayload,
        account_number: profile.mobile_number,
        payment_method: profile.mobile_provider, // e.g., 'M-Pesa', 'Airtel Money'
      };
    } else {
      // Bank transfer
      if (!profile.bank_account_number || !profile.bank_name || !profile.bank_account_name) {
        return new Response(
          JSON.stringify({ error: 'Bank account details incomplete' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      withdrawalPayload = {
        ...withdrawalPayload,
        account_number: profile.bank_account_number,
        account_name: profile.bank_account_name,
        bank_name: profile.bank_name,
        payment_method: 'Bank Transfer',
      };
    }

    console.log('Submitting withdrawal to Pesapal...');
    
    // Submit withdrawal to Pesapal (B2C endpoint)
    const withdrawResponse = await fetch(`${baseUrl}/api/Transactions/SubmitB2CRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${authData.token}`,
      },
      body: JSON.stringify(withdrawalPayload),
    });

    if (!withdrawResponse.ok) {
      const errorText = await withdrawResponse.text();
      console.error('Withdrawal submission failed:', errorText);
      throw new Error('Failed to process withdrawal with payment provider');
    }

    const withdrawData: PesapalWithdrawResponse = await withdrawResponse.json();
    console.log('Withdrawal submitted successfully:', withdrawData);

    // Create transaction record
    const { data: transaction, error: txError } = await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'withdrawal',
        amount: totalRequired,
        currency: profile.currency,
        status: 'pending',
        reference: withdrawalReference,
        payment_method: profile.withdrawal_account_type === 'mobile' ? profile.mobile_provider : 'Bank Transfer',
        description: `Withdrawal of ${profile.currency} ${amount} (Fee: ${(totalRequired - amount).toFixed(2)})`,
        metadata: {
          pesapal_tracking_id: withdrawData.order_tracking_id,
          withdrawal_amount: amount,
          fee_amount: totalRequired - amount,
          account_type: profile.withdrawal_account_type,
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
      // Note: In production, you'd want to implement a rollback mechanism here
      throw new Error('Failed to update balance');
    }

    // Send withdrawal initiated email
    try {
      const accountType = profile.withdrawal_account_type === 'mobile' 
        ? `${profile.mobile_provider} Mobile Money`
        : 'Bank Account';
      const accountDetails = profile.withdrawal_account_type === 'mobile'
        ? profile.mobile_number
        : `${profile.bank_name} - ${profile.bank_account_name}`;

      await supabaseAdmin.functions.invoke('send-payment-emails', {
        body: {
          type: 'withdrawal-initiated',
          to: profile.email,
          merchantName: profile.full_name || 'Merchant',
          amount: amount.toFixed(2),
          currency: profile.currency,
          feeAmount: feeAmount.toFixed(2),
          netAmount: (amount - feeAmount).toFixed(2),
          accountType,
          accountDetails,
          reference: withdrawalReference,
        },
      });
      console.log('Withdrawal initiated email sent');
    } catch (emailError) {
      console.error('Error sending withdrawal initiated email:', emailError);
      // Don't fail the withdrawal if email fails
    }

    console.log('Withdrawal processed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        transaction_id: transaction.id,
        reference: withdrawalReference,
        tracking_id: withdrawData.order_tracking_id,
        amount: amount,
        fee: totalRequired - amount,
        total_deducted: totalRequired,
        status: withdrawData.status,
        message: withdrawData.message || 'Withdrawal initiated successfully',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in pesapal-withdraw function:', error);
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
