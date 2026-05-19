// Waiver step shown between the reservation form and the payment confirmation.
// Participant must type their signature, pick photo consent + governing state, and check the
// acknowledgment box before they can continue to payment.
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  WAIVER_TITLE,
  WAIVER_PARTIES,
  WAIVER_SECTIONS,
  WAIVER_VERSION,
} from "../waiver";

export type WaiverData = {
  signatureName: string;
  printedName: string;
  governingState: string;
  photoConsent: boolean;
  acknowledged: boolean;
};

type Props = {
  defaultName: string;
  className: string;
  submitting: boolean;
  onBack: () => void;
  onSign: (data: WaiverData) => void;
};

export const WaiverStep = ({ defaultName, className, submitting, onBack, onSign }: Props) => {
  const [signatureName, setSignatureName] = useState(defaultName);
  const [printedName, setPrintedName] = useState(defaultName);
  const [governingState, setGoverningState] = useState("California");
  const [photoConsent, setPhotoConsent] = useState<"yes" | "no" | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);

  const today = new Date().toLocaleDateString();

  const canSubmit =
    signatureName.trim().length >= 2 &&
    printedName.trim().length >= 2 &&
    governingState.trim().length >= 2 &&
    photoConsent !== null &&
    acknowledged &&
    !submitting;

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Before payment, please read and sign the liability waiver for{" "}
        <span className="text-foreground font-medium">{className}</span>.
      </div>

      <div className="border border-border rounded-md">
        <ScrollArea className="h-64 p-4">
          <div className="space-y-3 text-sm">
            <h3 className="font-heading uppercase tracking-wider text-primary text-base">
              {WAIVER_TITLE}
            </h3>
            <p className="text-xs text-muted-foreground">Version {WAIVER_VERSION}</p>
            <p>
              <span className="font-medium">Landowner:</span> {WAIVER_PARTIES.landowner}
              <br />
              <span className="font-medium">Tenant/Operator:</span> {WAIVER_PARTIES.operator}
            </p>
            {WAIVER_SECTIONS.map((s, i) => (
              <div key={i} className="space-y-1">
                {s.heading && <h4 className="font-semibold text-foreground">{s.heading}</h4>}
                {s.body.map((p, j) => (
                  <p key={j} className="text-foreground/80">
                    {p}
                  </p>
                ))}
                {s.bullets && (
                  <ul className="list-disc pl-5 text-foreground/80 space-y-0.5">
                    {s.bullets.map((b, k) => (
                      <li key={k}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="governing_state">Governing State *</Label>
          <Input
            id="governing_state"
            value={governingState}
            onChange={(e) => setGoverningState(e.target.value)}
          />
        </div>
        <div>
          <Label>Date</Label>
          <Input value={today} readOnly disabled />
        </div>
      </div>

      <div>
        <Label className="mb-2 block">Photography & Recording *</Label>
        <RadioGroup
          value={photoConsent ?? ""}
          onValueChange={(v) => setPhotoConsent(v as "yes" | "no")}
          className="flex gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id="photo_yes" />
            <Label htmlFor="photo_yes" className="cursor-pointer">
              I agree
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id="photo_no" />
            <Label htmlFor="photo_no" className="cursor-pointer">
              I do not agree
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="printed_name">Printed Name *</Label>
          <Input
            id="printed_name"
            value={printedName}
            onChange={(e) => setPrintedName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="signature_name">Signature (type full name) *</Label>
          <Input
            id="signature_name"
            value={signatureName}
            onChange={(e) => setSignatureName(e.target.value)}
            placeholder="Your legal name"
            className="font-heading tracking-wider"
            required
          />
        </div>
      </div>

      <div className="flex items-start gap-2 bg-secondary p-3 border border-border rounded-md">
        <Checkbox
          id="ack"
          checked={acknowledged}
          onCheckedChange={(v) => setAcknowledged(v === true)}
        />
        <Label htmlFor="ack" className="text-sm leading-snug cursor-pointer">
          I am 18 years of age or older. I have read this Agreement carefully, fully understand its
          terms, am signing it voluntarily, and acknowledge that I am giving up substantial legal
          rights.
        </Label>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onBack} disabled={submitting}>
          Back
        </Button>
        <Button
          type="button"
          className="flex-1"
          disabled={!canSubmit}
          onClick={() =>
            onSign({
              signatureName: signatureName.trim(),
              printedName: printedName.trim(),
              governingState: governingState.trim(),
              photoConsent: photoConsent === "yes",
              acknowledged,
            })
          }
        >
          {submitting ? "Submitting..." : "Sign & Continue to Payment"}
        </Button>
      </div>
    </div>
  );
};
