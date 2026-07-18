
-- Drop overly-broad public INSERT policies; inserts now go through edge functions/RPCs (service role)
DROP POLICY IF EXISTS "Public can create pending signup with valid data" ON public.signups;
DROP POLICY IF EXISTS "Public can insert rifle data for a signup" ON public.signup_rifle_data;

-- Revoke direct table INSERT from anon for signups (edge function uses service role)
REVOKE INSERT ON public.signups FROM anon;
REVOKE INSERT ON public.signup_rifle_data FROM anon, authenticated;

-- Revoke EXECUTE on internal / trigger-only SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_admin() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.increment_discount_usage() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.discount_codes_uppercase_code() FROM anon, authenticated, PUBLIC;

-- has_role is only referenced from RLS policies (runs as definer regardless); no need for direct client execute
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, PUBLIC;
-- keep authenticated execute so useAdminGuard RPC still works
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
