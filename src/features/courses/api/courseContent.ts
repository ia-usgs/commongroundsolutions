// API for the `course_content` table — admin-editable description overrides per course_key.
import { supabase } from "@/integrations/supabase/client";

export type CourseContentRow = {
  course_key: string;
  description: string;
  updated_at: string;
};

export const fetchCourseContent = async (): Promise<CourseContentRow[]> => {
  const { data, error } = await supabase
    .from("course_content")
    .select("course_key, description, updated_at");
  if (error) throw error;
  return (data ?? []) as CourseContentRow[];
};

export const upsertCourseContent = async (course_key: string, description: string) => {
  const { error } = await supabase
    .from("course_content")
    .upsert({ course_key, description }, { onConflict: "course_key" });
  if (error) throw error;
};
