/**
 * Bakerverse Theme Engine — Schema
 *
 * Canonical TypeScript type for a theme object. Every visual token in the
 * design system must be representable here. The `toCss` function maps this
 * nested structure to CSS custom properties that match the existing
 * `--bg-void` / `--gold-400` naming convention, so no downstream component
 * code needs changing when themes swap.
 *
 * Design decisions:
 * - `palette.primary` maps to `--gold-*` CSS vars (primary accent scale).
 *   In the Diablo theme this IS gold; other themes plug in their own primary
 *   hue but the CSS variable name stays `--gold-*` so components need no
 *   edits.
 * - `palette.secondary` maps to `--purple-*` CSS vars (secondary scale).
 * - Spacing is a global constant (not per-theme) and lives in toCss.ts as a
 *   static emit.
 * - Contrast validation is enforced in validate.ts before a theme may enter
 *   the registry.
 */

export type ThemeMeta = {
  /** Unique machine identifier, e.g. "diablo" */
  id: string;
  /** Human-readable display name */
  name: string;
  /** Author credit (display name or handle) */
  author: string;
  /** Evocative mood descriptor, e.g. "Dark cathedral gold" */
  mood: string;
  /** Light or dark — drives `data-appearance` on `<html>` */
  appearance: 'dark' | 'light';
  /** Semver string for the theme definition */
  version: string;
};

export type PrimaryScale = Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700', string>;
export type SecondaryScale = PrimaryScale;
export type InkScale = Record<'100' | '300' | '500' | '700', string>;

export type ThemePalette = {
  bg: {
    void: string;
    night: string;
    dusk: string;
    ember: string;
    stone: string;
  };
  ink: InkScale;
  /** Maps to --gold-* CSS vars — the primary accent scale for this theme */
  primary: PrimaryScale;
  /** Maps to --purple-* CSS vars — the secondary accent scale for this theme */
  secondary: SecondaryScale;
  accents: {
    purple: string;
    blood: string;
    arcane: string;
  };
  rarity: Record<'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'artifact', string>;
};

export type ThemeTypography = {
  display: string;
  body: string;
  mono: string;
};

export type ThemeEffects = {
  shadows: Record<string, string>;
  radii: Record<string, string>;
};

export type ThemeMotion = {
  eases: Record<string, string>;
  durations: Record<string, string>;
};

/**
 * A complete Bakerverse theme definition.
 * Every field is required — partial themes are not valid.
 */
export type Theme = {
  meta: ThemeMeta;
  palette: ThemePalette;
  typography: ThemeTypography;
  effects: ThemeEffects;
  motion: ThemeMotion;
};
