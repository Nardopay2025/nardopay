import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fromCurrency, toCurrency } = await req.json();

    if (!fromCurrency || !toCurrency) {
      throw new Error('Both fromCurrency and toCurrency are required');
    }

    console.log(`Fetching exchange rate from ${fromCurrency} to ${toCurrency}`);

    // Using ExchangeRate-API which provides rates similar to Google's exchange rates
    // Google doesn't provide a public API, but this service mirrors Google's rates
    // Free, no API key needed for basic usage
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
    );

    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.rates || !data.rates[toCurrency]) {
      throw new Error(`Exchange rate not found for ${toCurrency}`);
    }

    const rate = data.rates[toCurrency];
    const timestamp = data.time_last_updated;

    console.log(`Exchange rate: 1 ${fromCurrency} = ${rate} ${toCurrency}`);

    return new Response(
      JSON.stringify({
        rate,
        fromCurrency,
        toCurrency,
        timestamp,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in get-exchange-rate function:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
