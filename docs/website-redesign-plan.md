# josephkbaker.com — Redesign Plan v1

**Owner:** Joseph Baker
**Date:** April 18, 2026
**Goal:** Rebuild josephkbaker.com as the visually distinctive hub of the Bakerverse — gamified in aesthetic, interview-ready in polish, engineered as a flagship side project.

---

## 1. Vision

The site has three jobs, in order of priority:

1. **Win the 10-second scan.** A recruiter, hiring manager, or freelance lead lands on it, and within 10 seconds they know who you are, what you do, and that you have taste. If this fails, nothing else matters.
2. **Be memorable.** Senior roles and freelance work are often won on "I remember that guy's site" — the gamified Bakerverse theme is the differentiator.
3. **Act as the Bakerverse hub.** Today it hosts a gateway page pointing at the subdomains you're building; long-term it hands that role off to `bakerverse.josephkbaker.com` and refocuses purely on *you*.

The tension to manage: gamified theming is a *hook*, not a crutch. Every flourish has to survive a recruiter who has never heard of Azeroth. Execution principle below.

---

## 2. Design direction — "Bakerverse UI, readable by muggles"

Treat the game metaphor as a visual language layered *on top* of a clean, professional content structure. Metaphor lives in the chrome, typography, micro-interactions, and iconography. Content stays plain-English.

**Signature visual elements**

- **Palette:** Deep navy/black base with a single warm accent (think Diablo "loot gold" or WoW "epic purple" — pick one lane, don't mix). A second muted accent for secondary UI. Avoid stock portfolio blue.
- **Typography:** A humanist sans for body (Inter, Geist, or similar), paired with a display face with character for headings (Cinzel, Eczar, IM Fell, or a custom ornate cut). One monospace for code snippets and "stat block" numerals.
- **Tooltip / item-card UI:** Project cards, skill tags, and experience entries borrow the visual grammar of MMO item tooltips — framed borders, rarity-colored headers, stat rows. A recruiter reads them as "well-designed info cards." A gamer reads them as "oh."
- **Cursor + hover physics:** Subtle magnetic hover on CTAs, particle trails on primary buttons, cursor-reactive glow on interactive elements. Nothing that hijacks scrolling.
- **Ornate framing:** Section dividers and page borders as light filigree SVGs rather than flat rules. Cheap way to telegraph craft.
- **Dark-mode first** (with a working light mode). Gamified theme reads better dark; respect `prefers-color-scheme`.

**Animation rules (non-negotiable)**

- Every motion must serve hierarchy or delight, never decoration for its own sake.
- `prefers-reduced-motion` is respected everywhere.
- Scroll-linked animation for storytelling on About/Work; page-level transitions between routes; idle animation on hero only.
- Target 60fps on a mid-range laptop. If an effect drops frames, it gets cut.
- Keep total page weight under 400KB on initial load (hero can be heavier, sub-pages must be lean).

---

## 3. Information architecture

```
/                  Home — hero + highlights + Bakerverse teaser
/about             Story, philosophy, the "character sheet"
/work              Professional experience as a quest log / timeline
/projects          Showcase index (curated grid)
/projects/[slug]   Individual case studies
/bakerverse        Gateway to sub-domains and services (map-style)
/uses              Gear, dev setup, NAS + media stack, game rigs
/now               What you're working on right now
/contact           Email, socials, Baker Software Solutions CTA
```

No `/blog` in v1. Leave the route free to add later once you've written 3–4 posts worth reading.

---

## 4. Page-by-page concept

### `/` Home
Full-viewport hero with animated canvas or WebGL backdrop — restrained, not a screensaver. Headline is short and opinionated ("Joseph Baker. Full-stack engineer building the Bakerverse."). Below the fold: three scroll-revealed sections — a marquee project, a compact skill stat-block, and a "enter the Bakerverse" teaser that links to `/bakerverse`. Closes with a single CTA (resume download or contact).

### `/about` — "Character sheet"
Narrative-first, not bio-first. Open with a personal story of *why* you build (automation-for-life, passive income arc, family tools motivation — the real reason, not LinkedIn-speak). Mid-page: a stylized "character sheet" — class, specialization, primary stack, levels of experience, guild (Baker Software Solutions). Close with the resume download and a link to `/contact`.

### `/work` — "Quest log"
Vertical timeline styled as a quest log. Each entry is a tooltip-styled card with role, company, dates, stack badges, and 2–3 outcomes (not responsibilities — outcomes). Completed quests are marked as such. Current role is highlighted as "active." Keep it skimmable; recruiters land here most.

### `/projects`
Curated grid of 6–9 project tiles. Each tile is an "item card" with rarity-tiered border (your judgment on which projects are your legendaries). Clicking opens a case-study page.

### `/projects/[slug]`
Structured: the problem, the approach, the stack, the outcome, what you'd do differently. Screenshots/video inline. Link to repo or live demo. This is the senior-level storytelling surface.

### `/bakerverse` — Map view
Isometric or node-graph style map of subdomains/services. Each node is a tooltip-styled card: name, one-line description, status (live / in-development / planned), and link. Status badges matter — recruiters find this impressive *because* it shows work in motion. Current nodes: personal site (this), future NAS media stack front-end, family tools, automation dashboards.

### `/uses`
Conventional `/uses` page structure: hardware (NAS, desktop, laptop, peripherals), software (editor, browser, terminal), services (hosting, DNS, monitoring). Two gamified sections: "Home server kit" (the Ugreen NAS + media automation stack as a tech tree) and "Battle stations" (gaming setup). This page is underrated for interview conversation starters.

### `/now`
Single-column, last-updated timestamp prominent. Three sections: building, learning, playing. Commit to updating monthly. If you won't, cut the page.

### `/contact`
Three options: email, a "hire me via Baker Software Solutions" CTA, and socials. No form in v1 — mail-to link is fine. A form is a feature to add later.

---

## 5. Tech stack recommendation

You chose a different framework entirely. My recommendation: **Astro 5 + React islands + Tailwind 4 + Motion**.

Why Astro specifically:

- Zero-JS by default — most of the site is static content, and Astro ships only the JS for the interactive islands. Your Lighthouse scores will be excellent out of the box, which matters for a site you're linking from a resume.
- Islands architecture lets you drop React (or Svelte, Vue, Solid) components anywhere a page needs interactivity. The hero canvas, the Bakerverse map, project tooltips — all React islands. Everything else stays HTML.
- Content collections with type-safe frontmatter — perfect for `/projects/[slug]` case studies and `/now` entries. MDX support if you want rich content.
- View transitions API support is built in — smooth cross-page animation without a SPA.
- You already know React, so the islands don't slow you down; Astro syntax is a weekend to pick up.

**Full stack:**

- Astro 5 (SSG, deployed to Vercel or Cloudflare Pages)
- React 19 for interactive islands
- Tailwind 4 for styling
- Motion (the new name for Framer Motion) for React-island animation
- GSAP + ScrollTrigger for the more ambitious scroll-linked sequences
- Three.js or OGL for the hero WebGL backdrop (OGL is lighter; pick based on how far you push the visuals)
- MDX for case studies and `/now` entries
- TypeScript everywhere, strict mode
- Bun or pnpm for package management
- Biome or Prettier + ESLint

**Alternative if you'd rather go full-new-framework:** SvelteKit. Animation story is lovely (svelte/motion, svelte/transition), DX is tight, smaller bundle than React. Downside: you'd learn a new component model at the same time you're building a portfolio-grade project. I'd only go this way if learning Svelte is explicitly part of the goal.

---

## 6. Animation & interaction strategy

Layered approach, from cheapest to most expensive:

1. **CSS-only:** Every hover, focus, and simple reveal. Transform + opacity only. This is 80% of the motion on the site.
2. **Motion (Framer):** React-island transitions — modal opens, project card expansions, tooltip entrances.
3. **GSAP + ScrollTrigger:** Scroll-linked storytelling on `/about` and `/work`. Pinned sections, staggered reveals, horizontal scroll sections if any.
4. **WebGL (Three.js / OGL):** Hero backdrop only, behind a `<noscript>` fallback. One canvas, cleaned up on route change.

Shared interaction patterns:

- Magnetic hover on primary CTAs.
- Cursor aura that shifts opacity by element type (dimmer over text, brighter over interactive).
- Page transition: radial wipe using the accent color, ~400ms.
- Tooltip animations mimic MMO item tooltips — quick fade-up with a slight overshoot.

---

## 7. Phasing

**Phase 0 — Foundation (est. 1 weekend)**
Stand up the new Astro project in a new repo or subfolder. Decide the fate of the existing `nextjs-portfolio` repo (archive or replace in place). Configure Vercel deploy, domain, analytics. Land a design tokens file (colors, type scale, spacing, shadow, easing, timing). Port your profile image and headshot. Set up the folder structure for the 8 pages above, each with a placeholder.

**Phase 1 — Interview-ready core (est. 2–3 weekends)**
Build Home, About, Work, Projects index, Contact. Ship with:

- Final typography and palette
- Hero animation v1 (can be canvas-based, doesn't have to be WebGL yet)
- Fully populated Work timeline
- 4–6 real projects in the index (no case studies yet — tiles link out to repos)
- Resume download wired up
- Lighthouse ≥ 95 on all four categories
- OG image + meta tags

At the end of this phase the site is linkable in a job application.

**Phase 2 — Bakerverse + depth (est. 2 weekends)**
Add `/bakerverse`, `/uses`, `/now`. Flesh out 2–3 case-study pages under `/projects/[slug]`. Upgrade hero to the real WebGL/canvas vision. Add page-transition animations.

**Phase 3 — Polish + measurement (ongoing)**
Add analytics (Plausible or Vercel), error tracking, a dark/light toggle, more case studies as you build projects. Start capturing what hiring managers click on and iterate.

---

## 8. Open questions to resolve before Phase 0

- **Repo strategy:** archive `nextjs-portfolio` and start fresh, or build Astro in a new branch and switch the domain over when ready? (Recommendation: new repo, archive the old. Cleaner git history, no framework ghosts.)
- **Accent color lock-in:** Diablo gold or WoW epic purple or something else entirely? This decision gates the design tokens file.
- **Display typeface:** Are we going ornate (Cinzel / Eczar) or restrained-with-character (IM Fell, Redaction)? Ornate reads more "MMO," restrained reads more "editorial with personality."
- **Bakerverse node status:** Which subdomains are we listing in v1? Need a list of "live / building / planned" to populate the map, even if most are placeholders.
- **Resume:** The current resume link is a Google Drive URL with Facebook tracking params. Swap for a clean PDF hosted on the site or in a stable Drive link before launch.

---

## 9. What I need from you to start

Before writing a line of code I want three things:

1. Decisions on the four open questions above.
2. The list of projects you want to feature (titles + a one-sentence description each). I'll handle structure and copy.
3. Confirmation on the tech stack (Astro + React islands as recommended, or pivot to SvelteKit).

Once those land, Phase 0 is a weekend of setup and we're in Phase 1.
