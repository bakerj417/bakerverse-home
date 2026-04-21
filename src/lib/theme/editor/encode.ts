/**
 * Bakerverse Theme Engine — Editor Encode/Decode
 *
 * Pure functions for serialising a Theme object into a URL-safe base64
 * hash string and deserialising it back.
 *
 * The encoding is intentionally simple (JSON → base64url) so share links
 * contain a fully self-describing theme without any backend.
 *
 * Usage:
 *   const hash = encodeThemeToHash(myTheme);
 *   window.location.hash = `#t=${hash}`;
 *
 *   const restored = decodeThemeFromHash(hash);
 *   if (restored === null) { // malformed — show error toast }
 */

import type { Theme } from '../schema';

// ---------------------------------------------------------------------------
// Type guard
// ---------------------------------------------------------------------------

/**
 * Minimal shape check for an unknown value.
 * Does NOT validate WCAG contrast or hex formats — use validateTheme for that.
 * Purpose: distinguish a plausible Theme from garbage after JSON.parse.
 */
function isThemeShape(value: unknown): value is Theme {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<Record<keyof Theme, unknown>>;
  return (
    typeof candidate.meta === 'object' && candidate.meta !== null &&
    typeof candidate.palette === 'object' && candidate.palette !== null &&
    typeof candidate.typography === 'object' && candidate.typography !== null &&
    typeof candidate.effects === 'object' && candidate.effects !== null &&
    typeof candidate.motion === 'object' && candidate.motion !== null
  );
}

// ---------------------------------------------------------------------------
// Base64-url helpers
// ---------------------------------------------------------------------------

/**
 * Encode a UTF-8 string to base64url (no padding, URL-safe alphabet).
 * Works in both Node 20+ (global btoa) and modern browsers.
 *
 * All JSON-stringified Theme values are ASCII-safe (hex strings, CSS
 * values, English text), so the Latin-1 restriction of btoa is not an
 * issue in practice. The implementation uses the encodeURIComponent
 * escape trick to handle any stray non-ASCII characters defensively.
 */
function base64urlEncode(str: string): string {
  const base64 = btoa(
    encodeURIComponent(str).replace(
      /%([0-9A-F]{2})/gi,
      (_match: string, p1: string) => String.fromCharCode(parseInt(p1, 16)),
    ),
  );
  // Convert standard base64 to URL-safe variant (RFC 4648 §5)
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Decode a base64url string back to a UTF-8 string.
 * Returns null if the input is not valid base64url.
 */
function base64urlDecode(hash: string): string | null {
  try {
    // Restore standard base64 alphabet and padding
    const base64 = hash.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const decoded = atob(padded);
    // Reverse the encodeURIComponent trick used during encoding
    return decodeURIComponent(
      decoded
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Encode a Theme to a URL-safe base64 hash string.
 * The result can be embedded in a URL fragment: `#t=<hash>`.
 *
 * The encoding is deterministic but NOT guaranteed to be stable across
 * schema versions (future schema changes may produce incompatible hashes).
 */
export function encodeThemeToHash(theme: Theme): string {
  return base64urlEncode(JSON.stringify(theme));
}

/**
 * Decode a theme hash back to a Theme object.
 *
 * Returns `null` if:
 * - The input is not valid base64url
 * - The decoded JSON is malformed
 * - The top-level object shape does not look like a Theme
 *
 * The caller is responsible for running `validateTheme()` on the result
 * if they need to enforce WCAG contrast rules.
 */
export function decodeThemeFromHash(hash: string): Theme | null {
  if (!hash || typeof hash !== 'string') return null;
  const json = base64urlDecode(hash);
  if (json === null) return null;
  try {
    const parsed: unknown = JSON.parse(json);
    if (!isThemeShape(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}
