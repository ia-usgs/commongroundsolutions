
-- Enums
CREATE TYPE public.discount_type AS ENUM ('percent', 'fixed');
CREATE TYPE public.discount_category AS ENUM ('military', 'leo', 'returning', 'custom');

-- Discount codes table
CREATE TABLE public.discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  label TEXT,
  discount_type public.discount_type NOT NULL DEFAULT 'percent',
  discount_value INTEGER NOT NULL CHECK (discount_value > 0),
  category public.discount_category NOT NULL DEFAULT 'custom',
  max_uses INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Force codes uppercase
CREATE OR REPLACE FUNCTION public.discount_codes_uppercase_code()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.code = upper(trim(NEW.code));
  RETURN NEW;
END;
$$;

CREATE TRIGGER discount_codes_uppercase
  BEFORE INSERT OR UPDATE ON public.discount_codes
  FOR EACH ROW EXECUTE FUNCTION public.discount_codes_uppercase_code();

CREATE TRIGGER update_discount_codes_updated_at
  BEFORE UPDATE ON public.discount_codes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage discount codes" ON public.discount_codes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Signups: discount tracking columns
ALTER TABLE public.signups
  ADD COLUMN discount_code TEXT,
  ADD COLUMN discount_type TEXT,
  ADD COLUMN discount_value INTEGER,
  ADD COLUMN original_price_cents INTEGER,
  ADD COLUMN final_price_cents INTEGER,
  ADD COLUMN is_returning_customer BOOLEAN NOT NULL DEFAULT false;

-- Validation function — public can call to check a code
CREATE OR REPLACE FUNCTION public.validate_discount_code(_code TEXT)
RETURNS TABLE (
  valid BOOLEAN,
  reason TEXT,
  code TEXT,
  discount_type TEXT,
  discount_value INTEGER,
  category TEXT
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  rec public.discount_codes%ROWTYPE;
BEGIN
  SELECT * INTO rec FROM public.discount_codes
  WHERE public.discount_codes.code = upper(trim(_code));

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Code not found', NULL::TEXT, NULL::TEXT, NULL::INTEGER, NULL::TEXT;
    RETURN;
  END IF;

  IF NOT rec.active THEN
    RETURN QUERY SELECT false, 'Code is inactive', NULL::TEXT, NULL::TEXT, NULL::INTEGER, NULL::TEXT;
    RETURN;
  END IF;

  IF rec.expires_at IS NOT NULL AND rec.expires_at < now() THEN
    RETURN QUERY SELECT false, 'Code has expired', NULL::TEXT, NULL::TEXT, NULL::INTEGER, NULL::TEXT;
    RETURN;
  END IF;

  IF rec.max_uses IS NOT NULL AND rec.used_count >= rec.max_uses THEN
    RETURN QUERY SELECT false, 'Code has reached its usage limit', NULL::TEXT, NULL::TEXT, NULL::INTEGER, NULL::TEXT;
    RETURN;
  END IF;

  RETURN QUERY SELECT true, NULL::TEXT, rec.code, rec.discount_type::TEXT, rec.discount_value, rec.category::TEXT;
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_discount_code(TEXT) TO anon, authenticated;

-- Returning customer check
CREATE OR REPLACE FUNCTION public.check_returning_customer(_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.signups
    WHERE lower(email) = lower(trim(_email))
      AND status = 'confirmed'
  );
$$;

GRANT EXECUTE ON FUNCTION public.check_returning_customer(TEXT) TO anon, authenticated;

-- Increment used_count when a signup with a code is created
CREATE OR REPLACE FUNCTION public.increment_discount_usage()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.discount_code IS NOT NULL THEN
    UPDATE public.discount_codes
      SET used_count = used_count + 1
      WHERE code = upper(trim(NEW.discount_code));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER signups_increment_discount_usage
  AFTER INSERT ON public.signups
  FOR EACH ROW EXECUTE FUNCTION public.increment_discount_usage();

-- Update the public insert RLS to allow the new discount fields (existing policy stays valid; the new columns are nullable)
-- Seed the three default codes at 20% off
INSERT INTO public.discount_codes (code, label, discount_type, discount_value, category) VALUES
  ('MILITARY', 'Military discount', 'percent', 20, 'military'),
  ('LEO', 'Law enforcement discount', 'percent', 20, 'leo'),
  ('RETURNING', 'Returning customer discount', 'percent', 20, 'returning');
