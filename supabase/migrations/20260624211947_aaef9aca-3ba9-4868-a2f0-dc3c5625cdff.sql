ALTER TABLE public.course_content
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS details jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS requirements jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS rental_note text;