/**
 * tests/theme/serialize.test.ts
 *
 * Unit tests for serializeTheme / themeFileName.
 * Run with: pnpm test
 */

import { describe, it, expect } from 'vitest';
import { serializeTheme, themeFileName } from '../../src/lib/theme/editor/serialize';
import { diabloTheme } from '../../src/lib/theme/themes/diablo';
import { arcaneTheme } from '../../src/lib/theme/themes/arcane';

// ---------------------------------------------------------------------------
// serializeTheme
// ---------------------------------------------------------------------------

describe('serializeTheme', () => {
  it('returns a non-empty string', () => {
    const code = serializeTheme(diabloTheme);
    expect(typeof code).toBe('string');
    expect(code.length).toBeGreaterThan(0);
  });

  it('contains the schema import', () => {
    const code = serializeTheme(diabloTheme);
    expect(code).toContain("import type { Theme } from '../schema'");
  });

  it('contains a named export', () => {
    const code = serializeTheme(diabloTheme);
    expect(code).toContain('export const');
  });

  it('derives the correct export name from a simple id', () => {
    // "diablo" → "diabloTheme"
    const code = serializeTheme(diabloTheme);
    expect(code).toContain('diabloTheme: Theme =');
  });

  it('derives the correct export name from a hyphenated id', () => {
    // "arcane" → "arcaneTheme"
    const code = serializeTheme(arcaneTheme);
    expect(code).toContain('arcaneTheme: Theme =');
  });

  it('includes the theme meta id in the JSON body', () => {
    const code = serializeTheme(diabloTheme);
    expect(code).toContain('"id": "diablo"');
  });

  it('includes the author name in the file header comment', () => {
    const code = serializeTheme(diabloTheme);
    expect(code).toContain('Author: Joseph Baker');
  });

  it('includes the mood in the file header comment', () => {
    const code = serializeTheme(diabloTheme);
    expect(code).toContain(diabloTheme.meta.mood);
  });

  it('produces valid JSON in the export body', () => {
    const code = serializeTheme(diabloTheme);
    // Extract the JSON portion: find '= {' to get the assignment's opening brace
    const assignIdx = code.indexOf('= {');
    const start = assignIdx + 2; // points to '{'
    const end = code.lastIndexOf('}');
    const json = code.slice(start, end + 1);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('round-trips: the embedded JSON parses back to the original theme', () => {
    const code = serializeTheme(diabloTheme);
    const assignIdx = code.indexOf('= {');
    const start = assignIdx + 2;
    const end = code.lastIndexOf('}');
    const json = code.slice(start, end + 1);
    const parsed: unknown = JSON.parse(json);
    expect(JSON.stringify(parsed)).toBe(JSON.stringify(diabloTheme));
  });

  it('includes the primary-400 hex value in the body', () => {
    const code = serializeTheme(diabloTheme);
    expect(code).toContain(diabloTheme.palette.primary['400']);
  });

  it('mentions the registry in the file comment', () => {
    const code = serializeTheme(diabloTheme);
    expect(code).toContain('registry.ts');
  });

  it('is deterministic: same input → same output', () => {
    expect(serializeTheme(diabloTheme)).toBe(serializeTheme(diabloTheme));
  });
});

// ---------------------------------------------------------------------------
// themeFileName
// ---------------------------------------------------------------------------

describe('themeFileName', () => {
  it('returns a .ts extension', () => {
    expect(themeFileName(diabloTheme)).toMatch(/\.ts$/);
  });

  it('uses the theme id as the base name', () => {
    expect(themeFileName(diabloTheme)).toBe('diablo.ts');
    expect(themeFileName(arcaneTheme)).toBe('arcane.ts');
  });

  it('sanitises non-alphanumeric characters', () => {
    const fakeMeta = { ...diabloTheme.meta, id: 'my weird theme!!' };
    const fakeTheme = { ...diabloTheme, meta: fakeMeta };
    const fileName = themeFileName(fakeTheme);
    expect(fileName).not.toContain(' ');
    expect(fileName).not.toContain('!');
    expect(fileName.endsWith('.ts')).toBe(true);
  });
});
