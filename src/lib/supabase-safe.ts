// Safe Supabase client with hardcoded publishable fallbacks.
// These values are PUBLIC (anon/publishable) and safe to commit.
// This wrapper exists so a missing build-time env var never blank-screens the site.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://zfegmngaqorlkohwqnan.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmZWdtbmdhcW9ybGtvaHdxbmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTIxMTksImV4cCI6MjA5MzIyODExOX0.eeRYZBlZw_qcaqOKcffdtgabQMoGn8oWt4wkyhkNWWM";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
