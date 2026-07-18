// All Supabase access for the `signups` table goes through this module.
import { supabase } from "@/lib/supabase-safe";
import type { PaymentMethod, SignupRow } from "./types";

export const generateReferenceCode = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "CGS-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

export type CreateSignupInput = {
  class_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  payment_method: PaymentMethod;
  notes?: string | null;
  reference_code: string;
  waiver_signed_at: string;
  waiver_signature_name: string;
  waiver_printed_name: string;
  waiver_governing_state: string;
  waiver_photo_consent: boolean;
  waiver_version: string;
  discount_code?: string | null;
  discount_type?: string | null;
  discount_value?: number | null;
  original_price_cents?: number | null;
  final_price_cents?: number | null;
  is_returning_customer?: boolean;
};

export const createSignup = async (input: CreateSignupInput) => {
  const { data, error } = await supabase.functions.invoke("create-signup", {
    body: input,
  });
  if (error) throw error;
  if (data && typeof data === "object" && "error" in data) {
    throw new Error(typeof data.error === "string" ? data.error : "Failed to create signup");
  }
};

export const fetchSignups = async (): Promise<SignupRow[]> => {
  const { data, error } = await supabase
    .from("signups")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as SignupRow[];
};

export const confirmSignup = async (id: string) => {
  const { error } = await supabase
    .from("signups")
    .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
};

export const cancelSignup = async (id: string) => {
  const { error } = await supabase.from("signups").update({ status: "cancelled" }).eq("id", id);
  if (error) throw error;
};
