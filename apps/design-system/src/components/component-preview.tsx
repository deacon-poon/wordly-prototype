'use client';

import { useState, type ReactNode } from 'react';

type Mode = 'both' | 'light' | 'dark';

const lightVars: Record<string, string> = {
  '--preview-bg': '#ffffff',
  '--preview-fg': '#121416',
  '--preview-muted': '#646e78',
  '--preview-muted-fg': '#646e78',
  '--preview-border': '#e3e6e8',
  '--preview-input': '#e3e6e8',
  '--preview-input-bg': '#ffffff',
  '--preview-ring': '#0063cc',
  '--preview-primary': '#0063cc',
  '--preview-primary-fg': '#ffffff',
  '--preview-secondary': '#f8f9fa',
  '--preview-secondary-fg': '#121416',
  '--preview-accent': '#f8f9fa',
  '--preview-accent-fg': '#121416',
  '--preview-destructive': '#b8221a',
  '--preview-destructive-fg': '#ffffff',
  '--preview-success': '#0a7b3f',
  '--preview-success-fg': '#ffffff',
  '--preview-card': '#ffffff',
  '--preview-card-fg': '#121416',
  '--preview-popover': '#ffffff',
  '--preview-popover-fg': '#121416',
  '--preview-disabled': '#9ba3ab',
  '--preview-surface-1': '#f8f9fa',
  '--preview-surface-2': '#eef0f2',
  '--preview-brand-blue-50': '#d6eaff',
  '--preview-brand-blue-100': '#b2d8ff',
  '--preview-brand-blue-200': '#75b8ff',
  '--preview-brand-blue-300': '#3396ff',
  '--preview-brand-blue-400': '#017cff',
  '--preview-brand-blue-500': '#0063cc',
  '--preview-brand-blue-600': '#0051a8',
  '--preview-brand-blue-700': '#00458f',
  '--preview-brand-blue-800': '#002c5c',
  '--preview-accent-green-500': '#15b743',
  '--preview-accent-orange-500': '#cc5500',
};

const darkVars: Record<string, string> = {
  '--preview-bg': '#121416',
  '--preview-fg': '#f0f2f4',
  '--preview-muted': '#495057',
  '--preview-muted-fg': '#9ba3ab',
  '--preview-border': '#343a40',
  '--preview-input': 'rgba(255,255,255,0.16)',
  '--preview-input-bg': '#21252b',
  '--preview-ring': '#3396ff',
  '--preview-primary': '#3396ff',
  '--preview-primary-fg': '#001e3d',
  '--preview-secondary': '#21252b',
  '--preview-secondary-fg': '#f0f2f4',
  '--preview-accent': '#21252b',
  '--preview-accent-fg': '#f0f2f4',
  '--preview-destructive': '#f07870',
  '--preview-destructive-fg': '#2e0906',
  '--preview-success': '#66c188',
  '--preview-success-fg': '#021f10',
  '--preview-card': '#1a1d21',
  '--preview-card-fg': '#f0f2f4',
  '--preview-popover': '#1a1d21',
  '--preview-popover-fg': '#f0f2f4',
  '--preview-disabled': '#495057',
  '--preview-surface-1': '#1a1d21',
  '--preview-surface-2': '#21252b',
  '--preview-brand-blue-50': '#001e3d',
  '--preview-brand-blue-100': '#002c5c',
  '--preview-brand-blue-200': '#00458f',
  '--preview-brand-blue-300': '#3396ff',
  '--preview-brand-blue-400': '#75b8ff',
  '--preview-brand-blue-500': '#3396ff',
  '--preview-brand-blue-600': '#75b8ff',
  '--preview-brand-blue-700': '#b2d8ff',
  '--preview-brand-blue-800': '#d6eaff',
  '--preview-accent-green-500': '#66c188',
  '--preview-accent-orange-500': '#fdba74',
};

function ModeSwitch({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div className="inline-flex rounded-full border border-gray-200 p-0.5 text-xs font-medium">
      {(['both', 'light', 'dark'] as const).map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={`rounded-full px-3 py-1 capitalize transition-all ${
            mode === m
              ? m === 'dark'
                ? 'bg-gray-800 text-white shadow-sm'
                : 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {m === 'both' ? 'Side-by-side' : m}
        </button>
      ))}
    </div>
  );
}

function PreviewPanel({ vars, label, children }: { vars: Record<string, string>; label: string; children: ReactNode }) {
  const isDark = label === 'Dark';
  return (
    <div
      className="flex-1 rounded-xl p-6 transition-colors duration-300"
      style={{
        ...vars,
        backgroundColor: vars['--preview-bg'],
      }}
    >
      <p
        className="mb-4 text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: isDark ? '#9ba3ab' : '#646e78' }}
      >
        {label}
      </p>
      <div>{children}</div>
    </div>
  );
}

export function ComponentPreview({
  title,
  children,
}: {
  title?: string;
  children: (vars: Record<string, string>, isDark: boolean) => ReactNode;
}) {
  const [mode, setMode] = useState<Mode>('both');

  return (
    <div className="not-prose mb-8">
      <div className="mb-3 flex items-center justify-between">
        {title && <span className="text-sm font-medium text-fd-foreground">{title}</span>}
        <ModeSwitch mode={mode} setMode={setMode} />
      </div>
      <div
        className={`overflow-hidden rounded-2xl border border-gray-200 shadow-sm ${
          mode === 'both' ? 'flex gap-0' : ''
        }`}
      >
        {(mode === 'both' || mode === 'light') && (
          <PreviewPanel vars={lightVars} label="Light">
            {children(lightVars, false)}
          </PreviewPanel>
        )}
        {mode === 'both' && <div className="w-px bg-gray-200" />}
        {(mode === 'both' || mode === 'dark') && (
          <PreviewPanel vars={darkVars} label="Dark">
            {children(darkVars, true)}
          </PreviewPanel>
        )}
      </div>
    </div>
  );
}

/** Simple props table for component documentation */
export function PropsTable({ rows }: { rows: { name: string; type: string; default?: string; description: string }[] }) {
  return (
    <div className="not-prose mb-8 overflow-hidden rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-fd-muted/50">
            <th className="px-4 py-2.5 text-left font-semibold text-fd-foreground">Prop</th>
            <th className="px-4 py-2.5 text-left font-semibold text-fd-foreground">Type</th>
            <th className="px-4 py-2.5 text-left font-semibold text-fd-foreground">Default</th>
            <th className="px-4 py-2.5 text-left font-semibold text-fd-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b last:border-0">
              <td className="px-4 py-2 font-mono text-xs text-fd-foreground">{row.name}</td>
              <td className="px-4 py-2 font-mono text-xs text-fd-muted-foreground">{row.type}</td>
              <td className="px-4 py-2 font-mono text-xs text-fd-muted-foreground">{row.default ?? '—'}</td>
              <td className="px-4 py-2 text-fd-muted-foreground">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
