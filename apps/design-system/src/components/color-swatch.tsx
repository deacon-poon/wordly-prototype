'use client';

import { useState } from 'react';

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

function CopyFeedback({ copied }: { copied: boolean }) {
  if (!copied) return null;
  return (
    <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60 text-xs font-medium text-white backdrop-blur-sm">
      Copied!
    </span>
  );
}

/** Full-width visual color scale — big swatches in a continuous strip */
export function ColorScale({
  name,
  colors,
}: {
  name: string;
  colors: { step: string; hex: string }[];
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="not-prose mb-10">
      {/* Continuous color strip */}
      <div className="flex overflow-hidden rounded-xl border shadow-sm">
        {colors.map(({ step, hex }) => (
          <button
            key={step}
            onClick={() => copy(hex)}
            className="group relative flex-1 transition-all hover:flex-[2] focus-visible:flex-[2] focus-visible:outline-none"
            style={{ backgroundColor: hex, minHeight: '80px' }}
            title={`${name}-${step}: ${hex}`}
          >
            <CopyFeedback copied={copied === hex} />
          </button>
        ))}
      </div>

      {/* Labels below */}
      <div className="mt-3 grid gap-1" style={{ gridTemplateColumns: `repeat(${colors.length}, 1fr)` }}>
        {colors.map(({ step, hex }) => (
          <button
            key={step}
            onClick={() => copy(hex)}
            className="group flex flex-col items-center text-center"
          >
            <span className="text-[11px] font-semibold text-fd-foreground">{step}</span>
            <span className="text-[10px] font-mono text-fd-muted-foreground group-hover:text-fd-foreground transition-colors">
              {hex}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Large swatch cards for individual color display */
export function ColorCard({
  name,
  hex,
  description,
}: {
  name: string;
  hex: string;
  description?: string;
}) {
  const [copied, setCopied] = useState(false);
  const fg = getContrastColor(hex);

  const copy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      onClick={copy}
      className="not-prose group relative flex flex-col justify-end overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none"
      style={{ backgroundColor: hex, minHeight: '120px' }}
    >
      <CopyFeedback copied={copied} />
      <div className="flex w-full items-end justify-between p-3" style={{ color: fg }}>
        <div className="flex flex-col items-start text-left">
          <span className="text-sm font-semibold">{name}</span>
          {description && (
            <span className="text-xs opacity-70">{description}</span>
          )}
        </div>
        <span className="rounded-md bg-black/10 px-1.5 py-0.5 text-xs font-mono backdrop-blur-sm">
          {hex}
        </span>
      </div>
    </button>
  );
}

/** Semantic token row — visual swatch + token info */
export function SemanticToken({
  name,
  hex,
  alias,
}: {
  name: string;
  hex: string;
  alias: string;
}) {
  const [copied, setCopied] = useState(false);
  const fg = getContrastColor(hex);

  const copy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      onClick={copy}
      className="not-prose group flex items-stretch overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none text-left"
    >
      <div
        className="relative flex w-16 shrink-0 items-center justify-center"
        style={{ backgroundColor: hex, color: fg }}
      >
        <CopyFeedback copied={copied} />
      </div>
      <div className="flex flex-col justify-center gap-0.5 px-3 py-2.5">
        <span className="text-sm font-semibold text-fd-foreground">{name}</span>
        <span className="text-xs text-fd-muted-foreground">
          <span className="font-mono">{hex}</span>
          <span className="mx-1.5 text-fd-muted-foreground/50">&rarr;</span>
          <span className="font-mono">{alias}</span>
        </span>
      </div>
    </button>
  );
}

/** Side-by-side light/dark mode comparison */
export function ModePair({
  name,
  light,
  dark,
  token,
}: {
  name: string;
  light: string;
  dark: string;
  token?: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="not-prose flex overflow-hidden rounded-xl border shadow-sm">
      {/* Light */}
      <button
        onClick={() => copy(light)}
        className="relative flex flex-1 items-end justify-between p-3"
        style={{ backgroundColor: light, color: getContrastColor(light), minHeight: '80px' }}
      >
        <CopyFeedback copied={copied === light} />
        <span className="text-xs font-medium">Light</span>
        <span className="rounded-md bg-black/10 px-1.5 py-0.5 text-[10px] font-mono backdrop-blur-sm">
          {light}
        </span>
      </button>
      {/* Dark */}
      <button
        onClick={() => copy(dark)}
        className="relative flex flex-1 items-end justify-between p-3"
        style={{ backgroundColor: dark, color: getContrastColor(dark), minHeight: '80px' }}
      >
        <CopyFeedback copied={copied === dark} />
        <span className="text-xs font-medium">Dark</span>
        <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-mono backdrop-blur-sm">
          {dark}
        </span>
      </button>
      {/* Label */}
      <div className="flex w-40 flex-col justify-center border-l bg-fd-background px-3 py-2">
        <span className="text-sm font-semibold text-fd-foreground">{name}</span>
        {token && (
          <span className="text-[10px] font-mono text-fd-muted-foreground">{token}</span>
        )}
      </div>
    </div>
  );
}
