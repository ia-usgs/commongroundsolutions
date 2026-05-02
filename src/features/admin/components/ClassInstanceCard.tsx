// Editable card for a single class instance. Self-contained: keeps local edit state,
// calls the API on save/delete, then asks the parent to refresh.
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { deleteClass, updateClass } from "@/features/classes/api";
import type { ClassRow } from "@/features/classes/types";
import type { SignupRow } from "@/features/signups/types";

type Props = {
  classRow: ClassRow;
  signups: SignupRow[];
  onChanged: () => void;
};

export const ClassInstanceCard = ({ classRow, signups, onChanged }: Props) => {
  const [draft, setDraft] = useState<ClassRow>(classRow);

  const classSignups = signups.filter(
    (s) => s.class_id === classRow.id && (s.status === "pending" || s.status === "confirmed")
  );
  const confirmed = classSignups.filter((s) => s.status === "confirmed").length;
  const pending = classSignups.filter((s) => s.status === "pending").length;
  const remaining = classRow.capacity - confirmed - pending;

  const update = <K extends keyof ClassRow>(field: K, value: ClassRow[K]) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    const priceCents = Number(draft.price_cents);
    const capacity = Number(draft.capacity);
    if (!draft.class_date || isNaN(priceCents) || isNaN(capacity) || capacity < 1) {
      toast.error("Date, price, and capacity (≥1) are required");
      return;
    }
    try {
      await updateClass(draft.id, {
        class_date: draft.class_date,
        start_time: draft.start_time,
        end_time: draft.end_time,
        price_cents: priceCents,
        capacity,
        status: draft.status,
        location: draft.location,
      });
      toast.success(`${draft.name} updated`);
      onChanged();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to update class");
    }
  };

  const handleDelete = async () => {
    const linked = classSignups.length;
    const warning =
      linked > 0
        ? `This class has ${linked} active signup(s). Deleting it will leave those signups orphaned. Continue?`
        : `Delete "${classRow.name}" (${classRow.class_date})? This cannot be undone.`;
    if (!confirm(warning)) return;
    try {
      await deleteClass(classRow.id);
      toast.success("Class deleted");
      onChanged();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to delete class");
    }
  };

  return (
    <div className="bg-card border border-border p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-heading text-foreground text-lg leading-tight">{classRow.name}</p>
          <p className="text-xs text-muted-foreground font-mono break-all">{classRow.slug}</p>
        </div>
        <div className="flex flex-wrap gap-1 justify-end">
          <Badge variant="default">{confirmed} paid</Badge>
          <Badge variant="secondary">{pending} pending</Badge>
          <Badge variant="outline">{remaining} left</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !draft.class_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {draft.class_date ? format(parseISO(draft.class_date), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-50 bg-popover" align="start">
              <Calendar
                mode="single"
                selected={draft.class_date ? parseISO(draft.class_date) : undefined}
                onSelect={(d) => d && update("class_date", format(d, "yyyy-MM-dd"))}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label className="text-xs">Status</Label>
          <Select value={draft.status} onValueChange={(v) => update("status", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="sold_out">Sold Out</SelectItem>
              <SelectItem value="tba">TBA</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Start time</Label>
          <Input
            type="text"
            placeholder="07:30"
            value={draft.start_time ?? ""}
            onChange={(e) => update("start_time", e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs">End time</Label>
          <Input
            type="text"
            placeholder="13:30"
            value={draft.end_time ?? ""}
            onChange={(e) => update("end_time", e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs">Price (cents)</Label>
          <Input
            type="number"
            value={draft.price_cents}
            onChange={(e) => update("price_cents", Number(e.target.value))}
          />
          <p className="text-[10px] text-muted-foreground mt-1">
            ${(Number(draft.price_cents) / 100).toFixed(2)}
          </p>
        </div>
        <div>
          <Label className="text-xs">Capacity</Label>
          <Input
            type="number"
            min={1}
            value={draft.capacity}
            onChange={(e) => update("capacity", Number(e.target.value))}
          />
        </div>
        <div className="col-span-2">
          <Label className="text-xs">Location</Label>
          <Input
            type="text"
            value={draft.location ?? ""}
            onChange={(e) => update("location", e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} className="flex-1" size="sm">
          <Save size={14} className="mr-2" /> Save changes
        </Button>
        <Button onClick={handleDelete} variant="outline" size="sm" title="Delete this class">
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
};
