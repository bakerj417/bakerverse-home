# Bakerverse Theme Engine — Implementation Plan

**Owner:** Joseph Baker
**Status:** Approved 2026-04-19
**Repo:** bakerverse-home

## Why

The current Diablo-gold look is hand-built against `tokens.css`. Converting it
into a themeable engine (a) lets us ship additional palettes without touching
component code, (b) becomes a publishable case study / project-page entry, and
(c) sets up a future community theme editor with submissions.

## Success criteria

- Site looks **visually identical** to pre-refactor after Phase 1 ports the
  current tokens into `themes/diablo.ts`.
- Every hard-coded color, radius, font, duration, and shadow in the codebase is
  sourced from a token — zero magic values in components.
- 4 ship-ready additional palettes (Arcane, Infernal, Celestial, Terminal).
- Theme swap is instant, persistent (`localStorage`), and FOUC-free on first
  paint.
- All existing `scripts/verify-*.mjs` tests still pass.
- Lighthouse a11y ≥95 on every theme; contrast enforced by a schema validator.
- New `/projects/theme-engine` entry with a narrative write-up and a live
  switcher embedded as the hero.

---

## Current token surface (inventory)

Source: `src/styles/tokens.css`. The engine schema must cover every one of
these.

| Group       | Tokens                                                           |
|-------------|------------------------------------------------------------------|
| Backgrounds | `--bg-void`, `--bg-night`, `--bg-dusk`, `--bg-ember`, `--bg-stone` |
| Ink         | `--ink-100`, `--ink-300`, `--ink-500`, `--ink-700`               |
| Purple      | `--purple-50`..`--purple-700`                                    |
| Gold        | `--gold-50`..`--gold-700`                                        |
| Rarity      | `--rarity-common`, `-uncommon`, `-rare`, `-epic`, `-legendary`, `-artifact` |
| Accents     | `--accent-purple`, `--accent-blood`, `--accent-arcane`           |
| Spacing     | `--space-0`..`--space-32`                                        |
| Radii       | `--radius-sharp`, `--radius-soft`, `--radius-pill`               |
| Shadow      | `--shadow-tooltip`, `-epic-glow`, `-epic-glow-strong`, `-inset-frame`, `-gold-glow`, `-gold-glow-strong` |
| Motion      | `--ease-ornate`, `--ease-bounce`, `--ease-standard`; `--dur-fast`, `-base`, `-slow`, `-page` |
| Typography  | `--font-display`, `--font-body`, `--font-mono`                   |
| Semantic    | `--color-primary` (alias → `--gold-400`)                         |

Additional hard-coded values to hunt and convert live inside
`src/styles/global.css` (rgba gold literals in `.ornate-frame`, `.btn-gold`,
`.btn-ghost`, `.stack-badge`) and per-page styles (e.g. `src/pages/contact.astro`
candle/parchment colors). Phase 1 audit must produce a full grep report.

---

## Phases

### Phase 1 — Extract & schematize

**Deliverables**

- `src/lib/theme/schema.ts` — `Theme` TypeScript type covering every token
  group above. Use nested structure, not a flat bag:
  ```ts
  type Theme = {
    meta: { id: string; name: string; author: string; mood: string;
            appearance: 'dark' | 'light'; version: string };
    palette: {
      bg: { void: string; night: string; dusk: string; ember: string; stone: string };
      ink: Record<'100'|'300'|'500'|'700', string>;
      primary: Record<'50'|'100'|'200'|'300'|'400'|'500'|'600'|'700', string>;
      secondary: Record<'50'|'100'|'200'|'300'|'400'|'500'|'600'|'700', string>;
      accents: { purple: string; blood: string; arcane: string };
      rarity: Record<'common'|'uncommon'|'rare'|'epic'|'legendary'|'artifact', string>;
    };
    typography: { display: string; body: string; mono: string };
    effects: { shadows: Record<string, string>; radii: Record<string, string> };
    motion: { eases: Record<string, string>; durations: Record<string, string> };
  };
  ```
- `src/lib/theme/themes/diablo.ts` — 1:1 port of today's tokens.
- `src/lib/theme/toCss.ts` — pure function `(Theme) => string` that emits a
  `:root` block. Variable names must match the existing `--bg-void` style so
  downstream CSS needs no changes.
- `src/lib/theme/registry.ts` — typed map of available themes.
- `src/lib/theme/validate.ts` — schema validator + WCAG AA contrast check
  between `ink.100` and `bg.night`, and accent against `bg.night`.

**Verification**

- `pnpm build` green.
- Visual regression: home, contact, projects, about at 390×844 and 1440×900 —
  pixel-diff vs pre-refactor snapshot ≤1% per screenshot.
- All `scripts/verify-*.mjs` still green.

**Commit:** `feat(theme): extract tokens into Theme schema + diablo theme`

---

### Phase 2 — Engine & runtime

**Deliverables**

- `src/lib/theme/store.ts` — vanilla subscribe/get/set singleton, framework
  independent; writes to `localStorage` under key `bakerverse.theme`.
- `src/lib/theme/apply.ts` — applies a theme by injecting/replacing a
  `<style id="bakerverse-theme">` block and setting
  `<html data-theme="…" data-appearance="dark|light">`.
- `src/lib/theme/ssr.ts` — emits the FOUC-guard inline script + initial
  `<style>` block. Inserted in `src/layouts/BaseLayout.astro` **before**
  `<ViewTransitions />` so it runs on first paint. The inline script reads
  `localStorage` and sets `data-theme` synchronously.
- `src/hooks/useTheme.ts` — React hook (for islands) backed by the store.
  Exposes `{ theme, setTheme, available }`.
- Handle Astro view transitions: re-apply on `astro:after-swap` (the `<style>`
  block may be replaced by the new page's render).

**Verification**

- First paint: no flash. Set `bakerverse.theme` to a non-default, reload, the
  first frame must already be that theme. Verified headlessly via:
  `scripts/verify-theme-fouc.mjs` that takes a screenshot at `domcontentloaded`
  and asserts the body background matches the persisted theme.
- Navigation: route to `/contact`, then back to `/`, theme must stay applied
  with no style regression.
- `prefers-reduced-motion` continues to zero out durations across themes.

**Commit:** `feat(theme): runtime engine with FOUC-safe application`

---

### Phase 3 — Additional palettes

Ship four themes. Each is a `Theme` object + a 320×180 preview swatch image in
`public/themes/`.

| id           | name        | appearance | notes                                              |
|--------------|-------------|------------|----------------------------------------------------|
| `diablo`     | Diablo      | dark       | Default. Gold primary, purple/blood/arcane accents |
| `arcane`     | Arcane      | dark       | Epic purple primary, gold as accent                |
| `infernal`   | Infernal    | dark       | Blood red primary, gold as accent, warmer bg       |
| `celestial`  | Celestial   | dark       | Arcane blue primary, gold accent, cooler bg        |
| `terminal`   | Terminal    | dark       | CRT green primary, amber accent — stretch          |

Each theme must pass the Phase 1 contrast validator before inclusion.

**Commit:** `feat(theme): add arcane, infernal, celestial, terminal palettes`

---

### Phase 4 — Theme switcher UI

- Add a compact picker to `src/components/layout/Navbar.astro` — a small
  "palette" button (icon only, aria-labelled) that opens a dropdown using the
  existing `.tooltip-card` grammar.
- Dropdown content: swatch grid (4 circles showing bg/ink/primary/accent of
  each theme), name, author initials. Active theme has ornate-frame corners
  lit.
- Keyboard: Tab-reachable, Enter/Space to open, arrow-keys to navigate, Esc
  to close. Announce change via a visually-hidden `aria-live="polite"`
  region.
- Reduced motion: swap is instant (no transition on `:root` variables in that
  mode).
- Mobile: picker collapses into the existing hamburger panel as a
  "Theme" section.

**Verification**

- New `scripts/verify-theme-switch.mjs`:
  1. Load home, assert default `data-theme="diablo"`.
  2. Open picker, tab to "Arcane", press Enter.
  3. Assert `data-theme="arcane"`, body bg changed, localStorage updated.
  4. Reload, assert Arcane persists.
  5. Reduced-motion: set matchMedia stub, swap themes, assert no transition on
     root.

**Commit:** `feat(theme): switcher UI in navbar`

---

### Phase 5 — Theme editor (STRETCH — do not start unless 1–4 are shipped and green)

- Route: `/playground/theme-editor`.
- Grouped controls: palette pickers (with contrast warnings inline), font
  selectors, numeric sliders for durations/radii.
- Live preview pane showing a sample card, button, tooltip, and a mini nav.
- Export: "Copy JSON", "Copy share link" (theme encoded base64 into URL hash
  so `?theme=…` hydrates the editor without a backend yet), "Download
  .theme.ts".
- Submission form (**scaffold only, no persistence this phase**) — captures
  name, author, "why", and serialized theme; submit button is wired but posts
  to a disabled endpoint that returns 501.

---

### Phase 6 — Case study write-up

- New MDX at `src/content/projects/theme-engine.mdx`.
- Featured on `/projects` with a bento-style hero that hosts the live picker.
- Sections:
  1. The itch — why themeable
  2. Token inventory
  3. Schema design decisions (nested vs flat, why SSR-inlined CSS beats
     CSS-in-JS for first paint)
  4. FOUC guard construction
  5. Editor demo with embedded iframe
  6. Lessons + what shipped vs deferred
- Include real screenshots from Phases 1–4 of each theme at
  390×844 and 1440×900.

---

## Guardrails

- **TypeScript strict** — no `any`, no `// @ts-ignore`.
- **No magic values** — every color/length/duration flows through `Theme`.
- **Accessibility** — contrast validated in schema; keyboard-reachable
  switcher; `prefers-reduced-motion` respected; `aria-live` announcement on
  change.
- **Performance** — initial CSS stays under the 30KB budget; the runtime adds
  ≤3KB gzipped to the JS budget.
- **Per-phase verification** — do not advance phases with failing tests.
- **Per-phase commits** — conventional-commit messages, pushed to `main` so
  Vercel auto-deploys and you can eyeball on-device.

## Rollback

Each phase's commit is independent. Revert via `git revert <sha>`. Phase 1
being a pure refactor (same visual output) means any regression is a reason to
halt and revert rather than patch forward.
