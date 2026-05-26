
CREATE TABLE public.signup_rifle_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  signup_id UUID NOT NULL REFERENCES public.signups(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  ammo_acknowledged BOOLEAN NOT NULL DEFAULT false,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (signup_id)
);

GRANT INSERT ON public.signup_rifle_data TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.signup_rifle_data TO authenticated;
GRANT ALL ON public.signup_rifle_data TO service_role;

ALTER TABLE public.signup_rifle_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert rifle data for a signup"
  ON public.signup_rifle_data
  FOR INSERT
  TO public
  WITH CHECK (
    ammo_acknowledged = true
    AND EXISTS (SELECT 1 FROM public.signups s WHERE s.id = signup_id)
  );

CREATE POLICY "Admins can view rifle data"
  ON public.signup_rifle_data
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update rifle data"
  ON public.signup_rifle_data
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete rifle data"
  ON public.signup_rifle_data
  FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_signup_rifle_data_updated_at
  BEFORE UPDATE ON public.signup_rifle_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
