/**
 * Bakerverse Theme Engine — Apply
 *
 * Client-side function: given a theme id, injects the generated CSS into a
 * `<style id="bakerverse-theme">` tag and updates `<html>` attributes.
 *
 * This is the single place where the DOM mutation for a theme swap happens.
 * Call it from the store subscriber or directly from the switcher UI.
 *
 * Not safe for SSR — references `document`. Only call from browser contexts
 * (React islands, client scripts, event handlers).
 */

import { getTheme } from './registry';
import { toCss } from './toCss';

const STYLE_ID = 'bakerverse-theme';

/**
 * Apply a theme to the document.
 *
 * - Injects / replaces the `<style id="bakerverse-theme">` tag in `<head>`
 * - Sets `data-theme="<id>"` and `data-appearance="dark|light"` on `<html>`
 *
 * Safe to call from any browser-side context (island, script, hook).
 * No-ops gracefully if the theme id is unknown.
 */
export function applyTheme(id: string): void {
  const theme = getTheme(id);
  if (!theme) return;

  const css = toCss(theme);

  // Update or create the <style> element
  let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = css;

  // Update <html> attributes for CSS/component selectors
  document.documentElement.setAttribute('data-theme', id);
  document.documentElement.setAttribute('data-appearance', theme.meta.appearance);
}
