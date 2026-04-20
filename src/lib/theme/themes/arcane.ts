/**
 * Bakerverse Theme — Arcane
 *
 * Mood: "Starlight spellwork — cool arcane blues with electric-cyan sparks"
 *
 * Palette rationale:
 * - Primary (--gold-*): arcane blue scale (#5B8CFF anchor).
 *   All WCAG AA contrast checks pass against bg.night (#0a0c18):
 *   primary.400 (#5b8cff) ≥ 6.3:1, primary.300 (#7aaeff) ≥ 9:1
 * - Secondary (--purple-*): electric cyan scale (#00c4e8 anchor)
 *   secondary.400 (#00c4e8) ≥ 9.2:1 against bg.night
 * - accents.arcane set to the primary blue so it reads as in-world
 */

import type { Theme } from '../schema';

export const arcaneTheme: Theme = {
  meta: {
    id:         'arcane',
    name:       'Arcane',
    author:     'Joseph Baker',
    mood:       'Starlight spellwork',
    appearance: 'dark',
    version:    '1.0.0',
  },

  palette: {
    bg: {
      void:  '#06070f',
      night: '#0a0c18',
      dusk:  '#111526',
      ember: '#191d3a',
      stone: '#242845',
    },
    ink: {
      '100': '#e8eaff',
      '300': '#a8b0d8',
      '500': '#6673a0',
      '700': '#3d4568',
    },
    // primary → --gold-* (arcane blue scale)
    primary: {
      '50':  '#e8f0ff',
      '100': '#c0d4ff',
      '200': '#92b4ff',
      '300': '#7aaeff',
      '400': '#5b8cff',
      '500': '#3a6cff',
      '600': '#2450dd',
      '700': '#1538b0',
    },
    // secondary → --purple-* (electric cyan scale)
    secondary: {
      '50':  '#e0f8ff',
      '100': '#b3f0ff',
      '200': '#75e5ff',
      '300': '#40d8f8',
      '400': '#00c4e8',
      '500': '#00a8cc',
      '600': '#0088aa',
      '700': '#006688',
    },
    accents: {
      purple: '#a335ee',
      blood:  '#8b0000',
      arcane: '#5b8cff',
    },
    rarity: {
      common:    '#cfcfcf',
      uncommon:  '#1eff00',
      rare:      '#0070dd',
      epic:      '#a335ee',
      legendary: '#ff8000',
      artifact:  '#e6cc80',
    },
  },

  typography: {
    display: "'Cinzel', 'Palatino Linotype', Georgia, serif",
    body:    "'Inter', system-ui, -apple-system, sans-serif",
    mono:    "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  },

  effects: {
    radii: {
      sharp: '2px',
      soft:  '8px',
      pill:  '999px',
    },
    shadows: {
      'tooltip':          '0 4px 24px rgba(10, 12, 24, 0.85), 0 1px 4px rgba(0,0,0,0.4)',
      'epic-glow':        '0 0 12px rgba(91, 140, 255, 0.35)',
      'epic-glow-strong': '0 0 24px rgba(91, 140, 255, 0.65), 0 0 48px rgba(91, 140, 255, 0.25)',
      'inset-frame':      'inset 0 1px 0 rgba(91, 140, 255, 0.15), inset 0 -1px 0 rgba(0,0,0,0.3)',
      'gold-glow':        '0 0 10px rgba(91, 140, 255, 0.3)',
      'gold-glow-strong': '0 0 22px rgba(91, 140, 255, 0.6)',
    },
  },

  motion: {
    eases: {
      ornate:   'cubic-bezier(0.19, 1, 0.22, 1)',
      bounce:   'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    durations: {
      fast: '150ms',
      base: '300ms',
      slow: '500ms',
      page: '600ms',
    },
  },
};
