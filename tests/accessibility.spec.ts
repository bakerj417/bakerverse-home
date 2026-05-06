/**
 * Accessibility regression gate for josephkbaker.com.
 *
 * Each route below is crawled with @axe-core/playwright using the
 * WCAG 2.1 A + AA tag set. Any new violation fails CI before it ever
 * reaches main. The /accessibility statement page documents the
 * conformance target and any acknowledged limitations.
 *
 * /playground/theme-editor is intentionally excluded — it is a heavy
 * client-only editor surface that needs its own dedicated audit pass.
 */

import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] as const;

async function runAxe(page: Page) {
  return new AxeBuilder({ page }).withTags([...WCAG_TAGS]).analyze();
}

test.describe('WCAG 2.1 AA — site-wide axe sweep', () => {
  test('home — no axe violations', async ({ page }) => {
    await page.goto('/');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('about — no axe violations', async ({ page }) => {
    await page.goto('/about');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('work — no axe violations', async ({ page }) => {
    await page.goto('/work');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('projects index — no axe violations', async ({ page }) => {
    await page.goto('/projects');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('projects detail (baker-cookbook) — no axe violations', async ({ page }) => {
    await page.goto('/projects/baker-cookbook');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('contact — no axe violations', async ({ page }) => {
    await page.goto('/contact');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('bakerverse — no axe violations', async ({ page }) => {
    await page.goto('/bakerverse');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('resume — no axe violations', async ({ page }) => {
    await page.goto('/resume');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('accessibility statement — no axe violations', async ({ page }) => {
    await page.goto('/accessibility');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });
});
