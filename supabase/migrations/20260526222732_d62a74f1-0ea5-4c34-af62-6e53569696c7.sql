
CREATE OR REPLACE FUNCTION public.insert_rifle_data_by_reference(
  _reference_code TEXT,
  _data JSONB,
  _ammo_acknowledged BOOLEAN
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_signup_id UUID;
  v_rifle_id UUID;
BEGIN
  IF _ammo_acknowledged IS NOT TRUE THEN
    RAISE EXCEPTION 'Ammunition acknowledgment required';
  END IF;

  SELECT id INTO v_signup_id FROM public.signups
    WHERE reference_code = _reference_code
    ORDER BY created_at DESC LIMIT 1;

  IF v_signup_id IS NULL THEN
    RAISE EXCEPTION 'Signup not found for reference code';
  END IF;

  INSERT INTO public.signup_rifle_data (signup_id, data, ammo_acknowledged)
  VALUES (v_signup_id, COALESCE(_data, '{}'::jsonb), _ammo_acknowledged)
  ON CONFLICT (signup_id) DO UPDATE
    SET data = EXCLUDED.data,
        ammo_acknowledged = EXCLUDED.ammo_acknowledged,
        submitted_at = now()
  RETURNING id INTO v_rifle_id;

  RETURN v_rifle_id;
END;
$$;
