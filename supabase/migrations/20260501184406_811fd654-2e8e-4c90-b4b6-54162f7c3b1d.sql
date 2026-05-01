-- Tighten signup INSERT policy with basic validation
DROP POLICY IF EXISTS "Anyone can create a signup" ON public.signups;

CREATE POLICY "Public can create pending signup with valid data"
  ON public.signups FOR INSERT
  WITH CHECK (
    status = 'pending'
    AND char_length(first_name) BETWEEN 1 AND 100
    AND char_length(last_name) BETWEEN 1 AND 100
    AND char_length(email) BETWEEN 3 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND (phone IS NULL OR char_length(phone) BETWEEN 7 AND 30)
    AND char_length(reference_code) BETWEEN 6 AND 40
    AND EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_id)
    AND confirmed_at IS NULL
    AND calendar_event_id IS NULL
  );

-- Lock down SECURITY DEFINER functions: only callable from server-side (service role)
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_class_seat_counts() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;