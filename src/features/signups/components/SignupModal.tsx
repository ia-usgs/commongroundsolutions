// Public reservation form. Validates with zod, inserts a pending signup, then swaps to the
// confirmation panel with payment instructions.
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PAYMENTS } from "@/config/payments";
import { createSignup, generateReferenceCode } from "../api";
import { signupFormSchema } from "../validation";
import type { PaymentMethod, SignupFormData } from "../types";
import { SignupConfirmation } from "./SignupConfirmation";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string | null;
  className: string;
  price: string;
};

const EMPTY: SignupFormData = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  payment_method: "zelle",
  notes: "",
};

export const SignupModal = ({ open, onOpenChange, classId, className, price }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{ refCode: string; method: PaymentMethod } | null>(
    null
  );
  const [form, setForm] = useState<SignupFormData>(EMPTY);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId) return;
    const parsed = signupFormSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    try {
      const reference_code = generateReferenceCode();
      await createSignup({
        class_id: classId,
        first_name: parsed.data.first_name,
        last_name: parsed.data.last_name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        payment_method: parsed.data.payment_method,
        notes: parsed.data.notes || null,
        reference_code,
      });
      setConfirmation({ refCode: reference_code, method: parsed.data.payment_method });
    } catch (err: any) {
      toast.error(err.message ?? "Signup failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = (next: boolean) => {
    if (!next) {
      setConfirmation(null);
      setForm(EMPTY);
    }
    onOpenChange(next);
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
                  onValueChange={(v) => setForm({ ...form, payment_method: v as PaymentMethod })}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="zelle" id="zelle" />
                    <Label htmlFor="zelle" className="cursor-pointer">
                      Zelle
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="venmo" id="venmo" />
                    <Label htmlFor="venmo" className="cursor-pointer">
                      Venmo
                    </Label>
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
                Your seat is held for {PAYMENTS.holdHours} hours pending payment confirmation.
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
                Send your payment within {PAYMENTS.holdHours} hours to confirm your spot.
              </DialogDescription>
            </DialogHeader>
            <SignupConfirmation
              refCode={confirmation.refCode}
              method={confirmation.method}
              price={price}
              onDone={() => handleClose(false)}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
