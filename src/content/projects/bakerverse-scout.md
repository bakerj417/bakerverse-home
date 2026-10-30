---
title: "Bakerverse Scout"
tagline: "An AI agent that hunts jobs across four boards every morning so family members don't have to."
liveUrl: "https://scout.bakerverse.com"
rarity: epic
year: 2026
status: paused
stack:
  - Next.js 15
  - React 19
  - TypeScript
  - Prisma
  - Neon (Postgres)
  - Auth.js v5
  - Gemini 2.5 Flash
  - Nodemailer
  - Tailwind CSS
  - Vercel
featured: false
order: 2
summary: >-
  A fully automated job discovery agent built for family members in an active
  job search. Every morning at 6 AM it scans four job boards, filters the noise
  against each person's profile, and emails a curated daily summary. Click any
  match to get an AI-generated interview prep report — company research, role
  breakdown, tailored talking points, salary ranges, and practice questions.
  Gmail monitoring catches recruiter replies and surfaces them in the dashboard.
  The goal: zero job board doomscrolling, maximum signal.
---

## The problem with job searching

Active job searching is a second job — and not a good one. The boards are
flooded with stale listings, scam postings, and positions that technically match
your keywords but clearly aren't right. Each board has its own UX, its own
account, its own alert system that fires at random intervals. You end up
checking the same sites twice a day, copying and pasting the same resume into
the same forms, and trying to remember which company you already applied to.

When family members mentioned they were job hunting, I built the thing I wished
existed: an agent that does the grinding and surfaces only what's worth a look.

## How it works

### The morning sweep

Every day at 6 AM, the agent wakes up and fires four parallel requests:

- **Remotive** — remote-first tech roles
- **Adzuna** — broad job search with salary data
- **The Muse** — culture-forward companies
- **Jobicy** — remote job listings with categories

These are the only four job boards with free public search APIs. LinkedIn and
Indeed have locked their APIs behind enterprise agreements — so the agent
works within what actually exists.

For each user, it pulls jobs relevant to their profile keywords and job title
targets, deduplicates against everything they've already seen, and builds a
short-list of net-new matches. If there's anything worth looking at, it sends
an email summary with a link directly to the dashboard. If it's a quiet morning,
no email — no noise.

### The job feed

The web app at `scout.bakerverse.com` is a private, invite-only dashboard.
Each user sees their own curated feed: job cards with company, role, location,
remote status, and a salary estimate when available. Jobs can be marked as
applied, rejected, or wishlisted. The application tracker shows where each one
stands.

### Interview prep on demand

This is the part that saves the most time. Click "Generate Prep Report" on any
job listing and the agent calls Gemini 2.5 Flash with the full job description
and the user's resume text. In a few seconds it returns:

- **Company research** — background, culture, recent news, what they're about
- **Role breakdown** — what the job is actually looking for between the lines
- **Interview questions** — 5–8 tailored questions, not the generic ones
- **Talking points** — resume highlights mapped to what this specific role needs
- **Salary data** — market range estimate for the role and location

No subscription. No third-party service. One Gemini free-tier call per prep
report — and that's the correct tradeoff for personal scale.

### Gmail monitoring

When a recruiter responds to an application, it usually happens by email.
The agent checks Gmail every hour using each user's OAuth token (stored via
the Auth.js Prisma adapter) and classifies incoming messages. Recruiter
responses surface in the dashboard with the email thread, so you never miss
a reply buried in an inbox.

## The architecture

The project is a monorepo with three packages:

```
apps/web/    — Next.js 15, the dashboard UI
apps/agent/  — Node.js agent, runs on my Mac via launchd
packages/db/ — Shared Prisma schema and client
```

The web app has zero AI calls. All AI work lives in the agent. The web app only
reads and writes the database — which means the UI stays snappy and the AI layer
can be iterated independently.

The agent runs as a persistent launchd process, scheduled automatically on
system boot. There's no cloud infrastructure to maintain — it just runs.

## Multi-tenant by design

Both family members have independent accounts. The agent iterates users
separately — profile, seen-jobs history, Gmail token, everything is scoped per
user. Adding another person is one row in the database and a Google OAuth login.

The DB schema is built so a `userId` column is the only addition needed if this
ever becomes something more.

## What it replaces

Before this existed: manually checking four websites every morning, missing
postings because the alert email went to spam, forgetting to follow up on
something promising, losing the application status to memory. After: wake up,
check your email, click the prep report if something looks good, apply.

The agent runs the boring part. The job seeker does the interesting part.
