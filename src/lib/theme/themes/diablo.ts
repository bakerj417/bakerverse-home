/**
 * Bakerverse Theme Engine — Diablo Theme
 *
 * 1:1 port of the values from src/styles/tokens.css as of 2026-04-19.
 * This is the canonical default theme: "Diablo loot gold on a void-black sky".
 *
 * Gold is primary, epic purple is secondary.
 * Blood red and arcane blue are available as accent moments.
 */

import type { Theme } from '../schema';

export const diabloTheme: Theme = {
  meta: {
    id: 'diablo',
    name: 'Diablo',
    author: 'Joseph Baker',
    mood: 'Dark cathedral gold — loot drops from the abyss',
    appearance: 'dark',
    version: '1.0.0',
  },

  palette: {
    bg: {
      void:  '#07060a',
      night: '#0d0c14',
      dusk:  '#15131d',
      ember: '#1d1a26',
      stone: '#2a2632',
    },

    ink: {
      '100': '#f5f1e4',
      '300': '#d8d1bc',
      '500': '#9b957f',
      '700': '#625d4e',
    },

    // primary = Diablo loot gold (maps to --gold-* CSS vars)
    primary: {
      '50':  '#fff8e1',
      '100': '#ffedb0',
      '200': '#ffd968',
      '300': '#f0b90b',
      '400': '#d99e0b',
      '500': '#b8840c',
      '600': '#8a6208',
      '700': '#5c4105',
    },

    // secondary = WoW epic purple (maps to --purple-* CSS vars)
    secondary: {
      '50':  '#f5e9fd',
      '100': '#e4bdf9',
      '200': '#cc85f4',
      '300': '#b557ef',
      '400': '#a335ee',  // WoW epic rarity canonical
      '500': '#8a22d4',
      '600': '#6b15a8',
      '700': '#4d0c7a',
    },

    accents: {
      purple: '#a335ee',  // references secondary-400 value
      blood:  '#8b0000',  // Diablo blood red
      arcane: '#5b8cff',  // deep arcane blue
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
    display: '"Cinzel", Georgia, serif',
    body:    '"Inter", "SF Pro Text", system-ui, sans-serif',
    mono:    '"JetBrains Mono", ui-monospace, monospace',
  },

  effects: {
    shadows: {
      tooltip:
        '0 20px 60px -20px rgba(0, 0, 0, 0.85), 0 8px 24px -8px rgba(0, 0, 0, 0.6)',
      'epic-glow':
        '0 0 32px -4px rgba(163, 53, 238, 0.35), 0 0 8px -2px rgba(163, 53, 238, 0.6)',
      'epic-glow-strong':
        '0 0 48px -4px rgba(163, 53, 238, 0.55), 0 0 12px -2px rgba(163, 53, 238, 0.8)',
      'inset-frame':
        'inset 0 0 0 1px rgba(240, 185, 11, 0.2), inset 0 0 24px -8px rgba(240, 185, 11, 0.15)',
      'gold-glow':
        '0 0 32px -4px rgba(240, 185, 11, 0.35), 0 0 8px -2px rgba(240, 185, 11, 0.6)',
      'gold-glow-strong':
        '0 0 48px -4px rgba(240, 185, 11, 0.55), 0 0 12px -2px rgba(240, 185, 11, 0.8)',
    },

    radii: {
      sharp: '2px',
      soft:  '8px',
      pill:  '999px',
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
