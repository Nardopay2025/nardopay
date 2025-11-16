import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const ADMIN_DASHBOARD_ORIGIN = Deno.env.get('ADMIN_DASHBOARD_ORIGIN') || '';

const corsHeaders = {
  // For security, restrict origins to the configured dashboard origin when provided.
  // Fall back to "*" only if no explicit origin is configured (e.g. during local development).
  'Access-Control-Allow-Origin': ADMIN_DASHBOARD_ORIGIN || '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schemas
const createConfigSchema = z.object({
  provider: z.string().min(1).max(50),
  country_code: z.string().length(2),
  environment: z.enum(['sandbox', 'production']),
  consumer_key: z.string().min(10).max(500),
  consumer_secret: z.string().min(10).max(500),
  ipn_id: z.string().max(500).optional(),
  is_active: z.boolean().default(true),
});

const updateConfigSchema = z.object({
  id: z.string().uuid(),
  provider: z.string().min(1).max(50).optional(),
  country_code: z.string().length(2).optional(),
  environment: z.enum(['sandbox', 'production']).optional(),
  consumer_key: z.string().min(10).max(500).optional(),
  consumer_secret: z.string().min(10).max(500).optional(),
  ipn_id: z.string().max(500).optional(),
  is_active: z.boolean().optional(),
});

const deleteConfigSchema = z.object({
  id: z.string().uuid(),
});

const listConfigsSchema = z.object({
  country_code: z.string().length(2).optional(),
});

// Helper to check admin role
async function isAdmin(supabase: any, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .maybeSingle();
  
  return !!data;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('[Internal] Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Access denied', code: 'E401' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify JWT and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('[Internal] Invalid authentication token:', authError);
      return new Response(
        JSON.stringify({ error: 'Access denied', code: 'E401' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin role
    const userIsAdmin = await isAdmin(supabase, user.id);
    if (!userIsAdmin) {
      console.error('[Internal] Non-admin user attempted access:', user.id);
      return new Response(
        JSON.stringify({ error: 'Access denied', code: 'E403' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'list': {
        const validated = listConfigsSchema.parse(body);
        
        let query = supabase
          .from('payment_provider_configs')
          // SECURITY: Never return secrets in list operations
          .select('id, provider, country_code, environment, is_active, ipn_id, created_at, updated_at')
          .order('country_code', { ascending: true });

        if (validated.country_code) {
          query = query.eq('country_code', validated.country_code);
        }

        const { data, error } = await query;

        if (error) {
          console.error('[Internal] List configs error:', error);
          return new Response(
            JSON.stringify({ error: 'Operation failed', code: 'E500' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ configs: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'create': {
        const validated = createConfigSchema.parse(body);

        const { error } = await supabase
          .from('payment_provider_configs')
          .insert([validated]);

        if (error) {
          console.error('[Internal] Create config error:', error);
          return new Response(
            JSON.stringify({ error: 'Operation failed', code: 'E400' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Log admin action
        await supabase.from('admin_audit_logs').insert({
          admin_user_id: user.id,
          action: 'create_payment_config',
          metadata: { provider: validated.provider, country: validated.country_code },
        });

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update': {
        const validated = updateConfigSchema.parse(body);
        const { id, ...updates } = validated;

        const { error } = await supabase
          .from('payment_provider_configs')
          .update(updates)
          .eq('id', id);

        if (error) {
          console.error('[Internal] Update config error:', error);
          return new Response(
            JSON.stringify({ error: 'Operation failed', code: 'E400' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Log admin action
        await supabase.from('admin_audit_logs').insert({
          admin_user_id: user.id,
          action: 'update_payment_config',
          metadata: { config_id: id },
        });

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete': {
        const validated = deleteConfigSchema.parse(body);

        const { error } = await supabase
          .from('payment_provider_configs')
          .delete()
          .eq('id', validated.id);

        if (error) {
          console.error('[Internal] Delete config error:', error);
          return new Response(
            JSON.stringify({ error: 'Operation failed', code: 'E400' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Log admin action
        await supabase.from('admin_audit_logs').insert({
          admin_user_id: user.id,
          action: 'delete_payment_config',
          metadata: { config_id: validated.id },
        });

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        console.error('[Internal] Invalid action requested:', action);
        return new Response(
          JSON.stringify({ error: 'Invalid request', code: 'E400' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error: any) {
    console.error('[Internal] Manage payment configs error:', error);
    
    // Return generic error to client, log details server-side
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', code: 'E001' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Internal error', code: 'E002' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
