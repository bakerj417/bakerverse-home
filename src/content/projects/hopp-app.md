---
title: "Hopp App — Demo Restoration"
tagline: "Bringing a shipped, App Store–live rewards platform back as a fully interactive demo."
rarity: legendary
year: 2026
status: paused
stack:
  - React Native
  - Expo
  - NestJS
  - TypeScript
  - React Admin
featured: false
order: 5
summary: >-
  Hopp was a location-based rewards app I authored and shipped to the iOS App
  Store and Google Play — users scanned QR codes at partner venues to earn
  points, unlock achievements, and redeem rewards. Development stopped four
  years ago. This quest resurrects the full stack as a self-contained demo:
  upgraded Expo SDK, mocked API with on-device storage, and the admin CMS —
  no live database, no external services, fully explorable.
---

## What Hopp was

Hopp was a gamified local discovery app built to drive foot traffic to partner
venues. The loop was simple: open the app, scan a QR code at a coffee shop or
bar, get points, progress toward achievements, redeem rewards. Geolocation
validation meant you actually had to be at the venue — no remote scanning.

The product shipped as **v2.3.0** on iOS and Android via Expo OTA channels.
I was the primary author across all three repos: the React Native mobile app,
the NestJS REST API, and the React Admin dashboard the ops team used to manage
venues, rewards, and achievements.

### The stack

**Mobile (React Native / Expo):** Tab-based navigation — Scan, Earn,
History, Rewards, Leaderboard, Refer, Loyalty, Account. Expo Camera for QR
decoding, Expo Location for geo-validation, Zustand for local state, React
Query for API calls, UI Kitten for components, Firebase for push notifications
and analytics.

**API (NestJS / TypeORM / PostgreSQL):** JWT + Passport auth, Twilio for SMS
verification, Mailchimp for transactional email, AWS S3 for assets, RabbitMQ
for async messaging, Tinify for image compression, a JSON rules engine driving
achievement evaluation, and a QR token system tying venue scans to points.

**Admin CMS (React Admin / Material UI):** Full CRUD over users, venues,
rewards, achievements, announcements, point modifiers, neighborhoods, and scan
history. The ops team used this to configure every aspect of the product
without touching code.

### Data model at a glance

- **User** — phone (unique ID), username, points balance, region, push token
- **Venue** — name, QR token, geo coordinates, categories, features, hours
- **Scan** — user + venue + geo + timestamp + points awarded
- **Achievement** — JSON rules engine (condition → reward), time-gated, regional
- **Reward** — point cost, redemption type (claim or auto-email), provider config
- **Referral** — referrer → referred phone, bonus tracking

## The restoration plan

The goal is a **fully interactive demo** with no live infrastructure — no
PostgreSQL, no Twilio, no AWS, no RabbitMQ. Everything the app currently
delegates to external services gets replaced with local equivalents.

### Phase 1 — Expo SDK upgrade

Expo 42 is several major versions behind. The first task is upgrading the
native app to a current SDK, resolving deprecated APIs, and confirming the
tab navigator and camera/location permissions still work on modern iOS and
Android simulators.

### Phase 2 — Mock API layer

Replace the live NestJS backend with a lightweight mock. Two options under
evaluation: (a) a thin Hono server that stores all state in-memory or in a
local JSON file — keeps the existing API contract, drop-in for the app;
(b) MSW (Mock Service Worker) wired directly into Expo for a zero-server
approach. Either way, the scan flow, points ledger, achievement rules engine,
and reward redemptions all need to work end-to-end.

### Phase 3 — On-device persistence

User progress (points, scans, achievements, claimed rewards) persists to
AsyncStorage / SecureStore so a demo session survives app restarts without any
backend. Seed data (5–10 venues, 3–4 achievements, a handful of rewards) ships
as a JSON fixture the mock API hydrates on first launch.

### Phase 4 — Admin CMS

The React Admin dashboard already points to an API endpoint — once the mock
API is running, the CMS should be largely functional with minimal changes.
Scope: verify all list/edit views work against the mock, remove screens that
reference hard-deleted external services (Mailchimp templates, S3 upload), and
confirm the achievement rule editor produces valid JSON the mock engine
evaluates correctly.

### Phase 5 — Demo packaging

A one-command `pnpm demo` that spins up the mock API and opens the Expo dev
client. A seeded demo account with a few scans and an in-progress achievement
so the app shows real state immediately. Screenshots of the core screens for
this portfolio entry. A short writeup on what the production version looked
like versus the demo and why the architecture choices made sense at the time.

## Why this is worth restoring

Hopp is the only project in this portfolio that shipped to real users on both
major app stores. The achievement rules engine, geo-validated QR flow, and
three-tier architecture (mobile + API + admin) reflect real product thinking
under real constraints. A runnable demo makes that concrete in a way a
description never can.
