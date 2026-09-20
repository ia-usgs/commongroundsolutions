ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS end_date DATE;

UPDATE public.classes SET end_date = '2026-11-01' WHERE slug = 'pcsl-nationals-prep-2026-10-31' AND end_date IS NULL;