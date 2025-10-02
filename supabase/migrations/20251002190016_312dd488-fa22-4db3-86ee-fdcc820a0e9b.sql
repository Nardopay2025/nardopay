-- Add country and withdrawal account fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN country TEXT,
ADD COLUMN withdrawal_account_type TEXT CHECK (withdrawal_account_type IN ('mobile', 'bank')),
ADD COLUMN mobile_provider TEXT,
ADD COLUMN mobile_number TEXT,
ADD COLUMN bank_name TEXT,
ADD COLUMN bank_account_number TEXT,
ADD COLUMN bank_account_name TEXT,
ADD COLUMN plan TEXT DEFAULT 'free';

-- Add comment for clarity
COMMENT ON COLUMN public.profiles.country IS 'User country (implies withdrawal currency)';
COMMENT ON COLUMN public.profiles.withdrawal_account_type IS 'Type of withdrawal account: mobile or bank';
COMMENT ON COLUMN public.profiles.plan IS 'Subscription plan: free, starter, professional, enterprise';