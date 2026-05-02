// Helper: pick the "best" instance to default-select for a course's date dropdown.
// Prefers Open with seats > Open without seats > anything.
import type { ClassRow } from "@/features/classes/types";

export const pickPreferredSlug = (
  instances: ClassRow[],
  isFull: (slug: string) => boolean,
  override?: string
): string | undefined => {
  if (instances.length === 0) return undefined;
  if (override && instances.some((i) => i.slug === override)) return override;
  const openWithSeats = instances.filter((i) => i.status === "open" && !isFull(i.slug));
  const open = instances.filter((i) => i.status === "open");
  const list = openWithSeats.length > 0 ? openWithSeats : open.length > 0 ? open : instances;
  return list[0].slug;
};

export const isCourseComingSoon = (instances: ClassRow[], forceComingSoon?: boolean): boolean => {
  if (forceComingSoon) return true;
  if (instances.length === 0) return true;
  return instances.every((i) => i.status === "tba" || i.status === "closed");
};
