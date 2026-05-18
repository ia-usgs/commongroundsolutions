// Discount validation + returning-customer check (public RPC calls).
import { supabase } from "@/lib/supabase-safe";

export type DiscountInfo = {
  code: string;
  category: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
};

export type ValidateResult =
  | { valid: true; discount: DiscountInfo }
  | { valid: false; reason: string };

export const validateDiscountCode = async (code: string): Promise<ValidateResult> => {
  const { data, error } = await supabase.rpc("validate_discount_code", { _code: code });
  if (error) return { valid: false, reason: error.message };
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || !row.valid) return { valid: false, reason: row?.reason ?? "Invalid code" };
  return {
    valid: true,
    discount: {
      code: row.code,
      category: row.category,
      discount_type: row.discount_type as "percent" | "fixed",
      discount_value: row.discount_value,
    },
  };
};

export const checkReturningCustomer = async (email: string): Promise<boolean> => {
  const { data, error } = await supabase.rpc("check_returning_customer", { _email: email });
  if (error) return false;
  return data === true;
};

export const applyDiscountToCents = (priceCents: number, d: DiscountInfo): number => {
  if (d.discount_type === "percent") {
    return Math.max(0, Math.round(priceCents * (1 - d.discount_value / 100)));
  }
  return Math.max(0, priceCents - d.discount_value);
};

export const formatCents = (cents: number): string => `$${(cents / 100).toFixed(2)}`;

export const formatDiscountLabel = (d: DiscountInfo): string =>
  d.discount_type === "percent" ? `${d.discount_value}% off` : `${formatCents(d.discount_value)} off`;
