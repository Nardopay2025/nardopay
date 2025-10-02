import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    throw new Error('Pesapal authentication failed');
  }

  const data = await response.json();
  return data.token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ipnUrl } = await req.json();

    console.log('Registering IPN URL:', ipnUrl);

    // Get Pesapal token
    const token = await getPesapalToken();

    // Register IPN URL
    const response = await fetch(`${PESAPAL_BASE_URL}/api/URLSetup/RegisterIPN`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        url: ipnUrl,
        ipn_notification_type: 'GET',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('IPN registration error:', errorText);
      throw new Error(`IPN registration failed: ${errorText}`);
    }

    const data = await response.json();
    console.log('IPN registered successfully:', data);

    return new Response(
      JSON.stringify({
        success: true,
        ipn_id: data.ipn_id,
        url: data.url,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in pesapal-register-ipn:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
