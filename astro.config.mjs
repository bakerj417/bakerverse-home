import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  site: 'https://josephkbaker.com',
  // Hybrid: pages are static-prerendered by default; routes that opt in
  // with `export const prerender = false` (e.g. /api/contact) run on
  // Vercel serverless at request time.
  output: 'hybrid',
  adapter: vercel(),
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
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
