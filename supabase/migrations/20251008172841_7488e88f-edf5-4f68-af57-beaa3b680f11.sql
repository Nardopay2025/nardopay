-- Remove public SELECT policies from main tables
-- Public access should only go through the secure views

DROP POLICY IF EXISTS "Public can view payment link details only" ON public.payment_links;
DROP POLICY IF EXISTS "Public can view donation link details only" ON public.donation_links;
DROP POLICY IF EXISTS "Public can view active subscription links" ON public.subscription_links;

-- Add RLS to the public views (they inherit from tables but need explicit policies)
ALTER VIEW public.public_payment_links SET (security_barrier = true);
ALTER VIEW public.public_donation_links SET (security_barrier = true);
ALTER VIEW public.public_subscription_links SET (security_barrier = true);