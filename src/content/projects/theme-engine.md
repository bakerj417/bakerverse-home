---
title: "Bakerverse Theme Engine"
tagline: "Runtime design-system theming: 5 themes, WCAG AA validated, zero flash."
rarity: epic
year: 2026
status: shipped
stack:
  - TypeScript
  - Astro 4
  - React 18
  - CSS Custom Properties
  - Vitest
featured: true
order: 2
summary: >-
  Designed and shipped a full design-system theming layer for josephkbaker.com
  from scratch — schema-first, WCAG AA validated at build time, zero flash of
  unstyled content on every route. Five themes ship as TypeScript modules;
  a live visual editor lets anyone create and share custom themes via a URL
  hash with no backend.
---

## The problem

A personal site that switches between five distinct visual themes — Diablo,
Arcane, Infernal, Celestial, Terminal — sounds straightforward until you factor
in three hard constraints: **no flash of unstyled content** (FOUC) on any page
load or client-side route transition, **WCAG AA contrast** enforced at build
time rather than remembered at commit time, and **zero new runtime dependencies**
beyond what the stack already ships.

Naive solutions break on at least one. Using only Tailwind utility classes
forces re-rendering everything on switch. A CSS `data-theme` attribute on
`<html>` solves the FOUC problem on initial load but not on Astro View
Transitions (which replay the `<head>` hydration). Custom properties in a
`<style>` tag work everywhere, but validating contrast automatically requires
a build-time hook that doesn't exist out of the box.

## The approach

I designed the engine as six composable layers with a strict dependency order.
Each layer owns exactly one concern and exposes a narrow public API.

### Layer 1 — Schema (`schema.ts`)

A single TypeScript `type Theme` definition covers every visual token: five
background stops, a four-step ink scale, an eight-step primary palette (mapped
to `--gold-*`), a secondary palette (`--purple-*`), accent moments, and the
full WoW rarity colour scale. Having a strict schema meant TypeScript caught
incomplete themes at compile time before any runtime code ran.

### Layer 2 — Validation (`validate.ts`)

`validateTheme()` runs two passes: a structural check (every field is a
non-empty string, every colour is a valid six-digit hex) and a WCAG AA contrast
check (`ink.100` on `bg.night` must be ≥ 4.5:1; primary-400 and secondary-400
on `bg.night` must be ≥ 3:1 for UI elements). `assertValidTheme()` wraps this
with a throw so the registry module crashes at import time if a broken theme
ships — no CI step required, the build fails loudly.

### Layer 3 — CSS emission (`toCss.ts`)

`toCss(theme)` emits a `:root { ... }` block with every custom property, plus
`-rgb` channel variants for composing `rgba()` values. It also emits a
`@media (prefers-reduced-motion: reduce)` override that zeroes all durations.
This function is pure — same input, same output — making it trivially testable.

### Layer 4 — FOUC guard (`ssr.ts` + inline script)

The guard runs before any stylesheet. It reads `localStorage.bakerverse.theme`,
resolves the right theme, and injects a `<style id="bakerverse-theme">` tag
into `<head>` before the browser's first paint. Astro's `set:html` renders this
as an inline `<script>` block — no external file, no render-blocking request.
The same guard is replayed on every View Transition via Astro's
`astro:before-swap` event listener to prevent the transition from reverting to
default colours.

### Layer 5 — Store & Apply (`store.ts` + `apply.ts`)

The store is a plain singleton that wraps `localStorage` reads/writes with
a pub-sub notifier. `applyTheme(id)` looks up the theme, calls `toCss()`,
and swaps the `<style id="bakerverse-theme">` content — a single DOM write that
triggers exactly one style recalculation. The `useTheme` React hook subscribes
to store updates and drives the Navbar switcher UI.

### Layer 6 — Editor (`encode.ts` + `serialize.ts`)

`encodeThemeToHash` and `decodeThemeFromHash` convert a `Theme` object to and
from a URL-safe base64 string using the `encodeURIComponent`-then-`btoa` pattern
to safely handle any non-ASCII characters in metadata strings. Share links are
fully self-describing — pasting the URL into a fresh browser session restores
the exact theme.

`serializeTheme` emits a valid TypeScript module string (importable,
fully typed, JSDoc header) ready to drop into the themes directory. The file
name is derived from `theme.meta.id` with non-alphanumeric characters
sanitised out.

## The stack choices

**Astro 4 hybrid output** was already the site adapter; using its `set:html`
directive for the FOUC guard avoided any additional framework complexity.
Astro's View Transitions integration was the trickiest piece — the guard had to
re-run on `astro:before-swap` because View Transitions replay `<head>` hydration
in a way that wipes inline style content.

**CSS custom properties** were the obvious carrier for runtime token swaps.
The key insight was that the property *names* (`--gold-400`, `--bg-night`)
never change between themes — only the *values* do. This means every component
stays untouched; only the `:root` block swaps. No component code was modified
during the entire theming implementation.

**TypeScript strict mode** throughout. No `any`, no `// @ts-ignore`. The
schema type propagates all the way from theme definition to the editor UI, so
a missing property is a compile error before it ever reaches the browser.

**Vitest** for the pure utility functions. The encode/decode round-trip tests
and the serialize tests give confidence that share links and exported files
are always valid. Running `pnpm test` takes under two seconds.

## Five themes, one site

Every screenshot below is the same `/` hero rendered under a different
theme — zero component code changes, only the `:root` custom-property
values swap.

### Diablo — the default

![Diablo theme — desktop](/images/themes/diablo-desktop.webp)
![Diablo theme — mobile](/images/themes/diablo-mobile.webp)

### Arcane — starlight spellwork

![Arcane theme — desktop](/images/themes/arcane-desktop.webp)
![Arcane theme — mobile](/images/themes/arcane-mobile.webp)

### Infernal — hellfire ember

![Infernal theme — desktop](/images/themes/infernal-desktop.webp)
![Infernal theme — mobile](/images/themes/infernal-mobile.webp)

### Celestial — moonlit vault

![Celestial theme — desktop](/images/themes/celestial-desktop.webp)
![Celestial theme — mobile](/images/themes/celestial-mobile.webp)

### Terminal — hacker green

![Terminal theme — desktop](/images/themes/terminal-desktop.webp)
![Terminal theme — mobile](/images/themes/terminal-mobile.webp)

## The outcome

Five fully distinct visual identities ship on josephkbaker.com with:

- **Zero FOUC** on hard reload, back/forward navigation, and View Transition
  routes across all five themes.
- **WCAG AA contrast** enforced at build time — a theme with insufficient
  contrast ratio fails `pnpm build` with a clear error message.
- **Live theme editor** at `/playground/theme-editor` where anyone can fork
  a base theme, tweak every token, preview in real time with contrast
  validation feedback, and share via a URL hash or download a TypeScript
  source file.
- **No new runtime dependencies** — the entire engine is ~600 lines of
  TypeScript using only Node built-ins and the project's existing stack.

The pattern — schema → validation → CSS emission → FOUC guard → store/apply —
is reusable and decoupled enough that any Astro project could adopt it by
swapping the theme definitions.
