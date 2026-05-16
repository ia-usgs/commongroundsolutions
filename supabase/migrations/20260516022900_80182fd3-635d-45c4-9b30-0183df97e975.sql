
ALTER TABLE public.signups
  ADD COLUMN IF NOT EXISTS waiver_signed_at timestamptz,
  ADD COLUMN IF NOT EXISTS waiver_signature_name text,
  ADD COLUMN IF NOT EXISTS waiver_printed_name text,
  ADD COLUMN IF NOT EXISTS waiver_governing_state text,
  ADD COLUMN IF NOT EXISTS waiver_photo_consent boolean,
  ADD COLUMN IF NOT EXISTS waiver_version text;

DROP POLICY IF EXISTS "Public can create pending signup with valid data" ON public.signups;

CREATE POLICY "Public can create pending signup with valid data"
ON public.signups
FOR INSERT
WITH CHECK (
  status = 'pending'::signup_status
  AND char_length(first_name) BETWEEN 1 AND 100
  AND char_length(last_name) BETWEEN 1 AND 100
  AND char_length(email) BETWEEN 3 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (phone IS NULL OR char_length(phone) BETWEEN 7 AND 30)
  AND char_length(reference_code) BETWEEN 6 AND 40
  AND EXISTS (SELECT 1 FROM public.classes c WHERE c.id = signups.class_id)
  AND confirmed_at IS NULL
  AND calendar_event_id IS NULL
  AND waiver_signed_at IS NOT NULL
  AND char_length(coalesce(waiver_signature_name, '')) BETWEEN 2 AND 120
  AND char_length(coalesce(waiver_printed_name, '')) BETWEEN 2 AND 120
  AND waiver_photo_consent IS NOT NULL
);
