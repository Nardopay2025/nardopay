import { z } from 'zod'

// Validate and normalize Vite client env
const clientEnvSchema = z.object({
	VITE_API_BASE_URL: z.string().url().optional(),
	VITE_SUPABASE_URL: z.string().url().optional(),
	VITE_SUPABASE_ANON_KEY: z.string().optional()
})

const parsed = clientEnvSchema.safeParse(import.meta.env)

export const env = {
	API_BASE_URL: parsed.success ? parsed.data.VITE_API_BASE_URL : undefined,
	SUPABASE_URL: parsed.success ? parsed.data.VITE_SUPABASE_URL : undefined,
	SUPABASE_ANON_KEY: parsed.success ? parsed.data.VITE_SUPABASE_ANON_KEY : undefined
}


