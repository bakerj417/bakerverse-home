/**
 * Bakerverse Theme Engine — Registry
 *
 * Typed map of all available themes. Every theme is validated on import;
 * a bad theme causes a build-time error via assertValidTheme().
 *
 * To add a new theme:
 * 1. Create `src/lib/theme/themes/<id>.ts` implementing `Theme`
 * 2. Import it here and add it to THEMES and THEME_ORDER
 * 3. Run `pnpm build` — the assertValidTheme call will catch any issues
 */

import type { Theme } from './schema';
import { assertValidTheme } from './validate';
import { diabloTheme }    from './themes/diablo';
import { arcaneTheme }    from './themes/arcane';
import { infernalTheme }  from './themes/infernal';
import { celestialTheme } from './themes/celestial';
import { terminalTheme }  from './themes/terminal';

// ---------------------------------------------------------------------------
// Registry definition
// ---------------------------------------------------------------------------

/**
 * All registered themes, keyed by their `meta.id`.
 */
const THEMES: Record<string, Theme> = {
  diablo:    diabloTheme,
  arcane:    arcaneTheme,
  infernal:  infernalTheme,
  celestial: celestialTheme,
  terminal:  terminalTheme,
};

// Validate every theme at module load time — fail fast, fail loud.
for (const theme of Object.values(THEMES)) {
  assertValidTheme(theme);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** The default theme id, used when no preference is stored. */
export const DEFAULT_THEME_ID = 'diablo';

/** Ordered list of theme ids for display in the switcher UI. */
export const THEME_ORDER: readonly string[] = [
  'diablo',
  'arcane',
  'infernal',
  'celestial',
  'terminal',
];

/**
 * Look up a theme by id. Returns undefined for unknown ids.
 * Callers should fall back to `getTheme(DEFAULT_THEME_ID)` on undefined.
 */
export function getTheme(id: string): Theme | undefined {
  return THEMES[id];
}

/**
 * Look up a theme by id with a fallback to the default theme.
 * Always returns a valid Theme.
 */
export function getThemeOrDefault(id: string): Theme {
  return THEMES[id] ?? THEMES[DEFAULT_THEME_ID]!;
}

/**
 * All registered themes as an ordered array, for rendering picker UI.
 */
export function listThemes(): Theme[] {
  return THEME_ORDER.map((id) => THEMES[id]).filter((t): t is Theme => t !== undefined);
}

/**
 * Check if a theme id is registered.
 */
export function isValidThemeId(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(THEMES, id);
}
