// Public reservation form. Three-step flow:
//   1. Reservation details (name, email, phone, payment method, promo code, notes)
//   2. Liability waiver — must be signed before payment instructions appear
//   3. Confirmation panel with reference code and Zelle/Venmo instructions (discounted price)
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, Loader2 } from "lucide-react";
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
import { SITE } from "@/config/site";
import { createSignup, generateReferenceCode } from "../api";
import {
  applyDiscountToCents,
  checkReturningCustomer,
  formatCents,
  formatDiscountLabel,
  validateDiscountCode,
  type DiscountInfo,
} from "../discounts";
import { signupFormSchema } from "../validation";
import { renderWaiverPlainText, WAIVER_TITLE, WAIVER_VERSION } from "../waiver";
import type { PaymentMethod, SignupFormData } from "../types";
import { SignupConfirmation } from "./SignupConfirmation";
import { WaiverStep, type WaiverData } from "./WaiverStep";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string | null;
  className: string;
  price: string;
  priceCents: number;
};

const EMPTY: SignupFormData = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  payment_method: "zelle",
  notes: "",
};

type Step = "form" | "waiver" | "confirmation";

export const SignupModal = ({ open, onOpenChange, classId, className, price, priceCents }: Props) => {
  const [step, setStep] = useState<Step>("form");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<SignupFormData>(EMPTY);
  const [promoInput, setPromoInput] = useState("");
  const [discount, setDiscount] = useState<DiscountInfo | null>(null);
  const [discountSource, setDiscountSource] = useState<"code" | "returning" | null>(null);
  const [validatingCode, setValidatingCode] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    refCode: string;
    method: PaymentMethod;
    finalCents: number;
    discount: DiscountInfo | null;
  } | null>(null);

  const finalCents = discount && priceCents > 0 ? applyDiscountToCents(priceCents, discount) : priceCents;

  // Auto-detect returning customer on email blur (only when no manual code applied)
  const handleEmailBlur = async () => {
    if (discountSource === "code") return;
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return;
    const isReturning = await checkReturningCustomer(form.email);
    if (isReturning) {
      const result = await validateDiscountCode("RETURNING");
      if (result.valid) {
        setDiscount(result.discount);
        setDiscountSource("returning");
        toast.success("Welcome back! Returning customer discount applied.");
      }
    }
  };

  const applyPromoCode = async () => {
    if (!promoInput.trim()) return;
    setValidatingCode(true);
    const result = await validateDiscountCode(promoInput.trim());
    setValidatingCode(false);
    if (!result.valid) {
      toast.error(result.reason);
      return;
    }
    setDiscount(result.discount);
    setDiscountSource("code");
    toast.success(`${formatDiscountLabel(result.discount)} applied.`);
  };

  const clearDiscount = () => {
    setDiscount(null);
    setDiscountSource(null);
    setPromoInput("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signupFormSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setStep("waiver");
  };

  const sendWaiverEmail = async (
    reference_code: string,
    parsed: SignupFormData,
    waiver: WaiverData,
    signedAtIso: string,
    finalAmountCents: number,
    appliedDiscount: DiscountInfo | null,
    isReturning: boolean
  ) => {
    const waiverText = renderWaiverPlainText({
      printedName: waiver.printedName,
      signatureName: waiver.signatureName,
      signedAt: new Date(signedAtIso).toLocaleString(),
      governingState: waiver.governingState,
      photoConsent: waiver.photoConsent,
      participantEmail: parsed.email,
      participantPhone: parsed.phone,
      className,
      referenceCode: reference_code,
    });

    const discountSummary = appliedDiscount
      ? `${appliedDiscount.code} (${formatDiscountLabel(appliedDiscount)})${isReturning ? " — auto: returning customer" : ""}`
      : "None";
    const priceSummary =
      priceCents > 0
        ? `Original: ${formatCents(priceCents)} | Discount: ${discountSummary} | Final: ${formatCents(finalAmountCents)}`
        : `Price: ${price} | Discount: ${discountSummary}`;

    const body = new FormData();
    body.append("access_key", SITE.web3formsAccessKey);
    body.append(
      "subject",
      `Signed Waiver — ${parsed.first_name} ${parsed.last_name} (${className}) — ${reference_code}`
    );
    body.append("from_name", `${parsed.first_name} ${parsed.last_name}`);
    body.append("replyto", parsed.email);
    body.append("name", `${parsed.first_name} ${parsed.last_name}`);
    body.append("email", parsed.email);
    body.append("phone", parsed.phone);
    body.append("class", className);
    body.append("reference_code", reference_code);
    body.append("pricing", priceSummary);
    body.append("discount_code", appliedDiscount?.code ?? "");
    body.append("final_amount", priceCents > 0 ? formatCents(finalAmountCents) : price);
    body.append("waiver_version", WAIVER_VERSION);
    body.append("waiver_title", WAIVER_TITLE);
    body.append("printed_name", waiver.printedName);
    body.append("signature", waiver.signatureName);
    body.append("governing_state", waiver.governingState);
    body.append("photo_consent", waiver.photoConsent ? "AGREES" : "DOES NOT AGREE");
    body.append("signed_at", signedAtIso);
    body.append("message", `${priceSummary}\n\n${waiverText}`);

    try {
      await fetch("https://api.web3forms.com/submit", { method: "POST", body });
    } catch (err) {
      console.error("Waiver email failed", err);
    }
  };

  const handleSign = async (waiver: WaiverData) => {
    if (!classId) return;
    const parsed = signupFormSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      setStep("form");
      return;
    }
    setSubmitting(true);
    try {
      const reference_code = generateReferenceCode();
      const signedAt = new Date().toISOString();
      const isReturning = discountSource === "returning";
      await createSignup({
        class_id: classId,
        first_name: parsed.data.first_name,
        last_name: parsed.data.last_name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        payment_method: parsed.data.payment_method,
        notes: parsed.data.notes || null,
        reference_code,
        waiver_signed_at: signedAt,
        waiver_signature_name: waiver.signatureName,
        waiver_printed_name: waiver.printedName,
        waiver_governing_state: waiver.governingState,
        waiver_photo_consent: waiver.photoConsent,
        waiver_version: WAIVER_VERSION,
        discount_code: discount?.code ?? null,
        discount_type: discount?.discount_type ?? null,
        discount_value: discount?.discount_value ?? null,
        original_price_cents: priceCents > 0 ? priceCents : null,
        final_price_cents: priceCents > 0 ? finalCents : null,
        is_returning_customer: isReturning,
      });
      await sendWaiverEmail(reference_code, form, waiver, signedAt, finalCents, discount, isReturning);
      setConfirmation({
        refCode: reference_code,
        method: parsed.data.payment_method,
        finalCents,
        discount,
      });
      setStep("confirmation");
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
      setPromoInput("");
      setDiscount(null);
      setDiscountSource(null);
      setStep("form");
    }
    onOpenChange(next);
  };

  // Reset state when reopened with a different class
  useEffect(() => {
    if (!open) return;
    setPromoInput("");
    setDiscount(null);
    setDiscountSource(null);
  }, [open, classId]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border">
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl tracking-wider text-primary uppercase">
                Reserve Your Seat
              </DialogTitle>
              <DialogDescription>
                {className} —{" "}
                {discount && priceCents > 0 ? (
                  <>
                    <span className="line-through text-muted-foreground">{price}</span>{" "}
                    <span className="text-primary font-semibold">{formatCents(finalCents)}</span>
                  </>
                ) : (
                  price
                )}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-4">
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
                  onBlur={handleEmailBlur}
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

              {/* Promo code */}
              <div>
                <Label htmlFor="promo">Promo / Discount Code (optional)</Label>
                {discount ? (
                  <div className="mt-1 flex items-center justify-between gap-2 border border-primary/50 bg-primary/10 px-3 py-2">
                    <div className="flex items-center gap-2 text-sm">
                      <BadgeCheck size={16} className="text-primary" />
                      <span className="font-mono font-semibold text-primary">{discount.code}</span>
                      <span className="text-muted-foreground">
                        — {formatDiscountLabel(discount)}
                        {discountSource === "returning" && " (returning customer)"}
                      </span>
                    </div>
                    <Button type="button" size="sm" variant="ghost" onClick={clearDiscount}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="mt-1 flex gap-2">
                    <Input
                      id="promo"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="MILITARY, LEO, etc."
                      className="font-mono uppercase"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={applyPromoCode}
                      disabled={!promoInput.trim() || validatingCode}
                    >
                      {validatingCode ? <Loader2 size={16} className="animate-spin" /> : "Apply"}
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Military, law enforcement, and returning students — request a code via{" "}
                  <a href="#contact" className="underline">
                    Contact Us
                  </a>
                  .
                </p>
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
              <Button type="submit" className="w-full">
                Continue to Waiver
              </Button>
              <p className="text-xs text-muted-foreground">
                You'll review and sign a liability waiver on the next step before payment.
              </p>
            </form>
          </>
        )}

        {step === "waiver" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl tracking-wider text-primary uppercase">
                Sign Liability Waiver
              </DialogTitle>
              <DialogDescription>Required before payment instructions are shown.</DialogDescription>
            </DialogHeader>
            <WaiverStep
              defaultName={`${form.first_name} ${form.last_name}`.trim()}
              className={className}
              submitting={submitting}
              onBack={() => setStep("form")}
              onSign={handleSign}
            />
          </>
        )}

        {step === "confirmation" && confirmation && (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl tracking-wider text-primary uppercase">
                Waiver Signed — Complete Payment
              </DialogTitle>
              <DialogDescription>
                A copy of your signed waiver has been emailed. Send payment within{" "}
                {PAYMENTS.holdHours} hours to confirm your seat.
              </DialogDescription>
            </DialogHeader>
            <SignupConfirmation
              refCode={confirmation.refCode}
              method={confirmation.method}
              originalPrice={price}
              originalPriceCents={priceCents}
              finalPriceCents={confirmation.finalCents}
              discount={confirmation.discount}
              onDone={() => handleClose(false)}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
