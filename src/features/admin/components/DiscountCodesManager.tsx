// Admin "Discount Codes" manager — list, create, toggle, delete.
import { useEffect, useState } from "react";
import { Plus, Power, Trash2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createDiscountCode,
  deleteDiscountCode,
  fetchDiscountCodes,
  generateRandomCode,
  toggleDiscountCode,
  type DiscountCategory,
  type DiscountCodeRow,
} from "../discountCodes";

const CATEGORIES: { value: DiscountCategory; label: string }[] = [
  { value: "military", label: "Military" },
  { value: "leo", label: "Law Enforcement" },
  { value: "returning", label: "Returning Customer" },
  { value: "custom", label: "Custom / Promo" },
];

export const DiscountCodesManager = () => {
  const [codes, setCodes] = useState<DiscountCodeRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    code: "",
    label: "",
    category: "custom" as DiscountCategory,
    discount_type: "percent" as "percent" | "fixed",
    discount_value: 20,
    max_uses: "",
    expires_at: "",
  });

  const refresh = async () => {
    setLoading(true);
    try {
      setCodes(await fetchDiscountCodes());
    } catch (err: any) {
      toast.error(err.message ?? "Failed to load codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleGenerate = () => {
    setForm((f) => ({ ...f, code: generateRandomCode(f.category) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) {
      toast.error("Code required");
      return;
    }
    if (!form.discount_value || form.discount_value < 1) {
      toast.error("Discount value must be greater than 0");
      return;
    }
    if (form.discount_type === "percent" && form.discount_value > 100) {
      toast.error("Percent discount must be 1–100");
      return;
    }
    try {
      await createDiscountCode({
        code: form.code,
        label: form.label || null,
        category: form.category,
        discount_type: form.discount_type,
        discount_value:
          form.discount_type === "percent"
            ? Number(form.discount_value)
            : Math.round(Number(form.discount_value) * 100), // dollars -> cents
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      });
      toast.success("Discount code created");
      setModalOpen(false);
      setForm({
        code: "",
        label: "",
        category: "custom",
        discount_type: "percent",
        discount_value: 20,
        max_uses: "",
        expires_at: "",
      });
      refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to create code");
    }
  };

  const handleToggle = async (row: DiscountCodeRow) => {
    try {
      await toggleDiscountCode(row.id, !row.active);
      refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to update");
    }
  };

  const handleDelete = async (row: DiscountCodeRow) => {
    if (!confirm(`Delete discount code ${row.code}? This cannot be undone.`)) return;
    try {
      await deleteDiscountCode(row.id);
      toast.success("Code deleted");
      refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to delete");
    }
  };

  const formatValue = (row: DiscountCodeRow) =>
    row.discount_type === "percent"
      ? `${row.discount_value}%`
      : `$${(row.discount_value / 100).toFixed(2)}`;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl tracking-wider text-foreground uppercase">
          Discount Codes
        </h2>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          New Code
        </Button>
      </div>

      <div className="border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Uses</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Label</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!loading && codes.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No discount codes yet.
                </TableCell>
              </TableRow>
            )}
            {codes.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-mono font-semibold text-primary">{row.code}</TableCell>
                <TableCell className="capitalize">{row.category}</TableCell>
                <TableCell>{formatValue(row)}</TableCell>
                <TableCell>
                  {row.used_count}
                  {row.max_uses != null ? ` / ${row.max_uses}` : ""}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {row.expires_at ? new Date(row.expires_at).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={row.active ? "default" : "secondary"}>
                    {row.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                  {row.label ?? "—"}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggle(row)}
                    title={row.active ? "Deactivate" : "Activate"}
                  >
                    <Power size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(row)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>New Discount Code</DialogTitle>
            <DialogDescription>
              Create a code to share with a student. They enter it during signup.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v as DiscountCategory })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="code">Code *</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="MILITARY-K7P3"
                  className="font-mono uppercase"
                  required
                />
                <Button type="button" variant="outline" onClick={handleGenerate} title="Generate">
                  <Wand2 size={16} />
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="label">Label / Note (internal)</Label>
              <Input
                id="label"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="e.g. John Doe — Army"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Discount Type</Label>
                <Select
                  value={form.discount_type}
                  onValueChange={(v) =>
                    setForm({ ...form, discount_type: v as "percent" | "fixed" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Percent (%)</SelectItem>
                    <SelectItem value="fixed">Fixed ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="value">
                  {form.discount_type === "percent" ? "Percent off" : "Dollars off"}
                </Label>
                <Input
                  id="value"
                  type="number"
                  min={1}
                  step={form.discount_type === "percent" ? 1 : 0.01}
                  value={form.discount_value}
                  onChange={(e) =>
                    setForm({ ...form, discount_value: Number(e.target.value) })
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="max_uses">Max uses (blank = unlimited)</Label>
                <Input
                  id="max_uses"
                  type="number"
                  min={1}
                  value={form.max_uses}
                  onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                  placeholder="1"
                />
              </div>
              <div>
                <Label htmlFor="expires">Expires (optional)</Label>
                <Input
                  id="expires"
                  type="date"
                  value={form.expires_at}
                  onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};
