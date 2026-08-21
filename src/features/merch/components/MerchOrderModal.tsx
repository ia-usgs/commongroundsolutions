// Merch order flow: details form -> confirmation with Zelle/Venmo instructions.
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
import { formatCents } from "@/features/signups/discounts";
import type { PaymentMethod } from "@/features/signups/types";
import { createMerchOrder, generateMerchReferenceCode } from "../api";
import { MAX_QTY_PER_SIZE, SHIPPING_CENTS } from "../constants";
import { availabilityKey, type AvailabilityMap } from "../api";
import { merchOrderFormSchema } from "../validation";
import type { Fulfillment, MerchOrderFormData, MerchProduct } from "../types";
import { MerchOrderConfirmation } from "./MerchOrderConfirmation";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: MerchProduct | null;
  initialSize?: string;
  availability?: AvailabilityMap;
  onOrdered?: () => void;
};

const emptyForm = (size: string): MerchOrderFormData => ({
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  size,
  quantity: 1,
  fulfillment: "pickup",
  ship_address_line1: "",
  ship_address_line2: "",
  ship_city: "",
  ship_state: "",
  ship_postal_code: "",
  payment_method: "zelle",
  notes: "",
});

export const MerchOrderModal = ({
  open,
  onOpenChange,
  product,
  initialSize,
  availability = {},
  onOrdered,
}: Props) => {
  const [form, setForm] = useState<MerchOrderFormData>(emptyForm(initialSize ?? ""));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    refCode: string;
    method: PaymentMethod;
    subtotal: number;
    shipping: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    if (open) {
      setForm(emptyForm(initialSize ?? product?.sizes[0] ?? ""));
      setErrors({});
      setResult(null);
    }
  }, [open, initialSize, product]);

  if (!product) return null;

  const remainingFor = (size: string) => availability[availabilityKey(product.id, size)] ?? 0;
  const maxForSize = Math.min(MAX_QTY_PER_SIZE, Math.max(0, remainingFor(form.size)));

  const subtotal = product.price_cents * (form.quantity || 1);
  const shipping = form.fulfillment === "ship" ? SHIPPING_CENTS : 0;
  const total = subtotal + shipping;

  const set = <K extends keyof MerchOrderFormData>(key: K, value: MerchOrderFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async () => {
    const parsed = merchOrderFormSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const referenceCode = generateMerchReferenceCode();
    try {
      const res = await createMerchOrder({
        product_id: product.id,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        size: form.size,
        quantity: form.quantity,
        fulfillment: form.fulfillment,
        ship_address_line1: form.ship_address_line1.trim() || null,
        ship_address_line2: form.ship_address_line2.trim() || null,
        ship_city: form.ship_city.trim() || null,
        ship_state: form.ship_state.trim() || null,
        ship_postal_code: form.ship_postal_code.trim() || null,
        payment_method: form.payment_method,
        reference_code: referenceCode,
        notes: form.notes.trim() || null,
      });
      onOrdered?.();
      setResult({
        refCode: res.reference_code ?? referenceCode,
        method: form.payment_method,
        subtotal: res.subtotal_cents ?? subtotal,
        shipping: res.shipping_cents ?? shipping,
        total: res.total_cents ?? total,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place your order");
    } finally {
      setSubmitting(false);
    }
  };

  const err = (field: string) =>
    errors[field] ? <p className="text-xs text-destructive mt-1">{errors[field]}</p> : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading uppercase tracking-widest">
            {result ? "Order Received" : `Order — ${product.name}`}
          </DialogTitle>
          <DialogDescription>
            {result
              ? "Send payment with your order code to lock it in."
              : `${formatCents(product.price_cents)} each · +${formatCents(SHIPPING_CENTS)} if shipped`}
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <MerchOrderConfirmation
            refCode={result.refCode}
            method={result.method}
            subtotalCents={result.subtotal}
            shippingCents={result.shipping}
            totalCents={result.total}
            onDone={() => onOpenChange(false)}
          />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="merch-first">First name</Label>
                <Input
                  id="merch-first"
                  value={form.first_name}
                  onChange={(e) => set("first_name", e.target.value)}
                />
                {err("first_name")}
              </div>
              <div>
                <Label htmlFor="merch-last">Last name</Label>
                <Input
                  id="merch-last"
                  value={form.last_name}
                  onChange={(e) => set("last_name", e.target.value)}
                />
                {err("last_name")}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="merch-email">Email</Label>
                <Input
                  id="merch-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
                {err("email")}
              </div>
              <div>
                <Label htmlFor="merch-phone">Phone</Label>
                <Input
                  id="merch-phone"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
                {err("phone")}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Size</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.sizes.map((size) => {
                    const out = remainingFor(size) <= 0;
                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={out}
                        title={out ? "Sold out" : `${remainingFor(size)} left`}
                        onClick={() => {
                          set("size", size);
                          set(
                            "quantity",
                            Math.min(form.quantity, Math.min(MAX_QTY_PER_SIZE, remainingFor(size))) || 1,
                          );
                        }}
                        className={`px-3 py-1 text-sm border font-heading tracking-wider transition-colors ${
                          out
                            ? "border-border/50 text-muted-foreground/40 line-through cursor-not-allowed"
                            : form.size === size
                              ? "border-primary text-primary"
                              : "border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                {err("size")}
              </div>
              <div>
                <Label htmlFor="merch-qty">Quantity (max {Math.max(maxForSize, 1)})</Label>
                <Input
                  id="merch-qty"
                  type="number"
                  min={1}
                  max={Math.max(maxForSize, 1)}
                  value={form.quantity}
                  onChange={(e) =>
                    set(
                      "quantity",
                      Math.min(Math.max(maxForSize, 1), Math.max(1, Number(e.target.value) || 1)),
                    )
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {maxForSize > 0
                    ? `${maxForSize} available in ${form.size} (limit ${MAX_QTY_PER_SIZE} per size).`
                    : "This size is sold out."}
                </p>
                {err("quantity")}
              </div>
            </div>

            <div>
              <Label>Delivery</Label>
              <RadioGroup
                value={form.fulfillment}
                onValueChange={(v) => set("fulfillment", v as Fulfillment)}
                className="mt-2 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="pickup" id="merch-pickup" />
                  <Label htmlFor="merch-pickup" className="font-normal">
                    Pick up in person — no extra charge
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="ship" id="merch-ship" />
                  <Label htmlFor="merch-ship" className="font-normal">
                    Ship to me — +{formatCents(SHIPPING_CENTS)}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {form.fulfillment === "ship" && (
              <div className="space-y-3 border border-border p-3">
                <div>
                  <Label htmlFor="merch-addr1">Street address</Label>
                  <Input
                    id="merch-addr1"
                    value={form.ship_address_line1}
                    onChange={(e) => set("ship_address_line1", e.target.value)}
                  />
                  {err("ship_address_line1")}
                </div>
                <div>
                  <Label htmlFor="merch-addr2">Apt / Unit (optional)</Label>
                  <Input
                    id="merch-addr2"
                    value={form.ship_address_line2}
                    onChange={(e) => set("ship_address_line2", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="merch-city">City</Label>
                    <Input
                      id="merch-city"
                      value={form.ship_city}
                      onChange={(e) => set("ship_city", e.target.value)}
                    />
                    {err("ship_city")}
                  </div>
                  <div>
                    <Label htmlFor="merch-state">State</Label>
                    <Input
                      id="merch-state"
                      value={form.ship_state}
                      onChange={(e) => set("ship_state", e.target.value)}
                    />
                    {err("ship_state")}
                  </div>
                  <div>
                    <Label htmlFor="merch-zip">ZIP</Label>
                    <Input
                      id="merch-zip"
                      value={form.ship_postal_code}
                      onChange={(e) => set("ship_postal_code", e.target.value)}
                    />
                    {err("ship_postal_code")}
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label>Payment method</Label>
              <RadioGroup
                value={form.payment_method}
                onValueChange={(v) => set("payment_method", v as PaymentMethod)}
                className="mt-2 flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="zelle" id="merch-zelle" />
                  <Label htmlFor="merch-zelle" className="font-normal">
                    Zelle
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="venmo" id="merch-venmo" />
                  <Label htmlFor="merch-venmo" className="font-normal">
                    Venmo
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="merch-notes">Notes (optional)</Label>
              <Textarea
                id="merch-notes"
                rows={2}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </div>

            <div className="border border-border p-3 space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>
                  {form.quantity} × {formatCents(product.price_cents)}
                </span>
                <span>{formatCents(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{shipping > 0 ? formatCents(shipping) : "Free (pickup)"}</span>
              </div>
              <div className="flex justify-between font-heading uppercase tracking-widest text-primary pt-1">
                <span>Total</span>
                <span>{formatCents(total)}</span>
              </div>
            </div>

            <Button
              onClick={submit}
              disabled={submitting || maxForSize <= 0}
              className="w-full"
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {maxForSize <= 0 ? "Sold Out" : "Place Order"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
