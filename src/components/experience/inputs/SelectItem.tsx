"use client";

/**
 * SelectItem
 *
 * React/shadcn migration of the production MUI `SelectItem`
 * (wordly-react-components-lib: src/components/library/inputs/SelectItem.tsx,
 * Figma node 236:1966).
 *
 * The MUI original is a `FormControl` wrapping a styled outlined `Select` with a
 * notched-outline `InputLabel` (the label sits in a cutout on the top border),
 * a `displayEmpty` + `renderValue` placeholder, and a `colors` config that
 * overrides label / background / text / placeholder / border colors (with
 * theme-aware fallbacks).
 *
 * Here we drop MUI + Emotion entirely and rebuild on the shared shadcn `Select`
 * primitive (Radix) + Tailwind, mirroring the `workspace-selector.tsx` proof
 * (label above control, token classes, no raw hex). The MUI "notched outline"
 * label is approximated with a small floating label that overlaps the top border
 * — the closest faithful equivalent in our trigger anatomy.
 *
 * Color mapping (lib palette → our tokens):
 *   - default border (lib lightnessGray82)            → border-input / gray-*
 *   - text/label (lib onyx)                           → gray-900 / gray-700
 *   - focus accent (Brand Blue, kept primary per rules)→ ring / primary
 * The `colors` override prop is preserved for parity; values are applied as
 * inline styles only when explicitly passed (so token defaults stay the norm).
 *
 * Data arrives via props (small inline mock default); in production the options
 * would be fetched from an API.
 */

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem as SelectOptionItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ---------------------------------------------------------------------------
// Data contract (mirrors the MUI SelectOption)
// ---------------------------------------------------------------------------

export interface SelectOption {
  /**
   * The value of the option (what gets submitted/stored). For numeric choices,
   * use a number (e.g. 2) even if the label is descriptive (e.g. "2 lines").
   * Radix Select works with string values, so values are coerced to strings
   * internally and handed back in their original form on change.
   */
  value: string | number;
  /** The display label shown to the user. */
  label: string;
}

/**
 * Optional explicit color overrides (parity with the MUI `colors` prop).
 * Omit to use the design tokens — that is the intended default.
 */
export interface SelectItemColors {
  /** Color of the label text above the field. */
  label?: string;
  /** Background color of the trigger. */
  background?: string;
  /** Color of the selected text. */
  text?: string;
  /** Color of the placeholder text. */
  placeholder?: string;
  /** Border color in the default state. */
  border?: string;
}

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from an API
// ---------------------------------------------------------------------------

export const MOCK_OPTIONS: SelectOption[] = [
  { value: "en", label: "English (US)" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "ja", label: "Japanese" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface SelectItemProps {
  /** Label text displayed above (floating into) the trigger border. */
  label?: string;
  /** Placeholder shown when no option is selected. */
  placeholder?: string;
  /** Options to display. */
  options?: SelectOption[];
  /** Controlled selected value. */
  value?: string | number;
  /** Initial value for uncontrolled use. */
  defaultValue?: string | number;
  /** Fired with the option's original (string | number) value on change. */
  onChange?: (value: string | number) => void;
  /** Disable the control. */
  disabled?: boolean;
  /** Explicit color overrides (parity with the MUI `colors` prop). */
  colors?: SelectItemColors;
  /** Extra classes for the outer wrapper. */
  className?: string;
}

export function SelectItem({
  label = "Select",
  placeholder = "Choose an option",
  options = MOCK_OPTIONS,
  value: controlledValue,
  defaultValue,
  onChange,
  disabled = false,
  colors,
  className,
}: SelectItemProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = React.useState<string>(
    defaultValue !== undefined ? String(defaultValue) : ""
  );

  const stringValue = isControlled
    ? controlledValue === undefined
      ? ""
      : String(controlledValue)
    : internalValue;

  const toId = (text: string) => text.replace(/\s+/g, "-").toLowerCase();
  const inputId = `${toId(label)}-select`;
  const labelId = `${toId(label)}-label`;

  const hasSelection = stringValue !== "";

  function handleChange(next: string) {
    if (!isControlled) setInternalValue(next);
    // Hand back the original (possibly numeric) value.
    const original = options.find((o) => String(o.value) === next);
    onChange?.(original ? original.value : next);
  }

  // Explicit overrides → inline styles; otherwise token classes carry the look.
  const labelStyle = colors?.label ? { color: colors.label } : undefined;
  const triggerStyle: React.CSSProperties | undefined =
    colors?.background || colors?.text || colors?.border
      ? {
          ...(colors.background ? { backgroundColor: colors.background } : {}),
          ...(colors.text ? { color: colors.text } : {}),
          ...(colors.border ? { borderColor: colors.border } : {}),
        }
      : undefined;
  const placeholderStyle = colors?.placeholder
    ? { color: colors.placeholder }
    : undefined;

  return (
    <div className={cn("relative min-w-[180px] max-w-[220px]", className)}>
      {/* Floating label — overlaps the top border to mimic the MUI notch. */}
      <label
        id={labelId}
        htmlFor={inputId}
        style={labelStyle}
        className="absolute left-2 top-0 z-10 -translate-y-1/2 bg-background px-1 text-[11px] font-medium leading-none tracking-[0.035px] text-gray-700"
      >
        {label}
      </label>

      <Select
        value={hasSelection ? stringValue : undefined}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={inputId}
          aria-labelledby={labelId}
          style={triggerStyle}
          className={cn(
            "h-9 min-h-9 bg-background text-base text-gray-900",
            "focus:ring-2 focus:ring-ring focus:ring-offset-0",
            !hasSelection && "text-gray-700"
          )}
        >
          {hasSelection ? (
            <SelectValue />
          ) : (
            <span style={placeholderStyle} className="text-gray-700">
              {placeholder}
            </span>
          )}
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectOptionItem
              key={String(option.value)}
              value={String(option.value)}
            >
              {option.label}
            </SelectOptionItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
