-- Add balance field to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS balance NUMERIC DEFAULT 0;