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
  
  // Simple checksum calculation (sum of bytes mod 256)
  let sum = 0;
  for (const byte of data) {
    sum += byte;
  }
  return (sum % 256).toString(16).padStart(2, '0').toUpperCase();
}

// Build XML request for card authorization
function buildAuthorizationXML(params: {
  terminalId: string;
  checksum: string;
  campaignUuid: string;
  amount: string;
  currency: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  reference: string;
}): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<AuthorizationRequest>
  <TerminalID>${params.terminalId}</TerminalID>
  <Checksum>${params.checksum}</Checksum>
  <CampaignUUID>${params.campaignUuid}</CampaignUUID>
  <Amount>${params.amount}</Amount>
  <Currency>${params.currency}</Currency>
  <CardNumber>${params.cardNumber}</CardNumber>
  <ExpiryDate>${params.expiryDate}</ExpiryDate>
  <CVV>${params.cvv}</CVV>
  <Reference>${params.reference}</Reference>
</AuthorizationRequest>`;
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

    const { amount, currency, cardNumber, expiryDate, cvv, reference, metadata } = await req.json();

    console.log('Processing Paymentology card payment:', { amount, currency, reference });

    // Get credentials
    const terminalId = Deno.env.get('PAYMENTOLOGY_TERMINAL_ID');
    const password = Deno.env.get('PAYMENTOLOGY_TERMINAL_PASSWORD');
    const campaignUuid = Deno.env.get('PAYMENTOLOGY_CAMPAIGN_UUID');
    const environment = Deno.env.get('PAYMENTOLOGY_ENVIRONMENT') || 'sandbox';

    if (!terminalId || !password || !campaignUuid) {
      throw new Error('Missing Paymentology credentials');
    }

    // Calculate checksum
    const checksum = calculateChecksum(
      terminalId,
      password,
      amount,
      currency,
      cardNumber,
      expiryDate
    );

    // Build XML request
    const xmlRequest = buildAuthorizationXML({
      terminalId,
      checksum,
      campaignUuid,
      amount,
      currency,
      cardNumber,
      expiryDate,
      cvv,
      reference,
    });

    // Determine API endpoint based on environment
    const apiUrl = environment === 'live' 
      ? 'https://api.paymentology.com/authorization'
      : 'https://sandbox-api.paymentology.com/authorization';

    console.log('Sending request to Paymentology:', apiUrl);

    // Send request to Paymentology
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xmlRequest,
    });

    const responseText = await response.text();
    console.log('Paymentology response:', responseText);

    // Parse XML response (basic parsing)
    const approved = responseText.includes('<ResponseCode>00</ResponseCode>');
    const authCode = responseText.match(/<AuthorizationCode>(.*?)<\/AuthorizationCode>/)?.[1];

    if (approved && authCode) {
      // Create transaction record
      const { data: { user } } = await supabaseClient.auth.getUser();
      
      if (user) {
        await supabaseClient.from('transactions').insert({
          user_id: user.id,
          type: 'payment',
          amount,
          currency,
          status: 'completed',
          payment_method: 'card',
          reference: authCode,
          description: 'Card payment via Paymentology',
          metadata: {
            ...metadata,
            authorization_code: authCode,
            terminal_id: terminalId,
          },
          completed_at: new Date().toISOString(),
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          authorization_code: authCode,
          reference: authCode,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      const errorMessage = responseText.match(/<ResponseMessage>(.*?)<\/ResponseMessage>/)?.[1] || 'Payment declined';
      
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
    console.error('Error processing Paymentology payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
