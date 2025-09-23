import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env } from '@/config/env'

let client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
	if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
		throw new Error('Missing Supabase env. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
	}
	if (!client) {
		client = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
	}
	return client
}


