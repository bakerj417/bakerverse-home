/**
 * Bakerverse Theme — Celestial
 *
 * Mood: "Moonlit vault — silver starlight with astral silver-blue primary"
 *
 * Palette rationale:
 * - Primary (--gold-*): silver/moonlight scale (#8a96e8 anchor).
 *   primary.400 (#8a96e8) vs bg.night (#0c0e16) ≥ 6.97:1
 *   primary.300 (#b0b8f0) vs bg.night            ≥ 10.1:1
 * - Secondary (--purple-*): starlight-gold scale (#e0a800 anchor).
 *   secondary.400 (#e0a800) vs bg.night          ≥  8.97:1
 * - accents.arcane (#6080ff) vs bg.night          ≥  5.52:1
 * - ink.300 (#b8c0e0) vs bg.night                 ≥ 10.7:1
 */

import type { Theme } from '../schema';

export const celestialTheme: Theme = {
  meta: {
    id:         'celestial',
    name:       'Celestial',
    author:     'Joseph Baker',
    mood:       'Moonlit vault',
    appearance: 'dark',
    version:    '1.0.0',
  },

  palette: {
    bg: {
      void:  '#07080c',
      night: '#0c0e16',
      dusk:  '#131624',
      ember: '#1c2035',
      stone: '#252845',
    },
    ink: {
      '100': '#f0f2ff',
      '300': '#b8c0e0',
      '500': '#707898',
      '700': '#404870',
    },
    // primary → --gold-* (astral silver-blue)
    primary: {
      '50':  '#f8f8ff',
      '100': '#e8eaff',
      '200': '#d0d4f8',
      '300': '#b0b8f0',
      '400': '#8a96e8',
      '500': '#6472d8',
      '600': '#4855c0',
      '700': '#3040a0',
    },
    // secondary → --purple-* (starlight gold)
    secondary: {
      '50':  '#fffff0',
      '100': '#fff8dc',
      '200': '#ffe066',
      '300': '#f0c040',
      '400': '#e0a800',
      '500': '#c08800',
      '600': '#9a6800',
      '700': '#7a5000',
    },
    accents: {
      purple: '#b070ff',
      blood:  '#8b0000',
      arcane: '#6080ff',
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
      'tooltip':          '0 4px 24px rgba(7, 8, 12, 0.88), 0 1px 4px rgba(0,0,0,0.4)',
      'epic-glow':        '0 0 12px rgba(138, 150, 232, 0.35)',
      'epic-glow-strong': '0 0 24px rgba(138, 150, 232, 0.65), 0 0 48px rgba(96, 128, 255, 0.25)',
      'inset-frame':      'inset 0 1px 0 rgba(138, 150, 232, 0.15), inset 0 -1px 0 rgba(0,0,0,0.3)',
      'gold-glow':        '0 0 10px rgba(138, 150, 232, 0.3)',
      'gold-glow-strong': '0 0 22px rgba(138, 150, 232, 0.6)',
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
