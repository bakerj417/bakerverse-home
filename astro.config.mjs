import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sentry from '@sentry/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://josephkbaker.com',
  // Hybrid: pages are static-prerendered by default; routes that opt in
  // with `export const prerender = false` (e.g. /api/contact) run on
  // Vercel serverless at request time.
  output: 'static',
  adapter: vercel(),
  // @astrojs/sitemap 3.x crashes against astro 4 hybrid + vercel
  // adapter (_routes is undefined in astro:build:done). Re-add after
  // the planned Astro 5 upgrade.
  integrations: [
    react(),
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
    plugins: [tailwindcss()],
    define: {
      'import.meta.env.PUBLIC_SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN ?? ''),
    },
  },
});
