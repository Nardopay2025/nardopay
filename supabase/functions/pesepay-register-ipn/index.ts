import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const ADMIN_DASHBOARD_ORIGIN = Deno.env.get('ADMIN_DASHBOARD_ORIGIN') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': ADMIN_DASHBOARD_ORIGIN || '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Pesepay API endpoints
// According to Pesepay documentation: https://developers.pesepay.com
// Base URL: https://api.pesepay.com
// NOTE: Pesepay may use result_url in payment creation instead of IPN registration
// Verify if IPN registration endpoint exists or if webhooks are configured differently
const PESEPAY_BASE_URL = Deno.env.get('PESEPAY_ENVIRONMENT') === 'production'
  ? 'https://api.pesepay.com'
  : 'https://api.pesepay.com'; // Use same URL for sandbox (test with test credentials)

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

    // Clean integration key
    let integrationKey = String(credentials.consumer_key || '').trim();
    integrationKey = integrationKey.replace(/[\s\n\r\t\0]/g, '');
    integrationKey = integrationKey.replace(/[^\x20-\x7E]/g, '');

    // NOTE: Pesepay uses Integration Key directly in authorization header (no token-based auth).
    // If Pesepay changes this contract, update both this function and pesepay-submit-order to
    // follow the latest documentation.
    // Register IPN/webhook URL (endpoint and event names should be kept in sync with docs).
    const ipnResponse = await fetch(`${PESEPAY_BASE_URL}/api/webhooks/register`, {
      method: 'POST',
      headers: {
        'authorization': integrationKey, // Direct integration key (per Pesepay docs)
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        url: ipnUrl,
        events: ['payment.completed', 'payment.failed', 'payment.pending'],
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
    console.log('IPN registered successfully:', data);

    // NOTE: Update field name based on actual Pesepay response structure
    // Verify exact field name with Pesepay documentation
    const ipnId = data.webhook_id || data.id || data.ipn_id || data.webhookId || data.ipnId;

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

