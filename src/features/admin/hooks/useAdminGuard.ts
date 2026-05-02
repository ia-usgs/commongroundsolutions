// Admin auth guard: subscribes to auth state, verifies admin role via has_role RPC,
// redirects to /auth on failure. Returns ready=true only when an admin is signed in.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase-safe";

export const useAdminGuard = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const verify = async (userId: string) => {
      const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
      if (!data) {
        toast.error("You don't have admin access.");
        await supabase.auth.signOut();
        navigate("/auth", { replace: true });
        return;
      }
      setReady(true);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }
      verify(session.user.id);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }
      verify(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return { ready };
};
