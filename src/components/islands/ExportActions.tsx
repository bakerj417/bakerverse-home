/**
 * ExportActions — export controls for the theme editor.
 *
 * Three actions:
 *   1. Copy share link — encodes theme to base64url hash and copies
 *      `{origin}/playground/theme-editor#t={hash}` to clipboard.
 *   2. Download .ts — serializes theme to a TypeScript module string and
 *      triggers a browser download.
 *   3. Submit theme — opens the SubmissionForm panel.
 *
 * No runtime deps beyond the encode/serialize utilities already in the
 * theme engine.
 */

import { useState } from 'react';
import type { Theme } from '@/lib/theme/schema';
import { encodeThemeToHash } from '@/lib/theme/editor/encode';
import { serializeTheme, themeFileName } from '@/lib/theme/editor/serialize';
import SubmissionForm from './SubmissionForm';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older environments
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

function downloadText(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Small button component
// ---------------------------------------------------------------------------

function ActionButton({
  onClick,
  label,
  feedback,
  variant = 'primary',
  disabled = false,
}: {
  onClick: () => void;
  label: string;
  feedback?: string | null;
  variant?: 'primary' | 'ghost' | 'arcane';
  disabled?: boolean;
}) {
  const baseClass =
    'rounded px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClass: Record<string, string> = {
    primary:
      'bg-[var(--gold-400)] text-[var(--bg-void)] hover:bg-[var(--gold-300)]',
    ghost:
      'border border-[var(--gold-400)] text-[var(--gold-400)] hover:bg-[var(--gold-400)]/10',
    arcane:
      'border border-[var(--purple-400)] text-[var(--purple-400)] hover:bg-[var(--purple-400)]/10',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variantClass[variant]}`}
      aria-label={label}
    >
      {feedback ?? label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

interface ExportActionsProps {
  theme: Theme;
}

export default function ExportActions({ theme }: ExportActionsProps) {
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [showSubmit, setShowSubmit] = useState(false);

  function handleCopyLink() {
    const hash = encodeThemeToHash(theme);
    const url = `${window.location.origin}/playground/theme-editor#t=${hash}`;
    copyToClipboard(url)
      .then(() => {
        setCopyFeedback('Copied!');
        setTimeout(() => setCopyFeedback(null), 2000);
      })
      .catch(() => {
        setCopyFeedback('Copy failed');
        setTimeout(() => setCopyFeedback(null), 2000);
      });
  }

  function handleDownload() {
    const code = serializeTheme(theme);
    const filename = themeFileName(theme);
    downloadText(filename, code);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <ActionButton
          onClick={handleCopyLink}
          label="Copy share link"
          feedback={copyFeedback}
          variant="ghost"
        />
        <ActionButton
          onClick={handleDownload}
          label="Download .ts"
          variant="primary"
        />
        <ActionButton
          onClick={() => setShowSubmit((s) => !s)}
          label={showSubmit ? 'Close submission' : 'Submit theme'}
          variant="arcane"
        />
      </div>

      {showSubmit && (
        <SubmissionForm theme={theme} onClose={() => setShowSubmit(false)} />
      )}
    </div>
  );
}
