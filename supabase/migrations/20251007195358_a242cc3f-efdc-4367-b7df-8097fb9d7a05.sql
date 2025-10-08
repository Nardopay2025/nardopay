-- Create payment provider configs table (platform-level, admin only)
CREATE TABLE public.payment_provider_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  country_code TEXT NOT NULL,
  environment TEXT NOT NULL DEFAULT 'sandbox',
  consumer_key TEXT NOT NULL,
  consumer_secret TEXT NOT NULL,
  ipn_id TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider, country_code, environment)
);

-- Create merchant payment configs table (optional merchant overrides)
CREATE TABLE public.merchant_payment_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  provider TEXT NOT NULL,
  consumer_key TEXT NOT NULL,
  consumer_secret TEXT NOT NULL,
  ipn_id TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Enable RLS
ALTER TABLE public.payment_provider_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_payment_configs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_provider_configs (admin only)
CREATE POLICY "Admins can view all provider configs"
  ON public.payment_provider_configs
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert provider configs"
  ON public.payment_provider_configs
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update provider configs"
  ON public.payment_provider_configs
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete provider configs"
  ON public.payment_provider_configs
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for merchant_payment_configs (merchants can manage their own)
CREATE POLICY "Merchants can view their own configs"
  ON public.merchant_payment_configs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Merchants can insert their own configs"
  ON public.merchant_payment_configs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Merchants can update their own configs"
  ON public.merchant_payment_configs
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Merchants can delete their own configs"
  ON public.merchant_payment_configs
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can view all merchant configs
CREATE POLICY "Admins can view all merchant configs"
  ON public.merchant_payment_configs
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_payment_provider_configs_updated_at
  BEFORE UPDATE ON public.payment_provider_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_merchant_payment_configs_updated_at
  BEFORE UPDATE ON public.merchant_payment_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();