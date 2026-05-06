# Accessibility Audit & Statement — Design Spec

**Date:** 2026-05-06
**Project:** bakerverse-home (josephkbaker.com)
**Target:** WCAG 2.1 Level AA with Level AAA improvements where practical
**Status:** Approved — pending implementation

---

## Overview

A two-part initiative:

1. **Full accessibility audit and remediation** — automated + manual audit of every route, followed by a prioritized fix pass that brings the site to WCAG 2.1 AA conformance.
2. **Public accessibility statement** — a dedicated `/accessibility` page plus a callout on `/about` and a footer link, documenting the conformance claim for users and recruiters alike.

Motivation: inclusive design as a baseline, legal liability protection (ADA Title III, Section 508, EN 301 549), and a visible engineering-values signal for hiring.

---

## Phase 1: Audit

### Pass 1 — Automated (axe-core via Playwright)

Install `@axe-core/playwright` and run it against every route with the dev server live:

| Route | Notes |
|---|---|
| `/` | Home — hero, featured projects, animations |
| `/about` | Character sheet, proficiencies |
| `/work` | AdventureEntry components |
| `/projects` | Project grid |
| `/projects/[slug]` | Individual project page |
| `/contact` | SubmissionForm island |
| `/bakerverse` | Portal grid |
| `/resume` | Résumé page |
| `/playground/theme-editor` | Complex interactive — highest risk |

Output: structured violation report grouped by page, each violation tagged with WCAG criterion, impact level (critical/serious/moderate/minor), and affected element.

### Pass 2 — Manual Review

Axe catches ~35–40% of WCAG violations. Manual pass covers:

- **Keyboard navigation** — Tab order logical on every page; no keyboard traps except intentional ones (theme picker popover must trap focus while open)
- **Focus management** — Theme picker popover: focus moves in on open, returns to trigger on close. Mobile nav panel: same pattern.
- **Heading hierarchy** — One `h1` per page, logical `h2` → `h3` nesting, no skipped levels
- **Screen reader semantics** — Decorative elements (`EmberBackdrop`, `CursorAura`, footer sigil SVG, ornate frames) confirm `aria-hidden="true"`; `RevealOnScroll` confirm content is accessible before/without animation
- **Motion gating** — All animations fully stop (not just slow) under `prefers-reduced-motion: reduce`. Covers: `EmberBackdrop`, `CursorAura`, `RevealOnScroll`, `MagneticButton`, footer sigil rotation, ViewTransition animations
- **Touch targets** — Interactive elements ≥ 44×44px (WCAG 2.5.5 AAA target; AA minimum is 24×24px)
- **Color contrast** — Manual check of secondary accents (epic purple `#A335EE`, arcane blue `#5B8CFF`, blood red `#8B0000`) against dark backgrounds. Diablo gold `#F0B90B` on `rgba(7,6,10)` expected to pass.
- **Form states** — Contact form: error announcements via `role="alert"`, success state announced to screen readers, required field indicators explained

Both passes feed a single triage doc (inline comments in the implementation plan) prioritizing:
- **Must fix** — WCAG AA failures (color contrast, missing labels, keyboard traps)
- **Should fix** — Best-practice improvements (touch target sizing, redundant title attributes)
- **Nice to have** — AAA wins (enhanced contrast, extended timeout notices)

---

## Phase 2: Remediation

Fixes are grouped by scope to avoid per-page patching of cross-cutting issues.

### Global (`BaseLayout.astro` / `global.css` / `tokens.css`)

- **Focus ring system** — Replace the single `:focus-visible` rule in `global.css` with a comprehensive token-based system: 2px offset outline using `var(--gold-300)` as the default ring color, with theme-sensitive overrides where the active theme changes backgrounds
- **`prefers-reduced-motion` hardening** — Audit all animation entry points; ensure `prefers-reduced-motion: reduce` fully stops motion (opacity transitions allowed; transform/translate/scale animations not allowed)
- **Color contrast tokens** — If any secondary accent fails contrast checks, add AA-compliant variants to `tokens.css` and use them for text/interactive contexts

### Navbar (`Navbar.astro`)

- **Theme picker focus trap** — On open: move focus to first swatch. On Escape or selection: return focus to the picker trigger. Tab and Shift+Tab must cycle within the popover while it's open.
- **Mobile nav focus management** — On open: move focus to first nav link. On close: return focus to the hamburger toggle.

### Pages (per-page)

- **Heading hierarchy** — Audit and correct `h1`/`h2`/`h3` nesting on all pages
- **Decorative elements** — Confirm `aria-hidden="true"` on all decorative SVGs, icons, and background effects
- **Image alt text** — All `<img>` elements have meaningful alt text; purely decorative images have `alt=""`

### Contact Form (`SubmissionForm.tsx`)

- Success state: wrap in `role="status"` or `aria-live="polite"` so screen readers announce confirmation
- Required fields: add `aria-required="true"` and visually indicate with a legend or field-level note readable to screen readers (not color alone)

### Playground / Theme Editor

- All sliders: `aria-label`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- All color inputs: explicit `<label>` associations
- Export and submit buttons: descriptive `aria-label` where button text alone is ambiguous
- `SubmissionForm` close button (✕): already has `aria-label="Close submission form"` ✓

---

## Phase 3: Accessibility Statement

### `/accessibility` page

**Conformance claim:**
> This site targets WCAG 2.1 Level AA conformance with Level AAA improvements where practical. This statement was last reviewed on [date of implementation].

**Page sections:**

1. **Conformance status** — Level AA claim, date, WCAG 2.1 reference link
2. **Technical approach** — Bulleted: semantic HTML5 landmarks, skip-to-content link, keyboard navigation, `prefers-reduced-motion` support, screen reader testing, color contrast targets, focus management
3. **Known limitations** — Honest list of anything that did not reach full AA after remediation (if none, say so). Honesty is legally protective.
4. **Feedback** — "If you experience an accessibility barrier, contact me at bakerj417@gmail.com or via the [contact form](/contact)." Response commitment: within 2 business days.
5. **Standards referenced** — WCAG 2.1, ADA Title III, EN 301 549

**Visual treatment:** Cinzel headers, clean Inter prose, minimal animation, no decorative motion. Fits the MMO aesthetic while being unambiguously legible. No EmberBackdrop on this page.

### `/about` callout

A short paragraph in the "how I work" / values section:

> "Accessibility isn't an afterthought in my work — it's a compliance baseline and a design constraint I apply from day one. Every project I ship is built to WCAG 2.1 AA standards. [Read this site's accessibility statement →]"

### Footer link

Added to `footer-bottom` alongside the copyright line — small mono text, dignified, persistent across every page. Matches the existing footer typographic style.

---

## Phase 4: Playwright Axe Tests

**Installation:** `@axe-core/playwright`

**File:** `tests/accessibility.spec.ts`

**Pattern per route:**
```ts
test('/ passes WCAG 2.1 AA', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
```

**Coverage:** One test per route (9 routes). Tests run as part of `pnpm test` and will block any future commit that introduces a WCAG AA violation.

**Known axe limitation:** Axe does not catch all violations (heading hierarchy, keyboard order, screen reader semantics require manual testing). The automated suite is a regression lock, not a replacement for the manual audit.

---

## Out of Scope

- Video/audio content (no video on the site currently)
- Third-party embeds (Cloudflare analytics beacon is async/defer and non-blocking)
- Right-to-left language support
- WCAG 2.2 (new criteria beyond 2.1 — worth revisiting if the site adds drag-and-drop interactions)

---

## Success Criteria

- [ ] Zero axe violations on all 9 routes
- [ ] Manual audit checklist passes on all pages
- [ ] `/accessibility` page live with accurate conformance claim and dated statement
- [ ] Footer link present on every page
- [ ] `/about` callout links to `/accessibility`
- [ ] `tests/accessibility.spec.ts` passes in CI
