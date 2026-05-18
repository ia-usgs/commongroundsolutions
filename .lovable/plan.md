# Discount Codes — Implementation Plan

## Overview

Add a discount system to the signup flow with three sources of discounts:

1. **Admin-managed promo codes** (Military, LEO, custom) — created in admin dashboard, manually approved/issued per request
2. **Auto-detected returning customer** — if email has a prior confirmed signup, discount auto-applies
3. **Default for now**: 20% off (configurable per code by admin)

Discount is applied to the price shown on the confirmation screen, recorded on the signup row, and emailed in the waiver receipt so admin sees the expected payment amount.

## User Flow

```text
[Form] → enters info + optional promo code  → validates code live
              ↓                                ↓ shows "20% off applied"
              ↓                                ↓ (or auto-applies returning discount)
        [Waiver] → sign
              ↓
        [Confirmation] → shows ORIGINAL price struck through + DISCOUNTED price
                       → Zelle/Venmo instructions reflect new amount
                       → reference code + discount info emailed
```

**Returning customer manual request flow:** The Contact section already has a course select. We'll add a "Request Military / LEO / Returning Discount Code" option that prefills a request template. Admin replies with a code created in the dashboard.

## Database Changes

**New table `discount_codes`:**
- `code` (text, unique, uppercase) — e.g. `MILITARY-J7K2`
- `label` (text) — internal note, e.g. "Military — John Doe"
- `discount_type` (enum: `percent` | `fixed`) — default `percent`
- `discount_value` (int) — percent (1–100) or cents
- `category` (enum: `military` | `leo` | `returning` | `custom`) — for reporting
- `max_uses` (int, nullable) — null = unlimited
- `used_count` (int, default 0)
- `expires_at` (timestamptz, nullable)
- `active` (boolean, default true)

RLS:
- Admins: full manage
- Public: no direct select — validation goes through a `validate_discount_code(code text, email text)` SECURITY DEFINER function that returns `{ valid, discount_type, discount_value, reason }` without exposing the table

**`signups` table — new columns:**
- `discount_code` (text, nullable)
- `discount_type` (text, nullable)
- `discount_value` (int, nullable)
- `original_price_cents` (int, nullable)
- `final_price_cents` (int, nullable)
- `is_returning_customer` (boolean, default false)

**New DB function `check_returning_customer(email text)`** — SECURITY DEFINER, returns boolean: true if email has a prior `confirmed` signup. Public-callable via RPC.

## Code Changes

**Signup form (`SignupModal.tsx`):**
- Add optional "Promo code" input + "Apply" button below payment method
- On Apply → call `validate_discount_code` RPC; show ✓ with discount or ✗ with reason
- On email blur → call `check_returning_customer` RPC; if true and no promo entered, auto-apply 20% returning discount with a "Welcome back!" badge
- Promo code wins over returning-customer auto-discount (no stacking)
- Pass final discount info into `createSignup` and the confirmation screen

**Confirmation (`SignupConfirmation.tsx`):**
- Show original price (struck through) + final price
- Show "Discount: 20% off (MILITARY-XXXX)" line

**Waiver email payload:** add discount code, original price, final price so admin knows exact amount to expect.

**Admin dashboard — new "Discount Codes" page:**
- Table of codes with category, value, uses, expiry, active toggle
- "Create code" modal: category, label, type, value, max uses, expiry
- Quick "Generate code" button that auto-creates `{CATEGORY}-{4 random chars}` (e.g. `LEO-K7P3`)
- Delete / deactivate actions

**Contact form (`ContactSection.tsx`):** Add option "Request discount code (Military / LEO)" that prefills:
> "I'm a [Military / Law Enforcement] member and would like to request a discount code for [course name]. Service branch / agency: ___"

## Out of Scope

- Auto-emailing the code to requester (admin replies manually)
- Stacking discounts
- Per-course discount restrictions (codes apply to any class for now)
- Stripe / online payment integration

## Files to Touch

- `supabase/migrations/...` — new table, signups columns, two RPC functions
- `src/features/signups/api.ts` — discount validation, createSignup signature, returning check
- `src/features/signups/components/SignupModal.tsx` — promo input + auto-detect logic
- `src/features/signups/components/SignupConfirmation.tsx` — show discount breakdown
- `src/features/signups/types.ts` — discount fields
- `src/components/ContactSection.tsx` — "Request discount code" option
- `src/features/admin/...` — new Discount Codes admin page + nav link
