---
title: "Baker Family Cookbook"
tagline: "Every recipe the Baker family loves — no fluff, no life stories, just the food."
rarity: epic
year: 2026
status: upcoming
stack:
  - Astro
  - React
  - TypeScript
  - PostgreSQL
  - Vercel
featured: false
order: 7
summary: >-
  A private family recipe vault built around one obsession: getting to the
  actual recipe without reading a 1,200-word essay about someone's childhood
  first. Clean ingredient lists, step-by-step instructions, a cooking mode
  that guides you hands-free, and voice control so you can say "next step"
  with flour-covered hands. Built for the Baker family first — if it's as
  good as it should be, open to the world next.
---

## The problem with recipes on the internet

Every recipe site is broken in the same way. You search for banana bread.
You get a page that opens with a personal essay about the author's grandmother,
a photo gallery of twelve nearly-identical shots of a loaf, a sticky ad that
follows you down the page, a newsletter popup, and then — maybe — the recipe.

The Baker family has decades of recipes in PDFs, handwritten cards, bookmarked
links that 404, and "I think it was something like this" verbal traditions.
None of it is organized. None of it is searchable. None of it is easy to use
while you're actively cooking.

This is the fix.

## What it does

A private, invite-only recipe vault for the Baker family. Every recipe lives
in one place, loads instantly, and gets out of the way.

### The recipe view

No blog post. No ads. No related content sidebar. Just:

- **Ingredient list** — scalable servings with smart unit conversion
- **Instructions** — numbered, clear, nothing implicit
- **Tips** — optional, collapsed by default. The fluff toggle: if you want to
  know why you're toasting the spices first or what the original story behind
  the dish is, it's one tap away. If you don't, it never appears.
- **Cook time, prep time, difficulty, yield** — above the fold, immediately visible

### Cooking mode

Tap "Start Cooking" and the recipe becomes a guided experience:

- Full-screen, one step at a time
- Large text optimized for reading across a kitchen
- Previous / Next navigation
- Timer integration for steps that have a duration
- Screen-on lock so your phone doesn't go dark mid-step

### Voice control

Hands covered in dough, stirring something that can't be left alone, or
elbow-deep in a mixing bowl — cooking mode listens for simple commands:

- **"Next"** — advance to the next step
- **"Previous"** — go back
- **"Repeat"** — read the current step aloud via text-to-speech
- **"Timer"** — start the step's timer without touching anything

Built on the Web Speech API. No third-party dependency, no subscription,
works entirely in the browser.

### The vault

Browse by category (Breakfast, Dinner, Desserts, Baking, Sides, Drinks),
filter by time or difficulty, search by ingredient or name. Each recipe has
a rating, a "made it" count, and a notes field per family member so you can
track "add extra garlic" or "Grandma says use buttermilk."

## The roadmap

**Phase 1 — Family vault (private)**

- Recipe entry (manual + PDF import)
- Clean recipe view with fluff toggle
- Cooking mode with voice control
- Invite-only access for Baker family

**Phase 2 — Community**

- Public-facing browse for a curated subset of family-approved recipes
- Community recipe submissions — anyone can submit, Baker family vets and
  approves before anything goes live
- Ratings and comments on public recipes
- "Baker Family Picks" badge for community recipes we've made and loved

**Phase 3 — Open access**

- Optional subscription for full community recipe access
- Subscriber-only features: meal planning, grocery list generation, saved
  collections
- API for third-party integrations (smart home, recipe boxes)

## Why build instead of buy

Paprika, AnyList, and a dozen others solve the storage problem. None of them
solve the cooking experience problem — hands-free voice navigation in a
browser, family-curated community submissions, or a no-fluff-first philosophy
baked into the UI at the design level. And none of them are a Bakerverse
subdomain you can send to family with a link.

The goal is a tool the Baker family actually reaches for in the kitchen.
If it's that good, other families will want it too.
