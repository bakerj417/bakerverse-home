import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import sentry from '@sentry/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://josephkbaker.com',
  // Hybrid: pages are static-prerendered by default; routes that opt in
  // with `export const prerender = false` (e.g. /api/contact) run on
  // Vercel serverless at request time.
  output: 'hybrid',
  adapter: vercel(),
  // @astrojs/sitemap 3.x crashes against astro 4 hybrid + vercel
  // adapter (_routes is undefined in astro:build:done). Re-add after
  // the planned Astro 5 upgrade.
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sentry({
      org: 'baker-software-solutions',
      project: 'bakerverse-home',
      // Uploads source maps to Sentry at build time so stack traces are readable.
      // SENTRY_AUTH_TOKEN must be set in Vercel env for production builds.
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourceMapsUploadOptions: {
        enabled: !!process.env.SENTRY_AUTH_TOKEN,
      },
    }),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  vite: {
    // Expose SENTRY_DSN to the client bundle at build time.
    // Empty string on localhost (no env var) → Sentry.init is skipped by the guard in sentry.client.config.ts.
    define: {
      'import.meta.env.PUBLIC_SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN ?? ''),
    },
    ssr: {
      noExternal: ['framer-motion'],
    },
  },
});
