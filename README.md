# bakerverse

Joseph Baker's personal site — the hub of the Bakerverse (`josephkbaker.com`).

Built with [Astro](https://astro.build) + React islands + Tailwind CSS. Gamified visual language (MMO/RPG tooltips, quest logs, rarity tiers) on a modern type-forward base.

## Quick start

```bash
npm install
cp .env.example .env.local    # then fill in real values (see below)
npm run dev
```

The dev server runs at http://localhost:4321.

## Environment variables

The contact form (`/contact` → `POST /api/contact`) needs four secrets at
runtime. They're loaded from `.env.local` locally and from Vercel's project
settings in production. Never commit `.env.local` — it's in `.gitignore`.

| Variable                     | Where to get it                                       | Notes                          |
|------------------------------|-------------------------------------------------------|--------------------------------|
| `RESEND_API_KEY`             | [resend.com/api-keys](https://resend.com/api-keys)    | Starts with `re_`              |
| `CONTACT_TO_EMAIL`           | The address that receives form submissions            | e.g. `you@example.com`         |
| `PUBLIC_TURNSTILE_SITE_KEY`  | [dash.cloudflare.com](https://dash.cloudflare.com) → Turnstile | `PUBLIC_` = exposed to browser |
| `TURNSTILE_SECRET_KEY`       | Same Turnstile site, secret field                     | Server-only                    |

### New machine setup

```bash
git clone git@github.com:bakerj417/bakerverse-home.git
cd bakerverse-home
npm install
cp .env.example .env.local

# Option A — pull the vars straight from Vercel (fastest, needs `vercel` CLI):
npx vercel link                        # link repo to the Vercel project
npx vercel env pull .env.local         # pulls all four vars from prod

# Option B — paste values by hand:
#   1. Open Vercel → Project → Settings → Environment Variables
#   2. Copy each of the four keys into .env.local

npm run dev
```

### Production (Vercel)

Set the same four vars at **Vercel → Project → Settings → Environment
Variables**. `@astrojs/vercel` is already wired in `astro.config.mjs`, so
every push deploys serverless API routes automatically.

## Project structure

```
.
├── public/               static assets (favicons, images, fonts)
├── src/
│   ├── components/
│   │   ├── layout/       navbar, footer, cursor overlay
│   │   ├── ui/           tooltip card, skill badge, ornate frame, etc.
│   │   ├── sections/     composed page sections
│   │   └── islands/      interactive React components
│   ├── content/          Astro content collections (projects, work)
│   ├── data/             site-wide data (nav links, socials, etc.)
│   ├── layouts/          BaseLayout
│   ├── pages/            file-based routing
│   └── styles/           global CSS + design tokens
├── docs/                 design docs and plans
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## Design language

Palette: Diablo loot gold (`#F0B90B` / `#D99E0B`) on deep navy-black (`#07060a` → `#15131d`). Warm cream parchment for text. Secondary accents available to pull: epic purple `#A335EE`, Diablo blood red `#8B0000`, arcane blue `#5B8CFF`. Rarity tier palette mirrors MMO conventions (common grey → legendary orange → artifact tan).

Typography: Cinzel for display (headings), Inter for body, JetBrains Mono for code. All self-hosted from `/public/fonts` (see `src/styles/global.css`).

Motion: Astro View Transitions for route changes; Framer Motion for React-island reveals; GSAP + ScrollTrigger reserved for scroll-linked storytelling sections. `prefers-reduced-motion` respected everywhere.

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build
- `npm run check` — type-check Astro files

## Content TODOs

Placeholder content is marked with `TODO:` comments in the relevant files. See `docs/morning-checklist.md` for the full list of what needs real data before launch.

## License

© 2026 Joseph Baker / Baker Software Solutions. All rights reserved.
