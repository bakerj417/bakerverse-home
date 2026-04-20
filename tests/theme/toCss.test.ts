/**
 * tests/theme/toCss.test.ts
 *
 * Unit tests for the toCss pure function.
 * Run with: pnpm test
 */

import { describe, it, expect } from 'vitest';
import { toCss, foucGuard } from '../../src/lib/theme/toCss';
import { diabloTheme } from '../../src/lib/theme/themes/diablo';

describe('toCss', () => {
  it('returns a string', () => {
    const css = toCss(diabloTheme);
    expect(typeof css).toBe('string');
  });

  it('opens with a :root block', () => {
    const css = toCss(diabloTheme);
    expect(css).toContain(':root {');
  });

  it('closes the :root block', () => {
    const css = toCss(diabloTheme);
    expect(css).toContain('}');
  });

  it('emits --bg-void with the correct Diablo value', () => {
    const css = toCss(diabloTheme);
    expect(css).toContain('--bg-void: #07060a');
  });

  it('emits --bg-night', () => {
    expect(toCss(diabloTheme)).toContain('--bg-night: #0d0c14');
  });

  it('emits --gold-400 (primary.400)', () => {
    expect(toCss(diabloTheme)).toContain('--gold-400: #d99e0b');
  });

  it('emits --purple-400 (secondary.400)', () => {
    expect(toCss(diabloTheme)).toContain('--purple-400: #a335ee');
  });

  it('emits --color-primary as a hex value (semantic alias)', () => {
    const css = toCss(diabloTheme);
    expect(css).toContain('--color-primary: #d99e0b');
  });

  it('emits --font-display', () => {
    const css = toCss(diabloTheme);
    expect(css).toContain('--font-display:');
    expect(css).toContain('Cinzel');
  });

  it('emits RGB channel variants for bg.night', () => {
    const css = toCss(diabloTheme);
    // #0d0c14 = 13, 12, 20
    expect(css).toContain('--bg-night-rgb: 13, 12, 20');
  });

  it('emits RGB channel variants for gold-300', () => {
    const css = toCss(diabloTheme);
    // #f0b90b = 240, 185, 11
    expect(css).toContain('--gold-300-rgb: 240, 185, 11');
  });

  it('emits --radius-sharp', () => {
    expect(toCss(diabloTheme)).toContain('--radius-sharp: 2px');
  });

  it('emits --dur-fast', () => {
    expect(toCss(diabloTheme)).toContain('--dur-fast: 150ms');
  });

  it('emits the spacing scale', () => {
    const css = toCss(diabloTheme);
    expect(css).toContain('--space-1:  0.25rem');
    expect(css).toContain('--space-32: 8rem');
  });

  it('emits the reduced-motion override block', () => {
    const css = toCss(diabloTheme);
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('--dur-fast: 0ms');
    expect(css).toContain('--dur-page: 0ms');
  });

  it('emits --rarity-epic', () => {
    expect(toCss(diabloTheme)).toContain('--rarity-epic: #a335ee');
  });

  it('emits shadow tokens', () => {
    const css = toCss(diabloTheme);
    expect(css).toContain('--shadow-tooltip:');
    expect(css).toContain('--shadow-gold-glow:');
    expect(css).toContain('--shadow-epic-glow:');
  });

  it('is deterministic: same input → same output', () => {
    expect(toCss(diabloTheme)).toBe(toCss(diabloTheme));
  });

  it('reflects theme meta id in output', () => {
    expect(toCss(diabloTheme)).toContain('--theme-id: "diablo"');
  });
});

describe('foucGuard', () => {
  it('returns a string', () => {
    expect(typeof foucGuard()).toBe('string');
  });

  it('references localStorage', () => {
    expect(foucGuard()).toContain('localStorage');
  });

  it('references bakerverse.theme key', () => {
    expect(foucGuard()).toContain('bakerverse.theme');
  });

  it('references data-theme attribute', () => {
    expect(foucGuard()).toContain('data-theme');
  });

  it('is wrapped in an IIFE', () => {
    const script = foucGuard();
    expect(script.startsWith('(function')).toBe(true);
  });
});
