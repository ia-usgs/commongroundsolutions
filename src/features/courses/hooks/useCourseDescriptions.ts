// Loads admin-edited description overrides keyed by course_key.
// Returns a map for callers to merge with the static COURSE_CATALOG fallback.
import { useEffect, useState } from "react";
import { fetchCourseContent } from "@/features/courses/api/courseContent";

export const useCourseDescriptions = () => {
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    fetchCourseContent()
      .then((rows) => {
        if (!active) return;
        const map: Record<string, string> = {};
        for (const r of rows) map[r.course_key] = r.description;
        setDescriptions(map);
      })
      .catch(() => {
        // non-fatal: fall back to static catalog copy
      });
    return () => {
      active = false;
    };
  }, []);

  return descriptions;
};
