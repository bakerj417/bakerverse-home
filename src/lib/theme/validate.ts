/**
 * Bakerverse Theme Engine — Validator
 *
 * Two-layer validation:
 * 1. Structural: checks all required fields are present and non-empty strings.
 * 2. WCAG AA contrast: ink.100 vs bg.night must be ≥ 4.5:1; primary-400 vs
 *    bg.night must be ≥ 3:1 (UI / large-text threshold); secondary-400 vs
 *    bg.night must be ≥ 3:1.
 *
 * A theme MUST pass validation before it may enter the registry. This is
 * enforced at build time so no broken-contrast theme can ever ship.
 */

import type { Theme } from './schema';

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

/** Parse a 6-digit hex string to [r, g, b] in 0–255 range. */
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) {
    throw new Error(`Invalid hex color: "${hex}" (expected 6-digit hex)`);
  }
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

/**
 * Calculate WCAG relative luminance for a single 8-bit channel value.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function linearize(channelByte: number): number {
  const sRgb = channelByte / 255;
  return sRgb <= 0.04045
    ? sRgb / 12.92
    : Math.pow((sRgb + 0.055) / 1.055, 2.4);
}

/**
 * Calculate WCAG 2.1 relative luminance of a hex color.
 * Returns a value in [0, 1] where 0 = black, 1 = white.
 */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/**
 * Calculate WCAG contrast ratio between two colors.
 * Returns a value ≥ 1.0 (1:1 = same color, 21:1 = black on white).
 */
export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker  = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ---------------------------------------------------------------------------
// Validation types
// ---------------------------------------------------------------------------

export type ValidationError = {
  field: string;
  message: string;
};

export type ValidationResult =
  | { valid: true }
  | { valid: false; errors: ValidationError[] };

// ---------------------------------------------------------------------------
// Structural checks
// ---------------------------------------------------------------------------

function requireString(value: unknown, field: string, errors: ValidationError[]): void {
  if (typeof value !== 'string' || value.trim() === '') {
    errors.push({ field, message: `Expected a non-empty string, got: ${JSON.stringify(value)}` });
  }
}

function requireHex(value: unknown, field: string, errors: ValidationError[]): void {
  if (typeof value !== 'string') {
    errors.push({ field, message: `Expected a string hex color, got: ${JSON.stringify(value)}` });
    return;
  }
  if (!/^#[0-9a-fA-F]{6}$/.test(value)) {
    errors.push({ field, message: `Expected 6-digit hex color (e.g. #a335ee), got: "${value}"` });
  }
}

function validateStructure(theme: Theme): ValidationError[] {
  const errors: ValidationError[] = [];

  // meta
  requireString(theme.meta.id,         'meta.id',         errors);
  requireString(theme.meta.name,       'meta.name',       errors);
  requireString(theme.meta.author,     'meta.author',     errors);
  requireString(theme.meta.mood,       'meta.mood',       errors);
  requireString(theme.meta.version,    'meta.version',    errors);
  if (theme.meta.appearance !== 'dark' && theme.meta.appearance !== 'light') {
    errors.push({ field: 'meta.appearance', message: 'Must be "dark" or "light"' });
  }

  // palette.bg
  for (const key of ['void', 'night', 'dusk', 'ember', 'stone'] as const) {
    requireHex(theme.palette.bg[key], `palette.bg.${key}`, errors);
  }

  // palette.ink
  for (const key of ['100', '300', '500', '700'] as const) {
    requireHex(theme.palette.ink[key], `palette.ink.${key}`, errors);
  }

  // palette.primary (gold scale)
  for (const key of ['50', '100', '200', '300', '400', '500', '600', '700'] as const) {
    requireHex(theme.palette.primary[key], `palette.primary.${key}`, errors);
  }

  // palette.secondary (purple scale)
  for (const key of ['50', '100', '200', '300', '400', '500', '600', '700'] as const) {
    requireHex(theme.palette.secondary[key], `palette.secondary.${key}`, errors);
  }

  // palette.accents
  requireHex(theme.palette.accents.purple, 'palette.accents.purple', errors);
  requireHex(theme.palette.accents.blood,  'palette.accents.blood',  errors);
  requireHex(theme.palette.accents.arcane, 'palette.accents.arcane', errors);

  // palette.rarity
  for (const key of ['common', 'uncommon', 'rare', 'epic', 'legendary', 'artifact'] as const) {
    requireHex(theme.palette.rarity[key], `palette.rarity.${key}`, errors);
  }

  // typography
  requireString(theme.typography.display, 'typography.display', errors);
  requireString(theme.typography.body,    'typography.body',    errors);
  requireString(theme.typography.mono,    'typography.mono',    errors);

  // effects.radii — required keys
  for (const key of ['sharp', 'soft', 'pill']) {
    if (!theme.effects.radii[key]) {
      errors.push({ field: `effects.radii.${key}`, message: 'Required key is missing' });
    }
  }

  // effects.shadows — required keys
  for (const key of ['tooltip', 'epic-glow', 'epic-glow-strong', 'inset-frame', 'gold-glow', 'gold-glow-strong']) {
    if (!theme.effects.shadows[key]) {
      errors.push({ field: `effects.shadows.${key}`, message: 'Required key is missing' });
    }
  }

  // motion.eases
  for (const key of ['ornate', 'bounce', 'standard']) {
    if (!theme.motion.eases[key]) {
      errors.push({ field: `motion.eases.${key}`, message: 'Required key is missing' });
    }
  }

  // motion.durations
  for (const key of ['fast', 'base', 'slow', 'page']) {
    if (!theme.motion.durations[key]) {
      errors.push({ field: `motion.durations.${key}`, message: 'Required key is missing' });
    }
  }

  return errors;
}

// ---------------------------------------------------------------------------
// WCAG AA contrast checks
// ---------------------------------------------------------------------------

type ContrastCheck = {
  fg: string;
  bg: string;
  fgLabel: string;
  bgLabel: string;
  /** Minimum acceptable ratio. 4.5 for body text, 3.0 for large text / UI. */
  minRatio: number;
};

function buildContrastChecks(theme: Theme): ContrastCheck[] {
  return [
    {
      fg: theme.palette.ink['100'],
      bg: theme.palette.bg.night,
      fgLabel: 'ink.100',
      bgLabel: 'bg.night',
      minRatio: 4.5,  // body text
    },
    {
      fg: theme.palette.ink['300'],
      bg: theme.palette.bg.night,
      fgLabel: 'ink.300',
      bgLabel: 'bg.night',
      minRatio: 3.0,  // secondary text / large
    },
    {
      fg: theme.palette.primary['400'],
      bg: theme.palette.bg.night,
      fgLabel: 'primary.400 (primary accent)',
      bgLabel: 'bg.night',
      minRatio: 3.0,  // UI element / large text
    },
    {
      fg: theme.palette.primary['300'],
      bg: theme.palette.bg.night,
      fgLabel: 'primary.300',
      bgLabel: 'bg.night',
      minRatio: 3.0,
    },
    {
      fg: theme.palette.secondary['400'],
      bg: theme.palette.bg.night,
      fgLabel: 'secondary.400',
      bgLabel: 'bg.night',
      minRatio: 3.0,
    },
    {
      fg: theme.palette.accents.arcane,
      bg: theme.palette.bg.night,
      fgLabel: 'accents.arcane',
      bgLabel: 'bg.night',
      minRatio: 3.0,
    },
  ];
}

function validateContrast(theme: Theme, structErrors: ValidationError[]): ValidationError[] {
  // If there are structural errors in the color fields, skip contrast checks
  // (hex parsing would throw)
  const hexErrors = structErrors.filter(e =>
    e.field.startsWith('palette') && e.message.includes('hex'),
  );
  if (hexErrors.length > 0) return [];

  const errors: ValidationError[] = [];
  const checks = buildContrastChecks(theme);

  for (const check of checks) {
    try {
      const ratio = contrastRatio(check.fg, check.bg);
      if (ratio < check.minRatio) {
        errors.push({
          field: `contrast:${check.fgLabel}/${check.bgLabel}`,
          message:
            `WCAG AA fail: ${check.fgLabel} (#${check.fg.replace('#', '')}) vs ` +
            `${check.bgLabel} (#${check.bg.replace('#', '')}) = ` +
            `${ratio.toFixed(2)}:1, required ≥ ${check.minRatio}:1`,
        });
      }
    } catch (e) {
      errors.push({
        field: `contrast:${check.fgLabel}/${check.bgLabel}`,
        message: `Could not compute contrast: ${e instanceof Error ? e.message : String(e)}`,
      });
    }
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Validate a Theme object.
 *
 * Runs structural checks first, then WCAG AA contrast checks.
 * Returns `{ valid: true }` or `{ valid: false, errors }`.
 *
 * @example
 * const result = validateTheme(myTheme);
 * if (!result.valid) {
 *   console.error(result.errors);
 *   process.exit(1);
 * }
 */
export function validateTheme(theme: Theme): ValidationResult {
  const structErrors = validateStructure(theme);
  const contrastErrors = validateContrast(theme, structErrors);
  const all = [...structErrors, ...contrastErrors];

  if (all.length === 0) return { valid: true };
  return { valid: false, errors: all };
}

/**
 * Assert a theme is valid, throwing a formatted error if not.
 * Intended for use at module initialization time (registry.ts).
 */
export function assertValidTheme(theme: Theme): void {
  const result = validateTheme(theme);
  if (result.valid) return;
  const lines = result.errors.map((e: ValidationError) => `  [${e.field}] ${e.message}`);
  throw new Error(
    `Theme "${theme.meta.id}" failed validation:\n${lines.join('\n')}`,
  );
}
