// Admin "Signups" table with status filter + confirm/cancel actions.
import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cancelSignup, confirmSignup } from "@/features/signups/api";
import type { ClassRow } from "@/features/classes/types";
import type { SignupRow } from "@/features/signups/types";

type Filter = "all" | "pending" | "confirmed";

type Props = {
  signups: SignupRow[];
  classes: ClassRow[];
  onChanged: () => void;
};

export const SignupsManager = ({ signups, classes, onChanged }: Props) => {
  const [filter, setFilter] = useState<Filter>("all");
  const classMap = Object.fromEntries(classes.map((c) => [c.id, c]));
  const filtered = signups.filter((s) => filter === "all" || s.status === filter);

  const handleConfirm = async (id: string) => {
    try {
      await confirmSignup(id);
      toast.success("Signup confirmed");
      onChanged();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to confirm");
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this signup?")) return;
    try {
      await cancelSignup(id);
      toast.success("Signup cancelled");
      onChanged();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to cancel");
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl tracking-wider text-foreground uppercase">Signups</h2>
        <div className="flex gap-2">
          {(["all", "pending", "confirmed"] as const).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>
      <div className="bg-card border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Pay</TableHead>
              <TableHead>Ref</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No signups
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="text-xs">
                    {new Date(s.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm">{classMap[s.class_id]?.name ?? "—"}</TableCell>
                  <TableCell>
                    {s.first_name} {s.last_name}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div>{s.email}</div>
                    <div className="text-muted-foreground">{s.phone}</div>
                  </TableCell>
                  <TableCell className="capitalize text-sm">{s.payment_method}</TableCell>
                  <TableCell className="font-mono text-xs">{s.reference_code}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        s.status === "confirmed"
                          ? "default"
                          : s.status === "pending"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {s.status === "pending" && (
                      <div className="flex gap-1 justify-end">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleConfirm(s.id)}
                          title="Mark paid & confirm"
                        >
                          <CheckCircle2 size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancel(s.id)}
                          title="Cancel"
                        >
                          <XCircle size={14} />
                        </Button>
                      </div>
                    )}
                    {s.status === "confirmed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel(s.id)}
                        title="Cancel"
                      >
                        <XCircle size={14} />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};
