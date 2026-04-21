/**
 * ContrastWarnings — displays WCAG AA contrast validation results for a theme.
 *
 * Renders nothing when all checks pass. Shows an amber warning list when any
 * contrast ratio is below the required threshold (4.5:1 for text, 3:1 for UI).
 */

import type { Theme } from '@/lib/theme/schema';
import { validateTheme } from '@/lib/theme/validate';

interface ContrastWarningsProps {
  theme: Theme;
}

export default function ContrastWarnings({ theme }: ContrastWarningsProps) {
  const result = validateTheme(theme);

  if (result.valid) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-2 rounded border border-green-800/60 bg-green-950/40 px-3 py-2 text-sm text-green-400"
      >
        <span aria-hidden="true">✓</span>
        All contrast checks pass — WCAG AA compliant
      </div>
    );
  }

  const allMessages = result.errors.map((e) => `${e.field}: ${e.message}`);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded border border-amber-700/60 bg-amber-950/40 p-3"
    >
      <p className="mb-2 text-sm font-semibold text-amber-400">
        ⚠ Contrast warnings — theme may not meet WCAG AA
      </p>
      <ul className="space-y-1">
        {allMessages.map((msg, i) => (
          <li key={i} className="text-xs text-amber-300/80">
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
}
