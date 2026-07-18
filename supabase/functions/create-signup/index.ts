import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const BodySchema = z.object({
  class_id: z.string().uuid(),
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().min(7).max(30).nullable().optional(),
  payment_method: z.string().min(1).max(40),
  notes: z.string().max(2000).nullable().optional(),
  reference_code: z.string().min(6).max(40),
  waiver_signed_at: z.string(),
  waiver_signature_name: z.string().min(2).max(120),
  waiver_printed_name: z.string().min(2).max(120),
  waiver_governing_state: z.string().min(1).max(80),
  waiver_photo_consent: z.boolean(),
  waiver_version: z.string().min(1).max(40),
  discount_code: z.string().max(60).nullable().optional(),
  discount_type: z.string().max(40).nullable().optional(),
  discount_value: z.number().int().nullable().optional(),
  original_price_cents: z.number().int().nullable().optional(),
  final_price_cents: z.number().int().nullable().optional(),
  is_returning_customer: z.boolean().optional(),
});

// Very simple in-memory rate limit per IP (best-effort)
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!rateLimit(ip)) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: klass, error: classErr } = await supabase
    .from("classes")
    .select("id")
    .eq("id", parsed.data.class_id)
    .maybeSingle();
  if (classErr || !klass) {
    return new Response(JSON.stringify({ error: "Invalid class" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { error } = await supabase.from("signups").insert({
    ...parsed.data,
    notes: parsed.data.notes ?? null,
    status: "pending",
  });

  if (error) {
    return new Response(JSON.stringify({ error: "Failed to create signup" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true, reference_code: parsed.data.reference_code }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
