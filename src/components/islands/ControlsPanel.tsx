/**
 * ControlsPanel — editor form for tweaking every token in a Theme.
 *
 * Grouped into collapsible sections:
 *   • Meta (id, name, author, mood, appearance, version)
 *   • Background palette
 *   • Ink (text) scale
 *   • Primary accent scale (→ --gold-*)
 *   • Secondary accent scale (→ --purple-*)
 *   • Accent moments (blood, arcane)
 *   • Rarity colours
 *   • Typography (font family strings)
 *
 * All changes are emitted via `onChange(draft)` immediately, enabling live
 * preview. The panel never validates — validation is the responsibility of
 * ContrastWarnings.
 */

import { useState } from 'react';
import type { Theme, ThemeMeta, ThemePalette, ThemeTypography } from '@/lib/theme/schema';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function ColorSwatch({
  label,
  value,
  onChange,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  id: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor={id}
        className="w-28 shrink-0 text-xs text-[var(--ink-300)] truncate"
        title={label}
      >
        {label}
      </label>
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <input
          type="color"
          id={id}
          value={value.startsWith('#') && value.length === 7 ? value : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="h-6 w-6 shrink-0 cursor-pointer rounded border border-white/10 bg-transparent p-0"
          aria-label={`${label} colour`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={7}
          pattern="#[0-9a-fA-F]{6}"
          className="w-full rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs text-[var(--ink-100)] placeholder-[var(--ink-700)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-400)]"
          aria-label={`${label} hex`}
        />
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-2.5 text-left text-xs font-semibold uppercase tracking-widest text-[var(--gold-400)] hover:text-[var(--gold-300)]"
        aria-expanded={open}
      >
        <span>{title}</span>
        <span aria-hidden="true" className="text-[var(--ink-500)]">
          {open ? '▲' : '▼'}
        </span>
      </button>
      {open && <div className="space-y-2 pb-3">{children}</div>}
    </div>
  );
}

function TextInput({
  id,
  label,
  value,
  onChange,
  mono = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor={id}
        className="w-28 shrink-0 text-xs text-[var(--ink-300)] truncate"
        title={label}
      >
        {label}
      </label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-[var(--ink-100)] placeholder-[var(--ink-700)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-400)] ${mono ? 'font-mono' : ''}`}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

interface ControlsPanelProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
}

export default function ControlsPanel({ theme, onChange }: ControlsPanelProps) {
  // Helper: update a top-level section
  function setMeta(patch: Partial<ThemeMeta>) {
    onChange({ ...theme, meta: { ...theme.meta, ...patch } });
  }

  function setPalette(patch: Partial<ThemePalette>) {
    onChange({ ...theme, palette: { ...theme.palette, ...patch } });
  }

  function setTypography(patch: Partial<ThemeTypography>) {
    onChange({ ...theme, typography: { ...theme.typography, ...patch } });
  }

  // Bg colours
  function setBg(key: keyof ThemePalette['bg'], value: string) {
    setPalette({ bg: { ...theme.palette.bg, [key]: value } });
  }

  // Ink scale
  function setInk(key: keyof ThemePalette['ink'], value: string) {
    setPalette({ ink: { ...theme.palette.ink, [key]: value } });
  }

  // Primary scale
  function setPrimary(key: keyof ThemePalette['primary'], value: string) {
    setPalette({ primary: { ...theme.palette.primary, [key]: value } });
  }

  // Secondary scale
  function setSecondary(key: keyof ThemePalette['secondary'], value: string) {
    setPalette({ secondary: { ...theme.palette.secondary, [key]: value } });
  }

  // Accents
  function setAccent(key: keyof ThemePalette['accents'], value: string) {
    setPalette({ accents: { ...theme.palette.accents, [key]: value } });
  }

  // Rarity
  function setRarity(key: keyof ThemePalette['rarity'], value: string) {
    setPalette({ rarity: { ...theme.palette.rarity, [key]: value } });
  }

  return (
    <div className="space-y-0 overflow-y-auto text-sm">
      {/* ── Meta ──────────────────────────────────────────── */}
      <Section title="Meta">
        <TextInput id="meta-id"      label="ID"         value={theme.meta.id}      onChange={(v) => setMeta({ id: v })} mono />
        <TextInput id="meta-name"    label="Name"       value={theme.meta.name}    onChange={(v) => setMeta({ name: v })} />
        <TextInput id="meta-author"  label="Author"     value={theme.meta.author}  onChange={(v) => setMeta({ author: v })} />
        <TextInput id="meta-mood"    label="Mood"       value={theme.meta.mood}    onChange={(v) => setMeta({ mood: v })} />
        <TextInput id="meta-version" label="Version"    value={theme.meta.version} onChange={(v) => setMeta({ version: v })} mono />
        <div className="flex items-center gap-2">
          <label htmlFor="meta-appearance" className="w-28 shrink-0 text-xs text-[var(--ink-300)]">
            Appearance
          </label>
          <select
            id="meta-appearance"
            value={theme.meta.appearance}
            onChange={(e) =>
              setMeta({ appearance: e.target.value as 'dark' | 'light' })
            }
            className="w-full rounded border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-[var(--ink-100)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-400)]"
          >
            <option value="dark">dark</option>
            <option value="light">light</option>
          </select>
        </div>
      </Section>

      {/* ── Background ────────────────────────────────────── */}
      <Section title="Background">
        <ColorSwatch id="bg-void"  label="void"  value={theme.palette.bg.void}  onChange={(v) => setBg('void', v)} />
        <ColorSwatch id="bg-night" label="night" value={theme.palette.bg.night} onChange={(v) => setBg('night', v)} />
        <ColorSwatch id="bg-dusk"  label="dusk"  value={theme.palette.bg.dusk}  onChange={(v) => setBg('dusk', v)} />
        <ColorSwatch id="bg-ember" label="ember" value={theme.palette.bg.ember} onChange={(v) => setBg('ember', v)} />
        <ColorSwatch id="bg-stone" label="stone" value={theme.palette.bg.stone} onChange={(v) => setBg('stone', v)} />
      </Section>

      {/* ── Ink ───────────────────────────────────────────── */}
      <Section title="Ink (text)" defaultOpen={false}>
        <ColorSwatch id="ink-100" label="ink-100" value={theme.palette.ink['100']} onChange={(v) => setInk('100', v)} />
        <ColorSwatch id="ink-300" label="ink-300" value={theme.palette.ink['300']} onChange={(v) => setInk('300', v)} />
        <ColorSwatch id="ink-500" label="ink-500" value={theme.palette.ink['500']} onChange={(v) => setInk('500', v)} />
        <ColorSwatch id="ink-700" label="ink-700" value={theme.palette.ink['700']} onChange={(v) => setInk('700', v)} />
      </Section>

      {/* ── Primary (--gold-*) ────────────────────────────── */}
      <Section title="Primary (--gold-*)">
        {(['50','100','200','300','400','500','600','700'] as const).map((k) => (
          <ColorSwatch
            key={k}
            id={`primary-${k}`}
            label={`primary-${k}`}
            value={theme.palette.primary[k]}
            onChange={(v) => setPrimary(k, v)}
          />
        ))}
      </Section>

      {/* ── Secondary (--purple-*) ────────────────────────── */}
      <Section title="Secondary (--purple-*)" defaultOpen={false}>
        {(['50','100','200','300','400','500','600','700'] as const).map((k) => (
          <ColorSwatch
            key={k}
            id={`secondary-${k}`}
            label={`secondary-${k}`}
            value={theme.palette.secondary[k]}
            onChange={(v) => setSecondary(k, v)}
          />
        ))}
      </Section>

      {/* ── Accents ───────────────────────────────────────── */}
      <Section title="Accent moments" defaultOpen={false}>
        <ColorSwatch id="accent-purple" label="purple" value={theme.palette.accents.purple} onChange={(v) => setAccent('purple', v)} />
        <ColorSwatch id="accent-blood"  label="blood"  value={theme.palette.accents.blood}  onChange={(v) => setAccent('blood', v)} />
        <ColorSwatch id="accent-arcane" label="arcane" value={theme.palette.accents.arcane} onChange={(v) => setAccent('arcane', v)} />
      </Section>

      {/* ── Rarity ────────────────────────────────────────── */}
      <Section title="Rarity palette" defaultOpen={false}>
        {(['common','uncommon','rare','epic','legendary','artifact'] as const).map((k) => (
          <ColorSwatch
            key={k}
            id={`rarity-${k}`}
            label={k}
            value={theme.palette.rarity[k]}
            onChange={(v) => setRarity(k, v)}
          />
        ))}
      </Section>

      {/* ── Typography ────────────────────────────────────── */}
      <Section title="Typography" defaultOpen={false}>
        <TextInput id="font-display" label="Display" value={theme.typography.display} onChange={(v) => setTypography({ display: v })} mono />
        <TextInput id="font-body"    label="Body"    value={theme.typography.body}    onChange={(v) => setTypography({ body: v })} mono />
        <TextInput id="font-mono"    label="Mono"    value={theme.typography.mono}    onChange={(v) => setTypography({ mono: v })} mono />
      </Section>
    </div>
  );
}
