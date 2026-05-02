// Confirmation panel shown after a successful reservation: reference code + payment instructions.
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PAYMENTS } from "@/config/payments";
import { SITE } from "@/config/site";
import venmoQr from "@/assets/venmo-qr.png";
import type { PaymentMethod } from "../types";

type Props = {
  refCode: string;
  method: PaymentMethod;
  price: string;
  onDone: () => void;
};

export const SignupConfirmation = ({ refCode, method, price, onDone }: Props) => {
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
          Your Reference Code
        </p>
        <div className="flex items-center justify-between gap-3">
          <span className="font-heading text-2xl tracking-wider text-primary">{refCode}</span>
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
              className="w-48 h-48 mx-auto bg-white p-2"
            />
            <p className="text-foreground font-medium mt-2 text-center">{PAYMENTS.venmo.handle}</p>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Once we confirm your payment, you'll receive an email with class details. Questions? Email{" "}
        {SITE.email}
      </p>
      <Button onClick={onDone} className="w-full">
        Done
      </Button>
    </div>
  );
};
