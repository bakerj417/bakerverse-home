#!/usr/bin/env node
// Local visual verification for mobile layouts. Loads a URL at a set
// of phone viewports, captures screenshots to /tmp, and logs the
// scroll width vs viewport width so we can catch horizontal overflow
// without eyeballing every page.
//
//   node scripts/verify-mobile.mjs <baseUrl> [/path /path2 ...]
//
// Example:
//   node scripts/verify-mobile.mjs http://localhost:4321 / /projects
//   node scripts/verify-mobile.mjs https://josephkbaker.com /

import { chromium } from 'playwright';

const baseUrl = process.argv[2] ?? 'http://localhost:4321';
const paths = process.argv.slice(3);
const targets = paths.length ? paths : ['/'];

const viewports = [
  { name: 'iphone-se', width: 375, height: 667 },
  { name: 'iphone-14', width: 390, height: 844 },
  { name: 'android-narrow', width: 360, height: 800 },
];

const browser = await chromium.launch();
let hadOverflow = false;

for (const path of targets) {
  const url = baseUrl.replace(/\/$/, '') + path;
  console.log(`\n=== ${url} ===`);

  for (const vp of viewports) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);

    const { scrollW, clientW, docW } = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      docW: document.body.scrollWidth,
    }));
    const overflow = scrollW > clientW;
    if (overflow) hadOverflow = true;

    const slug = path.replace(/\W+/g, '-') || 'home';
    const file = `/tmp/mobile-${vp.name}-${slug}.png`;
    await page.screenshot({ path: file, fullPage: false });

    console.log(
      `  ${vp.name.padEnd(16)} ${vp.width}x${vp.height}  ` +
        `html.scrollWidth=${scrollW}  client=${clientW}  body=${docW}  ` +
        `${overflow ? 'OVERFLOW' : 'ok'}  -> ${file}`,
    );

    await ctx.close();
  }
}

await browser.close();
process.exit(hadOverflow ? 1 : 0);
