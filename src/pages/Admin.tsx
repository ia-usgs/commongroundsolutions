import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase-safe";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";
import { LogOut, CheckCircle2, XCircle, Save, CalendarIcon, Plus, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

type Signup = {
  id: string;
  class_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  payment_method: string;
  reference_code: string;
  status: string;
  notes: string | null;
  created_at: string;
  expires_at: string;
};

type ClassRow = {
  id: string;
  name: string;
  slug: string;
  capacity: number;
  status: string;
  class_date: string;
  start_time: string | null;
  end_time: string | null;
  price_cents: number;
  location: string | null;
  course_key: string | null;
};

// Display order + labels for grouping classes by course on the admin page.
const COURSE_GROUPS: { key: string; label: string }[] = [
  { key: "pistol-performance", label: "Pistol Performance" },
  { key: "baseline-pistol", label: "Baseline Pistol Course" },
  { key: "defensive-dynamic", label: "Defensive Dynamic Performance" },
  { key: "baseline-rifle", label: "Baseline Rifle" },
  { key: "scope-carbine-1", label: "Scope Carbine I" },
  { key: "scope-carbine-2", label: "Scope Carbine II" },
  { key: "cpr-aed-firstaid", label: "CPR / AED / First Aid" },
];

const Admin = () => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed">("all");

  const loadData = useCallback(async () => {
    const [{ data: s }, { data: c }] = await Promise.all([
      supabase.from("signups").select("*").order("created_at", { ascending: false }),
      supabase.from("classes").select("*").order("class_date", { ascending: true }),
    ]);
    if (s) setSignups(s as Signup[]);
    if (c) setClasses(c as ClassRow[]);
  }, []);

  useEffect(() => {
    document.title = "Admin Dashboard | Common Ground Solutions";

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }
      checkAdminAndLoad(session.user.id);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }
      checkAdminAndLoad(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminAndLoad = async (userId: string) => {
    const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!data) {
      toast.error("You don't have admin access.");
      await supabase.auth.signOut();
      navigate("/auth", { replace: true });
      return;
    }
    setIsAdmin(true);
    setAuthChecked(true);
    await loadData();
  };

  const handleConfirm = async (id: string) => {
    const { error } = await supabase
      .from("signups")
      .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Signup confirmed");
    loadData();
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this signup?")) return;
    const { error } = await supabase.from("signups").update({ status: "cancelled" }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Signup cancelled");
    loadData();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  const updateClassField = (id: string, field: keyof ClassRow, value: any) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const saveClass = async (c: ClassRow) => {
    const priceCents = Number(c.price_cents);
    const capacity = Number(c.capacity);
    if (!c.class_date || isNaN(priceCents) || isNaN(capacity) || capacity < 1) {
      toast.error("Date, price, and capacity (≥1) are required");
      return;
    }
    const { error } = await supabase
      .from("classes")
      .update({
        class_date: c.class_date,
        start_time: c.start_time,
        end_time: c.end_time,
        price_cents: priceCents,
        capacity,
        status: c.status,
        location: c.location,
      })
      .eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success(`${c.name} updated`);
    loadData();
  };

  const addClassInstance = async (courseKey: string, courseLabel: string) => {
    // Generate a unique slug suffix
    const stamp = Date.now().toString(36);
    const slug = `${courseKey}-${stamp}`;
    // Sensible defaults pulled from an existing instance of the same course, if available
    const template = classes.find((c) => c.course_key === courseKey);
    const { error } = await supabase.from("classes").insert({
      slug,
      course_key: courseKey,
      name: template?.name ?? courseLabel,
      class_date: "2099-12-31",
      start_time: template?.start_time ?? "0730",
      end_time: template?.end_time ?? "1330",
      price_cents: template?.price_cents ?? 0,
      capacity: template?.capacity ?? 12,
      location: template?.location ?? "Nuevo, CA",
      status: "tba",
    });
    if (error) return toast.error(error.message);
    toast.success(`New ${courseLabel} class added — set the date and details, then Save.`);
    loadData();
  };

  const deleteClass = async (c: ClassRow) => {
    const linked = signups.filter((s) => s.class_id === c.id && s.status !== "cancelled").length;
    const warning = linked > 0
      ? `This class has ${linked} active signup(s). Deleting it will leave those signups orphaned. Continue?`
      : `Delete "${c.name}" (${c.class_date})? This cannot be undone.`;
    if (!confirm(warning)) return;
    const { error } = await supabase.from("classes").delete().eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success("Class deleted");
    loadData();
  };

  const classMap = Object.fromEntries(classes.map((c) => [c.id, c]));
  const filtered = signups.filter((s) => filter === "all" || s.status === filter);

  if (!authChecked || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-heading text-2xl tracking-widest text-primary uppercase">
            Admin Dashboard
          </h1>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut size={16} className="mr-2" /> Sign Out
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-10">
        {/* Class manager */}
        <section>
          <h2 className="font-heading text-xl tracking-wider text-foreground uppercase mb-4">
            Manage Classes
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Each course below can have multiple class instances. Click <strong>+ Add new date</strong> to schedule another one — it will appear automatically as a new date option on the public site. Use status <strong>TBA</strong> for placeholders, <strong>Sold Out</strong> to hide from booking, <strong>Closed</strong> to fully remove from the public dropdown.
          </p>
          <div className="space-y-8">
            {(() => {
              // Group classes by course_key, plus a bucket for any without a course_key (legacy/unmapped)
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
                groupsToRender.push({ key: "__unmapped__", label: "Unmapped Classes", items: unmapped });
              }
              return groupsToRender.map((group) => (
                <div key={group.key}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading text-lg tracking-wider text-primary uppercase">
                      {group.label} <span className="text-muted-foreground text-sm normal-case tracking-normal">({group.items.length})</span>
                    </h3>
                    {group.key !== "__unmapped__" && (
                      <Button size="sm" variant="outline" onClick={() => addClassInstance(group.key, group.label)}>
                        <Plus size={14} className="mr-1" /> Add new date
                      </Button>
                    )}
                  </div>
                  {group.items.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic mb-2">No classes scheduled. Click "Add new date" to create one.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.items.map((c) => {
                        const classSignups = signups.filter(
                          (s) => s.class_id === c.id && (s.status === "pending" || s.status === "confirmed")
                        );
                        const confirmed = classSignups.filter((s) => s.status === "confirmed").length;
                        const pending = classSignups.filter((s) => s.status === "pending").length;
                        const remaining = c.capacity - confirmed - pending;
                        return (
                          <div key={c.id} className="bg-card border border-border p-4 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-heading text-foreground text-lg leading-tight">{c.name}</p>
                                <p className="text-xs text-muted-foreground font-mono break-all">{c.slug}</p>
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
                                        !c.class_date && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {c.class_date ? format(parseISO(c.class_date), "PPP") : "Pick a date"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0 z-50 bg-popover" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={c.class_date ? parseISO(c.class_date) : undefined}
                                      onSelect={(d) =>
                                        d && updateClassField(c.id, "class_date", format(d, "yyyy-MM-dd"))
                                      }
                                      initialFocus
                                      className={cn("p-3 pointer-events-auto")}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <div>
                                <Label className="text-xs">Status</Label>
                                <Select
                                  value={c.status}
                                  onValueChange={(v) => updateClassField(c.id, "status", v)}
                                >
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
                                  value={c.start_time ?? ""}
                                  onChange={(e) => updateClassField(c.id, "start_time", e.target.value)}
                                />
                              </div>
                              <div>
                                <Label className="text-xs">End time</Label>
                                <Input
                                  type="text"
                                  placeholder="13:30"
                                  value={c.end_time ?? ""}
                                  onChange={(e) => updateClassField(c.id, "end_time", e.target.value)}
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Price (cents)</Label>
                                <Input
                                  type="number"
                                  value={c.price_cents}
                                  onChange={(e) => updateClassField(c.id, "price_cents", e.target.value)}
                                />
                                <p className="text-[10px] text-muted-foreground mt-1">
                                  ${(Number(c.price_cents) / 100).toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <Label className="text-xs">Capacity</Label>
                                <Input
                                  type="number"
                                  min={1}
                                  value={c.capacity}
                                  onChange={(e) => updateClassField(c.id, "capacity", e.target.value)}
                                />
                              </div>
                              <div className="col-span-2">
                                <Label className="text-xs">Location</Label>
                                <Input
                                  type="text"
                                  value={c.location ?? ""}
                                  onChange={(e) => updateClassField(c.id, "location", e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button onClick={() => saveClass(c)} className="flex-1" size="sm">
                                <Save size={14} className="mr-2" /> Save changes
                              </Button>
                              <Button
                                onClick={() => deleteClass(c)}
                                variant="outline"
                                size="sm"
                                title="Delete this class"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ));
            })()}
          </div>
        </section>

        {/* Signups */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl tracking-wider text-foreground uppercase">
              Signups
            </h2>
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
                      <TableCell className="text-sm">
                        {classMap[s.class_id]?.name ?? "—"}
                      </TableCell>
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
      </div>
    </div>
  );
};

export default Admin;
