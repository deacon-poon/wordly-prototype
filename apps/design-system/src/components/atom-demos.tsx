'use client';

import { ComponentPreview, PropsTable } from './component-preview';

/* ─────────────── Shared helpers ─────────────── */

const v = (vars: Record<string, string>, key: string) => vars[`--preview-${key}`] ?? '';

function P({ vars, children, style, ...rest }: { vars: Record<string, string>; children?: React.ReactNode; style?: React.CSSProperties } & React.HTMLAttributes<HTMLParagraphElement>) {
  return <p style={{ color: v(vars, 'fg'), ...style }} {...rest}>{children}</p>;
}

/* ─────────────── BUTTON ─────────────── */

export function ButtonDemo() {
  return (
    <ComponentPreview title="Variants">
      {(vars) => (
        <div className="flex flex-col gap-4">
          {/* Primary */}
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors" style={{ backgroundColor: v(vars, 'primary'), color: v(vars, 'primary-fg') }}>
              Primary
            </button>
            <button className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors" style={{ backgroundColor: v(vars, 'primary'), color: v(vars, 'primary-fg') }}>
              Small
            </button>
            <button className="inline-flex h-11 items-center justify-center rounded-md px-8 text-sm font-medium transition-colors" style={{ backgroundColor: v(vars, 'primary'), color: v(vars, 'primary-fg') }}>
              Large
            </button>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors" style={{ backgroundColor: v(vars, 'primary'), color: v(vars, 'primary-fg') }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
          {/* Secondary */}
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors" style={{ backgroundColor: v(vars, 'secondary'), color: v(vars, 'secondary-fg') }}>
              Secondary
            </button>
          </div>
          {/* Outline */}
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors" style={{ borderColor: v(vars, 'border'), backgroundColor: 'transparent', color: v(vars, 'fg') }}>
              Outline
            </button>
          </div>
          {/* Ghost */}
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors" style={{ backgroundColor: 'transparent', color: v(vars, 'fg') }}>
              Ghost
            </button>
          </div>
          {/* Destructive */}
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors" style={{ backgroundColor: v(vars, 'destructive'), color: v(vars, 'destructive-fg') }}>
              Destructive
            </button>
          </div>
          {/* Success */}
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors" style={{ backgroundColor: v(vars, 'success'), color: v(vars, 'success-fg') }}>
              Success
            </button>
          </div>
          {/* Link */}
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex h-10 items-center justify-center px-4 py-2 text-sm font-medium underline underline-offset-4 transition-colors" style={{ color: v(vars, 'primary') }}>
              Link
            </button>
          </div>
          {/* Disabled */}
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium opacity-50" style={{ backgroundColor: v(vars, 'primary'), color: v(vars, 'primary-fg') }}>
              Disabled
            </button>
          </div>
        </div>
      )}
    </ComponentPreview>
  );
}

export function ButtonPropsTable() {
  return (
    <PropsTable rows={[
      { name: 'variant', type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success"', default: '"default"', description: 'Visual style variant' },
      { name: 'size', type: '"default" | "sm" | "lg" | "icon"', default: '"default"', description: 'Button size' },
      { name: 'asChild', type: 'boolean', default: 'false', description: 'Render as child element via Radix Slot' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the button' },
    ]} />
  );
}

/* ─────────────── INPUT ─────────────── */

export function InputDemo() {
  return (
    <ComponentPreview title="Input States">
      {(vars, isDark) => (
        <div className="flex flex-col gap-4 max-w-xs">
          {/* Default */}
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: v(vars, 'fg') }}>Email</label>
            <div className="flex h-9 w-full items-center rounded-md border px-3 text-sm" style={{ borderColor: v(vars, 'input'), backgroundColor: v(vars, 'input-bg'), color: v(vars, 'fg') }}>
              user@example.com
            </div>
          </div>
          {/* Placeholder */}
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: v(vars, 'fg') }}>Search</label>
            <div className="flex h-9 w-full items-center rounded-md border px-3 text-sm" style={{ borderColor: v(vars, 'input'), backgroundColor: v(vars, 'input-bg'), color: v(vars, 'muted-fg') }}>
              Search...
            </div>
          </div>
          {/* Focused */}
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: v(vars, 'fg') }}>Focused</label>
            <div className="flex h-9 w-full items-center rounded-md border px-3 text-sm" style={{ borderColor: v(vars, 'ring'), backgroundColor: v(vars, 'input-bg'), color: v(vars, 'fg'), boxShadow: `0 0 0 3px ${isDark ? 'rgba(51,150,255,0.25)' : 'rgba(0,99,204,0.2)'}` }}>
              Focused input
            </div>
          </div>
          {/* Disabled */}
          <div>
            <label className="mb-1.5 block text-sm font-medium opacity-50" style={{ color: v(vars, 'fg') }}>Disabled</label>
            <div className="flex h-9 w-full items-center rounded-md border px-3 text-sm opacity-50" style={{ borderColor: v(vars, 'input'), backgroundColor: v(vars, 'input-bg'), color: v(vars, 'disabled') }}>
              Disabled
            </div>
          </div>
          {/* Error */}
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: v(vars, 'fg') }}>Error</label>
            <div className="flex h-9 w-full items-center rounded-md border px-3 text-sm" style={{ borderColor: v(vars, 'destructive'), backgroundColor: v(vars, 'input-bg'), color: v(vars, 'fg'), boxShadow: `0 0 0 3px ${isDark ? 'rgba(240,120,112,0.2)' : 'rgba(184,34,26,0.1)'}` }}>
              Invalid value
            </div>
            <p className="mt-1 text-xs" style={{ color: v(vars, 'destructive') }}>This field is required.</p>
          </div>
        </div>
      )}
    </ComponentPreview>
  );
}

export function InputPropsTable() {
  return (
    <PropsTable rows={[
      { name: 'type', type: 'string', default: '"text"', description: 'HTML input type' },
      { name: 'placeholder', type: 'string', description: 'Placeholder text' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the input' },
      { name: 'className', type: 'string', description: 'Additional CSS classes' },
    ]} />
  );
}

/* ─────────────── TEXTAREA ─────────────── */

export function TextareaDemo() {
  return (
    <ComponentPreview title="Textarea States">
      {(vars, isDark) => (
        <div className="flex flex-col gap-4 max-w-xs">
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: v(vars, 'fg') }}>Message</label>
            <div className="w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: v(vars, 'input'), backgroundColor: v(vars, 'input-bg'), color: v(vars, 'fg'), minHeight: '80px' }}>
              Type your message here...
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: v(vars, 'fg') }}>With content</label>
            <div className="w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: v(vars, 'input'), backgroundColor: v(vars, 'input-bg'), color: v(vars, 'fg'), minHeight: '80px' }}>
              Hello, this is an example of a textarea with some content. It supports multi-line text.
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium opacity-50" style={{ color: v(vars, 'fg') }}>Disabled</label>
            <div className="w-full rounded-md border px-3 py-2 text-sm opacity-50" style={{ borderColor: v(vars, 'input'), backgroundColor: v(vars, 'input-bg'), color: v(vars, 'disabled'), minHeight: '80px' }}>
              Cannot edit
            </div>
          </div>
        </div>
      )}
    </ComponentPreview>
  );
}

/* ─────────────── BADGE ─────────────── */

export function BadgeDemo() {
  return (
    <ComponentPreview title="Badge Variants">
      {(vars) => (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: v(vars, 'primary'), color: v(vars, 'primary-fg') }}>Default</span>
            <span className="inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: v(vars, 'secondary'), color: v(vars, 'secondary-fg') }}>Secondary</span>
            <span className="inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: v(vars, 'destructive'), color: v(vars, 'destructive-fg') }}>Destructive</span>
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold" style={{ borderColor: v(vars, 'border'), color: v(vars, 'fg') }}>Outline</span>
          </div>
          {/* Brand variants */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: v(vars, 'brand-blue-500'), color: '#ffffff' }}>Brand Blue</span>
            <span className="inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: v(vars, 'accent-green-500'), color: '#ffffff' }}>Accent Green</span>
            <span className="inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: v(vars, 'accent-orange-500'), color: '#ffffff' }}>Accent Orange</span>
          </div>
          {/* Sizes */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-transparent px-2 py-0.5 text-xs font-semibold" style={{ backgroundColor: v(vars, 'primary'), color: v(vars, 'primary-fg') }}>Small</span>
            <span className="inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: v(vars, 'primary'), color: v(vars, 'primary-fg') }}>Default</span>
            <span className="inline-flex items-center rounded-full border border-transparent px-3 py-1 text-sm font-semibold" style={{ backgroundColor: v(vars, 'primary'), color: v(vars, 'primary-fg') }}>Large</span>
          </div>
        </div>
      )}
    </ComponentPreview>
  );
}

export function BadgePropsTable() {
  return (
    <PropsTable rows={[
      { name: 'variant', type: '"default" | "secondary" | "destructive" | "outline" | "teal" | "navy" | "accent"', default: '"default"', description: 'Visual style variant' },
      { name: 'size', type: '"default" | "sm" | "lg"', default: '"default"', description: 'Badge size' },
    ]} />
  );
}

/* ─────────────── AVATAR ─────────────── */

export function AvatarDemo() {
  return (
    <ComponentPreview title="Avatar Variants">
      {(vars) => (
        <div className="flex flex-col gap-6">
          {/* With image fallbacks */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full" style={{ backgroundColor: v(vars, 'surface-1') }}>
              <span className="text-sm font-medium" style={{ color: v(vars, 'fg') }}>DP</span>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full" style={{ backgroundColor: v(vars, 'brand-blue-500'), color: '#ffffff' }}>
              <span className="text-sm font-medium">JD</span>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full" style={{ backgroundColor: v(vars, 'accent-green-500'), color: '#ffffff' }}>
              <span className="text-sm font-medium">AK</span>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full" style={{ backgroundColor: v(vars, 'accent-orange-500'), color: '#ffffff' }}>
              <span className="text-sm font-medium">MR</span>
            </div>
          </div>
          {/* Sizes */}
          <div className="flex items-end gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full" style={{ backgroundColor: v(vars, 'brand-blue-500'), color: '#ffffff' }}>
              <span className="text-xs font-medium">SM</span>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full" style={{ backgroundColor: v(vars, 'brand-blue-500'), color: '#ffffff' }}>
              <span className="text-sm font-medium">MD</span>
            </div>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full" style={{ backgroundColor: v(vars, 'brand-blue-500'), color: '#ffffff' }}>
              <span className="text-base font-medium">LG</span>
            </div>
          </div>
          {/* Group */}
          <div className="flex -space-x-2">
            {['DP', 'JD', 'AK', 'MR'].map((initials, i) => (
              <div key={i} className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2" style={{ backgroundColor: v(vars, 'brand-blue-500'), color: '#ffffff', ringColor: v(vars, 'bg') }}>
                <span className="text-xs font-medium">{initials}</span>
              </div>
            ))}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2" style={{ backgroundColor: v(vars, 'surface-2'), color: v(vars, 'muted-fg'), ringColor: v(vars, 'bg') }}>
              <span className="text-xs font-medium">+3</span>
            </div>
          </div>
        </div>
      )}
    </ComponentPreview>
  );
}

/* ─────────────── CHECKBOX ─────────────── */

export function CheckboxDemo() {
  return (
    <ComponentPreview title="Checkbox States">
      {(vars) => (
        <div className="flex flex-col gap-4">
          {/* Unchecked */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border" style={{ borderColor: v(vars, 'primary'), backgroundColor: 'transparent' }} />
            <span className="text-sm" style={{ color: v(vars, 'fg') }}>Unchecked</span>
          </div>
          {/* Checked */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm" style={{ backgroundColor: v(vars, 'primary'), color: v(vars, 'primary-fg') }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <span className="text-sm" style={{ color: v(vars, 'fg') }}>Checked</span>
          </div>
          {/* With label */}
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm" style={{ backgroundColor: v(vars, 'primary'), color: v(vars, 'primary-fg') }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div>
              <span className="text-sm font-medium" style={{ color: v(vars, 'fg') }}>Accept terms</span>
              <p className="text-xs" style={{ color: v(vars, 'muted-fg') }}>You agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </div>
          {/* Disabled */}
          <div className="flex items-center gap-2.5 opacity-50">
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border" style={{ borderColor: v(vars, 'primary'), backgroundColor: 'transparent' }} />
            <span className="text-sm" style={{ color: v(vars, 'fg') }}>Disabled</span>
          </div>
        </div>
      )}
    </ComponentPreview>
  );
}

/* ─────────────── SWITCH ─────────────── */

export function SwitchDemo() {
  return (
    <ComponentPreview title="Switch States">
      {(vars) => (
        <div className="flex flex-col gap-4">
          {/* Off */}
          <div className="flex items-center justify-between max-w-xs">
            <span className="text-sm" style={{ color: v(vars, 'fg') }}>Airplane Mode</span>
            <div className="relative inline-flex h-6 w-11 items-center rounded-full" style={{ backgroundColor: v(vars, 'surface-2') }}>
              <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-white transition-transform" />
            </div>
          </div>
          {/* On */}
          <div className="flex items-center justify-between max-w-xs">
            <span className="text-sm" style={{ color: v(vars, 'fg') }}>Notifications</span>
            <div className="relative inline-flex h-6 w-11 items-center rounded-full" style={{ backgroundColor: v(vars, 'primary') }}>
              <span className="inline-block h-4 w-4 translate-x-6 rounded-full bg-white transition-transform" />
            </div>
          </div>
          {/* Disabled */}
          <div className="flex items-center justify-between max-w-xs opacity-50">
            <span className="text-sm" style={{ color: v(vars, 'fg') }}>Wi-Fi (disabled)</span>
            <div className="relative inline-flex h-6 w-11 items-center rounded-full" style={{ backgroundColor: v(vars, 'surface-2') }}>
              <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-white transition-transform" />
            </div>
          </div>
        </div>
      )}
    </ComponentPreview>
  );
}

/* ─────────────── TOGGLE ─────────────── */

export function ToggleDemo() {
  return (
    <ComponentPreview title="Toggle Variants">
      {(vars) => (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Default off */}
            <div className="inline-flex h-10 items-center justify-center rounded-md px-3 text-sm font-medium" style={{ color: v(vars, 'muted-fg') }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 15h10M7 11h10M7 7h10" /></svg>
            </div>
            {/* Default on */}
            <div className="inline-flex h-10 items-center justify-center rounded-md px-3 text-sm font-medium" style={{ backgroundColor: v(vars, 'accent'), color: v(vars, 'accent-fg') }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 15h10M7 11h10M7 7h10" /></svg>
            </div>
            {/* Outline on */}
            <div className="inline-flex h-10 items-center justify-center rounded-md border px-3 text-sm font-medium" style={{ borderColor: v(vars, 'border'), backgroundColor: v(vars, 'accent'), color: v(vars, 'accent-fg') }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 15h10M7 11h10M7 7h10" /></svg>
            </div>
          </div>
          {/* Text toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex h-10 items-center justify-center rounded-md px-3 text-sm font-medium" style={{ backgroundColor: v(vars, 'accent'), color: v(vars, 'accent-fg') }}>Bold</div>
            <div className="inline-flex h-10 items-center justify-center rounded-md px-3 text-sm font-medium italic" style={{ color: v(vars, 'muted-fg') }}>Italic</div>
            <div className="inline-flex h-10 items-center justify-center rounded-md px-3 text-sm font-medium underline" style={{ color: v(vars, 'muted-fg') }}>Underline</div>
          </div>
        </div>
      )}
    </ComponentPreview>
  );
}

/* ─────────────── SELECT ─────────────── */

export function SelectDemo() {
  return (
    <ComponentPreview title="Select States">
      {(vars) => (
        <div className="flex flex-col gap-4 max-w-xs">
          {/* Default */}
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: v(vars, 'fg') }}>Framework</label>
            <div className="flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm" style={{ borderColor: v(vars, 'input'), backgroundColor: v(vars, 'input-bg'), color: v(vars, 'fg') }}>
              <span>Next.js</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}><path d="M6 9l6 6 6-6" /></svg>
            </div>
          </div>
          {/* Placeholder */}
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: v(vars, 'fg') }}>Language</label>
            <div className="flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm" style={{ borderColor: v(vars, 'input'), backgroundColor: v(vars, 'input-bg'), color: v(vars, 'muted-fg') }}>
              <span>Select a language...</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}><path d="M6 9l6 6 6-6" /></svg>
            </div>
          </div>
          {/* Dropdown open simulation */}
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: v(vars, 'fg') }}>Timezone</label>
            <div className="flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm" style={{ borderColor: v(vars, 'ring'), backgroundColor: v(vars, 'input-bg'), color: v(vars, 'fg') }}>
              <span>Select timezone...</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}><path d="M6 9l6 6 6-6" /></svg>
            </div>
            <div className="mt-1 rounded-md border p-1 shadow-md" style={{ borderColor: v(vars, 'border'), backgroundColor: v(vars, 'popover'), color: v(vars, 'popover-fg') }}>
              {['Pacific Time (PT)', 'Mountain Time (MT)', 'Central Time (CT)', 'Eastern Time (ET)'].map((tz, i) => (
                <div key={tz} className={`rounded-sm px-2 py-1.5 text-sm ${i === 0 ? '' : ''}`} style={i === 0 ? { backgroundColor: v(vars, 'accent'), color: v(vars, 'accent-fg') } : {}}>
                  {i === 0 && <span className="mr-2">&#10003;</span>}{tz}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ComponentPreview>
  );
}

/* ─────────────── RADIO GROUP ─────────────── */

export function RadioGroupDemo() {
  return (
    <ComponentPreview title="Radio Group">
      {(vars) => (
        <div className="flex flex-col gap-6 max-w-xs">
          <div className="flex flex-col gap-3">
            {['Option A', 'Option B', 'Option C'].map((label, i) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="flex h-4 w-4 items-center justify-center rounded-full border" style={{ borderColor: v(vars, 'primary') }}>
                  {i === 1 && <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: v(vars, 'primary') }} />}
                </div>
                <span className="text-sm" style={{ color: v(vars, 'fg') }}>{label}</span>
              </div>
            ))}
          </div>
          {/* Disabled */}
          <div className="flex flex-col gap-3 opacity-50">
            <div className="flex items-center gap-2.5">
              <div className="flex h-4 w-4 items-center justify-center rounded-full border" style={{ borderColor: v(vars, 'primary') }}>
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: v(vars, 'primary') }} />
              </div>
              <span className="text-sm" style={{ color: v(vars, 'fg') }}>Disabled selected</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-4 w-4 items-center justify-center rounded-full border" style={{ borderColor: v(vars, 'primary') }} />
              <span className="text-sm" style={{ color: v(vars, 'fg') }}>Disabled unselected</span>
            </div>
          </div>
        </div>
      )}
    </ComponentPreview>
  );
}

/* ─────────────── LABEL ─────────────── */

export function LabelDemo() {
  return (
    <ComponentPreview title="Label">
      {(vars) => (
        <div className="flex flex-col gap-4 max-w-xs">
          <div>
            <span className="text-sm font-medium leading-none" style={{ color: v(vars, 'fg') }}>Email address</span>
          </div>
          <div>
            <span className="text-sm font-medium leading-none" style={{ color: v(vars, 'fg') }}>Password</span>
            <span className="ml-1 text-xs" style={{ color: v(vars, 'destructive') }}>*</span>
          </div>
          <div className="opacity-50">
            <span className="text-sm font-medium leading-none" style={{ color: v(vars, 'fg') }}>Disabled label</span>
          </div>
          {/* With input */}
          <div>
            <span className="mb-1.5 block text-sm font-medium leading-none" style={{ color: v(vars, 'fg') }}>Username</span>
            <div className="flex h-9 w-full items-center rounded-md border px-3 text-sm" style={{ borderColor: v(vars, 'input'), backgroundColor: v(vars, 'input-bg'), color: v(vars, 'muted-fg') }}>
              Enter username
            </div>
          </div>
        </div>
      )}
    </ComponentPreview>
  );
}

/* ─────────────── TOOLTIP ─────────────── */

export function TooltipDemo() {
  return (
    <ComponentPreview title="Tooltip">
      {(vars) => (
        <div className="flex flex-col items-start gap-6">
          {/* Simulated tooltip above button */}
          <div className="relative pt-10">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-md px-3 py-1.5 text-xs" style={{ backgroundColor: v(vars, 'primary'), color: v(vars, 'primary-fg') }}>
              Add to library
              <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-px h-0 w-0" style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `5px solid ${v(vars, 'primary')}` }} />
            </div>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-md border" style={{ borderColor: v(vars, 'border'), color: v(vars, 'fg') }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            </button>
          </div>
          {/* Tooltip below */}
          <div className="relative pb-10">
            <button className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium" style={{ borderColor: v(vars, 'border'), color: v(vars, 'fg') }}>
              Hover me
            </button>
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 rounded-md px-3 py-1.5 text-xs" style={{ backgroundColor: v(vars, 'primary'), color: v(vars, 'primary-fg') }}>
              Tooltip content
              <div className="absolute left-1/2 bottom-full -translate-x-1/2 translate-y-px h-0 w-0" style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: `5px solid ${v(vars, 'primary')}` }} />
            </div>
          </div>
        </div>
      )}
    </ComponentPreview>
  );
}

/* ─────────────── SEPARATOR ─────────────── */

export function SeparatorDemo() {
  return (
    <ComponentPreview title="Separator">
      {(vars) => (
        <div className="max-w-sm">
          <h4 className="text-sm font-medium" style={{ color: v(vars, 'fg') }}>Wordly Design System</h4>
          <p className="text-xs" style={{ color: v(vars, 'muted-fg') }}>An open-source design system for Wordly products.</p>
          <div className="my-4 h-px w-full" style={{ backgroundColor: v(vars, 'border') }} />
          <div className="flex h-5 items-center gap-4 text-sm" style={{ color: v(vars, 'fg') }}>
            <span>Docs</span>
            <div className="h-full w-px" style={{ backgroundColor: v(vars, 'border') }} />
            <span>Source</span>
            <div className="h-full w-px" style={{ backgroundColor: v(vars, 'border') }} />
            <span>Figma</span>
          </div>
        </div>
      )}
    </ComponentPreview>
  );
}

/* ─────────────── SKELETON ─────────────── */

export function SkeletonDemo() {
  return (
    <ComponentPreview title="Skeleton Loading">
      {(vars) => (
        <div className="flex flex-col gap-6 max-w-sm">
          {/* Card skeleton */}
          <div className="rounded-xl border p-4" style={{ borderColor: v(vars, 'border') }}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-full" style={{ backgroundColor: v(vars, 'surface-2') }} />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded-md" style={{ backgroundColor: v(vars, 'surface-2') }} />
                <div className="h-3 w-1/2 animate-pulse rounded-md" style={{ backgroundColor: v(vars, 'surface-2') }} />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 w-full animate-pulse rounded-md" style={{ backgroundColor: v(vars, 'surface-2') }} />
              <div className="h-3 w-full animate-pulse rounded-md" style={{ backgroundColor: v(vars, 'surface-2') }} />
              <div className="h-3 w-2/3 animate-pulse rounded-md" style={{ backgroundColor: v(vars, 'surface-2') }} />
            </div>
          </div>
          {/* Inline skeleton */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 animate-pulse rounded-full" style={{ backgroundColor: v(vars, 'surface-2') }} />
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded-md" style={{ backgroundColor: v(vars, 'surface-2') }} />
              <div className="h-3 w-20 animate-pulse rounded-md" style={{ backgroundColor: v(vars, 'surface-2') }} />
            </div>
          </div>
        </div>
      )}
    </ComponentPreview>
  );
}

/* ─────────────── PROGRESS ─────────────── */

export function ProgressDemo() {
  return (
    <ComponentPreview title="Progress Bar">
      {(vars) => (
        <div className="flex flex-col gap-5 max-w-sm">
          {[25, 50, 75, 100].map((val) => (
            <div key={val}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: v(vars, 'fg') }}>{val === 100 ? 'Complete' : 'Loading...'}</span>
                <span className="text-xs font-mono" style={{ color: v(vars, 'muted-fg') }}>{val}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: v(vars, 'surface-2') }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${val}%`, backgroundColor: v(vars, 'primary') }} />
              </div>
            </div>
          ))}
          {/* Colored variants */}
          <div>
            <span className="mb-1.5 block text-xs font-medium" style={{ color: v(vars, 'fg') }}>Success</span>
            <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: v(vars, 'surface-2') }}>
              <div className="h-full rounded-full" style={{ width: '80%', backgroundColor: v(vars, 'success') }} />
            </div>
          </div>
          <div>
            <span className="mb-1.5 block text-xs font-medium" style={{ color: v(vars, 'fg') }}>Error</span>
            <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: v(vars, 'surface-2') }}>
              <div className="h-full rounded-full" style={{ width: '40%', backgroundColor: v(vars, 'destructive') }} />
            </div>
          </div>
        </div>
      )}
    </ComponentPreview>
  );
}

/* ─────────────── ALERT ─────────────── */

export function AlertDemo() {
  return (
    <ComponentPreview title="Alert Variants">
      {(vars, isDark) => (
        <div className="flex flex-col gap-3 max-w-sm">
          {/* Info */}
          <div className="rounded-lg border p-4" style={{ borderColor: isDark ? '#1e2f60' : '#b2d8ff', backgroundColor: isDark ? '#1e2f60' : '#f0f7ff' }}>
            <div className="flex gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#84c5ff' : '#1e40af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
              <div>
                <p className="text-sm font-medium" style={{ color: isDark ? '#84c5ff' : '#1e40af' }}>Information</p>
                <p className="mt-0.5 text-xs" style={{ color: isDark ? '#b2d8ff' : '#0051a8' }}>You can invite others via link.</p>
              </div>
            </div>
          </div>
          {/* Success */}
          <div className="rounded-lg border p-4" style={{ borderColor: isDark ? '#021f10' : '#bbf7cb', backgroundColor: isDark ? '#021f10' : '#f1fdf5' }}>
            <div className="flex gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#66c188' : '#0a7b3f'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              <div>
                <p className="text-sm font-medium" style={{ color: isDark ? '#66c188' : '#0a7b3f' }}>Success</p>
                <p className="mt-0.5 text-xs" style={{ color: isDark ? '#bbf7cb' : '#129737' }}>Session joined successfully.</p>
              </div>
            </div>
          </div>
          {/* Warning */}
          <div className="rounded-lg border p-4" style={{ borderColor: isDark ? '#7c2d12' : '#ffe7d6', backgroundColor: isDark ? '#7c2d12' : '#fff6f0' }}>
            <div className="flex gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#fdba74' : '#c2410c'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              <div>
                <p className="text-sm font-medium" style={{ color: isDark ? '#fdba74' : '#c2410c' }}>Warning</p>
                <p className="mt-0.5 text-xs" style={{ color: isDark ? '#ffe7d6' : '#8f3b00' }}>Session starts in 5 minutes.</p>
              </div>
            </div>
          </div>
          {/* Error */}
          <div className="rounded-lg border p-4" style={{ borderColor: isDark ? '#2e0906' : '#fcebea', backgroundColor: isDark ? '#2e0906' : '#fcebea' }}>
            <div className="flex gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#f07870' : '#b8221a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
              <div>
                <p className="text-sm font-medium" style={{ color: isDark ? '#f07870' : '#b8221a' }}>Error</p>
                <p className="mt-0.5 text-xs" style={{ color: isDark ? '#fcebea' : '#b8221a' }}>Invalid session ID.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </ComponentPreview>
  );
}
