// Rifle data intake form shown between the waiver and payment for American Rifleman I.
// Captures rifle/ammo/optic details so the instructor can pre-build ballistic profiles.
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EMPTY_RIFLE_DATA, type RifleDataPayload } from "../rifleData";

type Props = {
  submitting: boolean;
  onBack: () => void;
  onSubmit: (data: RifleDataPayload, ammoAcknowledged: boolean) => void;
};

const Field = ({
  id,
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) => (
  <div>
    <Label htmlFor={id}>
      {label}
      {required ? " *" : ""}
    </Label>
    <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  </div>
);

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h4 className="font-heading uppercase tracking-wider text-primary text-sm mt-2">{children}</h4>
);

export const RifleDataStep = ({ submitting, onBack, onSubmit }: Props) => {
  const [d, setD] = useState<RifleDataPayload>(EMPTY_RIFLE_DATA);
  const [ack, setAck] = useState(false);
  const set = (k: keyof RifleDataPayload) => (v: string) => setD((prev) => ({ ...prev, [k]: v }));

  const requiredFilled =
    d.caliber.trim() &&
    d.barrel_length.trim() &&
    d.barrel_twist_rate.trim() &&
    d.ammo_manufacturer.trim() &&
    d.ammo_product_line.trim() &&
    d.bullet_grain_weight.trim() &&
    d.optic_manufacturer_model.trim();

  const canSubmit = !!requiredFilled && ack && !submitting;

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        American Rifleman I is a data-driven course. Please provide your rifle, ammunition, and optic
        details so we can prepare ballistic profiles before class.
      </div>

      <SectionHeader>Rifle</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Field id="caliber" label="Caliber" value={d.caliber} onChange={set("caliber")} required />
        <Field
          id="barrel_length"
          label="Barrel Length"
          value={d.barrel_length}
          onChange={set("barrel_length")}
          required
          placeholder='e.g. 16"'
        />
        <Field
          id="twist"
          label="Twist Rate"
          value={d.barrel_twist_rate}
          onChange={set("barrel_twist_rate")}
          required
          placeholder="e.g. 1:8"
        />
      </div>

      <SectionHeader>Ammunition</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Field
          id="ammo_mfr"
          label="Manufacturer"
          value={d.ammo_manufacturer}
          onChange={set("ammo_manufacturer")}
          required
        />
        <Field
          id="ammo_line"
          label="Product Line"
          value={d.ammo_product_line}
          onChange={set("ammo_product_line")}
          required
        />
        <Field
          id="grain"
          label="Bullet Grain Weight"
          value={d.bullet_grain_weight}
          onChange={set("bullet_grain_weight")}
          required
          placeholder="e.g. 77gr"
        />
      </div>

      <SectionHeader>Optic</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field
          id="optic_model"
          label="Manufacturer / Model"
          value={d.optic_manufacturer_model}
          onChange={set("optic_manufacturer_model")}
          required
        />
        <Field
          id="optic_type"
          label="Optic Type (Scope, LPVO)"
          value={d.optic_type}
          onChange={set("optic_type")}
        />
        <Field
          id="optic_mh"
          label="Mount Height"
          value={d.optic_mount_height}
          onChange={set("optic_mount_height")}
        />
        <Field
          id="turret"
          label="Turret Adjustment Values"
          value={d.turret_adjustment_values}
          onChange={set("turret_adjustment_values")}
          placeholder="e.g. 0.1 MIL / 1/4 MOA"
        />
        <Field
          id="reticle"
          label="Reticle Type (BDC, Tree, Crosshair)"
          value={d.reticle_type}
          onChange={set("reticle_type")}
        />
        <Field
          id="fp"
          label="FFP or SFP"
          value={d.focal_plane}
          onChange={set("focal_plane")}
          placeholder="FFP / SFP"
        />
        <Field
          id="mag"
          label="Magnification Range"
          value={d.magnification_range}
          onChange={set("magnification_range")}
          placeholder="e.g. 1-6x, 5-25x"
        />
      </div>

      <SectionHeader>Red Dot / Magnifier (if applicable)</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field id="dot_size" label="Dot Size" value={d.red_dot_size} onChange={set("red_dot_size")} />
        <Field
          id="mag_x"
          label="Magnifier Magnification"
          value={d.magnifier_magnification}
          onChange={set("magnifier_magnification")}
        />
        <Field
          id="rd_mount"
          label="Mount Type"
          value={d.red_dot_mount_type}
          onChange={set("red_dot_mount_type")}
        />
        <Field
          id="rd_mh"
          label="Mount Height"
          value={d.red_dot_mount_height}
          onChange={set("red_dot_mount_height")}
        />
      </div>

      <SectionHeader>Applied Ballistics</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field
          id="ab_installed"
          label="App Installed (Y/N)"
          value={d.applied_ballistics_installed}
          onChange={set("applied_ballistics_installed")}
          placeholder="Y / N"
        />
        <Field
          id="ab_version"
          label="Version (Free, Pro)"
          value={d.applied_ballistics_version}
          onChange={set("applied_ballistics_version")}
        />
      </div>

      <div className="flex items-start gap-2 bg-secondary p-3 border border-border rounded-md">
        <Checkbox id="ammo_ack" checked={ack} onCheckedChange={(v) => setAck(v === true)} />
        <Label htmlFor="ammo_ack" className="text-sm leading-snug cursor-pointer">
          I acknowledge American Rifleman I is not a beginner firearms safety course, and I will bring
          500 rounds of consistent ammunition suitable for ballistic data collection.
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
          onClick={() => onSubmit(d, ack)}
        >
          {submitting ? "Submitting..." : "Submit & Continue to Payment"}
        </Button>
      </div>
    </div>
  );
};
