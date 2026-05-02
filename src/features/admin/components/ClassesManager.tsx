// Admin "Manage Classes" section: groups class instances by course_key and offers add/save/delete per group.
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClass } from "@/features/classes/api";
import { COURSE_GROUPS } from "@/features/courses/data/courseCatalog";
import type { ClassRow } from "@/features/classes/types";
import type { SignupRow } from "@/features/signups/types";
import { ClassInstanceCard } from "./ClassInstanceCard";

const TBA_DATE = "2099-12-31";

type Props = {
  classes: ClassRow[];
  signups: SignupRow[];
  onChanged: () => void;
};

export const ClassesManager = ({ classes, signups, onChanged }: Props) => {
  const grouped = new Map<string, ClassRow[]>();
  for (const c of classes) {
    const key = c.course_key ?? "__unmapped__";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(c);
  }
  const groupsToRender = [
    ...COURSE_GROUPS.map((g) => ({ key: g.key, label: g.label, items: grouped.get(g.key) ?? [] })),
  ];
  const unmapped = grouped.get("__unmapped__") ?? [];
  if (unmapped.length > 0) {
    groupsToRender.push({ key: "__unmapped__" as any, label: "Unmapped Classes", items: unmapped });
  }

  const handleAdd = async (courseKey: string, courseLabel: string) => {
    const stamp = Date.now().toString(36);
    const slug = `${courseKey}-${stamp}`;
    const template = classes.find((c) => c.course_key === courseKey);
    try {
      await createClass({
        slug,
        course_key: courseKey,
        name: template?.name ?? courseLabel,
        class_date: TBA_DATE,
        start_time: template?.start_time ?? "0730",
        end_time: template?.end_time ?? "1330",
        price_cents: template?.price_cents ?? 0,
        capacity: template?.capacity ?? 12,
        location: template?.location ?? "Nuevo, CA",
        status: "tba",
      });
      toast.success(`New ${courseLabel} class added — set the date and details, then Save.`);
      onChanged();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to add class");
    }
  };

  return (
    <section>
      <h2 className="font-heading text-xl tracking-wider text-foreground uppercase mb-4">
        Manage Classes
      </h2>
      <p className="text-xs text-muted-foreground mb-4">
        Each course below can have multiple class instances. Click <strong>+ Add new date</strong>{" "}
        to schedule another one — it will appear automatically as a new date option on the public
        site. Use status <strong>TBA</strong> for placeholders, <strong>Sold Out</strong> to hide
        from booking, <strong>Closed</strong> to fully remove from the public dropdown.
      </p>
      <div className="space-y-8">
        {groupsToRender.map((group) => (
          <div key={group.key}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading text-lg tracking-wider text-primary uppercase">
                {group.label}{" "}
                <span className="text-muted-foreground text-sm normal-case tracking-normal">
                  ({group.items.length})
                </span>
              </h3>
              {group.key !== "__unmapped__" && (
                <Button size="sm" variant="outline" onClick={() => handleAdd(group.key, group.label)}>
                  <Plus size={14} className="mr-1" /> Add new date
                </Button>
              )}
            </div>
            {group.items.length === 0 ? (
              <p className="text-xs text-muted-foreground italic mb-2">
                No classes scheduled. Click "Add new date" to create one.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.items.map((c) => (
                  <ClassInstanceCard
                    key={c.id}
                    classRow={c}
                    signups={signups}
                    onChanged={onChanged}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
