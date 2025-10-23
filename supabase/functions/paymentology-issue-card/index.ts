import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Calculate checksum for Paymentology API
function calculateChecksum(terminalId: string, password: string, ...fields: string[]): string {
  const concat = [terminalId, password, ...fields].join('');
  const encoder = new TextEncoder();
  const data = encoder.encode(concat);
  
  let sum = 0;
  for (const byte of data) {
    sum += byte;
  }
  return (sum % 256).toString(16).padStart(2, '0').toUpperCase();
}

// Build XML request for virtual card issuance
function buildCardIssuanceXML(params: {
  terminalId: string;
  checksum: string;
  campaignUuid: string;
  amount: string;
  currency: string;
  reference: string;
  customerName: string;
}): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<CardIssuanceRequest>
  <TerminalID>${params.terminalId}</TerminalID>
  <Checksum>${params.checksum}</Checksum>
  <CampaignUUID>${params.campaignUuid}</CampaignUUID>
  <CardType>Virtual</CardType>
  <Amount>${params.amount}</Amount>
  <Currency>${params.currency}</Currency>
  <Reference>${params.reference}</Reference>
  <CardholderName>${params.customerName}</CardholderName>
</CardIssuanceRequest>`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { amount, currency, customerName, withdrawalDetails } = await req.json();

    console.log('Issuing virtual card for withdrawal:', { amount, currency, customerName });

    // Get credentials
    const terminalId = Deno.env.get('PAYMENTOLOGY_TERMINAL_ID');
    const password = Deno.env.get('PAYMENTOLOGY_TERMINAL_PASSWORD');
    const campaignUuid = Deno.env.get('PAYMENTOLOGY_CAMPAIGN_UUID');
    const environment = Deno.env.get('PAYMENTOLOGY_ENVIRONMENT') || 'sandbox';

    if (!terminalId || !password || !campaignUuid) {
      throw new Error('Missing Paymentology credentials');
    }

    // Generate reference
    const reference = `WD-${Date.now()}`;

    // Calculate checksum
    const checksum = calculateChecksum(
      terminalId,
      password,
      amount,
      currency,
      reference
    );

    // Build XML request
    const xmlRequest = buildCardIssuanceXML({
      terminalId,
      checksum,
      campaignUuid,
      amount,
      currency,
      reference,
      customerName,
    });

    // Determine API endpoint
    const apiUrl = environment === 'live' 
      ? 'https://api.paymentology.com/card/issue'
      : 'https://sandbox-api.paymentology.com/card/issue';

    console.log('Sending card issuance request to Paymentology:', apiUrl);

    // Send request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xmlRequest,
    });

    const responseText = await response.text();
    console.log('Paymentology card issuance response:', responseText);

    // Parse XML response
    const success = responseText.includes('<ResponseCode>00</ResponseCode>');
    const cardNumber = responseText.match(/<CardNumber>(.*?)<\/CardNumber>/)?.[1];
    const expiryDate = responseText.match(/<ExpiryDate>(.*?)<\/ExpiryDate>/)?.[1];
    const cvv = responseText.match(/<CVV>(.*?)<\/CVV>/)?.[1];

    if (success && cardNumber) {
      // Get user
      const { data: { user } } = await supabaseClient.auth.getUser();
      
      if (user) {
        // Create withdrawal transaction
        await supabaseClient.from('transactions').insert({
          user_id: user.id,
          type: 'withdrawal',
          amount,
          currency,
          status: 'completed',
          payment_method: 'virtual_card',
          reference,
          description: 'Virtual card issued for withdrawal',
          metadata: {
            card_last_4: cardNumber.slice(-4),
            expiry_date: expiryDate,
            withdrawal_details: withdrawalDetails,
            terminal_id: terminalId,
          },
          completed_at: new Date().toISOString(),
        });

        // Update user balance
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('balance')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          await supabaseClient
            .from('profiles')
            .update({ balance: (profile.balance || 0) - parseFloat(amount) })
            .eq('id', user.id);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          card: {
            number: cardNumber,
            expiry: expiryDate,
            cvv: cvv,
            last4: cardNumber.slice(-4),
          },
          reference,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      const errorMessage = responseText.match(/<ResponseMessage>(.*?)<\/ResponseMessage>/)?.[1] || 'Card issuance failed';
      
      return new Response(
        JSON.stringify({
          success: false,
          error: errorMessage,
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (err) {
    const error = err as Error;
    console.error('Error issuing Paymentology virtual card:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
