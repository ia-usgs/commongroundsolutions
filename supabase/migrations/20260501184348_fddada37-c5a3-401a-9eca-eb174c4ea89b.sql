-- Roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer to check roles without RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can view roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Classes table
CREATE TABLE public.classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  level TEXT,
  class_date DATE NOT NULL,
  start_time TEXT,
  end_time TEXT,
  price_cents INTEGER NOT NULL DEFAULT 0,
  capacity INTEGER NOT NULL DEFAULT 12,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view classes"
  ON public.classes FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage classes"
  ON public.classes FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Signups table
CREATE TYPE public.signup_status AS ENUM ('pending', 'confirmed', 'cancelled', 'expired');
CREATE TYPE public.payment_method AS ENUM ('zelle', 'venmo');

CREATE TABLE public.signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  payment_method payment_method NOT NULL,
  reference_code TEXT NOT NULL UNIQUE,
  status signup_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '24 hours'),
  confirmed_at TIMESTAMPTZ,
  calendar_event_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_signups_class_status ON public.signups(class_id, status);
CREATE INDEX idx_signups_status ON public.signups(status);

ALTER TABLE public.signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a signup"
  ON public.signups FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all signups"
  ON public.signups FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update signups"
  ON public.signups FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete signups"
  ON public.signups FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Public seat-count function (so visitors can see X/12 booked without seeing names)
CREATE OR REPLACE FUNCTION public.get_class_seat_counts()
RETURNS TABLE (
  class_id UUID,
  confirmed_count BIGINT,
  pending_count BIGINT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.id AS class_id,
    COUNT(s.id) FILTER (WHERE s.status = 'confirmed') AS confirmed_count,
    COUNT(s.id) FILTER (WHERE s.status = 'pending' AND s.expires_at > now()) AS pending_count
  FROM public.classes c
  LEFT JOIN public.signups s ON s.class_id = c.id
  GROUP BY c.id;
$$;

-- Updated-at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_signups_updated_at
  BEFORE UPDATE ON public.signups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();