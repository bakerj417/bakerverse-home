#!/usr/bin/env node
// Probe candle + inkwell positions on the /contact page at a mobile
// portrait viewport. Also probes the sticky header's actual
// "stuck" behavior (getBoundingClientRect().top stays at 0 while
// scrolled) which is the iOS Safari failure we suspect.

import { chromium, webkit } from 'playwright';

const baseUrl = process.argv[2] ?? 'http://localhost:4321';
const engine = (process.argv[3] ?? 'chromium').toLowerCase();

const browserType = engine === 'webkit' ? webkit : chromium;
const browser = await browserType.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  userAgent:
    engine === 'webkit'
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      : undefined,
});
const page = await ctx.newPage();

await page.goto(baseUrl + '/contact', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(400);

const candleBoxes = await page.evaluate(() => {
  const vw = window.innerWidth;
  const left = document.querySelector('.candle--left');
  const right = document.querySelector('.candle--right');
  const ink = document.querySelector('.inkwell');
  const rect = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { left: r.left, right: r.right, top: r.top, width: r.width, height: r.height };
  };
  return { vw, left: rect(left), right: rect(right), ink: rect(ink) };
});
console.log('candle/inkwell boxes:', JSON.stringify(candleBoxes, null, 2));

const offscreen =
  (candleBoxes.left && candleBoxes.left.left < -1) ||
  (candleBoxes.left && candleBoxes.left.right > candleBoxes.vw + 1) ||
  (candleBoxes.right && candleBoxes.right.left < -1) ||
  (candleBoxes.right && candleBoxes.right.right > candleBoxes.vw + 1);
console.log('any candle off-screen?', !!offscreen);

await page.screenshot({ path: '/tmp/contact-candles.png', fullPage: false });
console.log('screenshot -> /tmp/contact-candles.png');

// -- sticky check on the home page
await page.goto(baseUrl + '/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(200);
await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }));
await page.waitForTimeout(200);
const headerTop = await page.evaluate(() => {
  const root = document.querySelector('[data-nav-root]');
  if (!root) return null;
  const r = root.getBoundingClientRect();
  return { top: r.top, hidden: root.hasAttribute('data-nav-hidden') };
});
console.log('header while scrolled:', headerTop);
console.log('sticky is working?', headerTop && Math.abs(headerTop.top) < 2);

await browser.close();
