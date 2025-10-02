import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PESAPAL_BASE_URL = Deno.env.get('PESAPAL_ENVIRONMENT') === 'production'
  ? 'https://pay.pesapal.com/v3'
  : 'https://cybqa.pesapal.com/pesapalv3';

async function getPesapalToken() {
  const consumer_key = Deno.env.get('PESAPAL_CONSUMER_KEY');
  const consumer_secret = Deno.env.get('PESAPAL_CONSUMER_SECRET');

  console.log('Requesting Pesapal authentication token for IPN...');
  
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
    throw new Error('Pesapal authentication failed');
  }

  const data = await response.json();
  return data.token;
}

async function getTransactionStatus(orderTrackingId: string, token: string) {
  console.log('Fetching transaction status for:', orderTrackingId);
  
  const response = await fetch(
    `${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
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
    throw new Error('Failed to get transaction status');
  }

  return await response.json();
}

serve(async (req) => {
  try {
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

    // Parse IPN notification
    const { OrderTrackingId, OrderMerchantReference, OrderNotificationType } = await req.json();

    console.log('IPN received:', {
      OrderTrackingId,
      OrderMerchantReference,
      OrderNotificationType,
    });

    // Get Pesapal token
    const token = await getPesapalToken();

    // Get transaction status from Pesapal
    const statusData = await getTransactionStatus(OrderTrackingId, token);

    console.log('Transaction status:', statusData);

    // Find transaction by reference
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('reference', OrderTrackingId)
      .single();

    if (txError || !transaction) {
      console.error('Transaction not found:', OrderTrackingId);
      return new Response(
        JSON.stringify({ message: 'Transaction not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Map Pesapal status to our status
    let newStatus = 'pending';
    if (statusData.payment_status_description === 'Completed') {
      newStatus = 'completed';
    } else if (statusData.payment_status_description === 'Failed') {
      newStatus = 'failed';
    } else if (statusData.payment_status_description === 'Invalid') {
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
          pesapal_status: statusData.payment_status_description,
          pesapal_method: statusData.payment_method,
          confirmation_code: statusData.confirmation_code,
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
        // Fetch current link to update amounts
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
    }

    return new Response(
      JSON.stringify({ message: 'IPN processed successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in pesapal-ipn:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
