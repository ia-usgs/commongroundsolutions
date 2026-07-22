// Loads classes + live seat counts and keeps them in sync via Supabase realtime on `signups`.
// This is the only place that subscribes to seat changes for the public site.
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-safe";
import { fetchClasses, fetchSeatCounts } from "../api";
import type { ClassRow, SeatAvailability, SeatCount } from "../types";

export const useClassesAndSeats = () => {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [seats, setSeats] = useState<Record<string, SeatCount>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [classData, seatData] = await Promise.all([fetchClasses(), fetchSeatCounts()]);
    setClasses(classData);
    const map: Record<string, SeatCount> = {};
    seatData.forEach((s) => {
      map[s.class_id] = s;
    });
    setSeats(map);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh().catch(() => setLoading(false));
    const channel = supabase
      .channel(`signups-seats-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "signups" },
        () => refresh()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  const getRemaining = (classSlug: string): SeatAvailability | null => {
    const cls = classes.find((c) => c.slug === classSlug);
    if (!cls) return null;
    const seat = seats[cls.id];
    const taken = seat ? Number(seat.confirmed_count) + Number(seat.pending_count) : 0;
    const remaining = Math.max(0, cls.capacity - taken);
    return { remaining, capacity: cls.capacity, full: remaining === 0 };
  };

  const getClassBySlug = (slug: string) => classes.find((c) => c.slug === slug);

  const getClassesByCourseKey = (key: string) =>
    sortInstancesByUpcoming(classes.filter((c) => c.course_key === key));

  return { classes, seats, loading, refresh, getRemaining, getClassBySlug, getClassesByCourseKey };
};
