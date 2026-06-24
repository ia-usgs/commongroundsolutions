// API for the `course_content` table — admin-editable course overrides per course_key.
// Stores the full editable content (title, description, details, requirements, rental note).
// Anything left null/empty falls back to the static COURSE_CATALOG copy.
import { supabase } from "@/lib/supabase-safe";

export type CourseContentRow = {
  course_key: string;
  title: string | null;
  description: string;
  details: string[];
  requirements: string[];
  rental_note: string | null;
  updated_at: string;
};

export type CourseContentInput = {
  title: string | null;
  description: string;
  details: string[];
  requirements: string[];
  rental_note: string | null;
};

export const fetchCourseContent = async (): Promise<CourseContentRow[]> => {
  const { data, error } = await (supabase as any)
    .from("course_content")
    .select("course_key, title, description, details, requirements, rental_note, updated_at");
  if (error) throw error;
  return ((data ?? []) as any[]).map((r) => ({
    course_key: r.course_key,
    title: r.title ?? null,
    description: r.description ?? "",
    details: Array.isArray(r.details) ? (r.details as string[]) : [],
    requirements: Array.isArray(r.requirements) ? (r.requirements as string[]) : [],
    rental_note: r.rental_note ?? null,
    updated_at: r.updated_at,
  }));
};

export const upsertCourseContent = async (course_key: string, input: CourseContentInput) => {
  const { error } = await (supabase as any)
    .from("course_content")
    .upsert(
      {
        course_key,
        title: input.title,
        description: input.description,
        details: input.details,
        requirements: input.requirements,
        rental_note: input.rental_note,
      },
      { onConflict: "course_key" }
    );
  if (error) throw error;
};
