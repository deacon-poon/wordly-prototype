'use client';

import { useState } from 'react';

type Mode = 'light' | 'dark';

const surfaces = {
  light: {
    base: '#ffffff',
    'elevated-1': '#f8f9fa',
    'elevated-2': '#f8f9fa',
    'elevated-3': '#eef0f2',
    'elevated-4': '#e3e6e8',
  },
  dark: {
    base: '#121416',
    'elevated-1': '#1a1d21',
    'elevated-2': '#21252b',
    'elevated-3': '#282d35',
    'elevated-4': '#2f353e',
  },
};

const tokens = {
  light: {
    textPrimary: '#121416',
    textSecondary: '#646e78',
    textDisabled: '#9ba3ab',
    border: '#cdd2d7',
    inputBorder: '#e2e8f0',
    inputBg: '#ffffff',
    divider: '#eef0f2',
    cardBg: '#ffffff',
    buttonPrimary: '#0063cc',
    buttonPrimaryText: '#ffffff',
    buttonSecondaryBg: '#ffffff',
    buttonSecondaryText: '#121416',
    buttonSecondaryBorder: '#e2e8f0',
    buttonDisabledBg: '#eef0f2',
    buttonDisabledText: '#9ba3ab',
    brand: '#017cff',
    success: '#0a7b3f',
    successBg: '#e6f6ec',
    error: '#b8221a',
    errorBg: '#fcebea',
    warning: '#c2410c',
    warningBg: '#fff7ed',
    info: '#1e40af',
    infoBg: '#ebf5ff',
    link: '#2563eb',
  },
  dark: {
    textPrimary: '#f0f2f4',
    textSecondary: '#9ba3ab',
    textDisabled: '#495057',
    border: '#343a40',
    inputBorder: 'rgba(255,255,255,0.16)',
    inputBg: '#21252b',
    divider: 'rgba(255,255,255,0.08)',
    cardBg: '#1a1d21',
    buttonPrimary: '#3396ff',
    buttonPrimaryText: '#001e3d',
    buttonSecondaryBg: '#21252b',
    buttonSecondaryText: '#f0f2f4',
    buttonSecondaryBorder: 'rgba(255,255,255,0.16)',
    buttonDisabledBg: '#282d35',
    buttonDisabledText: '#495057',
    brand: '#3396ff',
    success: '#66c188',
    successBg: '#021f10',
    error: '#f07870',
    errorBg: '#2e0906',
    warning: '#fdba74',
    warningBg: '#7c2d12',
    info: '#84c5ff',
    infoBg: '#1e2f60',
    link: '#84c5ff',
  },
};

function ModeToggle({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div className="inline-flex rounded-full border border-gray-200 p-0.5 text-xs font-medium">
      <button
        onClick={() => setMode('light')}
        className={`rounded-full px-4 py-1.5 transition-all ${
          mode === 'light' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Light
      </button>
      <button
        onClick={() => setMode('dark')}
        className={`rounded-full px-4 py-1.5 transition-all ${
          mode === 'dark' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Dark
      </button>
    </div>
  );
}

export function SurfaceElevationDemo() {
  const [mode, setMode] = useState<Mode>('dark');
  const s = surfaces[mode];

  return (
    <div className="not-prose">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-fd-foreground">Surface Elevation</span>
        <ModeToggle mode={mode} setMode={setMode} />
      </div>
      <div
        className="rounded-2xl p-6 transition-colors duration-500"
        style={{ backgroundColor: s.base }}
      >
        <p className="mb-4 text-xs font-mono" style={{ color: mode === 'dark' ? '#9ba3ab' : '#646e78' }}>
          surface/base
        </p>
        <div className="flex flex-col gap-4">
          {(['elevated-1', 'elevated-2', 'elevated-3', 'elevated-4'] as const).map((level) => (
            <div
              key={level}
              className="rounded-xl p-4 transition-colors duration-500"
              style={{ backgroundColor: s[level] }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono" style={{ color: mode === 'dark' ? '#f0f2f4' : '#121416' }}>
                  surface/{level}
                </span>
                <span className="text-[10px] font-mono" style={{ color: mode === 'dark' ? '#646e78' : '#9ba3ab' }}>
                  {s[level]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CardDemo() {
  const [mode, setMode] = useState<Mode>('dark');
  const t = tokens[mode];
  const s = surfaces[mode];

  return (
    <div className="not-prose">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-fd-foreground">Card + Form Example</span>
        <ModeToggle mode={mode} setMode={setMode} />
      </div>
      <div
        className="rounded-2xl p-6 transition-colors duration-500"
        style={{ backgroundColor: s.base }}
      >
        {/* Card */}
        <div
          className="mx-auto max-w-sm rounded-xl p-5 transition-colors duration-500"
          style={{
            backgroundColor: t.cardBg,
            border: `1px solid ${t.border}`,
          }}
        >
          <h3 className="mb-1 text-base font-semibold transition-colors duration-500" style={{ color: t.textPrimary }}>
            Attend a session
          </h3>
          <p className="mb-4 text-xs transition-colors duration-500" style={{ color: t.textSecondary }}>
            Enter your session ID to join.
          </p>

          {/* Input */}
          <label className="mb-1 block text-xs font-medium transition-colors duration-500" style={{ color: t.textPrimary }}>
            Session ID
          </label>
          <div
            className="mb-4 rounded-md px-3 py-2 text-sm transition-colors duration-500"
            style={{
              backgroundColor: t.inputBg,
              border: `1px solid ${t.inputBorder}`,
              color: t.textDisabled,
            }}
          >
            ABCD-1234
          </div>

          {/* Primary button */}
          <button
            className="mb-2 w-full rounded-md py-2 text-sm font-medium transition-colors duration-500"
            style={{
              backgroundColor: t.buttonPrimary,
              color: t.buttonPrimaryText,
            }}
          >
            Join
          </button>

          {/* Secondary button */}
          <button
            className="w-full rounded-md py-2 text-sm font-medium transition-colors duration-500"
            style={{
              backgroundColor: t.buttonSecondaryBg,
              color: t.buttonSecondaryText,
              border: `1px solid ${t.buttonSecondaryBorder}`,
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export function StatusBannerDemo() {
  const [mode, setMode] = useState<Mode>('dark');
  const t = tokens[mode];
  const s = surfaces[mode];

  const statuses = [
    { label: 'Success', text: t.success, bg: t.successBg, msg: 'Session joined successfully.' },
    { label: 'Error', text: t.error, bg: t.errorBg, msg: 'Invalid session ID.' },
    { label: 'Warning', text: t.warning, bg: t.warningBg, msg: 'Session starts in 5 minutes.' },
    { label: 'Info', text: t.info, bg: t.infoBg, msg: 'You can invite others via link.' },
  ];

  return (
    <div className="not-prose">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-fd-foreground">Status Banners</span>
        <ModeToggle mode={mode} setMode={setMode} />
      </div>
      <div
        className="rounded-2xl p-6 transition-colors duration-500"
        style={{ backgroundColor: s.base }}
      >
        <div className="flex flex-col gap-3">
          {statuses.map((st) => (
            <div
              key={st.label}
              className="rounded-lg px-4 py-3 text-sm transition-colors duration-500"
              style={{ backgroundColor: st.bg, color: st.text }}
            >
              <span className="font-semibold">{st.label}:</span> {st.msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TypographyDemo() {
  const [mode, setMode] = useState<Mode>('dark');
  const t = tokens[mode];
  const s = surfaces[mode];

  return (
    <div className="not-prose">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-fd-foreground">Text Hierarchy</span>
        <ModeToggle mode={mode} setMode={setMode} />
      </div>
      <div
        className="rounded-2xl p-6 transition-colors duration-500"
        style={{ backgroundColor: s.base }}
      >
        <div
          className="rounded-xl p-5 transition-colors duration-500"
          style={{ backgroundColor: surfaces[mode]['elevated-1'] }}
        >
          <p className="mb-1 text-xl font-bold transition-colors duration-500" style={{ color: t.textPrimary }}>
            Primary heading
          </p>
          <p className="mb-3 text-sm transition-colors duration-500" style={{ color: t.textSecondary }}>
            Secondary supporting text that provides context.
          </p>
          <p className="mb-4 text-xs transition-colors duration-500" style={{ color: t.textDisabled }}>
            Disabled or placeholder text
          </p>
          <div className="h-px transition-colors duration-500" style={{ backgroundColor: t.divider }} />
          <p className="mt-3 text-sm transition-colors duration-500">
            <a style={{ color: t.link }} href="#">Link text</a>
            <span style={{ color: t.textSecondary }}> — alongside body text.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export function MobileScreenDemo() {
  const [mode, setMode] = useState<Mode>('dark');
  const t = tokens[mode];
  const s = surfaces[mode];

  return (
    <div className="not-prose">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-fd-foreground">Mobile Attendee Screen</span>
        <ModeToggle mode={mode} setMode={setMode} />
      </div>
      <div className="flex justify-center">
        <div
          className="w-[320px] rounded-[32px] overflow-hidden shadow-xl transition-colors duration-500"
          style={{ backgroundColor: '#d6eaff' }}
        >
          {/* Branded header — always light */}
          <div className="flex flex-col items-center pt-12 pb-6">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
              <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/wordly-icon.svg`} alt="" className="h-10 w-10" />
            </div>
            <p className="text-lg font-light italic text-[#0b1c3a]">AI Powered Translation</p>
          </div>

          {/* Card — switches mode */}
          <div
            className="mx-3 mb-3 rounded-2xl p-5 transition-colors duration-500"
            style={{
              backgroundColor: t.cardBg,
              boxShadow: mode === 'light' ? '0 2px 48px rgba(0,0,0,0.02)' : 'none',
            }}
          >
            <h3 className="mb-3 text-lg font-bold transition-colors duration-500" style={{ color: t.textPrimary }}>
              Attend a session
            </h3>

            <label className="mb-1 block text-xs font-medium transition-colors duration-500" style={{ color: t.textPrimary }}>
              Session ID
            </label>
            <div
              className="mb-6 rounded-md px-3 py-2.5 text-sm transition-colors duration-500"
              style={{
                backgroundColor: t.inputBg,
                border: `1px solid ${t.inputBorder}`,
                color: t.textDisabled,
              }}
            >
              ABCD-1234
            </div>

            <div className="flex flex-col gap-2">
              <button
                className="w-full rounded-md py-2.5 text-sm font-medium transition-colors duration-500"
                style={{ backgroundColor: t.buttonPrimary, color: t.buttonPrimaryText }}
              >
                Join
              </button>
              <button
                className="w-full rounded-md py-2.5 text-sm font-medium transition-colors duration-500"
                style={{
                  backgroundColor: t.buttonSecondaryBg,
                  color: t.buttonSecondaryText,
                  border: `1px solid ${t.buttonSecondaryBorder}`,
                }}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
