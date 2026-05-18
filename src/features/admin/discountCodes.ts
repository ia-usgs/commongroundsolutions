// Admin API for discount codes.
import { supabase } from "@/lib/supabase-safe";

export type DiscountCategory = "military" | "leo" | "returning" | "custom";

export type DiscountCodeRow = {
  id: string;
  code: string;
  label: string | null;
  discount_type: "percent" | "fixed";
  discount_value: number;
  category: DiscountCategory;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export const fetchDiscountCodes = async (): Promise<DiscountCodeRow[]> => {
  const { data, error } = await supabase
    .from("discount_codes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DiscountCodeRow[];
};

export type CreateDiscountCodeInput = {
  code: string;
  label?: string | null;
  discount_type: "percent" | "fixed";
  discount_value: number;
  category: DiscountCategory;
  max_uses?: number | null;
  expires_at?: string | null;
  active?: boolean;
};

export const createDiscountCode = async (input: CreateDiscountCodeInput) => {
  const { error } = await supabase.from("discount_codes").insert({
    code: input.code.toUpperCase().trim(),
    label: input.label ?? null,
    discount_type: input.discount_type,
    discount_value: input.discount_value,
    category: input.category,
    max_uses: input.max_uses ?? null,
    expires_at: input.expires_at ?? null,
    active: input.active ?? true,
  });
  if (error) throw error;
};

export const toggleDiscountCode = async (id: string, active: boolean) => {
  const { error } = await supabase.from("discount_codes").update({ active }).eq("id", id);
  if (error) throw error;
};

export const deleteDiscountCode = async (id: string) => {
  const { error } = await supabase.from("discount_codes").delete().eq("id", id);
  if (error) throw error;
};

export const generateRandomCode = (category: DiscountCategory): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const prefix = category.toUpperCase();
  let suffix = "";
  for (let i = 0; i < 4; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${suffix}`;
};
