---
title: "BSS Client Portal"
tagline: "One hub for every client — projects, invoices, documents, and requests. No more email archaeology."
rarity: legendary
year: 2026
status: active
stack:
  - Next.js 14
  - TypeScript
  - Prisma
  - PostgreSQL
  - Clerk
  - Stripe
  - Resend
  - Tailwind CSS
  - Vercel
featured: false
order: 6
summary: >-
  A private branded client hub replacing the ad-hoc pile of email threads,
  Drive links, and PDF-attached invoices that most freelancers accept as normal.
  Every BSS client gets their own account at bss.josephkbaker.com — project
  tracking, document access, invoice payments, and work requests in one place.
  Joseph gets an admin panel that runs the whole operation.
---

## The problem with freelance tooling

Running a solo software consultancy means wearing every hat — engineer, PM,
account manager, invoicing department. The default setup is a mess: project
updates buried in email threads, documents living in Drive folders clients lose
the link to, invoices sent as PDF attachments that disappear in inboxes, work
requests arriving as "hey can we hop on a call" DMs.

Every client interaction is bespoke. There's no system. And the more clients
you have, the worse it compounds.

The BSS Client Portal is the product answer to that problem.

## What it does

The portal gives every BSS client their own private account at
`bss.josephkbaker.com`. Invite-only — no self-signup, no public-facing product.
Each client sees only their own data.

### Client-facing

**Dashboard:** A home screen that actually means something. Active project
count, open invoices, pending requests, and a live activity feed. The first
thing a client sees when they log in tells them exactly where things stand —
no email required.

**Projects:** Every engagement lives here with a status badge, milestones
timeline, and progress bar. Joseph posts updates in a structured log that
replaces the weekly status email. Clients can comment inline.

**Documents:** A file hub organized by category — Contracts, Proposals, Specs,
Designs, Reports. Joseph uploads; clients view and download. No more
"can you resend that spec doc?" messages.

**Invoices:** All invoices in one place with real statuses (sent, paid,
overdue). Each one carries a Stripe payment link so clients pay without leaving
the portal. The webhook confirms payment and flips the status automatically.

**Work Requests:** Clients submit structured requests — type, description,
priority, attachments — instead of free-form emails. Joseph reviews, posts an
estimate or declines, and every status change triggers an email notification.
The full history stays visible to both sides.

### Admin panel (Joseph only)

A full back-office at `/admin`:

- Client management — create accounts, send Clerk invites, drill into any
  client's complete history
- Project creation with milestone editing
- Document upload to any client account
- Invoice builder with Stripe Payment Link generation on save
- Work request queue with response, estimation, and status tools
- Rich text project update composer with image attachments

## The stack

Next.js 14 with the App Router drives the whole thing — React Server
Components for data-heavy views, client components where interactivity
demands it. Clerk handles invite-only auth with magic links and no auth
infrastructure to maintain. Prisma sits over serverless PostgreSQL (Neon).
Stripe covers payment links and webhook-driven invoice status. Resend handles
every transactional email: invites, invoice notifications, update alerts,
request status changes.

Deployed to Vercel as a subdomain of josephkbaker.com, using the same project
for automatic preview deploys on every pull request.

## The data model

The core of the portal is a handful of well-defined entities that map cleanly
to the client relationship:

- **Client** — the account, one per business
- **Project** — scoped to a client, carries status and progress
- **Milestone** — ordered events within a project, due-date–driven
- **Document** — categorized files attached to client or project
- **Invoice** — amount, dates, Stripe state, payment history
- **WorkRequest** — structured request through its full lifecycle
- **Update** — rich-text post on a project with comment thread
- **Notification** — in-app and email event log per user

Everything else — roles, permissions, notification prefs, invite flow — hangs
off this graph cleanly.

## Why this changes the business

The portal does two things at once. From the client side, BSS starts to feel
less like hiring a contractor and more like working with a product company:
organized, transparent, zero friction to pay an invoice or check a milestone.
From Joseph's side, it eliminates the cognitive overhead of tracking which
client needs what, what's been sent, what's unpaid.

The goal: every new client gets their account before the first kickoff call.
The portal is the first deliverable.

## Phases

**MVP (ship first):** Auth via Clerk invite flow, dashboard with real data,
projects + milestones, documents, invoices with Stripe payment, work requests,
admin panel, Resend transactional email.

**Phase 2:** Real-time in-app notifications (Pusher or Ably), per-client
branding overrides (custom accent color), time tracking integration, reporting
and analytics dashboard for Joseph.
