-- Public access policies for public payment/donation pages
-- Allow anyone to view ACTIVE payment links by RLS policy (read-only)
CREATE POLICY "Public can view active payment links"
ON public.payment_links
FOR SELECT
USING (status = 'active');

-- Allow anyone to view ACTIVE donation links by RLS policy (read-only)
CREATE POLICY "Public can view active donation links"
ON public.donation_links
FOR SELECT
USING (status = 'active');

-- Optional but recommended: index for faster lookup by link_code
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'idx_payment_links_link_code' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_payment_links_link_code ON public.payment_links (link_code);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'idx_donation_links_link_code' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_donation_links_link_code ON public.donation_links (link_code);
  END IF;
END $$;