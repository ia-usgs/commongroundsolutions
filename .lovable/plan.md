- Goal

Collect the American Rifleman I Student Rifle Data Form during signup, so students provide rifle/ammo/optic details ahead of class.

## Where it fits in the flow

Insert a new **Rifle Data** step **after the Waiver, before Payment Confirmation** — only when the class being signed up for is American Rifleman I (`course_key = "scope-carbine-1"`). This keeps the legal acknowledgment first and avoids friction for other classes.

```text
Reservation Form → Waiver → [Rifle Data — AR1 only] → Payment Confirmation
```

## Form fields (matches the uploaded document)

- **Rifle**: Caliber, Barrel Length, Barrel Twist Rate
- **Ammunition**: Manufacturer, Product Line, Bullet Grain Weight
- **Optic**: Manufacturer/Model, Optic Type (Scope/LPVO), Mount Height, Turret Adjustment Values, Reticle Type (BDC/Tree/Crosshair), FFP or SFP, Magnification Range
- **Red Dot / Magnifier** (optional): Dot Size, Magnifier Magnification, Mount Type, Mount Height
- **Applied Ballistics**: App Installed (Y/N), Version (Free/Pro)
- **Acknowledgment checkbox**: "I will bring 500 rounds of consistent ammunition suitable for ballistic data collection."

Student name/email/phone/class date are already captured in the reservation step — no need to re-ask.

## Storage

Add a new `signup_rifle_data` table linked to `signups.id`, with one JSONB column for the answers plus the acknowledgment flag and timestamp. RLS: public insert (matching signup pattern), admins read/update/delete.

## Admin visibility

In the existing `SignupsManager`, show a "Rifle Data" panel on AR1 signups so the instructor can review answers before class.

## Optional follow-ups (not in this plan, ask if you want them)

- Email the rifle data sheet to the student after submission
- PDF export of submitted form
- Allow editing rifle data after submission via the reference code

## Technical notes

- New `RifleDataStep.tsx` in `src/features/signups/components/`
- `SignupModal.tsx` gains a conditional step gated on `courseKey === "scope-carbine-1"`
- New `rifleData.ts` API helper for the insert
- Migration creates `signup_rifle_data` table with proper GRANTs + RLS