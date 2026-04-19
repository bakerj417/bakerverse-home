import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

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
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  vite: {
    ssr: {
      noExternal: ['framer-motion'],
    },
  },
});
