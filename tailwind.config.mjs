/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Bakerverse palette — "Diablo loot gold" on deep night
        bg: {
          void: '#07060a',       // deepest background
          night: '#0d0c14',      // page background
          dusk: '#15131d',       // section background
          ember: '#1d1a26',      // card background
          stone: '#2a2632',      // border / divider
        },
        ink: {
          100: '#f5f1e4',        // primary text (warm cream parchment)
          300: '#d8d1bc',        // body text
          500: '#9b957f',        // muted text
          700: '#625d4e',        // disabled / helper
        },
        gold: {
          50: '#fff8e1',
          100: '#ffedb0',
          200: '#ffd968',
          300: '#f0b90b',
          400: '#d99e0b',        // primary gold — loot legendary
          500: '#b8840c',        // gold pressed state
          600: '#8a6208',
          700: '#5c4105',
        },
        rarity: {
          common: '#cfcfcf',
          uncommon: '#1eff00',
          rare: '#0070dd',
          epic: '#a335ee',
          legendary: '#ff8000',
          artifact: '#e6cc80',
        },
        accent: {
          blood: '#a41e22',      // secondary accent (sparing use)
          arcane: '#5b8cff',     // tertiary (links in running text)
        },
      },
      fontFamily: {
        display: ['"Cinzel"', 'Georgia', 'serif'],
        body: ['"Inter"', '"SF Pro Text"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3.5rem, 8vw, 6.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.15' }],
      },
      boxShadow: {
        'gold-glow': '0 0 32px -4px rgba(240, 185, 11, 0.35), 0 0 8px -2px rgba(240, 185, 11, 0.6)',
        'gold-glow-strong': '0 0 48px -4px rgba(240, 185, 11, 0.55), 0 0 12px -2px rgba(240, 185, 11, 0.8)',
        'inset-frame': 'inset 0 0 0 1px rgba(240, 185, 11, 0.2), inset 0 0 24px -8px rgba(240, 185, 11, 0.15)',
        'tooltip': '0 20px 60px -20px rgba(0, 0, 0, 0.8), 0 8px 24px -8px rgba(0, 0, 0, 0.6)',
      },
      borderRadius: {
        'tooltip': '2px',
      },
      backgroundImage: {
        'parchment-grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.95  0 0 0 0 0.9  0 0 0 0 0.7  0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        'radial-gold': 'radial-gradient(circle at 50% 0%, rgba(240, 185, 11, 0.12) 0%, transparent 60%)',
        'radial-gold-strong': 'radial-gradient(circle at 50% 50%, rgba(240, 185, 11, 0.22) 0%, transparent 60%)',
      },
      transitionTimingFunction: {
        'ornate': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'bounce-soft': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        'ember-float': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
          '10%': { opacity: '0.8' },
          '90%': { opacity: '0.4' },
          '100%': { transform: 'translateY(-100vh) translateX(20px)', opacity: '0' },
        },
        'glint': {
          '0%, 100%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { opacity: '0.6' },
          '100%': { transform: 'translateX(300%)', opacity: '0' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(240, 185, 11, 0.0)' },
          '50%': { boxShadow: '0 0 0 8px rgba(240, 185, 11, 0.08)' },
        },
        'rune-rotate': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'ember-float': 'ember-float 8s linear infinite',
        'glint': 'glint 2.5s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2.4s ease-in-out infinite',
        'rune-rotate': 'rune-rotate 40s linear infinite',
        'fade-up': 'fade-up 0.7s cubic-bezier(0.19, 1, 0.22, 1) both',
      },
    },
  },
  plugins: [],
};
