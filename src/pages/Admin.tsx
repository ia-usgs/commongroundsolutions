import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { LogOut, CheckCircle2, XCircle } from "lucide-react";

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
  price_cents: number;
};

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
        {/* Class capacity overview */}
        <section>
          <h2 className="font-heading text-xl tracking-wider text-foreground uppercase mb-4">
            Class Capacity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((c) => {
              const classSignups = signups.filter(
                (s) => s.class_id === c.id && (s.status === "pending" || s.status === "confirmed")
              );
              const confirmed = classSignups.filter((s) => s.status === "confirmed").length;
              const pending = classSignups.filter((s) => s.status === "pending").length;
              const remaining = c.capacity - confirmed - pending;
              return (
                <div key={c.id} className="bg-card border border-border p-4">
                  <p className="font-heading text-foreground text-lg">{c.name}</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {new Date(c.class_date).toLocaleDateString()} · ${(c.price_cents / 100).toFixed(0)}
                  </p>
                  <div className="flex gap-2 text-xs">
                    <Badge variant="default">{confirmed} paid</Badge>
                    <Badge variant="secondary">{pending} pending</Badge>
                    <Badge variant="outline">{remaining} left of {c.capacity}</Badge>
                  </div>
                </div>
              );
            })}
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
