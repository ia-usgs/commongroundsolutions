// Data-access layer for the `classes` table. Components should never call supabase.from('classes')
// directly — go through this module so we have a single place to evolve queries / add caching / mock for tests.
import { supabase } from "@/lib/supabase-safe";
import type { ClassRow, SeatCount } from "./types";

export const fetchClasses = async (): Promise<ClassRow[]> => {
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .order("class_date", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ClassRow[];
};

export const fetchSeatCounts = async (): Promise<SeatCount[]> => {
  const { data, error } = await supabase.rpc("get_class_seat_counts");
  if (error) throw error;
  return (data ?? []) as SeatCount[];
};

export type UpdateClassPatch = Partial<
  Pick<
    ClassRow,
    "class_date" | "start_time" | "end_time" | "price_cents" | "capacity" | "status" | "location"
  >
>;

export const updateClass = async (id: string, patch: UpdateClassPatch) => {
  const { error } = await supabase.from("classes").update(patch).eq("id", id);
  if (error) throw error;
};

export type NewClassInput = {
  slug: string;
  course_key: string;
  name: string;
  class_date: string;
  start_time: string | null;
  end_time: string | null;
  price_cents: number;
  capacity: number;
  location: string | null;
  status: string;
};

export const createClass = async (input: NewClassInput) => {
  const { error } = await supabase.from("classes").insert(input);
  if (error) throw error;
};

export const deleteClass = async (id: string) => {
  const { error } = await supabase.from("classes").delete().eq("id", id);
  if (error) throw error;
};
