/**
 * Bakerverse Theme Engine — SSR helpers
 *
 * These functions run at Astro render time and return strings that are
 * injected directly into HTML. They do not reference browser APIs.
 *
 * Insertion order in BaseLayout.astro:
 *   1. foucGuardScript()   — inline <script> at the very top of <head>, before
 *      any stylesheets. Reads localStorage and sets data-theme on <html> so
 *      the FIRST paint already uses the correct theme CSS variable block.
 *   2. initialThemeStyle() — inline <style> with the full :root block for the
 *      server-resolved theme. When JS is disabled this is the only theming.
 *      On first client paint the client-side engine may replace it if the
 *      user's localStorage differs from the server default.
 *
 * Usage in BaseLayout.astro:
 *   ```astro
 *   <script set:html={foucGuardScript()} />
 *   <style  set:html={initialThemeStyle()} />
 *   ```
 */

import { DEFAULT_THEME_ID, getThemeOrDefault } from './registry';
import { toCss, foucGuard } from './toCss';

/**
 * Returns the raw JS string for the FOUC-guard inline script.
 * Embed as: `<script set:html={foucGuardScript()} />`
 *
 * The script is <200 B, has no dependencies, and executes synchronously
 * so it runs before the browser paints any content.
 */
export function foucGuardScript(): string {
  return foucGuard();
}

/**
 * Returns the full CSS for the given theme id (defaults to the default theme).
 * Embed as: `<style id="bakerverse-theme" set:html={initialThemeStyle()} />`
 *
 * This is the server-rendered initial style. The client-side applyTheme()
 * call will overwrite it on hydration when the user has a stored preference.
 */
export function initialThemeStyle(themeId: string = DEFAULT_THEME_ID): string {
  const theme = getThemeOrDefault(themeId);
  return toCss(theme);
}
