-- Block anonymous access to sensitive tables
-- Only authenticated users should be able to read profiles and transactions

-- Deny anonymous SELECT on profiles
CREATE POLICY "Block anonymous access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Deny anonymous SELECT on transactions  
CREATE POLICY "Block anonymous access to transactions"
ON public.transactions
FOR SELECT
TO anon
USING (false);

-- Ensure authenticated users can still access their own data
-- (existing policies already handle this, but let's be explicit)
CREATE POLICY "Authenticated users see own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Authenticated users see own transactions"
ON public.transactions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);