-- Add currency field to profiles table
ALTER TABLE profiles
ADD COLUMN currency TEXT DEFAULT 'KES';

-- Add a column to track if currency has been set
ALTER TABLE profiles
ADD COLUMN currency_set_at TIMESTAMP WITH TIME ZONE;