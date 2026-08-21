import type { PaymentMethod } from "@/features/signups/types";

export type Fulfillment = "pickup" | "ship";
export type MerchOrderStatus = "pending" | "paid" | "shipped" | "cancelled";

export type MerchProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  sizes: string[];
  badges: string[];
  image_key: string | null;
  active: boolean;
  sort_order: number;
};

export type MerchOrderRow = {
  id: string;
  product_id: string;
  product_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  size: string;
  quantity: number;
  fulfillment: Fulfillment;
  ship_address_line1: string | null;
  ship_address_line2: string | null;
  ship_city: string | null;
  ship_state: string | null;
  ship_postal_code: string | null;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  payment_method: PaymentMethod;
  reference_code: string;
  status: MerchOrderStatus;
  notes: string | null;
  created_at: string;
};

export type MerchOrderFormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  size: string;
  quantity: number;
  fulfillment: Fulfillment;
  ship_address_line1: string;
  ship_address_line2: string;
  ship_city: string;
  ship_state: string;
  ship_postal_code: string;
  payment_method: PaymentMethod;
  notes: string;
};
