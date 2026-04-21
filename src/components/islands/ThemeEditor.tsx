/**
 * ThemeEditor — main React island for /playground/theme-editor.
 *
 * Responsibilities:
 *   • Initialize theme state from URL hash (#t=<base64url-JSON>) if present,
 *     falling back to the selected base theme (default: diablo).
 *   • Sync theme state back to the URL hash on every change via
 *     history.replaceState (no page reload, no scroll reset).
 *   • Render the editor layout: controls ← → preview, with contrast warnings
 *     and export actions below.
 *
 * Layout (desktop: 3-column, mobile: stacked):
 *   ┌──────────────────────────────────────┐
 *   │  Base theme picker  │  Title          │
 *   ├──────────────┬───────────────────────┤
 *   │ ControlsPanel│     PreviewPane        │
 *   ├──────────────┴───────────────────────┤
 *   │ ContrastWarnings                      │
 *   ├───────────────────────────────────────┤
 *   │ ExportActions                         │
 *   └───────────────────────────────────────┘
 *
 * Constraints:
 *   • Never sets document.body.style.overflow
 *   • No new runtime dependencies
 *   • All types flow through Theme schema (src/lib/theme/schema.ts)
 */

import { useState, useEffect, useCallback } from 'react';
import type { Theme } from '@/lib/theme/schema';
import { listThemes, getThemeOrDefault, DEFAULT_THEME_ID } from '@/lib/theme/registry';
import { encodeThemeToHash, decodeThemeFromHash } from '@/lib/theme/editor/encode';
import ControlsPanel from './ControlsPanel';
import PreviewPane from './PreviewPane';
import ContrastWarnings from './ContrastWarnings';
import ExportActions from './ExportActions';

// ---------------------------------------------------------------------------
// Hash helpers
// ---------------------------------------------------------------------------

function readThemeFromHash(): Theme | null {
  if (typeof window === 'undefined') return null;
  const raw = window.location.hash;
  if (!raw.startsWith('#t=')) return null;
  return decodeThemeFromHash(raw.slice(3));
}

function writeThemeToHash(theme: Theme): void {
  if (typeof window === 'undefined') return;
  const hash = encodeThemeToHash(theme);
  history.replaceState(null, '', `#t=${hash}`);
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export default function ThemeEditor() {
  const themes = listThemes();

  // Resolve initial theme: URL hash → fall back to first registered
  const [baseId, setBaseId] = useState<string>(DEFAULT_THEME_ID);
  const [theme, setTheme] = useState<Theme>(() => {
    const fromHash = readThemeFromHash();
    if (fromHash) return fromHash;
    return getThemeOrDefault(DEFAULT_THEME_ID);
  });

  // On mount, re-read hash (handles SSR mismatch) and set baseId
  useEffect(() => {
    const fromHash = readThemeFromHash();
    if (fromHash) {
      setTheme(fromHash);
      // Try to match base id
      const matched = themes.find((t) => t.meta.id === fromHash.meta.id);
      if (matched) setBaseId(matched.meta.id);
    }
  }, []);

  // Sync theme → URL hash on every change
  useEffect(() => {
    writeThemeToHash(theme);
  }, [theme]);

  // Handle base theme change
  const handleBaseChange = useCallback(
    (id: string) => {
      setBaseId(id);
      setTheme(getThemeOrDefault(id));
    },
    [],
  );

  // Handle theme mutation from ControlsPanel
  const handleThemeChange = useCallback((next: Theme) => {
    setTheme(next);
  }, []);

  return (
    <div
      className="flex min-h-0 flex-1 flex-col gap-4"
      aria-label="Bakerverse theme editor"
    >
      {/* ── Header bar ─────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 rounded border border-white/8 bg-[var(--bg-ember)] px-4 py-3">
        <div className="flex items-center gap-2">
          <label
            htmlFor="base-theme-select"
            className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-500)]"
          >
            Base theme
          </label>
          <select
            id="base-theme-select"
            value={baseId}
            onChange={(e) => handleBaseChange(e.target.value)}
            className="rounded border border-white/10 bg-[var(--bg-dusk)] px-3 py-1 text-sm text-[var(--ink-100)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-400)]"
            aria-label="Select base theme to start from"
          >
            {themes.map((t) => (
              <option key={t.meta.id} value={t.meta.id}>
                {t.meta.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1" />

        <p className="text-xs text-[var(--ink-700)]">
          Editing: <span className="font-mono text-[var(--ink-300)]">{theme.meta.id}</span>
          {' · '}
          <span className="text-[var(--ink-500)]">{theme.meta.mood}</span>
        </p>
      </div>

      {/* ── Main editor layout ──────────────────────────── */}
      <div className="grid min-h-0 gap-4 lg:grid-cols-[320px_1fr]">
        {/* Controls */}
        <div className="rounded border border-white/8 bg-[var(--bg-ember)] p-3">
          <h2
            className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--gold-500)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Tokens
          </h2>
          <ControlsPanel theme={theme} onChange={handleThemeChange} />
        </div>

        {/* Preview */}
        <div
          className="min-h-64 overflow-hidden rounded border border-white/8 lg:min-h-0"
          aria-label="Live theme preview"
        >
          <PreviewPane theme={theme} />
        </div>
      </div>

      {/* ── Contrast warnings ──────────────────────────── */}
      <ContrastWarnings theme={theme} />

      {/* ── Export ─────────────────────────────────────── */}
      <div className="rounded border border-white/8 bg-[var(--bg-ember)] px-4 py-3">
        <h2
          className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--gold-500)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Export
        </h2>
        <ExportActions theme={theme} />
      </div>
    </div>
  );
}
