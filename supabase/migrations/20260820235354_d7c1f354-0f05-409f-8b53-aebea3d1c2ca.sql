CREATE TYPE public.merch_order_status AS ENUM ('pending', 'paid', 'shipped', 'cancelled');
CREATE TYPE public.merch_fulfillment AS ENUM ('pickup', 'ship');

CREATE TABLE public.merch_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL DEFAULT 0,
  sizes JSONB NOT NULL DEFAULT '["S","M","L","XL","2XL","3XL"]'::jsonb,
  badges JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_key TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.merch_products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.merch_products TO authenticated;
GRANT ALL ON public.merch_products TO service_role;

ALTER TABLE public.merch_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view merch products"
  ON public.merch_products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage merch products"
  ON public.merch_products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_merch_products_updated_at
  BEFORE UPDATE ON public.merch_products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.merch_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.merch_products(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  fulfillment public.merch_fulfillment NOT NULL DEFAULT 'pickup',
  ship_address_line1 TEXT,
  ship_address_line2 TEXT,
  ship_city TEXT,
  ship_state TEXT,
  ship_postal_code TEXT,
  subtotal_cents INTEGER NOT NULL DEFAULT 0,
  shipping_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL DEFAULT 0,
  payment_method public.payment_method NOT NULL,
  reference_code TEXT NOT NULL UNIQUE,
  status public.merch_order_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE, DELETE ON public.merch_orders TO authenticated;
GRANT ALL ON public.merch_orders TO service_role;

ALTER TABLE public.merch_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view merch orders"
  ON public.merch_orders FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update merch orders"
  ON public.merch_orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete merch orders"
  ON public.merch_orders FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_merch_orders_updated_at
  BEFORE UPDATE ON public.merch_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_merch_orders_created_at ON public.merch_orders (created_at DESC);

INSERT INTO public.merch_products (slug, name, description, price_cents, badges, image_key, sort_order)
VALUES
  ('cgs-black-oversized-tee', 'CGS Black Oversized Tee', 'Black tee with gold Old English CGS chest hit and full gold laurel back print.', 3200,
   '["PRE-ORDER ITEM — SHIPS IN 2–3 WEEKS","OVERSIZED FIT — RECOMMEND SIZING DOWN"]'::jsonb, 'black-oversized-tee', 1),
  ('cgs-white-tee', 'CGS White Tee', 'White tee with black box logo on the chest and large box logo back print.', 3200,
   '["PRE-ORDER ITEM — SHIPS IN 2–3 WEEKS"]'::jsonb, 'white-tee', 2);