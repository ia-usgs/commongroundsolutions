-- Add course_key to classes so multiple class instances can be grouped under one public course
ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS course_key text;

-- Backfill course_key from existing slugs
UPDATE public.classes SET course_key = 'pistol-performance' WHERE slug LIKE 'pistol-performance%' AND course_key IS NULL;
UPDATE public.classes SET course_key = 'baseline-pistol' WHERE slug LIKE 'baseline-pistol%' AND course_key IS NULL;
UPDATE public.classes SET course_key = 'defensive-dynamic' WHERE slug LIKE 'defensive-dynamic%' AND course_key IS NULL;
UPDATE public.classes SET course_key = 'baseline-rifle' WHERE slug LIKE 'baseline-rifle%' AND course_key IS NULL;
UPDATE public.classes SET course_key = 'scope-carbine-1' WHERE slug LIKE 'scope-carbine-1%' AND course_key IS NULL;
UPDATE public.classes SET course_key = 'scope-carbine-2' WHERE slug LIKE 'scope-carbine-2%' AND course_key IS NULL;

CREATE INDEX IF NOT EXISTS idx_classes_course_key ON public.classes(course_key);