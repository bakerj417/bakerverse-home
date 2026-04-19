#!/usr/bin/env node
// Visual check for the mobile nav: loads the home page at a phone
// viewport, captures closed state, clicks the hamburger, waits out
// the stagger animation, captures open state + a mid-stagger frame.
//
//   node scripts/verify-nav-open.mjs [baseUrl]

import { chromium } from 'playwright';

const baseUrl = process.argv[2] ?? 'http://localhost:4321';

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile Safari/604.1',
});
const page = await ctx.newPage();

await page.goto(baseUrl + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(200);

await page.screenshot({ path: '/tmp/nav-closed.png' });
console.log('closed -> /tmp/nav-closed.png');

await page.click('[data-nav-toggle]');
// Wait past the full stagger (400ms delay + 320ms transition).
await page.waitForTimeout(800);
await page.screenshot({ path: '/tmp/nav-open.png' });
console.log('open   -> /tmp/nav-open.png');

// Mid-animation frame: close, then re-open, capture at ~220ms.
await page.click('[data-nav-toggle]');
await page.waitForTimeout(350);
await page.click('[data-nav-toggle]');
await page.waitForTimeout(220);
await page.screenshot({ path: '/tmp/nav-opening.png' });
console.log('midway -> /tmp/nav-opening.png');

await browser.close();
