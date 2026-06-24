// Loads admin-edited course overrides keyed by course_key and merges them with the
// static COURSE_CATALOG entries. Components receive a ready-to-render Course.
import { useEffect, useState } from "react";
import { fetchCourseContent, type CourseContentRow } from "@/features/courses/api/courseContent";
import type { Course } from "@/features/courses/types";

export type CourseOverride = Partial<
  Pick<Course, "title" | "description" | "details" | "requirements" | "rentalNote">
>;

const toOverride = (r: CourseContentRow): CourseOverride => ({
  title: r.title ?? undefined,
  description: r.description || undefined,
  details: r.details.length > 0 ? r.details : undefined,
  requirements: r.requirements.length > 0 ? r.requirements : undefined,
  rentalNote: r.rental_note ?? undefined,
});

export const mergeCourse = (course: Course, override?: CourseOverride): Course => {
  if (!override) return course;
  return {
    ...course,
    title: override.title ?? course.title,
    description: override.description ?? course.description,
    details: override.details ?? course.details,
    requirements: override.requirements ?? course.requirements,
    rentalNote: override.rentalNote ?? course.rentalNote,
  };
};

export const useCourseOverrides = () => {
  const [overrides, setOverrides] = useState<Record<string, CourseOverride>>({});

  useEffect(() => {
    let active = true;
    fetchCourseContent()
      .then((rows) => {
        if (!active) return;
        const map: Record<string, CourseOverride> = {};
        for (const r of rows) map[r.course_key] = toOverride(r);
        setOverrides(map);
      })
      .catch(() => {
        // non-fatal: fall back to static catalog copy
      });
    return () => {
      active = false;
    };
  }, []);

  return overrides;
};

// Back-compat alias: previously returned a description-only map.
export const useCourseDescriptions = () => {
  const overrides = useCourseOverrides();
  const map: Record<string, string> = {};
  for (const [k, v] of Object.entries(overrides)) {
    if (v.description) map[k] = v.description;
  }
  return map;
};
