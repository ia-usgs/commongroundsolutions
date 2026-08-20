# Merch Page — Implementation Plan

## What gets built

A new **Merch** page (`/merch`) styled like the rest of the site (black/gold, Oswald headings), linked from the navbar and footer. Customers pick a shirt, size, and quantity, choose pickup or shipping, then get a reference code with the same Zelle/Venmo instructions used for class signups. Orders are saved to the backend and managed from a new **Merch Orders** tab in the admin panel.

## Products

| Product | Price | Sizes | Notes shown on card |
| --- | --- | --- | --- |
| CGS Black Oversized Tee (gold laurel back print) | $32 | S–3XL | PRE-ORDER ITEM — SHIPS IN 2–3 WEEKS · OVERSIZED FIT — RECOMMEND SIZING DOWN |
| CGS White Tee (black box logo) | $32 | S–3XL | PRE-ORDER ITEM — SHIPS IN 2–3 WEEKS |

Shipping: **+$7.00 per order** (not per item) when the customer chooses shipping instead of in-person pickup. Product photos come from the two mockup images provided.

## Customer flow

1. Merch page shows the two shirt cards with photo, price, size selector, and quantity.
2. "Order" opens a modal: name, email, phone, size/qty confirmation, pickup vs. ship, shipping address (required only when shipping), notes, payment method (Zelle or Venmo).
3. Submit → order saved, reference code generated (e.g. `MRCH-4F2A`).
4. Confirmation panel shows the order total (items + shipping), the reference code, and the Zelle name/phone or Venmo QR — reusing the existing confirmation component styling.

## Admin

New "Merch" tab in the admin dashboard listing orders with customer info, items, size, total, payment method, reference code, and status. Admin can mark an order **paid**, **shipped**, or **cancelled**, and delete orders. Product name/price/active toggle is also editable so the client can add future items or take a shirt down without code changes.

## Technical notes

- **DB migration** — two tables:
  - `merch_products`: slug, name, description, price_cents, sizes (jsonb), badges (jsonb), image_key, active, sort_order. Public read; admin write.
  - `merch_orders`: customer name/email/phone, product_id, size, quantity, fulfillment (`pickup` | `ship`), shipping address fields, subtotal_cents, shipping_cents, total_cents, payment_method (reuse existing `payment_method` enum), reference_code, status enum (`pending`/`paid`/`shipped`/`cancelled`), notes, timestamps. No public read or insert; admin full access.
  - GRANTs for `authenticated` + `service_role` (plus `anon` SELECT on products only), RLS enabled, `updated_at` trigger.
- **Edge function** `create-merch-order` (mirrors `create-signup`): Zod validation, price recalculated server-side from `merch_products` so totals can't be tampered with, per-IP rate limiting, returns the reference code.
- **New feature folder** `src/features/merch/` — `api.ts`, `types.ts`, `validation.ts`, `data/` for image imports, and `components/` (`MerchGrid.tsx`, `MerchProductCard.tsx`, `MerchOrderModal.tsx`, `MerchOrderConfirmation.tsx`).
- **Reuse** `src/config/payments.ts`, the Venmo QR asset, and the existing confirmation layout so payment info stays in one place.
- **Routing** `/merch` added in `src/App.tsx`; nav item added to `src/components/Navbar.tsx` (routes to the page rather than a hash anchor) and to the footer.
- **Admin** `src/features/admin/components/MerchOrdersManager.tsx` + `MerchProductsManager.tsx`, wired into `src/pages/Admin.tsx` and `useAdminData.ts`.
- **Assets** shirt mockups added via Lovable Assets pointers in `src/assets/`.
- **SEO** page title/description for merch, single H1, alt text on product photos, mobile-first responsive grid (1 column mobile, 2 desktop).

## Out of scope

No card checkout, no inventory counts, no automated shipping labels — payment stays manual via Zelle/Venmo confirmed by admin.
