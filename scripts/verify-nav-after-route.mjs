#!/usr/bin/env node
// Verify the mobile nav still works AFTER a ViewTransition route
// change. Loads home, opens the nav, clicks a link (route changes
// client-side via Astro's ViewTransitions), re-opens the nav on the
// destination page, and asserts the panel actually became visible.
//
//   node scripts/verify-nav-after-route.mjs [baseUrl]

import { chromium } from 'playwright';

const baseUrl = process.argv[2] ?? 'http://localhost:4321';

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

await page.goto(baseUrl + '/', { waitUntil: 'networkidle' });
console.log('on home -> url=', page.url());

// Open the panel so the link is actually clickable.
await page.click('[data-nav-toggle]');
await page.waitForTimeout(700);

const linkNav = page.waitForURL(/\/projects\/?$/, { timeout: 5000 });
await page.click('a.nav-link[href="/projects"]');
try {
  await linkNav;
} catch {
  await page.waitForLoadState('networkidle');
}
await page.waitForTimeout(400);
console.log('after link click -> url=', page.url());

const toggleBound = await page.evaluate(() =>
  document.querySelector('[data-nav-toggle]')?.dataset?.navBound === '1',
);
console.log('toggle bound after route change?', toggleBound);

await page.click('[data-nav-toggle]');
await page.waitForTimeout(600);

const opened = await page.evaluate(() =>
  document.querySelector('[data-nav-root]')?.hasAttribute('data-nav-open'),
);
console.log('[data-nav-open] present after post-route click?', opened);

const panelVisible = await page.evaluate(() => {
  const panel = document.querySelector('[data-nav-panel]');
  if (!panel) return false;
  const s = getComputedStyle(panel);
  return s.visibility === 'visible' && parseFloat(s.opacity) > 0.9;
});
console.log('panel computed visible?', panelVisible);

await page.screenshot({ path: '/tmp/nav-after-route.png' });
console.log('screenshot -> /tmp/nav-after-route.png');

await browser.close();
process.exit(opened && panelVisible ? 0 : 1);
