// Helpers for choosing which class instance a course card should default to,
// and for computing a course's "next upcoming" date used for ordering cards.
import type { ClassRow } from "@/features/classes/types";
import { FAR_FUTURE_DATE } from "@/lib/format";

/** Local YYYY-MM-DD for "today" (site's local timezone, no UTC shift). */
const todayLocalISO = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/** Parse "HH:mm" or "HHmm" into minutes-since-midnight; null if unparseable. */
const parseTimeToMinutes = (t?: string | null): number | null => {
  if (!t) return null;
  const clean = t.replace(":", "").trim();
  if (!/^\d{3,4}$/.test(clean)) return null;
  const padded = clean.padStart(4, "0");
  const h = Number(padded.slice(0, 2));
  const mm = Number(padded.slice(2, 4));
  if (isNaN(h) || isNaN(mm)) return null;
  return h * 60 + mm;
};

/**
 * An instance is "upcoming" if its date is in the future, or it's today and
 * its end_time (fallback start_time) hasn't passed yet. TBA/closed excluded.
 */
export const isInstanceUpcoming = (i: ClassRow, now: Date = new Date()): boolean => {
  if (i.status === "closed") return false;
  if (i.class_date === FAR_FUTURE_DATE) return false;
  const today = todayLocalISO();
  if (i.class_date > today) return true;
  if (i.class_date < today) return false;
  const endMin = parseTimeToMinutes(i.end_time) ?? parseTimeToMinutes(i.start_time);
  if (endMin == null) return true;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return nowMin < endMin;
};

/** Sort instances: upcoming ascending by date, then past descending. */
export const sortInstancesByUpcoming = (instances: ClassRow[]): ClassRow[] => {
  const now = new Date();
  const upcoming = instances
    .filter((i) => isInstanceUpcoming(i, now))
    .sort((a, b) => a.class_date.localeCompare(b.class_date));
  const rest = instances
    .filter((i) => !isInstanceUpcoming(i, now))
    .sort((a, b) => b.class_date.localeCompare(a.class_date));
  return [...upcoming, ...rest];
};

/** Earliest upcoming class_date for a course, or undefined if none. */
export const getNextUpcomingDate = (instances: ClassRow[]): string | undefined => {
  const now = new Date();
  const upcoming = instances
    .filter((i) => isInstanceUpcoming(i, now))
    .map((i) => i.class_date)
    .sort();
  return upcoming[0];
};

export const pickPreferredSlug = (
  instances: ClassRow[],
  isFull: (slug: string) => boolean,
  override?: string
): string | undefined => {
  if (instances.length === 0) return undefined;
  if (override && instances.some((i) => i.slug === override)) return override;
  const sorted = sortInstancesByUpcoming(instances);
  const openWithSeats = sorted.filter((i) => i.status === "open" && !isFull(i.slug));
  if (openWithSeats.length > 0) return openWithSeats[0].slug;
  const open = sorted.filter((i) => i.status === "open");
  if (open.length > 0) return open[0].slug;
  return sorted[0].slug;
};

export const isCourseComingSoon = (instances: ClassRow[], forceComingSoon?: boolean): boolean => {
  if (forceComingSoon) return true;
  if (instances.length === 0) return true;
  return instances.every((i) => i.status === "tba" || i.status === "closed");
};
