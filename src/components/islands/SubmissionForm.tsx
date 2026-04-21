/**
 * SubmissionForm — theme submission UI (submissions not yet open).
 *
 * POSTs to /api/themes/submit and gracefully displays the 501 response.
 * When the API eventually opens this will just work — the UI already
 * handles the success path with a confirmation message.
 *
 * Always renders a friendly "not open yet" notice because the API returns
 * 501 until submissions are enabled.
 */

import { useState } from 'react';
import type { Theme } from '@/lib/theme/schema';
import { encodeThemeToHash } from '@/lib/theme/editor/encode';

interface SubmissionFormProps {
  theme: Theme;
  onClose: () => void;
}

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export default function SubmissionForm({ theme, onClose }: SubmissionFormProps) {
  const [state, setState] = useState<SubmitState>({ status: 'idle' });
  const [authorNote, setAuthorNote] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ status: 'submitting' });

    try {
      const hash = encodeThemeToHash(theme);
      const res = await fetch('/api/themes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash, authorNote: authorNote.trim() }),
      });

      const json = (await res.json()) as { status?: string; message?: string };

      if (res.status === 501) {
        // Submissions not open yet — show friendly message
        setState({
          status: 'error',
          message: json.message ?? 'Theme submissions are not open yet. Check back soon!',
        });
      } else if (res.ok) {
        setState({ status: 'success' });
      } else {
        setState({
          status: 'error',
          message: json.message ?? `Unexpected error (${res.status})`,
        });
      }
    } catch (err) {
      setState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Network error — please try again.',
      });
    }
  }

  return (
    <div
      role="region"
      aria-label="Theme submission form"
      className="rounded border border-[var(--purple-700)] bg-[var(--bg-ember)] p-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3
          className="text-sm font-semibold text-[var(--purple-300)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Submit Your Theme
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-[var(--ink-500)] hover:text-[var(--ink-300)]"
          aria-label="Close submission form"
        >
          ✕
        </button>
      </div>

      {state.status === 'success' ? (
        <p className="text-sm text-green-400">
          ✓ Theme submitted successfully! It will be reviewed before going live.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <p className="mb-1 text-xs text-[var(--ink-500)]">
              Theme ID: <span className="font-mono text-[var(--ink-300)]">{theme.meta.id}</span>
            </p>
            <p className="text-xs text-[var(--ink-500)]">
              Author: <span className="text-[var(--ink-300)]">{theme.meta.author}</span>
            </p>
          </div>

          <div>
            <label
              htmlFor="author-note"
              className="mb-1 block text-xs text-[var(--ink-300)]"
            >
              Notes / context (optional)
            </label>
            <textarea
              id="author-note"
              value={authorNote}
              onChange={(e) => setAuthorNote(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Describe the inspiration for this theme…"
              className="w-full resize-none rounded border border-white/10 bg-white/5 px-3 py-2 text-xs text-[var(--ink-100)] placeholder-[var(--ink-700)] focus:outline-none focus:ring-1 focus:ring-[var(--purple-400)]"
            />
          </div>

          {state.status === 'error' && (
            <div
              role="alert"
              className="rounded border border-amber-700/60 bg-amber-950/40 px-3 py-2 text-xs text-amber-300"
            >
              {state.message}
            </div>
          )}

          <button
            type="submit"
            disabled={state.status === 'submitting'}
            className="rounded border border-[var(--purple-400)] px-4 py-1.5 text-xs font-semibold text-[var(--purple-400)] transition-all hover:bg-[var(--purple-400)]/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.status === 'submitting' ? 'Submitting…' : 'Submit theme'}
          </button>
        </form>
      )}
    </div>
  );
}
