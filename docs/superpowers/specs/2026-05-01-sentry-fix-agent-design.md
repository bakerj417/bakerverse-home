# Sentry + Monday Fix Agent — Design Spec
**Date:** 2026-05-01
**Project:** bakerverse-home (josephkbaker.com)
**Status:** Approved → implementation in progress

---

## Problem

josephkbaker.com has no error observability. JavaScript exceptions in React islands and server errors in API routes fail silently. There is no path from "something broke in prod" to "a fix is on a branch ready to review."

---

## Goals

1. Capture all client-side and server-side errors in production.
2. Get same-day awareness when a new error is first seen.
3. Every Monday morning, have an agent attempt fixes and open draft PRs for review — no human effort required to triage or start a fix.

---

## Non-Goals

- Dev/local error reporting (Sentry disabled on localhost by env var absence).
- Separate Sentry projects for client vs. server (one project, one DSN).
- GitHub Issues as an intermediary layer (agent reads Sentry directly).
- GitHub Actions (Claude Max subscription covers `/schedule`).

---

## Architecture

```
Error on josephkbaker.com
  → @sentry/astro SDK captures it (client JS + server API routes)
  → Sentry stores issue with full stack trace, session replay, source context

Sentry alert rule: "New issue first seen"
  → emails joseph directly                     ← same-day awareness

Every Monday 8am ET → /schedule agent fires
  → queries Sentry REST API for all unresolved issues
  → for each issue:
      - reads full event: stack trace, source context, occurrence count, replay
      - locates affected file(s) in the repo
      - writes a fix (or best attempt) on branch  fix/sentry-<issue-id>
      - opens draft PR with: what broke, what changed, confidence level
  → you review, adjust if needed, merge
```

---

## Component 1 — Sentry SDK (`@sentry/astro`)

**Package:** `@sentry/astro`

**Files changed:**
- `astro.config.mjs` — adds `sentry()` integration with org, project, authToken (source map upload)
- `sentry.client.config.ts` (new, repo root) — client init: DSN + Session Replay
- `sentry.server.config.ts` (new, repo root) — server init: DSN only

**Env vars:**
| Var | Where | Purpose |
|-----|-------|---------|
| `SENTRY_DSN` | Vercel production | Runtime ingest URL |
| `SENTRY_AUTH_TOKEN` | Vercel production | Build-time source map upload |

**Localhost behavior:** Both configs guard `if (!dsn) return` before calling `Sentry.init`. No env vars on localhost = Sentry never initializes.

**Session Replay config:**
- `replaysSessionSampleRate: 0.1` — 10% of sessions recorded (low traffic site, this is fine)
- `replaysOnErrorSampleRate: 1.0` — 100% of sessions that hit an error get recorded

---

## Component 2 — Awareness Alert

One Sentry alert rule configured in the Sentry dashboard (not in code):
- **Trigger:** New issue first seen
- **Action:** Send email to joseph
- **When:** Immediately

This gives same-day notification without GitHub Issues clutter.

---

## Component 3 — Monday Fix Agent (`/schedule`)

**Cadence:** Every Monday 8:00am ET
**Runtime:** Claude Max subscription via `/schedule`
**Auth needed:** `SENTRY_AUTH_TOKEN` (already in GitHub Actions secrets; also available via Claude Code env)

**Agent prompt (summary):**
> Query the Sentry REST API for all unresolved issues in the `bakerverse-home` project. For each issue, fetch the latest event (full stack trace + source context). Locate the affected file in this repo. Attempt a fix. Push a branch named `fix/sentry-<issue-id>`. Open a draft PR titled `fix: [sentry] <issue title>` with a description explaining what broke, what was changed, and a confidence level (high/medium/low). If confidence is low, still open the PR — note the uncertainty and leave guidance for the human reviewer.

**PR format:**
```
## What broke
<error message + affected file:line>

## Root cause
<agent's analysis>

## What I changed
<description of the fix>

## Confidence
[HIGH | MEDIUM | LOW] — <reason>

## If confidence is LOW
<specific things to check or alternative approaches>
```

---

## Secrets Summary

| Secret | Vercel | GitHub Actions | Notes |
|--------|--------|----------------|-------|
| `SENTRY_DSN` | ✅ | — | Runtime error ingest |
| `SENTRY_AUTH_TOKEN` | ✅ | ✅ | Source maps + API queries |
| `ANTHROPIC_API_KEY` | — | — | Not needed (Claude Max covers `/schedule`) |

---

## Out of Scope for This Iteration

- Auto-merging PRs (always human-reviewed)
- Slack/webhook notifications (email is sufficient)
- Multiple environments (staging, preview) — production only
- Issue de-duplication logic beyond Sentry's built-in grouping
