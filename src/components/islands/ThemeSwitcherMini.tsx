/**
 * ThemeSwitcherMini — compact inline theme demonstration island.
 *
 * Used in the /projects hero bento to showcase the Theme Engine project.
 * Renders a row of theme colour swatches; clicking one applies the theme
 * site-wide via the existing useTheme hook.
 *
 * Intentionally minimal: no controls beyond theme selection. Full editing
 * lives at /playground/theme-editor.
 */

import { useCallback } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { listThemes } from '@/lib/theme/registry';

const themes = listThemes();

export default function ThemeSwitcherMini() {
  const [activeId, setActive] = useTheme();

  const handleSelect = useCallback(
    (id: string) => {
      setActive(id);
    },
    [setActive],
  );

  return (
    <div
      className="theme-switcher-mini"
      role="group"
      aria-label="Live theme switcher — select a theme"
    >
      <p className="tsm-label">Live demo — pick a theme:</p>
      <div className="tsm-grid">
        {themes.map((t) => {
          const isActive = t.meta.id === activeId;
          return (
            <button
              key={t.meta.id}
              type="button"
              onClick={() => handleSelect(t.meta.id)}
              aria-pressed={isActive}
              aria-label={`Switch to ${t.meta.name} theme`}
              title={t.meta.name}
              className={`tsm-swatch ${isActive ? 'tsm-swatch--active' : ''}`}
              style={{
                '--swatch-primary': t.palette.primary['400'],
                '--swatch-secondary': t.palette.secondary['400'],
                '--swatch-bg': t.palette.bg.night,
              } as React.CSSProperties}
            >
              {/* Three-colour preview dot stack */}
              <span className="tsm-dots" aria-hidden="true">
                <span
                  className="tsm-dot"
                  style={{ background: t.palette.bg.night }}
                />
                <span
                  className="tsm-dot"
                  style={{ background: t.palette.primary['400'] }}
                />
                <span
                  className="tsm-dot"
                  style={{ background: t.palette.secondary['400'] }}
                />
              </span>
              <span className="tsm-name">{t.meta.name}</span>
              {isActive && (
                <span className="tsm-active-mark" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      <a
        href="/playground/theme-editor"
        className="tsm-editor-link"
        aria-label="Open the full theme editor to create your own theme"
      >
        Open editor & create your own →
      </a>

      <style>{`
        .theme-switcher-mini {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .tsm-label {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-500);
          font-family: var(--font-mono);
          margin: 0;
        }
        .tsm-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .tsm-swatch {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          cursor: pointer;
          transition: border-color 180ms ease, background 180ms ease;
          color: var(--ink-300);
          font-size: 0.8rem;
        }
        .tsm-swatch:hover {
          border-color: var(--swatch-primary, var(--gold-400));
          background: rgba(255,255,255,0.07);
          color: var(--ink-100);
        }
        .tsm-swatch:focus-visible {
          outline: 2px solid var(--swatch-primary, var(--gold-400));
          outline-offset: 2px;
        }
        .tsm-swatch--active {
          border-color: var(--swatch-primary, var(--gold-400));
          background: rgba(255,255,255,0.08);
          color: var(--ink-100);
        }
        .tsm-dots {
          display: flex;
          gap: 2px;
          flex-shrink: 0;
        }
        .tsm-dot {
          display: block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .tsm-name {
          font-family: var(--font-display);
          font-size: 0.78rem;
          letter-spacing: 0.03em;
        }
        .tsm-active-mark {
          font-size: 0.65rem;
          color: var(--swatch-primary, var(--gold-400));
          margin-left: 2px;
        }
        .tsm-editor-link {
          font-size: 0.78rem;
          color: var(--gold-400);
          text-decoration: none;
          font-family: var(--font-mono);
          transition: color 150ms ease;
        }
        .tsm-editor-link:hover {
          color: var(--gold-300);
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
