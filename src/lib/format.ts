// Shared formatters. Keep all date/price/time display logic here so the UI stays consistent.
import { format, parseISO } from "date-fns";

// Sentinel value used in the DB for "TBA" rows so they don't break date sorting.
export const FAR_FUTURE_DATE = "2099-12-31";

export const formatDateLabel = (iso: string | null | undefined): string => {
  if (!iso || iso === FAR_FUTURE_DATE) return "TBA";
  try {
    return format(parseISO(iso), "MMM d");
  } catch {
    return iso;
  }
};

export const formatPrice = (cents: number | null | undefined, fallback = "$0"): string => {
  if (cents == null) return fallback;
  const dollars = cents / 100;
  return `$${dollars.toFixed(cents % 100 === 0 ? 0 : 2)}`;
};

export const formatTimeRange = (
  start: string | null | undefined,
  end: string | null | undefined,
  fallback = "TBA"
): string => {
  if (!start || !end) return fallback;
  return `${start}–${end}`;
};
