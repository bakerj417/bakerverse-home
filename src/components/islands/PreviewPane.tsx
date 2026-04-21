/**
 * PreviewPane — live-rendered preview of a Theme using inline CSS vars.
 *
 * Injects a scoped `<style>` tag (keyed by theme id for uniqueness) that
 * mirrors what `toCss()` would generate, scoped to the preview container
 * instead of `:root`. This means the preview is fully isolated — it cannot
 * affect the rest of the page, and the site's active theme continues
 * operating normally.
 *
 * The preview renders a representative slice of the Bakerverse UI grammar:
 * - Page chrome (dark background)
 * - Heading with display font
 * - Body text paragraph
 * - Item tooltip card (signature Bakerverse UI pattern)
 * - Rarity badges
 * - Primary button + ghost button
 */

import { useId } from 'react';
import type { Theme } from '@/lib/theme/schema';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a hex colour to space-separated R G B values for CSS `-rgb` vars. */
function hexToRgbParts(hex: string): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return '0 0 0';
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

/** Generate a scoped CSS block for the preview container. */
function buildPreviewCss(theme: Theme, scope: string): string {
  const { palette, typography } = theme;
  const p = palette;

  const vars = [
    // backgrounds
    `--bg-void: ${p.bg.void}`,
    `--bg-night: ${p.bg.night}`,
    `--bg-dusk: ${p.bg.dusk}`,
    `--bg-ember: ${p.bg.ember}`,
    `--bg-stone: ${p.bg.stone}`,
    `--bg-night-rgb: ${hexToRgbParts(p.bg.night)}`,
    // ink
    `--ink-100: ${p.ink['100']}`,
    `--ink-300: ${p.ink['300']}`,
    `--ink-500: ${p.ink['500']}`,
    `--ink-700: ${p.ink['700']}`,
    // primary (→ --gold-*)
    `--gold-50: ${p.primary['50']}`,
    `--gold-100: ${p.primary['100']}`,
    `--gold-200: ${p.primary['200']}`,
    `--gold-300: ${p.primary['300']}`,
    `--gold-400: ${p.primary['400']}`,
    `--gold-500: ${p.primary['500']}`,
    `--gold-600: ${p.primary['600']}`,
    `--gold-700: ${p.primary['700']}`,
    // secondary (→ --purple-*)
    `--purple-50: ${p.secondary['50']}`,
    `--purple-100: ${p.secondary['100']}`,
    `--purple-200: ${p.secondary['200']}`,
    `--purple-300: ${p.secondary['300']}`,
    `--purple-400: ${p.secondary['400']}`,
    `--purple-500: ${p.secondary['500']}`,
    `--purple-600: ${p.secondary['600']}`,
    `--purple-700: ${p.secondary['700']}`,
    // accents
    `--accent-purple: ${p.accents.purple}`,
    `--accent-blood: ${p.accents.blood}`,
    `--accent-arcane: ${p.accents.arcane}`,
    // rarity
    `--rarity-common: ${p.rarity.common}`,
    `--rarity-uncommon: ${p.rarity.uncommon}`,
    `--rarity-rare: ${p.rarity.rare}`,
    `--rarity-epic: ${p.rarity.epic}`,
    `--rarity-legendary: ${p.rarity.legendary}`,
    `--rarity-artifact: ${p.rarity.artifact}`,
    // typography
    `--font-display: ${typography.display}`,
    `--font-body: ${typography.body}`,
    `--font-mono: ${typography.mono}`,
  ];

  return `
    ${scope} {
      ${vars.join(';\n      ')};
    }
  `;
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

interface PreviewPaneProps {
  theme: Theme;
}

export default function PreviewPane({ theme }: PreviewPaneProps) {
  const uid = useId().replace(/:/g, '');
  const scopeClass = `bv-preview-${uid}`;

  const css = buildPreviewCss(theme, `.${scopeClass}`);

  const rarityOrder = [
    ['common',    theme.palette.rarity.common],
    ['uncommon',  theme.palette.rarity.uncommon],
    ['rare',      theme.palette.rarity.rare],
    ['epic',      theme.palette.rarity.epic],
    ['legendary', theme.palette.rarity.legendary],
    ['artifact',  theme.palette.rarity.artifact],
  ] as const;

  return (
    <div
      className={`${scopeClass} h-full overflow-y-auto rounded`}
      style={{
        backgroundColor: 'var(--bg-night)',
        fontFamily: 'var(--font-body)',
        color: 'var(--ink-100)',
      }}
      aria-label="Theme preview"
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="space-y-4 p-4">
        {/* ── Header ──────────────────────────────── */}
        <header className="border-b pb-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2
            className="text-2xl font-bold tracking-wide"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--gold-400)',
            }}
          >
            {theme.meta.name}
          </h2>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--ink-500)' }}>
            {theme.meta.mood}
          </p>
        </header>

        {/* ── Item tooltip card ───────────────────── */}
        <div
          className="rounded p-3"
          style={{
            backgroundColor: 'var(--bg-ember)',
            border: `1px solid var(--gold-600)`,
            boxShadow: `0 0 12px rgba(var(--bg-night-rgb), 0.8)`,
          }}
        >
          <p
            className="text-sm font-semibold"
            style={{ color: 'var(--gold-300)', fontFamily: 'var(--font-display)' }}
          >
            [Epic] Theme Token
          </p>
          <p className="mt-1 text-xs" style={{ color: 'var(--ink-300)' }}>
            Item Level 5 · Bakerverse Theme Engine
          </p>
          <hr className="my-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />
          <p className="text-xs" style={{ color: 'var(--ink-100)' }}>
            Equip: All visual tokens scale from this theme.
          </p>
          <p className="mt-1 text-xs" style={{ color: 'var(--purple-400)' }}>
            Set Bonus: WCAG AA contrast enforced.
          </p>
        </div>

        {/* ── Rarity badges ───────────────────────── */}
        <div className="flex flex-wrap gap-1.5">
          {rarityOrder.map(([name, colour]) => (
            <span
              key={name}
              className="rounded px-2 py-0.5 text-xs font-semibold"
              style={{
                color: colour,
                border: `1px solid ${colour}40`,
                backgroundColor: `${colour}12`,
              }}
            >
              {name}
            </span>
          ))}
        </div>

        {/* ── Body copy ───────────────────────────── */}
        <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-300)' }}>
          The Bakerverse is Joseph Baker's personal empire — tools, services, and
          automation woven together under one domain. This theme controls every
          visual token.
        </p>

        {/* ── Buttons ─────────────────────────────── */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded px-4 py-1.5 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{
              backgroundColor: 'var(--gold-400)',
              color: 'var(--bg-void)',
              fontFamily: 'var(--font-display)',
            }}
          >
            Primary action
          </button>
          <button
            type="button"
            className="rounded border px-4 py-1.5 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{
              borderColor: 'var(--gold-400)',
              color: 'var(--gold-400)',
              backgroundColor: 'transparent',
              fontFamily: 'var(--font-display)',
            }}
          >
            Ghost action
          </button>
          <button
            type="button"
            className="rounded px-4 py-1.5 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{
              backgroundColor: 'var(--purple-500)',
              color: 'var(--ink-100)',
              fontFamily: 'var(--font-display)',
            }}
          >
            Arcane action
          </button>
        </div>

        {/* ── Code sample ─────────────────────────── */}
        <pre
          className="overflow-x-auto rounded p-3 text-xs"
          style={{
            backgroundColor: 'var(--bg-void)',
            fontFamily: 'var(--font-mono)',
            color: 'var(--gold-200)',
          }}
        >
          <code>{`--gold-400: ${theme.palette.primary['400']};
--purple-400: ${theme.palette.secondary['400']};
--bg-night: ${theme.palette.bg.night};`}</code>
        </pre>
      </div>
    </div>
  );
}
