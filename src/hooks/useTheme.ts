/**
 * Bakerverse Theme Engine — useTheme React hook
 *
 * Connects React islands to the vanilla store/apply pipeline.
 * Returns `[themeId, setTheme]` — same shape as `useState` but backed by the
 * singleton store so all islands on the page stay in sync.
 *
 * Usage:
 *   const [theme, setTheme] = useTheme();
 *
 * Rules:
 * - Only call from a React component (island). Do not call from Astro files.
 * - The hook initialises from localStorage on first render, so the displayed
 *   theme id reflects the user's persisted choice.
 */

import { useState, useEffect } from 'react';
import {
  getThemeId,
  setThemeId as storeSet,
  subscribe,
  initStore,
} from '../lib/theme/store';
import { applyTheme } from '../lib/theme/apply';

/**
 * Returns `[currentThemeId, setTheme]`.
 *
 * On mount:
 *  1. Reads the persisted preference from localStorage via `initStore()`.
 *  2. Applies the resolved theme to the DOM via `applyTheme()`.
 *  3. Subscribes to future store changes so the component re-renders when
 *     another island (or the switcher) changes the theme.
 *
 * On unmount: automatically unsubscribes from the store.
 */
export function useTheme(): [string, (id: string) => void] {
  // Initialise to the in-memory store value (avoids flash to default on remount)
  const [themeId, setLocal] = useState<string>(getThemeId);

  useEffect(() => {
    // Sync store from localStorage — may differ from the SSR default
    initStore();
    const current = getThemeId();
    setLocal(current);
    applyTheme(current);

    // Mirror future store mutations into local state + DOM
    const unsub = subscribe((id) => {
      setLocal(id);
      applyTheme(id);
    });

    return unsub;
  }, []);

  const setTheme = (id: string): void => {
    storeSet(id); // store notifies all subscribers, including this hook
  };

  return [themeId, setTheme];
}
