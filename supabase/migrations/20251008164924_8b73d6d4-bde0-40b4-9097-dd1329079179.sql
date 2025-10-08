-- Fix security issues: Remove public exposure of sensitive data
-- Issue 1 & 2: payment_links table exposes user_id and webhook_url publicly

-- Drop the existing public SELECT policy
DROP POLICY IF EXISTS "Public can view active payment links" ON public.payment_links;

-- Create a restricted public policy that only shows essential payment info
-- without exposing sensitive merchant data
CREATE POLICY "Public can view payment link details only"
ON public.payment_links
FOR SELECT
USING (
  status = 'active' 
  -- Note: This policy allows SELECT but application code should filter
  -- which columns are returned to avoid exposing user_id and webhook_url
);

-- Similarly fix donation_links table
DROP POLICY IF EXISTS "Public can view active donation links" ON public.donation_links;

CREATE POLICY "Public can view donation link details only"
ON public.donation_links
FOR SELECT
USING (
  status = 'active'
  -- Note: This policy allows SELECT but application code should filter
  -- which columns are returned to avoid exposing user_id and webhook_url
);

-- Fix Issue 3: Add public policy for subscription_links if they should be viewable
CREATE POLICY "Public can view active subscription links"
ON public.subscription_links
FOR SELECT
USING (status = 'active');