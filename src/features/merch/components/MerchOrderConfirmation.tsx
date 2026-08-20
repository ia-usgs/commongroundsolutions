// Shown after a merch order is placed: reference code + Zelle/Venmo payment instructions.
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PAYMENTS } from "@/config/payments";
import { SITE } from "@/config/site";
import venmoQr from "@/assets/venmo-qr.png";
import { formatCents } from "@/features/signups/discounts";
import type { PaymentMethod } from "@/features/signups/types";

type Props = {
  refCode: string;
  method: PaymentMethod;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  onDone: () => void;
};

export const MerchOrderConfirmation = ({
  refCode,
  method,
  subtotalCents,
  shippingCents,
  totalCents,
  onDone,
}: Props) => {
  const [copied, setCopied] = useState(false);

  const copyRef = () => {
    navigator.clipboard.writeText(refCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="bg-secondary p-4 border border-border">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
          Your Order Code
        </p>
        <div className="flex items-center justify-between gap-3">
          <span className="font-heading text-2xl tracking-wider text-primary">{refCode}</span>
          <Button size="sm" variant="outline" onClick={copyRef}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Include this code in your payment note so we can match it to your order.
        </p>
      </div>

      <div className="border border-border p-4 space-y-3">
        <div className="space-y-1 pb-3 border-b border-border">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Shirts</span>
            <span>{formatCents(subtotalCents)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Shipping</span>
            <span>{shippingCents > 0 ? formatCents(shippingCents) : "Pickup — free"}</span>
          </div>
        </div>
        <p className="font-heading uppercase tracking-widest text-sm text-primary">
          Amount to send: {formatCents(totalCents)}
        </p>
        {method === "zelle" ? (
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Send via Zelle to</p>
            <p className="text-foreground font-medium">{PAYMENTS.zelle.name}</p>
            <p className="text-foreground font-mono">{PAYMENTS.zelle.phone}</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
              Scan to pay via Venmo
            </p>
            <img
              src={venmoQr}
              alt={`Venmo QR code for ${PAYMENTS.venmo.handle}`}
              className="w-40 h-40 sm:w-48 sm:h-48 mx-auto bg-white p-2"
            />
            <p className="text-foreground font-medium mt-2 text-center">{PAYMENTS.venmo.handle}</p>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Pre-order item — ships in 2–3 weeks once payment is confirmed. Questions? Email {SITE.email}
      </p>
      <Button onClick={onDone} className="w-full">
        Done
      </Button>
    </div>
  );
};
