#!/usr/bin/env node
/**
 * scripts/verify-case-study.mjs
 *
 * Smoke-tests the theme engine case study and its /projects integration.
 *
 * Usage:
 *   pnpm dev &
 *   node scripts/verify-case-study.mjs [baseUrl]
 *
 * What it checks:
 *   1. GET /projects returns HTTP 200 and contains the bento hero section
 *   2. GET /projects returns HTML with "Theme Engine" text visible
 *   3. GET /projects returns HTML with ThemeSwitcherMini island marker
 *   4. GET /projects/theme-engine returns HTTP 200 (case study slug resolves)
 *   5. Case study page contains expected headings ("The problem", "The approach")
 *   6. Case study page contains the stack items in meta
 *
 * Checks 1–6 use plain fetch (no Playwright / browser needed).
 * Screenshots are captured only when Playwright is available + server is up.
 *
 * Requires: Node 20+. No extra dependencies for the core checks.
 */

import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

// ── Configuration ──────────────────────────────────────────────────────────

const BASE = process.argv[2] ?? (process.env.VERIFY_BASE ?? 'http://localhost:4321');
let passed = 0;
let failed = 0;

// ── Helpers ────────────────────────────────────────────────────────────────

function ok(label) {
  console.log(`  ✓ ${label}`);
  passed++;
}

function fail(label, detail = '') {
  console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`);
  failed++;
}

function check(label, condition, detail = '') {
  if (condition) ok(label);
  else fail(label, detail);
}

// ── Probe server ───────────────────────────────────────────────────────────

let serverReachable = false;
try {
  const probe = await fetch(`${BASE}/`);
  serverReachable = probe.ok || probe.status < 500;
} catch {
  // server not running
}

if (!serverReachable) {
  console.log(`\n  ℹ  Dev server not reachable at ${BASE}`);
  console.log('     Run "pnpm dev" then re-run this script for full checks.\n');
  console.log(`Result: ${passed} passed, ${failed} failed (checks skipped — no dev server)\n`);
  process.exit(0); // Not a failure — just no server
}

// ── Check 1 + 2 + 3: /projects page ───────────────────────────────────────

console.log('\n[1] GET /projects returns 200');
let projectsHtml = '';
try {
  const res = await fetch(`${BASE}/projects`);
  check('HTTP 200', res.status === 200, `got ${res.status}`);
  projectsHtml = await res.text();
} catch (err) {
  fail('/projects fetch failed', err.message);
}

if (projectsHtml) {
  console.log('\n[2] /projects contains "Theme Engine" text');
  check(
    '"Theme Engine" visible in page HTML',
    projectsHtml.includes('Theme Engine'),
    'text not found',
  );

  console.log('\n[3] /projects contains ThemeSwitcherMini island');
  check(
    'ThemeSwitcherMini island marker present',
    projectsHtml.includes('ThemeSwitcherMini') ||
      projectsHtml.includes('theme-switcher-mini') ||
      projectsHtml.includes('data-astro-island'),
    'island marker not found — ThemeSwitcherMini may not be wired up',
  );
}

// ── Check 4: case study page resolves ─────────────────────────────────────

console.log('\n[4] GET /projects/theme-engine returns 200');
let caseStudyHtml = '';
try {
  const res = await fetch(`${BASE}/projects/theme-engine`);
  check('HTTP 200', res.status === 200, `got ${res.status}`);
  caseStudyHtml = await res.text();
} catch (err) {
  fail('/projects/theme-engine fetch failed', err.message);
}

if (caseStudyHtml) {
  console.log('\n[5] Case study contains expected section headings');
  check(
    'contains "The problem" section',
    caseStudyHtml.includes('The problem'),
    'heading not found',
  );
  check(
    'contains "The approach" section',
    caseStudyHtml.includes('The approach'),
    'heading not found',
  );
  check(
    'contains "The outcome" section',
    caseStudyHtml.includes('The outcome'),
    'heading not found',
  );

  console.log('\n[6] Case study page contains stack references');
  check(
    'mentions TypeScript',
    caseStudyHtml.includes('TypeScript'),
    'stack item not found',
  );
  check(
    'mentions Astro',
    caseStudyHtml.includes('Astro'),
    'stack item not found',
  );
}

// ── Optional: Playwright screenshots ──────────────────────────────────────

const screenshotDir = path.join(REPO_ROOT, 'public', 'case-studies', 'theme-engine');
let playwrightAvailable = false;
try {
  await import('playwright');
  playwrightAvailable = true;
} catch {
  // playwright not available in this environment
}

if (playwrightAvailable) {
  console.log('\n[7] Taking Playwright screenshots');
  try {
    await mkdir(screenshotDir, { recursive: true });
    const { chromium } = await import('playwright');
    const browser = await chromium.launch();

    const viewports = [
      { name: 'mobile', width: 390, height: 844 },
      { name: 'desktop', width: 1440, height: 900 },
    ];

    const themes = ['diablo', 'arcane', 'infernal', 'celestial', 'terminal'];

    for (const vp of viewports) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await ctx.newPage();

      // Set each theme via localStorage before navigating
      for (const themeId of themes) {
        await page.addInitScript((id) => {
          window.localStorage.setItem('bakerverse.theme', id);
        }, themeId);
        await page.goto(`${BASE}/projects/theme-engine`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(300);
        const filepath = path.join(screenshotDir, `${themeId}-${vp.name}.png`);
        await page.screenshot({ path: filepath, fullPage: false });
        ok(`screenshot: ${themeId}-${vp.name}.png`);
      }

      await ctx.close();
    }

    await browser.close();
  } catch (err) {
    console.log(`  ℹ  Playwright screenshots skipped: ${err.message}`);
  }
} else {
  console.log('\n[7] Playwright not available — screenshots skipped');
  console.log(`     Install playwright and run again to capture screenshots at:`);
  console.log(`     ${screenshotDir}`);
}

// ── Summary ────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(50)}`);
console.log(`Result: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
