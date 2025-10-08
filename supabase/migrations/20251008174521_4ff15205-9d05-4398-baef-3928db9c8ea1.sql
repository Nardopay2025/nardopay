-- Create a secure view for profiles that hides ultra-sensitive financial fields
-- Users can still access their own data through direct table queries (with RLS)
-- but this provides an additional security layer

DROP VIEW IF EXISTS public.safe_profiles;

CREATE VIEW public.safe_profiles
WITH (security_invoker = true)
AS
SELECT 
  id,
  email,
  full_name,
  avatar_url,
  business_name,
  business_address,
  logo_url,
  primary_color,
  secondary_color,
  currency,
  plan,
  country,
  created_at,
  updated_at
  -- Explicitly excluding: bank_account_number, bank_account_name, bank_name,
  -- mobile_number, mobile_provider, tax_id, balance, withdrawal_account_type
FROM public.profiles;

GRANT SELECT ON public.safe_profiles TO authenticated, anon;

-- Add explicit comment to public views to document they are secure
COMMENT ON VIEW public.public_donation_links IS 'Secure public view - filters active donations only, excludes webhook_url, uses security_invoker';
COMMENT ON VIEW public.public_payment_links IS 'Secure public view - filters active links only, excludes webhook_url, uses security_invoker';  
COMMENT ON VIEW public.public_subscription_links IS 'Secure public view - filters active subscriptions only, excludes webhook_url, uses security_invoker';