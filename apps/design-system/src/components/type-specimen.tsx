'use client';

import { useState } from 'react';

interface TypeRowProps {
  name: string;
  fontSize: number;
  lineHeight: number;
  weight: string;
  letterSpacing?: string;
  sample?: string;
}

export function TypeRow({
  name,
  fontSize,
  lineHeight,
  weight,
  letterSpacing = '0.25%',
  sample,
}: TypeRowProps) {
  const fontWeight =
    weight === 'Regular' ? 400
    : weight === 'Medium' ? 500
    : weight === 'SemiBold' ? 600
    : weight === 'Bold' ? 700
    : weight === 'Light' ? 300
    : weight === 'Italic' ? 400
    : 400;

  const isItalic = weight === 'Italic';

  return (
    <div className="not-prose group flex items-baseline gap-6 border-b border-fd-border/50 py-4 last:border-0">
      <div className="w-44 shrink-0">
        <p className="text-xs font-semibold text-fd-foreground">{name}</p>
        <p className="mt-0.5 text-[10px] font-mono text-fd-muted-foreground">
          {fontSize}px / {lineHeight}px · {weight}
        </p>
      </div>
      <p
        className="min-w-0 flex-1 truncate text-fd-foreground"
        style={{
          fontFamily: 'Roboto, sans-serif',
          fontSize: `${fontSize}px`,
          lineHeight: `${lineHeight}px`,
          fontWeight,
          fontStyle: isItalic ? 'italic' : 'normal',
          letterSpacing: letterSpacing === '0.25%' ? '0.0025em' : undefined,
        }}
      >
        {sample || 'The quick brown fox jumps over the lazy dog'}
      </p>
    </div>
  );
}

interface FontScaleStepProps {
  token: string;
  px: number;
}

export function FontScaleStrip({ steps }: { steps: FontScaleStepProps[] }) {
  return (
    <div className="not-prose flex items-end gap-1 overflow-x-auto pb-2">
      {steps.map(({ token, px }) => (
        <div key={token} className="flex flex-col items-center gap-1">
          <div
            className="flex items-end justify-center rounded-md bg-brand-blue-400 text-white"
            style={{ width: `${Math.max(px * 0.8, 20)}px`, height: `${Math.max(px * 1.2, 16)}px`, minWidth: '20px' }}
          >
            <span className="text-[8px] font-mono leading-none pb-0.5">{px}</span>
          </div>
          <span className="text-[9px] font-mono text-fd-muted-foreground whitespace-nowrap">{token}</span>
        </div>
      ))}
    </div>
  );
}

interface WeightSampleProps {
  weights: { name: string; value: number; style?: string }[];
}

export function WeightSamples({ weights }: WeightSampleProps) {
  const [text, setText] = useState('Wordly');

  return (
    <div className="not-prose space-y-3">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type to preview..."
        className="w-full rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm text-fd-foreground placeholder:text-fd-muted-foreground focus:border-brand-blue-400 focus:outline-none"
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {weights.map(({ name, value, style }) => (
          <div key={name} className="rounded-xl border border-fd-border p-4">
            <p
              className="mb-2 text-3xl text-fd-foreground truncate"
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: value,
                fontStyle: style || 'normal',
              }}
            >
              {text || 'Wordly'}
            </p>
            <p className="text-xs text-fd-muted-foreground">
              <span className="font-semibold text-fd-foreground">{name}</span> · {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
