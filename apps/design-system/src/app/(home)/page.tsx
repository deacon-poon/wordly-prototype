import Link from 'next/link';
import { FluidRibbon } from '@/components/fluid-ribbon';

const foundations = [
  { title: 'Colors', description: 'Primitive scales, semantic tokens, and usage guidelines.', href: '/docs/foundations/colors', ready: true },
  { title: 'Typography', description: 'Type ramp, font families, weights, and line heights.', href: '/docs/foundations/typography', ready: true },
  { title: 'Dark Mode', description: 'Dark palette construction, surface elevation, and mixed-mode patterns.', href: '/docs/foundations/dark-mode', ready: true },
  { title: 'Spacing', description: 'Spacing scale, layout grid, and density tokens.', href: '/docs/foundations/spacing' },
  { title: 'Iconography', description: 'Icon set, sizing conventions, and accessibility.', href: '/docs/foundations/iconography' },
  { title: 'Elevation', description: 'Shadow tokens, layering, and surface hierarchy.', href: '/docs/foundations/elevation' },
];

const atoms = [
  { title: 'Button', href: '/docs/atoms/button', ready: true },
  { title: 'Input', href: '/docs/atoms/input', ready: true },
  { title: 'Textarea', href: '/docs/atoms/textarea', ready: true },
  { title: 'Select', href: '/docs/atoms/select', ready: true },
  { title: 'Checkbox', href: '/docs/atoms/checkbox', ready: true },
  { title: 'Radio Group', href: '/docs/atoms/radio-group', ready: true },
  { title: 'Switch', href: '/docs/atoms/switch', ready: true },
  { title: 'Toggle', href: '/docs/atoms/toggle', ready: true },
  { title: 'Badge', href: '/docs/atoms/badge', ready: true },
  { title: 'Avatar', href: '/docs/atoms/avatar', ready: true },
  { title: 'Label', href: '/docs/atoms/label', ready: true },
  { title: 'Tooltip', href: '/docs/atoms/tooltip', ready: true },
  { title: 'Alert', href: '/docs/atoms/alert', ready: true },
  { title: 'Separator', href: '/docs/atoms/separator', ready: true },
  { title: 'Skeleton', href: '/docs/atoms/skeleton', ready: true },
  { title: 'Progress', href: '/docs/atoms/progress', ready: true },
];

const molecules = [
  { title: 'Button', href: '/docs/molecules/button', ready: true },
  { title: 'Toggle', href: '/docs/molecules/toggle', ready: true },
  { title: 'Select', href: '/docs/molecules/select', ready: true },
  { title: 'Combobox', href: '/docs/molecules/combobox', ready: true },
  { title: 'Calendar', href: '/docs/molecules/calendar', ready: true },
  { title: 'Form Field', href: '/docs/molecules/form-field', ready: true },
  { title: 'Card', href: '/docs/molecules/card', ready: true },
  { title: 'Dialog', href: '/docs/molecules/dialog', ready: true },
  { title: 'Dropdown Menu', href: '/docs/molecules/dropdown-menu', ready: true },
  { title: 'Accordion', href: '/docs/molecules/accordion', ready: true },
  { title: 'Toast', href: '/docs/molecules/toast', ready: true },
  { title: 'Tabs', href: '/docs/molecules/tabs', ready: true },
  { title: 'Table', href: '/docs/molecules/table', ready: true },
  { title: 'Data Table', href: '/docs/molecules/data-table', ready: true },
  { title: '+32 more', href: '/docs/molecules', ready: true },
];

const organisms = [
  { title: 'Navigation', href: '/docs/organisms/navigation' },
  { title: 'Data Table', href: '/docs/organisms/data-table' },
  { title: 'Modal Dialog', href: '/docs/organisms/modal-dialog' },
  { title: 'Sidebar', href: '/docs/organisms/sidebar' },
  { title: 'Form', href: '/docs/organisms/form' },
  { title: 'Header', href: '/docs/organisms/header' },
];

const templates = [
  { title: 'Dashboard', href: '/docs/templates/dashboard' },
  { title: 'Settings Page', href: '/docs/templates/settings' },
  { title: 'List / Detail', href: '/docs/templates/list-detail' },
  { title: 'Onboarding Flow', href: '/docs/templates/onboarding' },
];

const guidelines = [
  { title: 'Accessibility', description: 'WCAG 2.1 AA compliance, ARIA patterns, and keyboard navigation.', href: '/docs/guidelines/accessibility' },
  { title: 'Responsive Design', description: 'Breakpoints, adaptive layouts, and mobile-first patterns.', href: '/docs/guidelines/responsive' },
  { title: 'Content & Voice', description: 'Writing style, tone, terminology, and microcopy guidelines.', href: '/docs/guidelines/content' },
  { title: 'Internationalization', description: 'RTL support, translation patterns, and locale handling.', href: '/docs/guidelines/i18n' },
];

function SectionHeader({ label, title, description }: { label: string; title: string; description: string }) {
  return (
    <div className="mb-6">
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand-blue-400">{label}</p>
      <h2 className="mb-1 text-2xl font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

function DocCard({ title, description, href, ready }: { title: string; description?: string; href: string; ready?: boolean }) {
  const Tag = ready ? Link : 'div';
  return (
    <Tag
      {...(ready ? { href } : {})}
      className={`group rounded-xl border p-5 transition-all duration-200 ${
        ready
          ? 'border-gray-200/80 bg-white shadow-sm hover:border-brand-blue-200 hover:shadow-md hover:-translate-y-0.5'
          : 'border-dashed border-gray-200 bg-gray-50/40'
      }`}
    >
      <h3 className={`text-sm font-semibold ${ready ? 'text-gray-900 group-hover:text-brand-blue-500' : 'text-gray-400'}`}>
        {title}
      </h3>
      {description && (
        <p className={`mt-1.5 text-xs leading-relaxed ${ready ? 'text-gray-500' : 'text-gray-400'}`}>
          {description}
        </p>
      )}
    </Tag>
  );
}

function ChipGrid({ items }: { items: { title: string; href: string; ready?: boolean }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const Tag = item.ready ? Link : 'span';
        return (
          <Tag
            key={item.title}
            {...(item.ready ? { href: item.href } : {})}
            className={`rounded-lg border px-3.5 py-2 text-sm transition-all duration-200 ${
              item.ready
                ? 'border-gray-200/80 bg-white text-gray-700 shadow-sm hover:border-brand-blue-200 hover:text-brand-blue-500 hover:-translate-y-0.5'
                : 'border-dashed border-gray-200 bg-gray-50/40 text-gray-400'
            }`}
          >
            {item.title}
          </Tag>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-white animate-page-in">
      {/* ─── Hero ─── */}
      <section className="relative h-[92vh] min-h-[650px] overflow-hidden">
        {/* Ribbon — full bleed behind everything */}
        <FluidRibbon />

        {/* Radial glow behind content — separates text from ribbon */}
        <div
          className="pointer-events-none absolute left-1/2 top-[30%] z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80"
          style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0) 70%)' }}
        />

        {/* Content — positioned in the upper portion, above the ribbon curve */}
        <div className="relative z-20 flex flex-col items-center px-6 pt-32 sm:pt-40 text-center">
          <div className="mb-5">
            <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/wordly-icon.svg`} alt="" className="h-16 w-16" />
          </div>
          <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/wordly-logo.svg`} alt="Wordly" className="mb-3 h-9" />
          <h1
            className="mb-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl"
            style={{ textShadow: '0 0 40px rgba(255,255,255,0.95), 0 0 80px rgba(255,255,255,0.6)' }}
          >
            Design System
          </h1>
          <p
            className="max-w-md text-base text-gray-500"
            style={{ textShadow: '0 0 30px rgba(255,255,255,1), 0 0 60px rgba(255,255,255,0.8)' }}
          >
            Design tokens, color palettes, and component guidelines.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-full bg-brand-blue-400 px-7 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand-blue-400/20 transition-all duration-200 hover:bg-brand-blue-500 hover:shadow-brand-blue-500/25 hover:-translate-y-0.5"
            >
              Browse Docs
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <a
              href="https://www.figma.com/design/KIjCL0Hm88Ah2xsJmfvhaZ/Wordly-Design-System"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-gray-300 hover:text-gray-900 hover:-translate-y-0.5"
            >
              Open in Figma
            </a>
          </div>
        </div>

        {/* Bottom fade into content */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-48 bg-gradient-to-b from-transparent via-white/60 to-gray-50" />
      </section>

      {/* ─── Content ─── */}
      <div className="relative z-10 bg-gray-50 pb-32">
        <div className="mx-auto max-w-5xl space-y-20 px-6 pt-8">

          <section>
            <SectionHeader label="Foundations" title="Design Tokens" description="The core visual language — colors, type, spacing, and motion." />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {foundations.map((f) => (
                <DocCard key={f.title} {...f} />
              ))}
            </div>
          </section>

          <section>
            <SectionHeader label="Atoms" title="Primitive Components" description="The smallest UI building blocks — buttons, inputs, badges." />
            <ChipGrid items={atoms} />
          </section>

          <section>
            <SectionHeader label="Molecules" title="Composed Components" description="Combinations of atoms that form distinct UI units." />
            <ChipGrid items={molecules} />
          </section>

          <section>
            <SectionHeader label="Organisms" title="Complex Components" description="Feature-level components composed of molecules and atoms." />
            <ChipGrid items={organisms} />
          </section>

          <section>
            <SectionHeader label="Templates" title="Page Templates" description="Full-page layouts and composition patterns." />
            <ChipGrid items={templates} />
          </section>

          <section>
            <SectionHeader label="Guidelines" title="Standards & Practices" description="Cross-cutting concerns that apply to every component." />
            <div className="grid gap-3 sm:grid-cols-2">
              {guidelines.map((g) => (
                <DocCard key={g.title} {...g} />
              ))}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
