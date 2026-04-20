/**
 * Bakerverse Theme Engine — Registry
 *
 * Typed map of all available themes. Every theme is validated on import;
 * a bad theme causes a build-time error via assertValidTheme().
 *
 * To add a new theme:
 * 1. Create `src/lib/theme/themes/<id>.ts` implementing `Theme`
 * 2. Import it here and add it to THEMES
 * 3. Run `pnpm build` — the assertValidTheme call will catch any issues
 */

import type { Theme } from './schema';
import { assertValidTheme } from './validate';
import { diabloTheme } from './themes/diablo';

// ---------------------------------------------------------------------------
// Registry definition
// ---------------------------------------------------------------------------

/**
 * All registered themes, keyed by their `meta.id`.
 * Additions in Phase 3 (arcane, infernal, celestial, terminal) will go here.
 */
const THEMES: Record<string, Theme> = {
  diablo: diabloTheme,
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
export const THEME_ORDER: readonly string[] = ['diablo'];

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
  return THEME_ORDER.map(id => THEMES[id]).filter((t): t is Theme => t !== undefined);
}

/**
 * Check if a theme id is registered.
 */
export function isValidThemeId(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(THEMES, id);
}
