#!/usr/bin/env node
// Mobile hide-on-scroll-down / show-on-scroll-up check for the header.
// Opens the home page at a phone viewport, scrolls past the threshold,
// asserts the header slides off, scrolls back up, asserts it returns.
//
//   node scripts/verify-nav-scroll-hide.mjs [baseUrl]

import { chromium } from 'playwright';

const baseUrl = process.argv[2] ?? 'http://localhost:4321';

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

await page.goto(baseUrl + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(200);

const read = () => page.evaluate(() => {
  const root = document.querySelector('[data-nav-root]');
  const rect = root?.getBoundingClientRect();
  return {
    hidden: !!root?.hasAttribute('data-nav-hidden'),
    top: rect?.top ?? null,
    y: window.scrollY,
  };
});

const initial = await read();
console.log('initial', initial);

await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
await page.waitForTimeout(250);
const afterDown = await read();
console.log('after scroll down', afterDown);

// Tiny upward scroll — the user wants a small nudge up to reveal,
// so they can tap the header / hamburger without scrolling all the
// way back to the top.
await page.evaluate(() => window.scrollTo({ top: 585, behavior: 'instant' }));
await page.waitForTimeout(250);
const afterUp = await read();
console.log('after tiny scroll up (15px)', afterUp);

await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
await page.waitForTimeout(250);
const backTop = await read();
console.log('back at top', backTop);

await page.screenshot({ path: '/tmp/nav-scroll-top.png' });

const pass =
  initial.hidden === false &&
  afterDown.hidden === true &&
  afterUp.hidden === false &&
  backTop.hidden === false;

console.log('result:', pass ? 'PASS' : 'FAIL');
await browser.close();
process.exit(pass ? 0 : 1);
