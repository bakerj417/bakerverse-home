#!/usr/bin/env node
/**
 * scripts/verify-theme-editor.mjs
 *
 * Smoke-tests the theme editor page at /playground/theme-editor.
 *
 * Usage:
 *   pnpm dev &
 *   node scripts/verify-theme-editor.mjs [baseUrl]
 *
 * What it checks:
 *   1. GET /playground/theme-editor returns HTTP 200
 *   2. The page HTML contains the editor heading text
 *   3. POST /api/themes/submit returns HTTP 501 (stub, not yet open)
 *   4. The 501 response body includes { status: "disabled" }
 *   5. The page HTML includes data-astro-island (React island present)
 *   6. URL hash round-trip: encode a theme to hash and decode it back
 *
 * Checks 1–5 use plain fetch (no browser needed).
 * Check 6 is a pure JS unit check (no server needed).
 *
 * Requires: Node 20+ with built-in fetch. No extra dependencies.
 */

import assert from 'node:assert/strict';

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

// ── Check 6: URL hash round-trip (pure JS, no server) ─────────────────────

console.log('\n[6] URL hash round-trip (pure encode/decode, no server needed)');
try {
  // Minimal theme-like object to test the encode/decode cycle
  const minimalTheme = {
    meta: { id: 'test', name: 'Test', author: 'Joseph Baker', mood: 'Test', appearance: 'dark', version: '1.0.0' },
    palette: {
      bg: { void: '#000000', night: '#0d0c14', dusk: '#15131d', ember: '#1d1a26', stone: '#2a2632' },
      ink: { '100': '#f5f1e4', '300': '#d8d1bc', '500': '#9b957f', '700': '#625d4e' },
      primary:   { '50': '#fff', '100': '#fff', '200': '#fff', '300': '#fff', '400': '#d99e0b', '500': '#fff', '600': '#fff', '700': '#fff' },
      secondary: { '50': '#fff', '100': '#fff', '200': '#fff', '300': '#fff', '400': '#a335ee', '500': '#fff', '600': '#fff', '700': '#fff' },
      accents: { purple: '#a335ee', blood: '#8b0000', arcane: '#5b8cff' },
      rarity: { common: '#cfcfcf', uncommon: '#1eff00', rare: '#0070dd', epic: '#a335ee', legendary: '#ff8000', artifact: '#e6cc80' },
    },
    typography: { display: 'Cinzel', body: 'Inter', mono: 'JetBrains Mono' },
    effects: { shadows: {}, radii: {} },
    motion: { eases: {}, durations: {} },
  };

  // Encode to base64url
  const json = JSON.stringify(minimalTheme);
  const base64 = Buffer.from(encodeURIComponent(json).replace(
    /%([0-9A-F]{2})/gi,
    (_, p1) => String.fromCharCode(parseInt(p1, 16)),
  )).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  check('encode produces a non-empty string', base64.length > 0);
  check('encode is URL-safe (no +, /, =)', !base64.includes('+') && !base64.includes('/') && !base64.includes('='));

  // Decode back
  const b64std = base64.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64std.padEnd(b64std.length + (4 - (b64std.length % 4)) % 4, '=');
  const decoded = decodeURIComponent(
    Buffer.from(padded, 'base64').toString('latin1').split('').map(
      (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2),
    ).join(''),
  );
  const roundTripped = JSON.parse(decoded);

  check('round-trip preserves meta.id', roundTripped.meta?.id === 'test');
  check('round-trip preserves primary-400', roundTripped.palette?.primary?.['400'] === '#d99e0b');
} catch (err) {
  fail('hash round-trip threw', err.message);
}

// ── Checks 1–5: HTTP checks (require dev server) ───────────────────────────

let serverReachable = false;
try {
  const probe = await fetch(`${BASE}/`);
  serverReachable = probe.ok || probe.status < 500;
} catch {
  // server not running
}

if (!serverReachable) {
  console.log(`\n  ℹ  Dev server not reachable at ${BASE}`);
  console.log('     Run "pnpm dev" then re-run this script for full HTTP checks.\n');
  console.log(`Result: ${passed} passed, ${failed} failed (HTTP checks skipped)\n`);
  process.exit(failed > 0 ? 1 : 0);
}

console.log(`\n[1] GET /playground/theme-editor returns 200`);
try {
  const res = await fetch(`${BASE}/playground/theme-editor`);
  check('HTTP 200', res.status === 200, `got ${res.status}`);
  const html = await res.text();

  console.log('\n[2] Page contains editor heading');
  check(
    'contains "Theme Editor" in page title or heading',
    html.includes('Theme Editor'),
    'text not found in HTML',
  );

  console.log('\n[5] Page HTML includes Astro island marker');
  check(
    '<astro-island> present (React island rendered)',
    html.includes('<astro-island') || html.includes('astro-island '),
    'island marker not found — island may not be hooked up',
  );
} catch (err) {
  fail('page fetch failed', err.message);
}

console.log('\n[3] POST /api/themes/submit returns 501');
try {
  const res = await fetch(`${BASE}/api/themes/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hash: 'test-hash', authorNote: '' }),
  });
  check('HTTP 501', res.status === 501, `got ${res.status}`);

  console.log('\n[4] 501 response body includes { status: "disabled" }');
  try {
    const json = await res.json();
    check('body.status === "disabled"', json.status === 'disabled', JSON.stringify(json));
    check('body.message is a non-empty string', typeof json.message === 'string' && json.message.length > 0);
  } catch {
    fail('response body is not valid JSON');
  }
} catch (err) {
  fail('submit endpoint fetch failed', err.message);
}

// ── Summary ────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(50)}`);
console.log(`Result: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
