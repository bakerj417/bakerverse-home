/**
 * tests/theme/validate.test.ts
 *
 * Unit tests for the WCAG contrast validator and structural checks.
 * Run with: pnpm test
 */

import { describe, it, expect } from 'vitest';
import {
  relativeLuminance,
  contrastRatio,
  validateTheme,
  assertValidTheme,
} from '../../src/lib/theme/validate';
import type { Theme } from '../../src/lib/theme/schema';
import { diabloTheme } from '../../src/lib/theme/themes/diablo';

// ---------------------------------------------------------------------------
// relativeLuminance
// ---------------------------------------------------------------------------

describe('relativeLuminance', () => {
  it('returns 0 for pure black', () => {
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 5);
  });

  it('returns 1 for pure white', () => {
    expect(relativeLuminance('#ffffff')).toBeCloseTo(1, 5);
  });

  it('returns a value between 0 and 1 for mid-grey', () => {
    const l = relativeLuminance('#808080');
    expect(l).toBeGreaterThan(0);
    expect(l).toBeLessThan(1);
  });
});

// ---------------------------------------------------------------------------
// contrastRatio
// ---------------------------------------------------------------------------

describe('contrastRatio', () => {
  it('returns 21 for black on white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
  });

  it('returns 1 for same color (black on black)', () => {
    expect(contrastRatio('#000000', '#000000')).toBeCloseTo(1, 5);
  });

  it('is symmetric (fg/bg order does not matter)', () => {
    const a = contrastRatio('#a335ee', '#0d0c14');
    const b = contrastRatio('#0d0c14', '#a335ee');
    expect(a).toBeCloseTo(b, 10);
  });

  it('WCAG AA body text: white on very dark bg passes 4.5:1', () => {
    expect(contrastRatio('#f5f1e4', '#0d0c14')).toBeGreaterThanOrEqual(4.5);
  });
});

// ---------------------------------------------------------------------------
// validateTheme — structural
// ---------------------------------------------------------------------------

describe('validateTheme — structural checks', () => {
  it('returns valid for the Diablo theme', () => {
    const result = validateTheme(diabloTheme);
    if (!result.valid) {
      console.error(result.errors);
    }
    expect(result.valid).toBe(true);
  });

  it('catches a missing meta.id', () => {
    const bad = { ...diabloTheme, meta: { ...diabloTheme.meta, id: '' } };
    const result = validateTheme(bad as Theme);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      const fields = result.errors.map(e => e.field);
      expect(fields).toContain('meta.id');
    }
  });

  it('catches an invalid meta.appearance value', () => {
    const bad = { ...diabloTheme, meta: { ...diabloTheme.meta, appearance: 'neon' as 'dark' } };
    const result = validateTheme(bad as Theme);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some(e => e.field === 'meta.appearance')).toBe(true);
    }
  });

  it('catches an invalid hex color in palette.bg.void', () => {
    const bad: Theme = {
      ...diabloTheme,
      palette: {
        ...diabloTheme.palette,
        bg: { ...diabloTheme.palette.bg, void: 'not-a-hex' },
      },
    };
    const result = validateTheme(bad);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some(e => e.field === 'palette.bg.void')).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// validateTheme — contrast checks
// ---------------------------------------------------------------------------

describe('validateTheme — WCAG AA contrast', () => {
  it('diablo ink.100 vs bg.night passes 4.5:1', () => {
    const ratio = contrastRatio(diabloTheme.palette.ink['100'], diabloTheme.palette.bg.night);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('diablo primary.300 vs bg.night passes 3:1', () => {
    const ratio = contrastRatio(diabloTheme.palette.primary['300'], diabloTheme.palette.bg.night);
    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });

  it('catches a theme whose primary.400 is too dark against bg.night', () => {
    const bad: Theme = {
      ...diabloTheme,
      palette: {
        ...diabloTheme.palette,
        primary: {
          ...diabloTheme.palette.primary,
          '400': '#111111',  // near-black primary — fails contrast on dark bg
        },
      },
    };
    const result = validateTheme(bad);
    // Either structural (if primary.400 fails hex check) or contrast errors
    // Since #111111 is valid hex, this must be a contrast error
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some(e => e.field.startsWith('contrast:'))).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// assertValidTheme
// ---------------------------------------------------------------------------

describe('assertValidTheme', () => {
  it('does not throw for the Diablo theme', () => {
    expect(() => assertValidTheme(diabloTheme)).not.toThrow();
  });

  it('throws for a theme with an empty id', () => {
    const bad = { ...diabloTheme, meta: { ...diabloTheme.meta, id: '' } };
    expect(() => assertValidTheme(bad as Theme)).toThrow(/failed validation/);
  });
});
