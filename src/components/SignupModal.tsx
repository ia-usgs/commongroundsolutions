import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/lib/supabase-safe";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";
import venmoQr from "@/assets/venmo-qr.png";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string | null;
  className: string;
  price: string;
};

const formSchema = z.object({
  first_name: z.string().trim().min(1, "First name required").max(100),
  last_name: z.string().trim().min(1, "Last name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Phone required").max(30),
  payment_method: z.enum(["zelle", "venmo"]),
  notes: z.string().max(500).optional(),
});

const generateRefCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "CGS-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

const SignupModal = ({ open, onOpenChange, classId, className, price }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    refCode: string;
    method: "zelle" | "venmo";
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    payment_method: "zelle" as "zelle" | "venmo",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId) return;
    const parsed = formSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    try {
      const reference_code = generateRefCode();
      const { error } = await supabase.from("signups").insert({
        class_id: classId,
        first_name: parsed.data.first_name,
        last_name: parsed.data.last_name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        payment_method: parsed.data.payment_method,
        notes: parsed.data.notes || null,
        reference_code,
        status: "pending",
      });
      if (error) throw error;
      setConfirmation({ refCode: reference_code, method: parsed.data.payment_method });
    } catch (err: any) {
      toast.error(err.message ?? "Signup failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setConfirmation(null);
    setCopied(false);
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      payment_method: "zelle",
      notes: "",
    });
  };

  const handleClose = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const copyRef = () => {
    if (!confirmation) return;
    navigator.clipboard.writeText(confirmation.refCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border">
        {!confirmation ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl tracking-wider text-primary uppercase">
                Reserve Your Seat
              </DialogTitle>
              <DialogDescription>
                {className} — {price}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="first_name">First name *</Label>
                  <Input
                    id="first_name"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last name *</Label>
                  <Input
                    id="last_name"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Payment method *</Label>
                <RadioGroup
                  value={form.payment_method}
                  onValueChange={(v) =>
                    setForm({ ...form, payment_method: v as "zelle" | "venmo" })
                  }
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="zelle" id="zelle" />
                    <Label htmlFor="zelle" className="cursor-pointer">Zelle</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="venmo" id="venmo" />
                    <Label htmlFor="venmo" className="cursor-pointer">Venmo</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  placeholder="Anything we should know?"
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Reserving..." : "Reserve Seat"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Your seat is held for 24 hours pending payment confirmation.
              </p>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl tracking-wider text-primary uppercase">
                Seat Reserved
              </DialogTitle>
              <DialogDescription>
                Send your payment within 24 hours to confirm your spot.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5">
              <div className="bg-secondary p-4 border border-border">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  Your Reference Code
                </p>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-heading text-2xl tracking-wider text-primary">
                    {confirmation.refCode}
                  </span>
                  <Button size="sm" variant="outline" onClick={copyRef}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Include this code in your payment note so we can match it to your seat.
                </p>
              </div>

              <div className="border border-border p-4 space-y-3">
                <p className="font-heading uppercase tracking-widest text-sm text-primary">
                  Amount to send: {price}
                </p>
                {confirmation.method === "zelle" ? (
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider">
                      Send via Zelle to
                    </p>
                    <p className="text-foreground font-medium">Saul Gonzalez</p>
                    <p className="text-foreground font-mono">619-451-6820</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                      Scan to pay via Venmo
                    </p>
                    <img
                      src={venmoQr}
                      alt="Venmo QR code for @Saul-Gonzalez285"
                      className="w-48 h-48 mx-auto bg-white p-2"
                    />
                    <p className="text-foreground font-medium mt-2 text-center">
                      @Saul-Gonzalez285
                    </p>
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Once we confirm your payment, you'll receive an email with class details.
                Questions? Email cgstraininggroup@gmail.com
              </p>
              <Button onClick={() => handleClose(false)} className="w-full">
                Done
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SignupModal;
