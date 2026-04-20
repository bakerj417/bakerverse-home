/**
 * Bakerverse Theme — Terminal
 *
 * Mood: "Hacker green — phosphor CRT glow on void black"
 *
 * Palette rationale:
 * - Primary (--gold-*): terminal green scale (#00bb00 anchor).
 *   primary.400 (#00bb00) vs bg.night (#050a05) ≥ 7.64:1
 *   primary.300 (#40cc40) vs bg.night            ≥ 9.38:1
 * - Secondary (--purple-*): chartreuse/yellow-green (#88cc00 anchor).
 *   secondary.400 (#88cc00) vs bg.night          ≥ 10.1:1
 * - accents.arcane (#44aaff) vs bg.night          ≥  7.96:1
 * - ink.300 (#88cc88) vs bg.night                 ≥ 10.4:1
 */

import type { Theme } from '../schema';

export const terminalTheme: Theme = {
  meta: {
    id:         'terminal',
    name:       'Terminal',
    author:     'Joseph Baker',
    mood:       'Hacker green',
    appearance: 'dark',
    version:    '1.0.0',
  },

  palette: {
    bg: {
      void:  '#000000',
      night: '#050a05',
      dusk:  '#0a140a',
      ember: '#0f1f0f',
      stone: '#152015',
    },
    ink: {
      '100': '#e0ffe0',
      '300': '#88cc88',
      '500': '#406040',
      '700': '#204020',
    },
    // primary → --gold-* (phosphor terminal green)
    primary: {
      '50':  '#e8ffe8',
      '100': '#c0f0c0',
      '200': '#80e080',
      '300': '#40cc40',
      '400': '#00bb00',
      '500': '#009900',
      '600': '#007700',
      '700': '#005500',
    },
    // secondary → --purple-* (chartreuse / yellow-green)
    secondary: {
      '50':  '#f0ffe0',
      '100': '#d8ffa0',
      '200': '#b8f060',
      '300': '#a0e030',
      '400': '#88cc00',
      '500': '#68aa00',
      '600': '#508800',
      '700': '#386600',
    },
    accents: {
      purple: '#a335ee',
      blood:  '#cc2200',
      arcane: '#44aaff',
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
    display: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    body:    "'JetBrains Mono', 'Fira Code', monospace",
    mono:    "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  },

  effects: {
    radii: {
      sharp: '0px',
      soft:  '2px',
      pill:  '2px',
    },
    shadows: {
      'tooltip':          '0 4px 24px rgba(0, 0, 0, 0.95), 0 1px 4px rgba(0,0,0,0.6)',
      'epic-glow':        '0 0 12px rgba(0, 187, 0, 0.45)',
      'epic-glow-strong': '0 0 24px rgba(0, 187, 0, 0.75), 0 0 48px rgba(0, 187, 0, 0.30)',
      'inset-frame':      'inset 0 1px 0 rgba(0, 187, 0, 0.25), inset 0 -1px 0 rgba(0,0,0,0.5)',
      'gold-glow':        '0 0 10px rgba(0, 187, 0, 0.4)',
      'gold-glow-strong': '0 0 22px rgba(0, 187, 0, 0.7)',
    },
  },

  motion: {
    eases: {
      ornate:   'cubic-bezier(0.19, 1, 0.22, 1)',
      bounce:   'steps(4, end)',
      standard: 'steps(2, end)',
    },
    durations: {
      fast: '80ms',
      base: '160ms',
      slow: '300ms',
      page: '400ms',
    },
  },
};
