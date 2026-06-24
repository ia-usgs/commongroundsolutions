// Admin section that lets an admin edit each course's public content:
// title, description, details (paragraphs + bullets), requirements, and rental note.
// Stored in `course_content` and merged with the static COURSE_CATALOG fallback on the site.
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COURSE_CATALOG, CPR_COURSE } from "@/features/courses/data/courseCatalog";
import {
  fetchCourseContent,
  upsertCourseContent,
} from "@/features/courses/api/courseContent";
import type { Course } from "@/features/courses/types";

const ALL_COURSES = [...COURSE_CATALOG, CPR_COURSE];

type Draft = {
  title: string;
  description: string;
  detailsText: string; // one per line
  requirementsText: string; // one per line
  rentalNote: string;
};

const courseToDraft = (c: Course): Draft => ({
  title: c.title,
  description: c.description,
  detailsText: (c.details ?? []).join("\n"),
  requirementsText: (c.requirements ?? []).join("\n"),
  rentalNote: c.rentalNote ?? "",
});

const linesToArray = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

export const CourseDescriptionsManager = () => {
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchCourseContent()
      .then((rows) => {
        const initial: Record<string, Draft> = {};
        for (const c of ALL_COURSES) initial[c.courseKey] = courseToDraft(c);
        for (const r of rows) {
          const fallback = ALL_COURSES.find((c) => c.courseKey === r.course_key);
          initial[r.course_key] = {
            title: r.title ?? fallback?.title ?? "",
            description: r.description || fallback?.description || "",
            detailsText: (r.details.length > 0 ? r.details : fallback?.details ?? []).join("\n"),
            requirementsText: (r.requirements.length > 0
              ? r.requirements
              : fallback?.requirements ?? []
            ).join("\n"),
            rentalNote: r.rental_note ?? fallback?.rentalNote ?? "",
          };
        }
        setDrafts(initial);
        setLoaded(true);
      })
      .catch((err) => {
        toast.error(err.message ?? "Failed to load course content");
        setLoaded(true);
      });
  }, []);

  const updateField = (key: string, field: keyof Draft, value: string) =>
    setDrafts((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));

  const handleReset = (course: Course) => {
    setDrafts((prev) => ({ ...prev, [course.courseKey]: courseToDraft(course) }));
    toast.message("Reverted to defaults — click Save to publish.");
  };

  const handleSave = async (courseKey: string) => {
    const draft = drafts[courseKey];
    if (!draft) return;
    if (!draft.title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    if (!draft.description.trim()) {
      toast.error("Description cannot be empty");
      return;
    }
    setSaving(courseKey);
    try {
      await upsertCourseContent(courseKey, {
        title: draft.title.trim(),
        description: draft.description.trim(),
        details: linesToArray(draft.detailsText),
        requirements: linesToArray(draft.requirementsText),
        rental_note: draft.rentalNote.trim() || null,
      });
      toast.success("Course updated");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to save course");
    } finally {
      setSaving(null);
    }
  };

  return (
    <section>
      <h2 className="font-heading text-xl tracking-wider text-foreground uppercase mb-4">
        Course Content
      </h2>
      <p className="text-xs text-muted-foreground mb-4">
        Edit the public-facing content shown on each course card. Put each detail or requirement
        on its own line. The first two detail lines render as intro paragraphs, the last as a
        closing paragraph, and everything in between as bullet points. Changes appear on the
        public site immediately after saving.
      </p>
      {!loaded ? (
        <p className="text-xs text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-6">
          {ALL_COURSES.map((course) => {
            const draft = drafts[course.courseKey];
            if (!draft) return null;
            return (
              <div key={course.courseKey} className="border border-border p-4 bg-card space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-heading text-base tracking-wider text-primary uppercase">
                    {course.title}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReset(course)}
                      disabled={saving === course.courseKey}
                    >
                      Reset to default
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSave(course.courseKey)}
                      disabled={saving === course.courseKey}
                    >
                      {saving === course.courseKey ? "Saving…" : "Save"}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={draft.title}
                    onChange={(e) => updateField(course.courseKey, "title", e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    rows={4}
                    value={draft.description}
                    onChange={(e) => updateField(course.courseKey, "description", e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-xs">
                    Details (one per line — first 2 = paragraphs, middle = bullets, last = closing paragraph)
                  </Label>
                  <Textarea
                    rows={8}
                    value={draft.detailsText}
                    onChange={(e) => updateField(course.courseKey, "detailsText", e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-xs">Student requirements (one per line)</Label>
                  <Textarea
                    rows={8}
                    value={draft.requirementsText}
                    onChange={(e) =>
                      updateField(course.courseKey, "requirementsText", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label className="text-xs">Rental note (optional)</Label>
                  <Textarea
                    rows={2}
                    value={draft.rentalNote}
                    onChange={(e) => updateField(course.courseKey, "rentalNote", e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
