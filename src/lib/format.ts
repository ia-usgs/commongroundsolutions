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

// For multi-day classes: "Oct 31 – Nov 1". Falls back to the single-date label.
export const formatDateRange = (
  iso: string | null | undefined,
  endDate: string | null | undefined
): string => {
  if (!endDate || endDate === FAR_FUTURE_DATE || endDate <= (iso ?? "")) {
    return formatDateLabel(iso);
  }
  try {
    const start = parseISO(iso!);
    const end = parseISO(endDate);
    // Same month/year: "Oct 31 – Nov 1" style is only needed across months;
    // within a month show "Oct 31 – 31" never happens, so use "MMM d" both.
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${format(start, "MMM d")} – ${format(end, "d")}`;
    }
    return `${format(start, "MMM d")} – ${format(end, "MMM d")}`;
  } catch {
    return formatDateLabel(iso);
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
