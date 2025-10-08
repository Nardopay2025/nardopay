import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schema
const setupSchema = z.object({
  action: z.literal('setup_test_configs'),
});

// Test credentials stored server-side only
const TEST_CONFIGS = [
  { country_code: "KE", consumer_key: "qkio1BGGYAXTu2JOfm7XSXNruoZsrqEW", consumer_secret: "osGQ364R49cXKeOYSpaOnT++rHs=" },
  { country_code: "UG", consumer_key: "TDpigBOOhs+zAl8cwH2Fl82jJGyD8xev", consumer_secret: "1KpqkfsMaihIcOlhnBo/gBZ5smw=" },
  { country_code: "TZ", consumer_key: "ngW+UEcnDhltUc5fxPfrCD987xMh3Lx8", consumer_secret: "q27RChYs5UkypdcNYKzuUw460Dg=" },
  { country_code: "MW", consumer_key: "htMsEFfIVHfhqBL9O0ykz8wuedfFyg1s", consumer_secret: "DcwkVNIiyijNWn1fdL/pa4K6khc=" },
  { country_code: "RW", consumer_key: "wCGzX1fNzvtI5lMR5M4AxvxBmLpFgZzp", consumer_secret: "uU7R9g2IHn9dkrKDVIfcPppktIo=" },
  { country_code: "ZM", consumer_key: "v988cq7bMB6AjktYo/drFpe6k2r/y7z3", consumer_secret: "3p0F/KcY8WAi36LntpPf/Ss0MhQ=" },
  { country_code: "ZW", consumer_key: "vknEWEEFeygxAX+C9TPOhvkbkPsj8qXK", consumer_secret: "MOOP31smKijvusQbNXn/s7m8jC8=" },
];

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
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'E002' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const adminCheck = await isAdmin(supabase, user.id);
    if (!adminCheck) {
      console.error('User is not admin:', user.id);
      return new Response(
        JSON.stringify({ error: 'E003' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate request body
    const body = await req.json();
    const validatedData = setupSchema.parse(body);

    console.log('Setting up test configs for admin:', user.id);

    // Create all test configs
    const results = [];
    for (const config of TEST_CONFIGS) {
      const { data, error } = await supabase
        .from('payment_provider_configs')
        .insert({
          country_code: config.country_code,
          provider: 'pesapal',
          environment: 'sandbox',
          consumer_key: config.consumer_key,
          consumer_secret: config.consumer_secret,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error(`Failed to create config for ${config.country_code}:`, error);
        results.push({ country: config.country_code, success: false, error: error.message });
      } else {
        results.push({ country: config.country_code, success: true, id: data.id });
      }
    }

    // Log admin action
    await supabase
      .from('admin_audit_logs')
      .insert({
        admin_user_id: user.id,
        action: 'setup_test_configs',
        metadata: { results },
      });

    return new Response(
      JSON.stringify({
        success: true,
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in setup-test-configs:', error);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'E004', details: error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'E005' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
