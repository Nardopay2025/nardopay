-- Add webhook_url column to payment_links
ALTER TABLE payment_links
ADD COLUMN webhook_url TEXT;

-- Add webhook_url column to donation_links
ALTER TABLE donation_links
ADD COLUMN webhook_url TEXT;

-- Add webhook_url column to subscription_links
ALTER TABLE subscription_links
ADD COLUMN webhook_url TEXT;

-- Add webhook_url column to catalogues
ALTER TABLE catalogues
ADD COLUMN webhook_url TEXT;