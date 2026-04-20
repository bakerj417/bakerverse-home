# Cowork brief — Theme Engine for bakerverse-home

Copy everything between the fences below into Cowork as the initial brief. The
canonical spec is `docs/theme-engine-plan.md` in this repo; Cowork should
treat that file as the source of truth and this message as the run-rules
wrapper around it.

---

```
You are picking up an approved, scoped feature on bakerverse-home
(josephkbaker.com). The full spec — goals, phases, deliverables, token
inventory, per-phase verification steps — is at
docs/theme-engine-plan.md in the repo.

Read that file first, then execute Phases 1 through 4 in order. Do not start
Phase 5 (editor) or Phase 6 (case study) unless 1–4 are all shipped, verified
green, committed, and pushed. If anything blocks you for more than one retry
cycle, write BLOCKER.md at the repo root with what you tried, what you
observed, and what decision you'd want from Joseph — then stop. Do not ship
half-broken code.

=== Ground rules ===

- Language: TypeScript strict. No `any`. No `// @ts-ignore`. No magic values
  in components — everything flows through the Theme schema.
- Style: existing conventions in the repo (see CLAUDE.md + `.claude/rules`).
  Many small files (200–400 lines, 800 hard max), feature-scoped folders,
  kebab-case CSS classes, PascalCase components.
- Accessibility: contrast validated in the schema itself, not after the fact.
  Keyboard reachable switcher. `prefers-reduced-motion` zeroes durations.
  Announce theme changes via `aria-live="polite"`.
- Performance: initial CSS under 30KB, runtime JS under 3KB gzipped added.
- No new runtime dependencies unless absolutely required. Dev deps for
  testing (e.g. Vitest) are OK if not already present. If a runtime dep is
  required, justify it in the commit body.
- Respect existing scroll/nav behavior — do not reintroduce
  `document.body.style.overflow = 'hidden'` or any body mutation in the
  Navbar script. That was explicitly removed last session.

=== Per-phase loop ===

For each phase in docs/theme-engine-plan.md:

1. Re-read the phase section of the spec.
2. Plan concrete file edits with the `planner` agent. Keep its output in
   chat context — do not write it to disk.
3. Implement with TDD where practical (validator, toCss, store all have
   pure functions — write unit tests first in `tests/theme/*.test.ts`
   using Vitest; install Vitest if it is not already wired up).
4. Run in this order and only commit when all pass:
     a. `pnpm build`
     b. `pnpm test` (if Vitest present)
     c. `node scripts/verify-nav-open.mjs`
     d. `node scripts/verify-nav-open-while-scrolled.mjs`
     e. `node scripts/verify-nav-scroll-hide.mjs`
     f. `node scripts/verify-nav-after-route.mjs`
     g. `node scripts/probe-contact-candles.mjs`
     h. Phase-specific verify script (see spec)
5. Take screenshots per phase at both viewports (390x844 and 1440x900) for
   pages: `/`, `/about`, `/work`, `/projects`, `/contact`. Save to
   `/tmp/theme-<phase>-<page>-<viewport>.png`. After Phase 3, screenshot every
   page under every theme.
6. Run `typescript-reviewer` agent on the diff. Address CRITICAL/HIGH items.
7. Commit with conventional-commit format from the spec, push to `origin main`.
   Vercel will auto-deploy. Wait 60s, fetch the deployed URL, re-verify one
   screenshot to confirm production matches local.

=== Agent delegation ===

- `planner` — one-shot at the start of each phase for the file edit plan.
- `typescript-reviewer` — after code is written, before commit.
- `code-reviewer` — after Phase 4 completion, full-diff review across all of
  Phase 1–4.
- `a11y-architect` — after Phase 4 completion, pass the switcher through a
  WCAG 2.2 audit.

=== Outputs Joseph expects in the morning ===

- 4 commits pushed to `origin main`:
    feat(theme): extract tokens into Theme schema + diablo theme
    feat(theme): runtime engine with FOUC-safe application
    feat(theme): add arcane, infernal, celestial, terminal palettes
    feat(theme): switcher UI in navbar
- `docs/theme-engine-plan.md` unchanged (it's the spec, not a changelog).
- `docs/theme-engine-progress.md` with one section per phase, timestamps,
  what passed, what didn't, links to screenshots.
- Screenshots for every (theme × page × viewport) combination in
  `/tmp/theme-*.png`.
- If Phase 5 or 6 were touched, they must also be fully green and pushed. If
  not touched, note in progress doc.

=== Hard stops — DO NOT do any of these without human approval ===

- Install new runtime deps (dev deps for testing are OK).
- Modify `package.json` scripts beyond adding a `test` script for Vitest.
- Touch `astro.config.mjs`, `tailwind.config.*`, or `vercel.*` files.
- Touch `src/pages/api/contact.ts`.
- Force-push or amend pushed commits.
- Rewrite history.
- Disable lint rules project-wide.
- Ship a theme that fails the contrast validator — even with a TODO.
```

---

## Operator notes (not for Cowork)

- The only hands-on step after Cowork finishes: hard-refresh the phone to
  clear the service worker / CDN cache, then walk through each theme on
  /, /about, /work, /projects, /contact.
- If Cowork wrote `BLOCKER.md`, that's the first file to read.
- Progress doc is at `docs/theme-engine-progress.md`.
- Worst case rollback: each phase's commit is independent; revert the SHA.
