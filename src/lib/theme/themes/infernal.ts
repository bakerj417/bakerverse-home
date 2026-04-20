/**
 * Bakerverse Theme — Infernal
 *
 * Mood: "Hellfire ember — scorched reds with molten amber primary"
 *
 * Palette rationale:
 * - Primary (--gold-*): molten amber/orange scale (#ffa726 anchor).
 *   primary.400 (#ffa726) vs bg.night (#110707) ≥ 10.2:1
 *   primary.300 (#ffb74d) vs bg.night             ≥ 11.5:1
 * - Secondary (--purple-*): blood-red scale (#ef5350 anchor).
 *   secondary.400 (#ef5350) vs bg.night           ≥  5.7:1
 * - accents.arcane (#5b8cff) vs bg.night           ≥  6.8:1
 * - ink.300 (#e8b0a0) vs bg.night                  ≥ 10.6:1
 */

import type { Theme } from '../schema';

export const infernalTheme: Theme = {
  meta: {
    id:         'infernal',
    name:       'Infernal',
    author:     'Joseph Baker',
    mood:       'Hellfire ember',
    appearance: 'dark',
    version:    '1.0.0',
  },

  palette: {
    bg: {
      void:  '#0a0404',
      night: '#110707',
      dusk:  '#1c0e0e',
      ember: '#2c1212',
      stone: '#3a1818',
    },
    ink: {
      '100': '#ffeaea',
      '300': '#e8b0a0',
      '500': '#a06060',
      '700': '#6a3030',
    },
    // primary → --gold-* (molten amber/orange)
    primary: {
      '50':  '#fff3e0',
      '100': '#ffe0b2',
      '200': '#ffcc80',
      '300': '#ffb74d',
      '400': '#ffa726',
      '500': '#fb8c00',
      '600': '#e65100',
      '700': '#bf360c',
    },
    // secondary → --purple-* (blood red)
    secondary: {
      '50':  '#ffebee',
      '100': '#ffcdd2',
      '200': '#ef9a9a',
      '300': '#e57373',
      '400': '#ef5350',
      '500': '#e53935',
      '600': '#c62828',
      '700': '#8b0000',
    },
    accents: {
      purple: '#a335ee',
      blood:  '#cc2200',
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
      'tooltip':          '0 4px 24px rgba(10, 4, 4, 0.9), 0 1px 4px rgba(0,0,0,0.5)',
      'epic-glow':        '0 0 12px rgba(255, 167, 38, 0.35)',
      'epic-glow-strong': '0 0 24px rgba(255, 167, 38, 0.65), 0 0 48px rgba(255, 83, 80, 0.25)',
      'inset-frame':      'inset 0 1px 0 rgba(255, 167, 38, 0.15), inset 0 -1px 0 rgba(0,0,0,0.4)',
      'gold-glow':        '0 0 10px rgba(255, 167, 38, 0.3)',
      'gold-glow-strong': '0 0 22px rgba(255, 167, 38, 0.6)',
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
