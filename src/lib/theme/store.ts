/**
 * Bakerverse Theme Engine — Store
 *
 * Tiny vanilla-JS singleton (no framework dependency) that:
 *  - Holds the current theme id in memory
 *  - Persists to / reads from localStorage key 'bakerverse.theme'
 *  - Exposes a subscribe() pattern so React and plain JS can react to changes
 *
 * Framework-independent by design — safe to import from Astro, React, or any
 * plain script. Must NOT import from React or any framework module.
 */

import { DEFAULT_THEME_ID, isValidThemeId } from './registry';

export const STORAGE_KEY = 'bakerverse.theme';

type Subscriber = (themeId: string) => void;

// ---------------------------------------------------------------------------
// Private state
// ---------------------------------------------------------------------------

let _current: string = DEFAULT_THEME_ID;
const _subscribers = new Set<Subscriber>();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readPersisted(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isValidThemeId(stored)) return stored;
  } catch {
    // localStorage unavailable (SSR, private mode, etc.) — ignore
  }
  return DEFAULT_THEME_ID;
}

function writePersisted(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Ignore write failures
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Return the currently active theme id. */
export function getThemeId(): string {
  return _current;
}

/**
 * Set the active theme id.
 * Validates the id before applying; silently ignores unknown ids.
 * Persists the selection to localStorage and notifies all subscribers.
 */
export function setThemeId(id: string): void {
  if (!isValidThemeId(id)) return;
  if (id === _current) return;
  _current = id;
  writePersisted(id);
  _subscribers.forEach((fn) => fn(_current));
}

/**
 * Subscribe to theme changes.
 * `fn` is called synchronously on every `setThemeId()` call with the new id.
 * Returns an unsubscribe function.
 *
 * @example
 * const unsub = subscribe(id => applyTheme(id));
 * // later:
 * unsub();
 */
export function subscribe(fn: Subscriber): () => void {
  _subscribers.add(fn);
  return () => {
    _subscribers.delete(fn);
  };
}

/**
 * Initialize the store from localStorage.
 * Call once on the client side (in a browser-only context).
 * Safe to call multiple times — subsequent calls are no-ops if the stored
 * value is already the current theme.
 */
export function initStore(): void {
  const persisted = readPersisted();
  if (persisted !== _current) {
    _current = persisted;
    _subscribers.forEach((fn) => fn(_current));
  }
}
