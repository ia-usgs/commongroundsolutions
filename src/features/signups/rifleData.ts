// Supabase access for the American Rifleman I student rifle data form.
import { supabase } from "@/lib/supabase-safe";

export type RifleDataPayload = {
  // Rifle
  caliber: string;
  barrel_length: string;
  barrel_twist_rate: string;
  // Ammunition
  ammo_manufacturer: string;
  ammo_product_line: string;
  bullet_grain_weight: string;
  // Optic
  optic_manufacturer_model: string;
  optic_type: string;
  optic_mount_height: string;
  turret_adjustment_values: string;
  reticle_type: string;
  focal_plane: string; // FFP or SFP
  magnification_range: string;
  // Red Dot / Magnifier (optional)
  red_dot_size: string;
  magnifier_magnification: string;
  red_dot_mount_type: string;
  red_dot_mount_height: string;
  // Applied Ballistics
  applied_ballistics_installed: string; // 'Y' | 'N' | ''
  applied_ballistics_version: string;
};

export const EMPTY_RIFLE_DATA: RifleDataPayload = {
  caliber: "",
  barrel_length: "",
  barrel_twist_rate: "",
  ammo_manufacturer: "",
  ammo_product_line: "",
  bullet_grain_weight: "",
  optic_manufacturer_model: "",
  optic_type: "",
  optic_mount_height: "",
  turret_adjustment_values: "",
  reticle_type: "",
  focal_plane: "",
  magnification_range: "",
  red_dot_size: "",
  magnifier_magnification: "",
  red_dot_mount_type: "",
  red_dot_mount_height: "",
  applied_ballistics_installed: "",
  applied_ballistics_version: "",
};

export const createRifleData = async (
  signup_id: string,
  data: RifleDataPayload,
  ammo_acknowledged: boolean
) => {
  const { error } = await supabase.from("signup_rifle_data").insert({
    signup_id,
    data: data as unknown as Record<string, unknown>,
    ammo_acknowledged,
  });
  if (error) throw error;
};

export const RIFLE_DATA_FIELD_LABELS: Record<keyof RifleDataPayload, string> = {
  caliber: "Caliber",
  barrel_length: "Barrel Length",
  barrel_twist_rate: "Barrel Twist Rate",
  ammo_manufacturer: "Ammo Manufacturer",
  ammo_product_line: "Ammo Product Line",
  bullet_grain_weight: "Bullet Grain Weight",
  optic_manufacturer_model: "Optic Manufacturer / Model",
  optic_type: "Optic Type",
  optic_mount_height: "Optic Mount Height",
  turret_adjustment_values: "Turret Adjustment Values",
  reticle_type: "Reticle Type",
  focal_plane: "FFP / SFP",
  magnification_range: "Magnification Range",
  red_dot_size: "Red Dot Size",
  magnifier_magnification: "Magnifier Magnification",
  red_dot_mount_type: "Red Dot Mount Type",
  red_dot_mount_height: "Red Dot Mount Height",
  applied_ballistics_installed: "Applied Ballistics Installed",
  applied_ballistics_version: "Applied Ballistics Version",
};
