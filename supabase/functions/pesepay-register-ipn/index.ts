import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// TODO: Update these URLs with actual Pesepay API endpoints once API documentation is available
const PESEPAY_BASE_URL = Deno.env.get('PESEPAY_ENVIRONMENT') === 'production'
  ? 'https://api.pesepay.com' // PLACEHOLDER - Update with actual Pesepay production URL
  : 'https://api-sandbox.pesepay.com'; // PLACEHOLDER - Update with actual Pesepay sandbox URL

// Validation schema
const registerIpnSchema = z.object({
  configId: z.string().uuid(),
  ipnUrl: z.string().url(),
});

// Check if user has admin role
async function isAdmin(supabase: any, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .single();

  return !error && data !== null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get JWT from header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'E001' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role for admin checks
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify user from JWT
    const jwtToken = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwtToken);

    if (authError || !user) {
      console.error('Authentication failed');
      return new Response(
        JSON.stringify({ error: 'E002' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const adminCheck = await isAdmin(supabase, user.id);
    if (!adminCheck) {
      console.error('User is not admin');
      return new Response(
        JSON.stringify({ error: 'E003' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate request body
    const body = await req.json();
    const { configId, ipnUrl } = registerIpnSchema.parse(body);

    console.log('Registering IPN URL for config:', configId);

    // Fetch credentials from database (server-side only)
    const { data: config, error: configError } = await supabase
      .from('payment_provider_configs')
      .select('consumer_key, consumer_secret, country_code')
      .eq('id', configId)
      .single();

    if (configError || !config) {
      console.error('Failed to fetch config');
      return new Response(
        JSON.stringify({ error: 'E004' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use credentials from database
    const credentials = {
      consumer_key: config.consumer_key,
      consumer_secret: config.consumer_secret,
    };

    // TODO: Update authentication endpoint and request format based on Pesepay API documentation
    const authResponse = await fetch(`${PESEPAY_BASE_URL}/api/auth/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: credentials.consumer_key,
        api_secret: credentials.consumer_secret,
      }),
    });

    if (!authResponse.ok) {
      console.error('Pesepay authentication failed');
      return new Response(
        JSON.stringify({ error: 'E005' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authData = await authResponse.json();
    // TODO: Update based on actual Pesepay response structure
    const token = authData.token || authData.access_token || authData.accessToken;

    // TODO: Update endpoint and request body structure based on Pesepay API documentation
    // Register IPN/webhook URL
    const ipnResponse = await fetch(`${PESEPAY_BASE_URL}/api/webhooks/register`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        url: ipnUrl,
        events: ['payment.completed', 'payment.failed'], // TODO: Update based on Pesepay webhook events
      }),
    });

    if (!ipnResponse.ok) {
      const errorText = await ipnResponse.text();
      console.error('IPN registration failed:', errorText);
      return new Response(
        JSON.stringify({ error: 'E006' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await ipnResponse.json();
    console.log('IPN registered successfully');

    // TODO: Update field name based on actual Pesepay response structure
    const ipnId = data.webhook_id || data.id || data.ipn_id;

    // Update config with IPN ID
    const { error: updateError } = await supabase
      .from('payment_provider_configs')
      .update({ ipn_id: ipnId })
      .eq('id', configId);

    if (updateError) {
      console.error('Failed to update config with IPN ID');
    }

    // Log admin action
    await supabase
      .from('admin_audit_logs')
      .insert({
        admin_user_id: user.id,
        action: 'register_ipn',
        metadata: { configId, country: config.country_code, ipn_id: ipnId, provider: 'pesepay' },
      });

    return new Response(
      JSON.stringify({
        success: true,
        ipn_id: ipnId,
        url: ipnUrl,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in pesepay-register-ipn:', error);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'E007', details: error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'E008' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

