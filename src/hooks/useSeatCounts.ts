import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase-safe";

export type SeatCount = {
  class_id: string;
  confirmed_count: number;
  pending_count: number;
};

export type ClassRow = {
  id: string;
  slug: string;
  name: string;
  status: string;
  capacity: number;
  class_date: string;
  price_cents: number;
  course_key: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
};

export const useClassesAndSeats = () => {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [seats, setSeats] = useState<Record<string, SeatCount>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [{ data: classData }, { data: seatData }] = await Promise.all([
      supabase.from("classes").select("*").order("class_date", { ascending: true }),
      supabase.rpc("get_class_seat_counts"),
    ]);
    if (classData) setClasses(classData as ClassRow[]);
    if (seatData) {
      const map: Record<string, SeatCount> = {};
      (seatData as SeatCount[]).forEach((s) => {
        map[s.class_id] = s;
      });
      setSeats(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const channel = supabase
      .channel("signups-seats")
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

  const getRemaining = (classSlug: string): { remaining: number; capacity: number; full: boolean } | null => {
    const cls = classes.find((c) => c.slug === classSlug);
    if (!cls) return null;
    const seat = seats[cls.id];
    const taken = seat ? Number(seat.confirmed_count) + Number(seat.pending_count) : 0;
    const remaining = Math.max(0, cls.capacity - taken);
    return { remaining, capacity: cls.capacity, full: remaining === 0 };
  };

  const getClassBySlug = (slug: string) => classes.find((c) => c.slug === slug);

  return { classes, seats, loading, refresh, getRemaining, getClassBySlug };
};
