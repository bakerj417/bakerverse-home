---
title: "Family Bounty Board"
tagline: "Chores as an adventurers' guild — quests, ranks, gold, and a market the kids actually want to shop in."
liveUrl: "https://bounty.josephkbaker.com"
rarity: epic
year: 2026
status: active
stack:
  - Next.js 16
  - React 19
  - TypeScript
  - Tailwind 4
  - shadcn/ui
  - Neon (Postgres)
  - Drizzle
  - Clerk
  - Sentry
  - Vitest
  - Playwright
  - Vercel
featured: true
order: 1
summary: >-
  A family chore system dressed as an adventurers' guild. Parents post ranked
  quests, kids accept them, submit their work, and earn gold and XP once a
  parent approves. Gold is spent in a parent-stocked market and fulfilled in
  real life. Rank gating, party quests, pixel-art avatars, and PIN profiles
  for kids who don't have email addresses.
---

## The problem with chore charts

A fridge chart works for about a week. Nobody remembers what counts as
"done," the rewards are vague, and the parent turns into a nag. I wanted
chores to feel like a game kids choose to play, with rules fair enough that
nobody argues about them.

## How it works

The family is a **guild**. The parent is the Guild Leader, a delegated adult
is a Guild Secretary, and each kid is an Adventurer.

- **Quests** come from a pre-seeded library of 63 chores or are written
  custom. They can be daily, weekly, one-off, or party quests for jobs that
  take teamwork.
- **Ranks** run F through S. An adventurer may accept quests up to one rank
  above their own, so there is always something to grow into.
- **The loop** is accept, submit, inspect, approve or reject. Nobody approves
  their own run.
- **Rewards** are in-site gold and XP only. Enough XP plus a short promotion
  trial earns the next rank.
- **The market** is stocked by parents with real rewards. A kid spends gold,
  a parent fulfils the order in real life, and the kid confirms it arrived.
  No payment API is involved.

## Built for kids

Kids never have email accounts. A parent creates each adventurer profile with
an avatar and a PIN, and every device picks a profile on a "Who's playing?"
screen before anything can be done. Parents unlock with their own PIN, and
wrong guesses lock the screen out temporarily. Adults and teens join through
single-use invite links.

Every pixel-art asset is drawn in code, including the coin, XP gem, market
icons, and a layered avatar creator, so there are no licensing strings
attached.

## Under the hood

Gold and XP live in an append-only ledger, and balances are always derived
from it, never stored. The game rules are pure functions with no I/O, written
test-first. Every query is scoped to the active member's guild. The suite
covers rank promotion, party splits, cooldowns, and order states, with
Playwright and axe checks on the critical flows.

## What's next

Market and party-quest polish, a fuller character creator, four more themes
(Hellforge, Crystal, Azeroth, Isekai), then PWA push notifications, photo
proof, and streaks.
