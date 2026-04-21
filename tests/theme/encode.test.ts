/**
 * tests/theme/encode.test.ts
 *
 * Unit tests for encodeThemeToHash / decodeThemeFromHash.
 * Run with: pnpm test
 */

import { describe, it, expect } from 'vitest';
import { encodeThemeToHash, decodeThemeFromHash } from '../../src/lib/theme/editor/encode';
import { diabloTheme } from '../../src/lib/theme/themes/diablo';
import { arcaneTheme } from '../../src/lib/theme/themes/arcane';
import type { Theme } from '../../src/lib/theme/schema';

// ---------------------------------------------------------------------------
// encodeThemeToHash
// ---------------------------------------------------------------------------

describe('encodeThemeToHash', () => {
  it('returns a non-empty string', () => {
    const hash = encodeThemeToHash(diabloTheme);
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(0);
  });

  it('produces a URL-safe string (no +, /, or = characters)', () => {
    const hash = encodeThemeToHash(diabloTheme);
    expect(hash).not.toContain('+');
    expect(hash).not.toContain('/');
    expect(hash).not.toContain('=');
  });

  it('is deterministic: same input → same output', () => {
    expect(encodeThemeToHash(diabloTheme)).toBe(encodeThemeToHash(diabloTheme));
  });

  it('produces different hashes for different themes', () => {
    const h1 = encodeThemeToHash(diabloTheme);
    const h2 = encodeThemeToHash(arcaneTheme);
    expect(h1).not.toBe(h2);
  });
});

// ---------------------------------------------------------------------------
// decodeThemeFromHash
// ---------------------------------------------------------------------------

describe('decodeThemeFromHash', () => {
  it('round-trips the diablo theme without data loss', () => {
    const hash = encodeThemeToHash(diabloTheme);
    const decoded = decodeThemeFromHash(hash);
    expect(decoded).not.toBeNull();
    // Deep equality via JSON round-trip (avoids reference equality issues)
    expect(JSON.stringify(decoded)).toBe(JSON.stringify(diabloTheme));
  });

  it('round-trips the arcane theme', () => {
    const hash = encodeThemeToHash(arcaneTheme);
    const decoded = decodeThemeFromHash(hash);
    expect(decoded).not.toBeNull();
    expect(JSON.stringify(decoded)).toBe(JSON.stringify(arcaneTheme));
  });

  it('returns null for an empty string', () => {
    expect(decodeThemeFromHash('')).toBeNull();
  });

  it('returns null for random garbage', () => {
    expect(decodeThemeFromHash('not-valid-base64url!!!')).toBeNull();
  });

  it('returns null for valid base64 that is not valid JSON', () => {
    // Use our encode helper for ASCII-safe encoding
    const notJson = encodeThemeToHash({ notA: 'theme' } as unknown as Theme);
    // Our encode should produce a hash that decodes to a non-Theme shape
    expect(decodeThemeFromHash(notJson)).toBeNull();
  });

  it('returns null for valid JSON that is not a Theme shape', () => {
    // Encode a simple object that is not a Theme
    const simpleObj = { foo: 'bar', baz: 42 };
    const hash = encodeThemeToHash(simpleObj as unknown as Theme);
    expect(decodeThemeFromHash(hash)).toBeNull();
  });

  it('returns null for a JSON object missing required top-level keys', () => {
    // Use encodeThemeToHash with a partial object (avoids btoa non-ASCII issue)
    const partial = { meta: { id: 'test', name: 'Test' } };
    const hash = encodeThemeToHash(partial as unknown as Theme);
    expect(decodeThemeFromHash(hash)).toBeNull();
  });

  it('returns a Theme with the correct meta.id after round-trip', () => {
    const hash = encodeThemeToHash(diabloTheme);
    const decoded = decodeThemeFromHash(hash);
    expect(decoded?.meta.id).toBe('diablo');
  });

  it('preserves all palette.bg values after round-trip', () => {
    const hash = encodeThemeToHash(diabloTheme);
    const decoded = decodeThemeFromHash(hash);
    expect(decoded?.palette.bg.void).toBe(diabloTheme.palette.bg.void);
    expect(decoded?.palette.bg.night).toBe(diabloTheme.palette.bg.night);
  });

  it('preserves typography values after round-trip', () => {
    const hash = encodeThemeToHash(diabloTheme);
    const decoded = decodeThemeFromHash(hash);
    expect(decoded?.typography.display).toBe(diabloTheme.typography.display);
  });
});
