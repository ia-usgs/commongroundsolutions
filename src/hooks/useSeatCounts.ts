// Re-export shim. Real implementation lives in @/features/classes/hooks/useClassesAndSeats.
// Kept so any straggling imports don't break. Prefer importing from the feature module directly.
export { useClassesAndSeats } from "@/features/classes/hooks/useClassesAndSeats";
export type { ClassRow, SeatCount } from "@/features/classes/types";
