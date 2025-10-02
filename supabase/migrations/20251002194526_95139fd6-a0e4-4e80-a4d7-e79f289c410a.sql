-- Add invoice branding columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS business_address TEXT,
ADD COLUMN IF NOT EXISTS tax_id TEXT,
ADD COLUMN IF NOT EXISTS invoice_footer TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#0EA5E9',
ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '#0284C7';

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);