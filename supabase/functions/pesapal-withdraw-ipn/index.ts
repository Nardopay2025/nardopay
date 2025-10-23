import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PesapalAuthResponse {
  token: string;
  expiryDate: string;
}

interface PesapalStatusResponse {
  payment_method: string;
  amount: number;
  created_date: string;
  confirmation_code: string;
  payment_status_description: string;
  description: string;
  message: string;
  payment_account: string;
  call_back_url: string;
  status_code: number;
  merchant_reference: string;
  payment_status_code: string;
  currency: string;
  error: any;
  status: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Withdrawal IPN received');
    
    const { OrderTrackingId, OrderMerchantReference } = await req.json();

    if (!OrderTrackingId && !OrderMerchantReference) {
      console.error('Missing tracking ID and merchant reference');
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing withdrawal status for:', { OrderTrackingId, OrderMerchantReference });

    // Get Pesapal access token
    const consumerKey = Deno.env.get('PESAPAL_CONSUMER_KEY');
    const consumerSecret = Deno.env.get('PESAPAL_CONSUMER_SECRET');
    const environment = Deno.env.get('PESAPAL_ENVIRONMENT') || 'sandbox';
    
    const baseUrl = environment === 'production' 
      ? 'https://pay.pesapal.com/v3'
      : 'https://cybqa.pesapal.com/pesapalv3';

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

    // Get withdrawal status from Pesapal
    const statusUrl = `${baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${OrderTrackingId}`;
    
    console.log('Fetching withdrawal status from Pesapal...');
    const statusResponse = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${authData.token}`,
      },
    });

    if (!statusResponse.ok) {
      const errorText = await statusResponse.text();
      console.error('Status check failed:', errorText);
      throw new Error('Failed to check withdrawal status');
    }

    const statusData: PesapalStatusResponse = await statusResponse.json();
    console.log('Withdrawal status:', statusData);

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Find transaction by reference
    const { data: transaction, error: txFetchError } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('reference', OrderMerchantReference)
      .eq('type', 'withdrawal')
      .single();

    if (txFetchError || !transaction) {
      console.error('Transaction not found:', txFetchError);
      return new Response(
        JSON.stringify({ error: 'Transaction not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map Pesapal status codes to our status
    let transactionStatus = 'pending';
    let shouldRefundBalance = false;

    // Pesapal status codes: 0=pending, 1=completed, 2=failed, 3=reversed
    switch (statusData.payment_status_code) {
      case '1':
        transactionStatus = 'completed';
        break;
      case '2':
        transactionStatus = 'failed';
        shouldRefundBalance = true;
        break;
      case '3':
        transactionStatus = 'failed';
        shouldRefundBalance = true;
        break;
      default:
        transactionStatus = 'pending';
    }

    console.log('Updating transaction status to:', transactionStatus);

    // Update transaction with new status
    const { error: txUpdateError } = await supabaseAdmin
      .from('transactions')
      .update({
        status: transactionStatus,
        completed_at: transactionStatus === 'completed' ? new Date().toISOString() : null,
        metadata: {
          ...transaction.metadata,
          pesapal_status: statusData.payment_status_description,
          pesapal_confirmation: statusData.confirmation_code,
          last_updated: new Date().toISOString(),
        }
      })
      .eq('id', transaction.id);

    if (txUpdateError) {
      console.error('Transaction update error:', txUpdateError);
      throw new Error('Failed to update transaction');
    }

    // If withdrawal failed, refund the balance
    if (shouldRefundBalance && transaction.status !== 'failed') {
      console.log('Refunding balance for failed withdrawal');
      
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('balance')
        .eq('id', transaction.user_id)
        .single();

      if (profile) {
        await supabaseAdmin
          .from('profiles')
          .update({ 
            balance: Number(profile.balance) + Number(transaction.amount)
          })
          .eq('id', transaction.user_id);
      }
    }

    // Send email notification about withdrawal status
    try {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('email, full_name, withdrawal_account_type, mobile_provider, mobile_number, bank_name, bank_account_name')
        .eq('id', transaction.user_id)
        .single();

      if (profile) {
        const accountType = profile.withdrawal_account_type === 'mobile' 
          ? `${profile.mobile_provider} Mobile Money`
          : 'Bank Account';
        const accountDetails = profile.withdrawal_account_type === 'mobile'
          ? profile.mobile_number
          : `${profile.bank_name} - ${profile.bank_account_name}`;

        await supabaseAdmin.functions.invoke('send-payment-emails', {
          body: {
            type: 'withdrawal-status',
            to: profile.email,
            merchantName: profile.full_name || 'Merchant',
            amount: transaction.amount.toFixed(2),
            currency: transaction.currency,
            status: transactionStatus,
            accountType,
            accountDetails,
            reference: transaction.reference || '',
            failureReason: transactionStatus === 'failed' ? statusData.payment_status_description : undefined,
          },
        });
        console.log('Withdrawal status email sent');
      }
    } catch (emailError) {
      console.error('Error sending withdrawal status email:', emailError);
      // Don't fail the IPN if email fails
    }

    console.log('Withdrawal IPN processed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        transaction_id: transaction.id,
        status: transactionStatus,
        message: statusData.payment_status_description,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in pesapal-withdraw-ipn function:', error);
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
