-- Create payment_links table
CREATE TABLE IF NOT EXISTS public.payment_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KES',
  product_name TEXT NOT NULL,
  description TEXT,
  thank_you_message TEXT,
  redirect_url TEXT,
  link_code TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(8), 'hex'),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  payments_count INTEGER DEFAULT 0,
  total_amount_collected NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create donation_links table
CREATE TABLE IF NOT EXISTS public.donation_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  goal_amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KES',
  current_amount NUMERIC(10, 2) DEFAULT 0,
  thank_you_message TEXT,
  redirect_url TEXT,
  link_code TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(8), 'hex'),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  donations_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create subscription_links table
CREATE TABLE IF NOT EXISTS public.subscription_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KES',
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('daily', 'weekly', 'monthly', 'yearly')),
  trial_days INTEGER DEFAULT 0,
  thank_you_message TEXT,
  redirect_url TEXT,
  link_code TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(8), 'hex'),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  subscribers_count INTEGER DEFAULT 0,
  total_revenue NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create catalogues table
CREATE TABLE IF NOT EXISTS public.catalogues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  currency TEXT NOT NULL DEFAULT 'KES',
  link_code TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(8), 'hex'),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create catalogue_items table
CREATE TABLE IF NOT EXISTS public.catalogue_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catalogue_id UUID NOT NULL REFERENCES public.catalogues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  sku TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('payment', 'donation', 'subscription', 'transfer', 'deposit', 'withdrawal')),
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KES',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  reference TEXT,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogue_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_links
CREATE POLICY "Users can view their own payment links"
  ON public.payment_links FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payment links"
  ON public.payment_links FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment links"
  ON public.payment_links FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment links"
  ON public.payment_links FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for donation_links
CREATE POLICY "Users can view their own donation links"
  ON public.donation_links FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own donation links"
  ON public.donation_links FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own donation links"
  ON public.donation_links FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own donation links"
  ON public.donation_links FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for subscription_links
CREATE POLICY "Users can view their own subscription links"
  ON public.subscription_links FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscription links"
  ON public.subscription_links FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription links"
  ON public.subscription_links FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscription links"
  ON public.subscription_links FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for catalogues
CREATE POLICY "Users can view their own catalogues"
  ON public.catalogues FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own catalogues"
  ON public.catalogues FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own catalogues"
  ON public.catalogues FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own catalogues"
  ON public.catalogues FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for catalogue_items
CREATE POLICY "Users can view items in their catalogues"
  ON public.catalogue_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.catalogues
    WHERE catalogues.id = catalogue_items.catalogue_id
    AND catalogues.user_id = auth.uid()
  ));

CREATE POLICY "Users can create items in their catalogues"
  ON public.catalogue_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.catalogues
    WHERE catalogues.id = catalogue_items.catalogue_id
    AND catalogues.user_id = auth.uid()
  ));

CREATE POLICY "Users can update items in their catalogues"
  ON public.catalogue_items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.catalogues
    WHERE catalogues.id = catalogue_items.catalogue_id
    AND catalogues.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete items in their catalogues"
  ON public.catalogue_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.catalogues
    WHERE catalogues.id = catalogue_items.catalogue_id
    AND catalogues.user_id = auth.uid()
  ));

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE TRIGGER update_payment_links_updated_at
  BEFORE UPDATE ON public.payment_links
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_donation_links_updated_at
  BEFORE UPDATE ON public.donation_links
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_subscription_links_updated_at
  BEFORE UPDATE ON public.subscription_links
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_catalogues_updated_at
  BEFORE UPDATE ON public.catalogues
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_catalogue_items_updated_at
  BEFORE UPDATE ON public.catalogue_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();