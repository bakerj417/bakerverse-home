---
title: "Bakerverse UI"
tagline: "A component library forged from josephkbaker.com — themeable, gamified, portable."
rarity: rare
year: 2026
status: upcoming
stack:
  - TypeScript
  - React 18
  - Astro 4
  - CSS Custom Properties
featured: false
order: 10
summary: >-
  The next quest — extract the components built for josephkbaker.com into a
  reusable library that ships alongside the Bakerverse Theme Engine. Internal
  workspace package first (shared across bakerverse-* repos), then a
  fork-friendly public repo. No semver promises, no roadmap — just a polished
  reference you can lift into your own Astro or React project.
---

## What's coming

The site you're reading is built from a small kit of components — tooltip
cards, ornate frames, stack badges, reveal-on-scroll islands, a magnetic
button, the mobile nav scroll, the adventure log, the quest grid. Paired with
the theme engine, they're distinct enough to be worth extracting.

## The plan

1. **Internal workspace package** — `@bakerverse/ui` inside a pnpm workspace,
   consumed by every `bakerverse-*` repo. This is where the reuse pays off first.
2. **Public repo** — fork-friendly, documented, no roadmap. Use it, lift from
   it, learn from it. Issues welcome but no guarantees.
3. **Theme engine as the headliner** — the components are nice, but the real
   selling point is "drop in your own theme and the whole kit repaints."

## Why not a published package

Published = semver, breaking-change pain, issue triage, docs site
maintenance. As a solo builder, that's a commitment that outweighs the
payoff. Fork-friendly public repo + internal workspace package gets 90% of
the value for 10% of the cost.
