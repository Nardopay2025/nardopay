-- Update secure views to include user_id (needed for branding lookup)
-- but still exclude sensitive webhook URLs

DROP VIEW IF EXISTS public.public_payment_links;
DROP VIEW IF EXISTS public.public_donation_links;
DROP VIEW IF EXISTS public.public_subscription_links;

CREATE VIEW public.public_payment_links
WITH (security_invoker = true)
AS
SELECT 
  id,
  user_id,
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

GRANT SELECT ON public.public_payment_links TO anon, authenticated;

CREATE VIEW public.public_donation_links
WITH (security_invoker = true)
AS
SELECT 
  id,
  user_id,
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

GRANT SELECT ON public.public_donation_links TO anon, authenticated;

CREATE VIEW public.public_subscription_links
WITH (security_invoker = true)
AS
SELECT 
  id,
  user_id,
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

GRANT SELECT ON public.public_subscription_links TO anon, authenticated;