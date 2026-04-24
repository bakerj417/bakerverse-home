#!/usr/bin/env node
/**
 * scripts/verify-theme-fouc.mjs
 *
 * Verifies the theme engine's FOUC guard — that the persisted theme is
 * applied on the very first paint, with no flash of the default.
 *
 * For each theme:
 *   1. Launches a page, seeds localStorage.bakerverse.theme with the id
 *   2. Navigates to BASE and waits only for domcontentloaded
 *   3. Asserts <html data-theme> matches the persisted id
 *   4. Asserts the inline <style id="bakerverse-theme"> block contains the
 *      theme's bg.night hex — proof the SSR guard emitted the right CSS
 *   5. Asserts the computed body background-color resolves to bg.night
 *
 * Usage:
 *   pnpm dev &
 *   node scripts/verify-theme-fouc.mjs
 *   # or: VERIFY_BASE=https://josephkbaker.com node scripts/verify-theme-fouc.mjs
 */

import { chromium } from 'playwright';

const BASE = process.env.VERIFY_BASE ?? 'http://localhost:4321';

// bg.night per theme (kept in sync with src/lib/theme/themes/*.ts)
const THEMES = [
  { id: 'diablo',    bgNight: '#0d0c14' },
  { id: 'arcane',    bgNight: '#0a0c18' },
  { id: 'infernal',  bgNight: '#110707' },
  { id: 'celestial', bgNight: '#0c0e16' },
  { id: 'terminal',  bgNight: '#050a05' },
];

let passed = 0;
let failed = 0;

function assert(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`);
    failed++;
  }
}

function hexToRgb(hex) {
  const m = hex.replace('#', '').match(/.{2}/g);
  if (!m) return null;
  const [r, g, b] = m.map((x) => parseInt(x, 16));
  return `rgb(${r}, ${g}, ${b})`;
}

const browser = await chromium.launch();

try {
  for (const theme of THEMES) {
    console.log(`\n[${theme.id}] FOUC check`);

    const context = await browser.newContext();
    // Seed localStorage before any page code runs.
    await context.addInitScript((id) => {
      try {
        window.localStorage.setItem('bakerverse.theme', id);
      } catch {
        // private mode or similar — ignore
      }
    }, theme.id);

    const page = await context.newPage();

    // Only wait for DOM — we want first-paint state, not post-load.
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });

    const attr = await page.getAttribute('html', 'data-theme');
    assert(
      `<html data-theme="${theme.id}">`,
      attr === theme.id,
      `got "${attr}"`,
    );

    const styleBlock = await page
      .locator('style#bakerverse-theme')
      .innerHTML()
      .catch(() => '');
    assert(
      `<style id="bakerverse-theme"> contains ${theme.bgNight}`,
      styleBlock.toLowerCase().includes(theme.bgNight.toLowerCase()),
      `block length=${styleBlock.length}`,
    );

    const expectedRgb = hexToRgb(theme.bgNight);
    const bodyBg = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );
    assert(
      `body background-color === ${expectedRgb}`,
      bodyBg === expectedRgb,
      `got "${bodyBg}"`,
    );

    await context.close();
  }
} finally {
  await browser.close();
}

console.log(`\nResult: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
