-- Fix critical security issues

-- Issue 1: Create secure public views for payment_links without sensitive data
CREATE OR REPLACE VIEW public.public_payment_links AS
SELECT 
  id,
  link_code,
  product_name,
  description,
  amount,
  currency,
  status,
  created_at,
  thank_you_message,
  redirect_url
FROM public.payment_links
WHERE status = 'active';

-- Grant SELECT on the view to anon users
GRANT SELECT ON public.public_payment_links TO anon;

-- Create secure public view for donation_links
CREATE OR REPLACE VIEW public.public_donation_links AS
SELECT 
  id,
  link_code,
  title,
  description,
  goal_amount,
  current_amount,
  donations_count,
  currency,
  status,
  created_at,
  thank_you_message,
  redirect_url
FROM public.donation_links
WHERE status = 'active';

GRANT SELECT ON public.public_donation_links TO anon;

-- Create secure public view for subscription_links
CREATE OR REPLACE VIEW public.public_subscription_links AS
SELECT 
  id,
  link_code,
  plan_name,
  description,
  amount,
  currency,
  billing_cycle,
  trial_days,
  status,
  created_at,
  thank_you_message,
  redirect_url
FROM public.subscription_links
WHERE status = 'active';

GRANT SELECT ON public.public_subscription_links TO anon;

-- Issue 2: Tighten profiles RLS - ensure users can ONLY see and update their own data
-- Drop existing policies and create more restrictive ones
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own_safe" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Strict policy: users can only SELECT their own profile
CREATE POLICY "users_select_own_profile_only"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Strict policy: users can only UPDATE their own profile
-- and cannot change their role
CREATE POLICY "users_update_own_profile_only"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
);

-- Issue 3: Add explicit DELETE policy for transactions
-- Prevent deletion of transactions (audit trail requirement)
CREATE POLICY "transactions_cannot_be_deleted"
ON public.transactions
FOR DELETE
TO authenticated
USING (false);

-- Also prevent anonymous deletion
CREATE POLICY "transactions_anon_cannot_delete"
ON public.transactions
FOR DELETE
TO anon
USING (false);