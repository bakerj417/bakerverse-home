---
title: "Bakerverse Prinfo"
tagline: "3D print inventory that knows how much PLA you have left — and what it looks like."
rarity: rare
year: 2026
status: paused
stack:
  - Next.js 15
  - TypeScript
  - Prisma
  - Neon (Postgres)
  - Auth.js v5
  - Tailwind CSS
  - Vercel
featured: false
order: 3
summary: >-
  A 3D print inventory and info app for tracking filament spools, printers, and
  tools. The design language is industrial workshop — dark, rugged, feels like
  a real tool. Each spool card shows a live color swatch pulled from the actual
  hex value and a progress bar that turns orange when stock runs low. An easter
  egg theme pays tribute to a 1994 SNES game with the right vibe: CRT scanlines,
  pixel drop shadows, zero-padded stat counters, and a teal brick wall. Prinfo
  is short for print + inventory + info.
---

## The problem with 3D print inventory

Every 3D printer owner with more than ten spools has the same problem: you know
you have PETG somewhere, you're just not sure if it's enough for this print,
and you can't remember whether that green-ish spool is "Leaf Green" or
"Matte Olive" — and the label fell off six months ago.

79 filament spools. A handful of printers. A growing collection of tools that
live in three different drawers. None of it is organized. None of it is
searchable. Prinfo is the fix.

## What it tracks

### Filament

Each spool in the system gets:

- **Type and subtype** — PETG, PLA Matte, TPU, ABS, ASA, Wood, Gradient, and
  whatever else lands in the collection
- **Color name and hex value** — the hex drives an actual color swatch in the
  UI, not a text label pretending to be one
- **Two hex values for gradients** — gradient spools render as a true
  `linear-gradient` across the swatch
- **Amount remaining** — a 0–100 percent field with a color-matched progress
  bar; at 15% or below it switches to warning orange regardless of filament color
- **Brand and notes** — optional fields for whatever else matters

79 spools were seeded from inventory on day one using a color name → hex
mapping pass. The catalog is live from the start.

### Printers and tools

Printers carry their model, status (active, idle, maintenance, retired),
firmware version, total print hours, and purchase date. Tools track type,
condition, and quantity. The overview page shows running counts for all three.

## The design language

### Garage / Rugged (default)

The visual direction is an industrial workshop. Dark backgrounds, tight
typographic hierarchy, orange as the primary accent — the color of a
warning light, a weld seam, a machine still running.

A few deliberate texture details:

- **Diagonal knurling** — repeating CSS gradient pattern on the page
  background, like diamond-plate steel
- **Heat-glow weld seam** — top edge of each panel is an orange-to-amber
  gradient with a half-pixel blur, the kind of glow you'd see on a hot
  metal edge
- **Rivet corners** on stat cards — four small dots, each positioned in a
  corner, the way industrial panels are bolted together
- **Brushed vertical lines** on stat card backgrounds — subtle, directional

It reads as a real tool, not a website.

### Tool Time Tribute (easter egg)

Accessible via a toggle in Settings or a keyboard shortcut. The alternate theme
pays homage to the visual palette of the 1994 SNES game *Home Improvement:
Power Tool Pursuit!* — no IP lifted, only the vibe.

The signature teal-cyan wall color. The brick orange platform fills. The navy
sky HUD bar. Muted CRT gold for numbers. A red blink animation on low-stock
warnings, like an arcade game about to end.

`Press Start 2P` for all type. Zero-padded stat counters (003, 007, 079).
Pixel drop shadows — `2px 2px 0 rgba(0,0,0,0.7)`, no blur. CRT scanlines from
a `repeating-linear-gradient` at 3px intervals, 12% opacity. A vignette
darkening the edges of the viewport.

Filament color swatches in this theme apply `filter: saturate(60%) brightness(85%)`
to simulate the 16-bit palette limitations of SNES hardware. The stored hex
values never change — it's pure CSS.

Theme preference lives in `localStorage` and persists across sessions.

## The sidebar

A collapsible panel, 180px wide when open, always-visible orange bookmark tab
at the panel edge. Slides in and out with `transform: translateX` and an expo
ease. The tab arrow rotates 180° when open.

The panel position — top-left, top-right, bottom-left, bottom-right — is
configurable in Settings and persisted to `localStorage`. Main content shifts
with a synchronized `padding-left` transition so nothing jumps.

## The roadmap

**Phase 1 (current):** Core inventory. Filament, printers, tools. Both themes.
Deployed to `3d.josephkbaker.com`.

**Phase 2:** Auto-reorder agent. A local cron process monitors low-stock spools
and checks for deals via a filament price API. Email notification when
something worth buying crosses a threshold.

**Phase 3:** 3D model viewer and in-browser color picker. Drag a model in,
assign filament colors from your inventory, see what it'll look like.

**Phase 4:** Bambu Studio integration. Pull print job history, track filament
actually consumed per job, compute waste against remaining spool amounts
automatically.

**Phase 5:** Multi-tenant SaaS extraction. The schema is designed for it —
a `userId` column is the only thing standing between a personal tool and
a product people can subscribe to.

## Why build instead of track in a spreadsheet

A spreadsheet doesn't show you a color swatch. It doesn't turn orange when
you're running low. It doesn't have a sidebar that slides in from a corner you
choose or a secret SNES theme you can switch on when you feel like it.

The goal is a tool that's genuinely pleasant to use, not just functional.
