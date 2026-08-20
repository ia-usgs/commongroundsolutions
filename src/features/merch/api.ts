// All Supabase access for merch products and orders goes through this module.
import { supabase } from "@/lib/supabase-safe";
import type { MerchOrderRow, MerchOrderStatus, MerchProduct } from "./types";

export const generateMerchReferenceCode = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "MRCH-";
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

const normalizeProduct = (row: Record<string, unknown>): MerchProduct => ({
  id: String(row.id),
  slug: String(row.slug),
  name: String(row.name),
  description: (row.description as string | null) ?? null,
  price_cents: Number(row.price_cents ?? 0),
  sizes: Array.isArray(row.sizes) ? (row.sizes as string[]) : [],
  badges: Array.isArray(row.badges) ? (row.badges as string[]) : [],
  image_key: (row.image_key as string | null) ?? null,
  active: Boolean(row.active),
  sort_order: Number(row.sort_order ?? 0),
});

export const fetchMerchProducts = async (opts?: { includeInactive?: boolean }): Promise<MerchProduct[]> => {
  let query = supabase.from("merch_products").select("*").order("sort_order", { ascending: true });
  if (!opts?.includeInactive) query = query.eq("active", true);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => normalizeProduct(row as Record<string, unknown>));
};

export type CreateMerchOrderInput = {
  product_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  size: string;
  quantity: number;
  fulfillment: "pickup" | "ship";
  ship_address_line1?: string | null;
  ship_address_line2?: string | null;
  ship_city?: string | null;
  ship_state?: string | null;
  ship_postal_code?: string | null;
  payment_method: "zelle" | "venmo";
  reference_code: string;
  notes?: string | null;
};

export type CreateMerchOrderResult = {
  reference_code: string;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
};

export const createMerchOrder = async (
  input: CreateMerchOrderInput,
): Promise<CreateMerchOrderResult> => {
  const { data, error } = await supabase.functions.invoke("create-merch-order", { body: input });
  if (error) throw error;
  if (data && typeof data === "object" && "error" in data) {
    throw new Error(typeof data.error === "string" ? data.error : "Failed to place order");
  }
  const result = data as CreateMerchOrderResult;
  return result;
};

export const fetchMerchOrders = async (): Promise<MerchOrderRow[]> => {
  const { data, error } = await supabase
    .from("merch_orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as MerchOrderRow[];
};

export const updateMerchOrderStatus = async (id: string, status: MerchOrderStatus) => {
  const { error } = await supabase.from("merch_orders").update({ status }).eq("id", id);
  if (error) throw error;
};

export const deleteMerchOrder = async (id: string) => {
  const { error } = await supabase.from("merch_orders").delete().eq("id", id);
  if (error) throw error;
};

export const updateMerchProduct = async (
  id: string,
  patch: Partial<Pick<MerchProduct, "name" | "description" | "price_cents" | "active" | "sort_order">>,
) => {
  const { error } = await supabase.from("merch_products").update(patch).eq("id", id);
  if (error) throw error;
};
