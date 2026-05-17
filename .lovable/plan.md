# Plan: Reserve Spot for Coming Soon Courses

## Goal
For courses with no scheduled date yet (currently American Rifleman I & II), replace the disabled "Coming Soon" button with an active **"Reserve Your Spot"** button. Clicking it scrolls to the Contact Us section and pre-fills the course dropdown + a starter message so CGS gets an email with the reservation interest.

## Scope
Frontend only. No DB changes. Uses existing Web3Forms contact form to capture the lead.

## Changes

### 1. `src/components/ContactSection.tsx`
- Add new course options to the `<select>`:
  - "American Rifleman I — Reserve Spot"
  - "American Rifleman II — Reserve Spot"
- Listen for a custom URL hash or query param (e.g. `#contact?reserve=scope-carbine-1`) OR accept a global event so the form can pre-select the course and prefill the message with: *"I'd like to reserve a spot for {Course Title}. Please notify me as soon as a date is announced."*
- Simplest approach: read `window.location.hash` on mount and parse a `reserve` param.

### 2. `src/components/ClassesSection.tsx`
- When `comingSoon` is true, render a **"Reserve Your Spot"** button (primary style, not disabled) instead of the disabled "Coming Soon" button.
- onClick: set `window.location.hash` to `#contact?reserve={courseKey}` and smooth-scroll to `#contact`.
- Keep the "Coming Soon" overlay badge on the image so users still see it's not yet scheduled.

### 3. Course title mapping
- Small helper to map `courseKey` → contact form option value (e.g. `scope-carbine-1` → `"American Rifleman I"`) so the dropdown selects correctly and the email subject reads cleanly.

## Email behavior
- Web3Forms already sends submissions to CGS inbox. The subject line will become e.g. *"New Website Inquiry from John Doe (American Rifleman I — Reserve Spot)"* — gives admin a clean list of interested reservers per course.

## Out of scope
- No new database table for reservations (admin tracks via inbox).
- No automated "first dibs" email blast when date is set — admin replies manually from inbox for now. Can add later if wanted.

## Files touched
- `src/components/ClassesSection.tsx` — swap disabled button for Reserve button
- `src/components/ContactSection.tsx` — add reserve options + hash param prefill logic
