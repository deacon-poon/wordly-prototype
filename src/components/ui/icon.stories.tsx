import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Plus,
  X,
  Trash2,
  Check,
  Search,
  Settings,
  Bell,
  Globe,
  type LucideIcon,
} from "lucide-react";

/**
 * NOTE ON SCOPE
 *
 * There is no `src/components/ui/icon.tsx` in this prototype, so this story
 * cannot import a component from "./icon" without breaking the Storybook build.
 * Per the "adapt sensibly" rule, this story documents the icon pattern the
 * prototype actually uses (Lucide via `lucide-react`) and mirrors the portal's
 * `WordlyIcon` design-system size tokens (xs/sm/base/lg/xl). The lightweight
 * `Icon` wrapper below is defined inline so the file compiles and indexes on
 * its own without creating or editing any component file.
 *
 * Portal reference: wordly_portal/libs/components/core/icon/wordly-icon.component.ts
 *   xs = 12px | sm = 16px | base = 24px | lg = 32px | xl = 48px (default sm)
 */

type WordlyIconSize = "xs" | "sm" | "base" | "lg" | "xl";

const SIZE_PX: Record<WordlyIconSize, number> = {
  xs: 12,
  sm: 16,
  base: 24,
  lg: 32,
  xl: 48,
};

type IconProps = {
  /** Lucide icon component, e.g. Plus, Trash2. */
  icon: LucideIcon;
  /** Design-system size token (default "sm"). */
  size?: WordlyIconSize;
  /** Tailwind color class, e.g. "text-destructive". */
  className?: string;
  /** Accessible label. When omitted the icon is decorative (aria-hidden). */
  "aria-label"?: string;
};

/**
 * Thin design-system wrapper around a Lucide icon. Icons are decorative by
 * default (aria-hidden); pass aria-label to make one meaningful.
 */
function Icon({
  icon: Glyph,
  size = "sm",
  className,
  "aria-label": ariaLabel,
}: IconProps) {
  const px = SIZE_PX[size];
  return (
    <Glyph
      width={px}
      height={px}
      className={className}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      role={ariaLabel ? "img" : undefined}
    />
  );
}

const meta: Meta<typeof Icon> = {
  title: "Core/Icon",
  component: Icon,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "base", "lg", "xl"],
    },
    className: { control: "text" },
  },
  args: {
    icon: Plus,
    size: "sm",
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

// --- Default ----------------------------------------------------------------

export const Default: Story = {
  args: { icon: Plus, size: "sm" },
};

// --- Sizes ------------------------------------------------------------------

/** The five design-system size tokens: xs 12, sm 16, base 24, lg 32, xl 48. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      {(["xs", "sm", "base", "lg", "xl"] as WordlyIconSize[]).map((s) => (
        <div key={s} className="flex flex-col items-center gap-2">
          <Icon icon={Settings} size={s} />
          <span className="text-xs text-gray-500">
            {s} ({SIZE_PX[s]}px)
          </span>
        </div>
      ))}
    </div>
  ),
};

// --- Colors -----------------------------------------------------------------

/** Color is inherited from a Tailwind text class on the icon. */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <Icon icon={Check} size="base" className="text-accent-green-600" />
      <Icon icon={Globe} size="base" className="text-primary-blue-700" />
      <Icon icon={Bell} size="base" className="text-action-teal-800" />
      <Icon icon={Trash2} size="base" className="text-destructive" />
      <Icon icon={Settings} size="base" className="text-gray-500" />
    </div>
  ),
};

// --- Catalogue sample -------------------------------------------------------

/** A representative set of common Lucide glyphs used across the dashboard. */
export const Catalogue: Story = {
  render: () => {
    const items: Array<{ icon: LucideIcon; label: string }> = [
      { icon: Plus, label: "Plus" },
      { icon: X, label: "X" },
      { icon: Trash2, label: "Trash2" },
      { icon: Check, label: "Check" },
      { icon: Search, label: "Search" },
      { icon: Settings, label: "Settings" },
      { icon: Bell, label: "Bell" },
      { icon: Globe, label: "Globe" },
    ];
    return (
      <div className="flex flex-wrap gap-4">
        {items.map(({ icon, label }) => (
          <div
            key={label}
            className="flex w-20 flex-col items-center gap-2 rounded-md border border-gray-200 p-3"
          >
            <Icon icon={icon} size="base" className="text-gray-700" />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    );
  },
};

// --- Accessibility ----------------------------------------------------------

/**
 * Left: decorative icon inside a labelled button (icon is aria-hidden).
 * Right: standalone meaningful icon carrying its own aria-label.
 */
export const Accessibility: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-md bg-primary-blue-700 px-3 py-2 text-sm text-white"
      >
        <Icon icon={Plus} size="sm" />
        Add language
      </button>
      <Icon
        icon={Bell}
        size="base"
        className="text-gray-700"
        aria-label="Notifications"
      />
    </div>
  ),
};
