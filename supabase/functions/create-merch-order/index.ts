import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const SHIPPING_CENTS = 700;

const BodySchema = z.object({
  product_id: z.string().uuid(),
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().min(7).max(30).nullable().optional(),
  size: z.string().min(1).max(10),
  quantity: z.number().int().min(1).max(2),
  fulfillment: z.enum(["pickup", "ship"]),
  ship_address_line1: z.string().max(200).nullable().optional(),
  ship_address_line2: z.string().max(200).nullable().optional(),
  ship_city: z.string().max(120).nullable().optional(),
  ship_state: z.string().max(80).nullable().optional(),
  ship_postal_code: z.string().max(20).nullable().optional(),
  payment_method: z.enum(["zelle", "venmo"]),
  reference_code: z.string().min(6).max(40),
  notes: z.string().max(2000).nullable().optional(),
});

const hits = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || rec.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  rec.count += 1;
  return rec.count <= MAX_PER_WINDOW;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!rateLimit(ip)) return json({ error: "Too many requests" }, 429);

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const parsed = BodySchema.safeParse(payload);
  if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
  const input = parsed.data;

  if (input.fulfillment === "ship") {
    if (!input.ship_address_line1 || !input.ship_city || !input.ship_state || !input.ship_postal_code) {
      return json({ error: "Shipping address is required for shipped orders" }, 400);
    }
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: product, error: productErr } = await supabase
    .from("merch_products")
    .select("id, name, price_cents, sizes, active, stock_per_size")
    .eq("id", input.product_id)
    .maybeSingle();

  if (productErr || !product || !product.active) return json({ error: "Invalid product" }, 400);

  const sizes = Array.isArray(product.sizes) ? (product.sizes as string[]) : [];
  if (sizes.length > 0 && !sizes.includes(input.size)) return json({ error: "Invalid size" }, 400);

  // Per-size inventory is enforced server-side: stock_per_size minus non-cancelled orders.
  const stockPerSize = Number(product.stock_per_size ?? 2);
  const { data: existing, error: existingErr } = await supabase
    .from("merch_orders")
    .select("quantity")
    .eq("product_id", product.id)
    .eq("size", input.size)
    .neq("status", "cancelled");

  if (existingErr) return json({ error: "Could not verify inventory" }, 500);

  const ordered = (existing ?? []).reduce(
    (sum: number, row: { quantity: number }) => sum + Number(row.quantity ?? 0),
    0,
  );
  const remaining = Math.max(stockPerSize - ordered, 0);

  if (remaining <= 0) return json({ error: `Size ${input.size} is sold out` }, 409);
  if (input.quantity > remaining) {
    return json({ error: `Only ${remaining} left in size ${input.size}` }, 409);
  }

  // Prices are always recalculated server-side.
  const subtotal = product.price_cents * input.quantity;
  const shipping = input.fulfillment === "ship" ? SHIPPING_CENTS : 0;
  const total = subtotal + shipping;

  const { error } = await supabase.from("merch_orders").insert({
    product_id: product.id,
    product_name: product.name,
    first_name: input.first_name,
    last_name: input.last_name,
    email: input.email,
    phone: input.phone ?? null,
    size: input.size,
    quantity: input.quantity,
    fulfillment: input.fulfillment,
    ship_address_line1: input.ship_address_line1 ?? null,
    ship_address_line2: input.ship_address_line2 ?? null,
    ship_city: input.ship_city ?? null,
    ship_state: input.ship_state ?? null,
    ship_postal_code: input.ship_postal_code ?? null,
    subtotal_cents: subtotal,
    shipping_cents: shipping,
    total_cents: total,
    payment_method: input.payment_method,
    reference_code: input.reference_code,
    notes: input.notes ?? null,
    status: "pending",
  });

  if (error) return json({ error: "Failed to create order" }, 500);

  return json({
    ok: true,
    reference_code: input.reference_code,
    subtotal_cents: subtotal,
    shipping_cents: shipping,
    total_cents: total,
  });
});
