#!/usr/bin/env node
// Reproduce the "opening menu while scrolled sends header to top of
// page" bug. At a phone viewport, scroll to y=500, tap the hamburger,
// then read: scrollY, the header's getBoundingClientRect().top, and
// the panel's top. Sticky-working-correctly implies:
//
//   scrollY  ~= 500  (the tap did NOT jump us back to the top)
//   header top ~= 0  (sticky kept it pinned to the viewport)
//   panel  top ~= header height  (panel opens below the pinned header)
//
//   node scripts/verify-nav-open-while-scrolled.mjs [baseUrl]

import { chromium } from 'playwright';

const baseUrl = process.argv[2] ?? 'http://localhost:4321';

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  hasTouch: true,
  isMobile: true,
});
const page = await ctx.newPage();

await page.goto(baseUrl + '/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(300);

// Simulate a real user: scroll deep into the page, then scroll
// BACK up a bit to reveal the pinned header. The hamburger is
// clickable only when the header is visible, and this mimics
// the exact flow the user reported.
await page.evaluate(() => window.scrollTo({ top: 800, behavior: 'instant' }));
await page.waitForTimeout(250);
await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'instant' }));
await page.waitForTimeout(300);

const before = await page.evaluate(() => ({
  y: window.scrollY,
  headerTop: document.querySelector('[data-nav-root]')?.getBoundingClientRect().top ?? null,
  hidden: document.querySelector('[data-nav-root]')?.hasAttribute('data-nav-hidden'),
  bodyOverflow: document.body.style.overflow,
}));
console.log('before tap:', before);

// Capture the viewport-relative Y of a landmark element before the
// tap, then check it hasn't visually moved after the tap. With the
// position:fixed scroll lock, window.scrollY will drop to 0, but
// the body is offset by top:-scrollLockY so visible content
// stays in place. That's the actual UX guarantee we care about.
const landmarkBefore = await page.evaluate(() => {
  const el = document.querySelector('main') ?? document.body;
  return el.getBoundingClientRect().top;
});
console.log('landmark top before tap:', landmarkBefore);

await page.click('[data-nav-toggle]');
await page.waitForTimeout(500);

const afterOpen = await page.evaluate(() => {
  const root = document.querySelector('[data-nav-root]');
  const panel = document.querySelector('[data-nav-panel]');
  const main = document.querySelector('main') ?? document.body;
  return {
    y: window.scrollY,
    headerTop: root?.getBoundingClientRect().top ?? null,
    panelTop: panel?.getBoundingClientRect().top ?? null,
    landmarkTop: main.getBoundingClientRect().top,
    open: !!root?.hasAttribute('data-nav-open'),
    bodyPos: document.body.style.position,
    bodyTop: document.body.style.top,
  };
});
console.log('after tap:', afterOpen);

await page.screenshot({ path: '/tmp/nav-open-while-scrolled.png' });

await page.click('[data-nav-toggle]');
await page.waitForTimeout(500);

const afterClose = await page.evaluate(() => ({
  y: window.scrollY,
  bodyPos: document.body.style.position,
  open: !!document.querySelector('[data-nav-root]')?.hasAttribute('data-nav-open'),
}));
console.log('after close:', afterClose);

// Judgments
const headerPinned =
  afterOpen.headerTop != null && Math.abs(afterOpen.headerTop) < 2;
const panelNearHeader =
  afterOpen.panelTop != null && afterOpen.panelTop > 30 && afterOpen.panelTop < 120;
const noVisualJump =
  Math.abs((afterOpen.landmarkTop ?? 0) - (landmarkBefore ?? 0)) < 8;
// With no body lock, scrollY must stay put across tap and close —
// that's the whole point. Body styles must never be mutated by
// the nav script.
const scrollKeptOnOpen = Math.abs((afterOpen.y ?? -1) - 500) < 20;
const scrollKeptOnClose = Math.abs((afterClose.y ?? -1) - 500) < 20;
const bodyUntouched = afterOpen.bodyPos === '' && afterClose.bodyPos === '';

console.log('--- judgments ---');
console.log('header pinned at viewport top?', headerPinned);
console.log('panel just below header?', panelNearHeader);
console.log('no visual jump (landmark y stable)?', noVisualJump, `(${landmarkBefore} -> ${afterOpen.landmarkTop})`);
console.log('scroll preserved on open?', scrollKeptOnOpen, '(actual:', afterOpen.y, ')');
console.log('scroll preserved on close?', scrollKeptOnClose, '(actual:', afterClose.y, ')');
console.log('body left untouched by nav JS?', bodyUntouched);

const pass =
  headerPinned &&
  panelNearHeader &&
  noVisualJump &&
  scrollKeptOnOpen &&
  scrollKeptOnClose &&
  bodyUntouched &&
  afterOpen.open &&
  !afterClose.open;
console.log('result:', pass ? 'PASS' : 'FAIL');
await browser.close();
process.exit(pass ? 0 : 1);
