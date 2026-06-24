
CREATE TABLE public.course_content (
  course_key TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.course_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.course_content TO authenticated;
GRANT ALL ON public.course_content TO service_role;

ALTER TABLE public.course_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view course content"
  ON public.course_content FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert course content"
  ON public.course_content FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update course content"
  ON public.course_content FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete course content"
  ON public.course_content FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_course_content_updated_at
  BEFORE UPDATE ON public.course_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
