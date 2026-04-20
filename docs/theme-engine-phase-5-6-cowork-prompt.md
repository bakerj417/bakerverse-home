# Cowork brief — Theme Engine Phases 5 & 6 (editor + case study)

Copy everything between the fences below into Cowork as the brief. The
canonical spec is `docs/theme-engine-plan.md`; Cowork treats that file as
source of truth and this message as the run-rules wrapper around it.

Phases 1–4 are already shipped to `origin/main` and live on
`josephkbaker.com`. The switcher works; 5 themes (diablo, arcane, infernal,
celestial, terminal) pass contrast validation; tests are in
`tests/theme/*.test.ts`. Do not touch any of that.

---

```
You are picking up the bakerverse-home theme engine at Phase 5. The full
spec is docs/theme-engine-plan.md in the repo. Read it first. Phases 1-4
are DONE and shipped to origin/main (commits b0778e5, 7a24e4a, 3e27791,
40c1ed5, 7479de0 + spec docs + lockfile). Do NOT re-implement or modify
them. Your job is Phases 5 and 6 only.

=== Ground rules (same as before) ===

- Language: TypeScript strict. No `any`. No `// @ts-ignore`. No magic
  values in components — everything flows through the Theme schema
  defined in src/lib/theme/schema.ts.
- Style: existing conventions (see CLAUDE.md + .claude/rules). Many small
  files (200-400 lines, 800 hard max), feature-scoped folders,
  kebab-case CSS classes, PascalCase components.
- Accessibility: WCAG AA contrast baked into the validator (already
  written — import assertValidTheme from src/lib/theme/validate.ts).
  Keyboard reachable. `prefers-reduced-motion` zeroes durations. Announce
  any live changes via aria-live="polite" — follow the pattern the
  switcher already uses in src/components/layout/Navbar.astro.
- Performance: initial CSS under 30KB, runtime JS under 3KB gzipped
  added per feature. The editor page is allowed extra JS since it is its
  own route; keep the public site budget intact.
- NEVER reintroduce `document.body.style.overflow = 'hidden'` anywhere
  in the repo. It was explicitly removed last session and the switcher
  must not bring it back. The editor must not bring it back either.
- Respect existing scroll/nav behavior. Do not mutate body styles.
- No new runtime dependencies unless absolutely required. Dev deps are
  already wired up (vitest pinned to ^2, playwright already installed).
  If a runtime dep is required, justify in the commit body.

=== Hard stops (same as before) — DO NOT without human approval ===

- Install new runtime deps.
- Modify astro.config.mjs, tailwind.config.*, vercel.* files.
- Touch src/pages/api/contact.ts.
- Force-push or amend pushed commits. Never rewrite history.
- Disable lint rules project-wide.
- Ship a theme that fails the contrast validator — even with a TODO.
- Modify any Phase 1-4 file in src/lib/theme/*, src/hooks/useTheme.ts,
  src/components/layout/Navbar.astro (theme picker sections), or
  src/layouts/BaseLayout.astro (FOUC guard). If you genuinely need to
  change one of these to support Phases 5/6, STOP and write
  BLOCKER.md explaining why.

=== Per-phase loop ===

For each of Phase 5 and Phase 6:

1. Re-read the phase section of docs/theme-engine-plan.md.
2. Plan concrete file edits with the `planner` agent. Keep its output
   in chat context — do not write it to disk.
3. Implement with TDD where practical. Any new pure function
   (encode/decode base64 theme, validate submission payload, etc.) gets
   a vitest test in tests/theme/ first. Run `pnpm test` to confirm.
4. Run in this order and only commit when all pass:
     a. `pnpm build`
     b. `pnpm test`
     c. `node scripts/verify-nav-open.mjs`
     d. `node scripts/verify-nav-open-while-scrolled.mjs`
     e. `node scripts/verify-nav-scroll-hide.mjs`
     f. `node scripts/verify-nav-after-route.mjs`
     g. `node scripts/probe-contact-candles.mjs`
     h. `node scripts/verify-theme-switch.mjs` (still must pass — do
        not regress the Phase 4 switcher)
     i. Phase-specific verify script (see below)
5. Take screenshots per phase at both viewports (390x844 and 1440x900).
   Save to /tmp/theme-phase<n>-<page>-<viewport>.png.
6. Run `typescript-reviewer` agent on the diff. Address CRITICAL/HIGH.
7. Commit with conventional-commit format (see below), push to
   `origin main`. Vercel auto-deploys. Wait 60-90s, fetch the deployed
   URL, re-verify one screenshot to confirm production matches local.

=== Phase 5 — Theme editor ===

Route: /playground/theme-editor (Astro page + React island for the
editor shell).

Deliverables:

- src/pages/playground/theme-editor.astro — wraps the React island in
  BaseLayout. Thin page.
- src/components/theme-editor/ThemeEditor.tsx — top-level island.
  Manages current-theme-being-edited state (start with a clone of
  diablo or whatever the hash contains).
- src/components/theme-editor/ControlsPanel.tsx — grouped controls:
    * Palette pickers (bg, ink, primary 50-700, secondary 50-700,
      accents, rarity). Use native <input type="color"> for now —
      no color-picker library.
    * Font selectors (display, body, mono) — <select> backed by a small
      typed list of supported font stacks.
    * Sliders for duration values (fast, base, slow, page) and for
      numeric radii. Min/max/step chosen from the spec + existing
      Diablo values.
- src/components/theme-editor/PreviewPane.tsx — renders:
    * Sample card using .ornate-frame
    * Primary button and ghost button
    * A tooltip-card with a rarity bar
    * A mini nav bar stub (NOT the real Navbar — a dumb mock)
- src/components/theme-editor/ContrastWarnings.tsx — shows inline
  warnings when palette.ink["100"] vs palette.bg.night (or accents vs
  bg) fall below WCAG AA. Import validateTheme and render its errors.
- src/lib/theme/editor/encode.ts — pure functions:
    `encodeThemeToHash(theme: Theme): string` — base64-url-encoded JSON
    `decodeThemeFromHash(hash: string): Theme | null` — returns null on
    malformed input; caller shows an error toast.
    Vitest tests in tests/theme/encode.test.ts.
- src/lib/theme/editor/serialize.ts — emits a valid .theme.ts file
  string given a Theme (round-trip: produces a module that exports
  the same Theme object). Tests in tests/theme/serialize.test.ts.
- src/components/theme-editor/ExportActions.tsx — Copy JSON, Copy
  share link, Download .theme.ts.
- src/components/theme-editor/SubmissionForm.tsx — name, author,
  "why", serialized theme preview. Submit button posts to
  `/api/themes/submit` which returns 501 with a friendly message.
- src/pages/api/themes/submit.ts — always returns 501 with
  { status: "disabled", message: "Submissions not open yet" }.
  This scaffold must not write to disk, env, or any external service.

URL hash behavior:

- On mount, if window.location.hash starts with "#t=", decode the
  remainder and use it as the initial theme.
- When the user edits, update the hash (no history entries — use
  history.replaceState) so the URL is always shareable.

Accessibility:

- Every slider, color input, and select has a proper <label>.
- ContrastWarnings uses role="status" and aria-live="polite".
- Full keyboard traversal. Tab order matches visual order.
- prefers-reduced-motion kills preview transitions.

Verification:

- scripts/verify-theme-editor.mjs (new):
    1. Load /playground/theme-editor, assert the editor renders with
       all three control groups.
    2. Change a palette color via the DOM, assert PreviewPane updates
       and hash updates.
    3. Reload with a hash (#t=<encoded>), assert editor hydrates from
       it.
    4. Click "Copy share link" — assert navigator.clipboard.writeText
       was called with a URL containing #t=.
    5. Submit the form — assert the endpoint returned 501 and the UI
       shows the disabled message.
    6. Inject an invalid palette (ink vs bg < AA) and assert
       ContrastWarnings renders an error.
- Unit tests (vitest) for encodeThemeToHash round-trip,
  decodeThemeFromHash on malformed input, serialize output
  compiles, validateTheme still green.

Commit: `feat(theme): Phase 5 — theme editor at /playground/theme-editor`

=== Phase 6 — Case study ===

Deliverables:

- src/content/projects/theme-engine.mdx — full write-up per the spec
  section 6 (the itch, token inventory, schema design, FOUC guard,
  editor demo, lessons). This must pass `astro check` (the content
  collection schema already enforces frontmatter shape — see
  src/content/config.ts).
- If /projects/[slug].astro already renders MDX content, nothing else
  is needed for the individual page. If not, minimal updates to that
  template to render MDX output (but do not invent new frontmatter
  fields — reuse existing schema).
- /projects/index.astro — feature theme-engine in the bento hero slot.
  Look for the existing "featured" pattern (there is one in the current
  layout — grep for `featured` in src/pages/projects/index.astro) and
  slot theme-engine into it. The hero bento should embed the live
  switcher — import and mount a small React island that shows the
  four swatches and clicking one actually swaps the site's theme
  (reuses the existing store).
- Screenshots under public/case-studies/theme-engine/<theme>-<viewport>.png
  for each theme × (390x844, 1440x900). Do NOT commit them to /tmp;
  these are hero-worthy assets.
- MDX references those screenshots with proper <Image> tags with
  explicit width/height to prevent CLS.

Verification:

- scripts/verify-case-study.mjs (new):
    1. Load /projects, assert "theme-engine" card is in the hero slot
       and visible.
    2. Load /projects/theme-engine, assert each section heading from
       the MDX is present.
    3. Assert no console errors on either page.
    4. Screenshot both pages at 390x844 and 1440x900.

Commit: `feat(theme): Phase 6 — theme engine case study + projects feature`

=== Agent delegation ===

- `planner` — one-shot at the start of each phase for the file edit plan.
- `typescript-reviewer` — after code is written, before commit.
- `a11y-architect` — after Phase 5 (editor has the most a11y surface).
- `code-reviewer` — after Phase 6, full-diff review across Phase 5-6.

If Opus 4.7, drop `planner` — Opus is the deep-reasoning model, sub-
planning is redundant.

=== Outputs expected in the morning ===

- 2 commits pushed to `origin main`:
    feat(theme): Phase 5 — theme editor at /playground/theme-editor
    feat(theme): Phase 6 — theme engine case study + projects feature
- docs/theme-engine-progress.md updated with Phase 5 and Phase 6
  sections (timestamps, what passed, screenshot paths).
- Screenshots for editor under /tmp/theme-phase5-*.png.
- Screenshots for case study under
  public/case-studies/theme-engine/*.png (these are user-facing).
- Submission endpoint returns 501 — verified.
- No regression on the existing switcher or contact flow.

If anything blocks you for more than one retry cycle, write BLOCKER.md
at the repo root with what you tried, what you observed, and what
decision you'd want from Joseph — then stop. Do not ship half-broken
code.
```

---

## Operator notes (not for Cowork)

- Cowork runs on Linux; reinstall `node_modules` locally when you pull
  (macOS rollup native binary, same as last time).
- Verify in the morning: `/playground/theme-editor` loads, palette edit
  updates URL hash, reload from hash rehydrates, "Download .theme.ts"
  downloads a file that round-trips through the validator.
- If the editor looks too busy, Phase 5.5 (not specced) could split
  palette/typography/motion into tabs — hold that for your call.
- Case study hero swatch clicks should actually swap the site theme —
  verifies the engine works end-to-end from the projects page.
- If Cowork writes BLOCKER.md, read that first.
