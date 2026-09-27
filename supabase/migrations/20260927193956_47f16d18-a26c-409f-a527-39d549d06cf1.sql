ALTER TABLE public.signups ADD COLUMN notification_sent boolean, ADD COLUMN notification_error text;

CREATE OR REPLACE FUNCTION public.record_signup_notification(_reference_code text, _sent boolean, _error text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  UPDATE public.signups
    SET notification_sent = _sent,
        notification_error = CASE WHEN _sent THEN NULL ELSE left(coalesce(_error,'unknown'), 500) END
    WHERE reference_code = _reference_code
      AND created_at > now() - interval '1 hour'
      AND coalesce(notification_sent, false) = false;
END; $$;
GRANT EXECUTE ON FUNCTION public.record_signup_notification(text, boolean, text) TO anon, authenticated;