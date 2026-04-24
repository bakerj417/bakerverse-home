#!/usr/bin/env node
/**
 * scripts/capture-theme-screenshots.mjs
 *
 * Captures above-the-fold hero screenshots of josephkbaker.com under each
 * ship-ready theme, at mobile (390×844) and desktop (1440×900) viewports.
 * Output goes to `public/images/themes/` and is embedded in the Theme
 * Engine case study MDX.
 *
 * Usage:
 *   pnpm dev &
 *   node scripts/capture-theme-screenshots.mjs
 */

import { chromium } from 'playwright';
import { mkdir, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const BASE = process.env.CAPTURE_BASE ?? 'http://localhost:4321';
const OUT_DIR = resolve('public/images/themes');

const THEMES = ['diablo', 'arcane', 'infernal', 'celestial', 'terminal'];

const VIEWPORTS = [
  { name: 'mobile',  width: 390,  height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
];

await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();

try {
  for (const theme of THEMES) {
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 2,
        reducedMotion: 'reduce',
      });

      await context.addInitScript((id) => {
        try {
          window.localStorage.setItem('bakerverse.theme', id);
        } catch {
          // private mode — ignore
        }
      }, theme);

      const page = await context.newPage();
      await page.goto(BASE, { waitUntil: 'networkidle' });

      // Let scroll-reveal animations settle.
      await page.waitForTimeout(500);

      const pngPath = resolve(OUT_DIR, `${theme}-${viewport.name}.png`);
      const webpPath = pngPath.replace(/\.png$/, '.webp');
      await page.screenshot({ path: pngPath, fullPage: false });
      await sharp(pngPath).webp({ quality: 82 }).toFile(webpPath);
      await unlink(pngPath);
      console.log(`  ✓ ${theme}-${viewport.name}.webp`);

      await context.close();
    }
  }
} finally {
  await browser.close();
}

console.log(`\nSaved ${THEMES.length * VIEWPORTS.length} screenshots → ${OUT_DIR}`);
