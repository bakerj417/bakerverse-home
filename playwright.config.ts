import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for end-to-end accessibility regression tests.
 *
 * Spins up the Astro production preview locally so axe-core can crawl
 * the same HTML the user will get. The accessibility spec is the
 * regression gate for WCAG 2.1 AA — see tests/accessibility.spec.ts.
 */
export default defineConfig({
  testDir: 'tests',
  testMatch: ['**/*.spec.ts'],
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  retries: process.env.CI ? 1 : 0,

  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    // `astro preview` serves the production build; we run `pnpm build`
    // first so axe is testing the same artifact production users see.
    command: 'pnpm build && pnpm preview --host 127.0.0.1 --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
