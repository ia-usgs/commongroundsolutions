// Admin section that lets an admin edit each course's public description.
// Descriptions are stored in the `course_content` table and override the static
// fallback copy from COURSE_CATALOG on the public site.
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { COURSE_CATALOG, CPR_COURSE } from "@/features/courses/data/courseCatalog";
import { fetchCourseContent, upsertCourseContent } from "@/features/courses/api/courseContent";

const ALL_COURSES = [...COURSE_CATALOG, CPR_COURSE];

export const CourseDescriptionsManager = () => {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchCourseContent()
      .then((rows) => {
        const initial: Record<string, string> = {};
        for (const c of ALL_COURSES) initial[c.courseKey] = c.description;
        for (const r of rows) initial[r.course_key] = r.description;
        setDrafts(initial);
        setLoaded(true);
      })
      .catch((err) => {
        toast.error(err.message ?? "Failed to load course descriptions");
        setLoaded(true);
      });
  }, []);

  const handleSave = async (courseKey: string) => {
    const value = drafts[courseKey]?.trim();
    if (!value) {
      toast.error("Description cannot be empty");
      return;
    }
    setSaving(courseKey);
    try {
      await upsertCourseContent(courseKey, value);
      toast.success("Description saved");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to save description");
    } finally {
      setSaving(null);
    }
  };

  return (
    <section>
      <h2 className="font-heading text-xl tracking-wider text-foreground uppercase mb-4">
        Course Descriptions
      </h2>
      <p className="text-xs text-muted-foreground mb-4">
        Edit the public-facing description shown at the top of each course's expanded card.
        Changes appear on the public site immediately after saving.
      </p>
      {!loaded ? (
        <p className="text-xs text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-6">
          {ALL_COURSES.map((course) => (
            <div key={course.courseKey} className="border border-border p-4 bg-card">
              <div className="flex items-center justify-between mb-2 gap-3">
                <h3 className="font-heading text-base tracking-wider text-primary uppercase">
                  {course.title}
                </h3>
                <Button
                  size="sm"
                  onClick={() => handleSave(course.courseKey)}
                  disabled={saving === course.courseKey}
                >
                  {saving === course.courseKey ? "Saving…" : "Save"}
                </Button>
              </div>
              <Textarea
                rows={5}
                value={drafts[course.courseKey] ?? ""}
                onChange={(e) =>
                  setDrafts({ ...drafts, [course.courseKey]: e.target.value })
                }
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
