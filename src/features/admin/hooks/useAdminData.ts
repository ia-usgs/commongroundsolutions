// Admin dashboard data: classes + signups with a single refresh function.
import { useCallback, useEffect, useState } from "react";
import { fetchClasses } from "@/features/classes/api";
import { fetchSignups } from "@/features/signups/api";
import type { ClassRow } from "@/features/classes/types";
import type { SignupRow } from "@/features/signups/types";

export const useAdminData = (enabled: boolean) => {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [signups, setSignups] = useState<SignupRow[]>([]);

  const refresh = useCallback(async () => {
    const [c, s] = await Promise.all([fetchClasses(), fetchSignups()]);
    setClasses(c);
    setSignups(s);
  }, []);

  useEffect(() => {
    if (enabled) refresh();
  }, [enabled, refresh]);

  return { classes, signups, refresh };
};
