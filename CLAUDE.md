# bakerverse-home — Project Context

Joseph Baker's personal site. josephkbaker.com.

## Who I am
Full-stack engineer, 15+ years. Current focus: React Native + Expo + Design Systems. Side business: Baker Software Solutions (freelance). Building toward passive income / early retirement.

## What this project is
josephkbaker.com is the public-facing landing page for everything I build. Two audiences:
1. **Hiring managers / freelance leads** — needs to read as polished, credible, senior-engineer-with-taste
2. **Bakerverse explorers** — gateway to subdomains (family tools, media stack, automation dashboards)

## Bakerverse repo pattern
All repos are named `bakerverse-[service]`. This repo is `bakerverse-home` — the `josephkbaker.com` site.

## Tech stack
- Astro 4 (targeting upgrade to Astro 5 when stable)
- React 18 islands (targeting React 19)
- Tailwind 3 (targeting Tailwind 4)
- Framer Motion 11 (now called "Motion")
- GSAP 3 + ScrollTrigger
- TypeScript strict mode
- pnpm

## Design system — LOCKED DECISIONS
- **Primary accent:** Diablo loot gold `#F0B90B` / `#D99E0B`
- **Available secondary accents (pull when the moment calls for it):**
  - Epic purple `#A335EE` — arcane / hero moments
  - Diablo blood red `#8B0000` — danger / destruction moments
  - Arcane blue `#5B8CFF` — tech / utility moments
- **Rarity palette:** common `#CFCFCF`, uncommon `#1EFF00`, rare `#0070DD`, epic `#A335EE`, legendary `#FF8000`, artifact `#E6CC80`
- **Display font:** Cinzel (ornate). Accessibility fallback: Inter. One CSS variable swap to toggle.
- **Body font:** Inter
- **Mono font:** JetBrains Mono
- **Theme:** Dark-mode first, gamified MMO aesthetic ("Bakerverse UI, readable by muggles"). Item tooltip UI grammar for cards.
- **Animation rules:** prefers-reduced-motion respected, 60fps target, <400KB initial load

## Current state
> Canonical progress tracker: the `project_current_status.md` auto-memory. This paragraph is a coarse snapshot — trust the memory file for anything current.

Phase 0 done (scaffold, tokens.css with Diablo gold + secondaries, base components, islands, content collections). Phase 1 in progress — `/`, `/about`, `/work`, `/projects` all have real structure; remaining Phase 1 work is content fill-in (placeholder MDs in `src/content/projects` and `src/content/work`, About's narrative TODO, `site.ts` resume URL + stats) plus building `/contact`.

## Phase plan (see full plan in .auto-memory/project_bakerverse_redesign_plan.md)
- **Phase 0**: Foundation — tokens, scaffold, Vercel config
- **Phase 1**: Interview-ready core — Home, About, Work, Projects, Contact
- **Phase 2**: Bakerverse + depth — /bakerverse map, /uses, /now, case studies
- **Phase 3**: Polish + analytics

## Coding preferences
- Always use TypeScript, never plain JS
- Prefer Astro components for static content, React islands only when interactivity is needed
- CSS custom properties (tokens.css) over hardcoded values
- No magic numbers — use spacing/timing tokens
- Accessible by default (aria labels, reduced motion, keyboard nav)
