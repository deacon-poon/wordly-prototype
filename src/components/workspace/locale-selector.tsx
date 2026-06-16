"use client";

/**
 * LocaleSelector
 *
 * EXACT React mirror of the production Angular `wordly-locale-selector`
 *   wordly_portal:
 *     libs/components/business/wordly-locale-selector/
 *       wordly-locale-selector.component.{ts,html}
 *
 * Like the Angular original, this is a *thin proxy*: it renders the shared
 * FormControlWrapper (label / required / helper / error / info / extra-info /
 * layout) wrapping a Select control, exactly the way the Angular component
 * proxies through `app-wordly-select` → `app-wordly-form-control-wrapper` +
 * `hlm-select-trigger`.
 *
 *   Angular:  locale-selector → wordly-select → form-control-wrapper + hlm-select-trigger
 *   React:    LocaleSelector  → FormControlWrapper + (radix Select w/ hlm trigger anatomy)
 *
 * The Angular template pins the proxied select to `multiple=false`,
 * `scrollable=true`, `searchable=false` — so this React proxy is a single,
 * non-searchable select (matching account-selector). The trigger class string
 * is ported verbatim from
 *   wordly_portal: libs/ui/select/src/lib/hlm-select-trigger.ts (selectTriggerVariants)
 *
 * The default LAYOUT is the responsive label-beside-control grid (design
 * variant "default"), matching the portal — NOT a bespoke vertical flex-col.
 *
 * Locale data arrives via props (mock default mirroring the Overview story's
 * bridge-service mock). The Angular DI/bridge-service layer
 * (ConstantsService.SUPPORTED_LOCALES) is dropped; the `LocaleOption` shape
 * ({ label, value, use }) and the `value`-keyed option list are preserved.
 */

import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControlWrapper } from "@/components/ui/form-control-wrapper";
import type { WordlyDesignVariants } from "@/components/ui/design-variants";

// ---------------------------------------------------------------------------
// Trigger anatomy — ported verbatim from the portal `selectTriggerVariants`
// (wordly_portal libs/ui/select/src/lib/hlm-select-trigger.ts). Angular targets
// `[&>ng-icon]`; the React radix trigger renders its chevron as an svg, so the
// icon-targeting utilities are mapped to `[&>svg]` while every other token
// (border-input, rounded-md, px-3 py-2, text-sm, shadow-xs, gap-2, the
// data-[size] heights, the focus ring [3px], destructive on error) is identical.
// ---------------------------------------------------------------------------

const selectTriggerVariants = cva(
  "border-input [&>svg]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      error: {
        true: "text-destructive border-destructive focus-visible:ring-destructive/20",
        false: "",
      },
    },
    defaultVariants: {
      error: false,
    },
  }
);

export type LocaleSelectorSize = "default" | "sm";

// ---------------------------------------------------------------------------
// Data contract (mirrors the Angular LocaleOption model)
// ---------------------------------------------------------------------------

export interface LocaleOption {
  /** Display label for the locale (e.g., "English", "Español"). */
  label: string;
  /** Short locale code (e.g., "en", "es"). */
  value: string;
  /** Specific locale code for internal use (e.g., "en-US", "es-419"). */
  use?: string;
}

/** Default label: the locale label (matches the Angular default behavior). */
export const defaultLabelFormatter = (locale: LocaleOption): string =>
  locale.label;

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from ConstantsService.SUPPORTED_LOCALES via
// the bridge service. Mirrors the dataset used by the portal Overview story.
// ---------------------------------------------------------------------------

export const MOCK_LOCALES: LocaleOption[] = [
  { label: "English", value: "en", use: "en-US" },
  { label: "Español", value: "es", use: "es-419" },
  { label: "Français", value: "fr", use: "fr-FR" },
  { label: "日本語", value: "ja", use: "ja-JP" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface LocaleSelectorProps {
  /** Controlled selected locale value (the short locale code). */
  value?: string;
  /** Fired when the selection changes (empty string when cleared). */
  onValueChange?: (value: string) => void;

  /** Available locale options. Defaults to mock data. */
  locales?: LocaleOption[];
  /** Customize how each locale label renders. Defaults to `locale.label`. */
  labelFormatter?: (locale: LocaleOption) => string;

  placeholder?: string;
  /**
   * Accepted for API compatibility. The Angular locale-selector proxies
   * `wordly-select` with `searchable=false` (fixed), so this is a no-op here.
   */
  searchable?: boolean;

  /** Control height. Matches the portal `data-size`: default (h-9) or sm (h-8). */
  size?: LocaleSelectorSize;
  /** CSS class(es) applied to the select trigger (portal `triggerClass`). */
  triggerClass?: string;

  disabled?: boolean;
  /** Read-only: shows the value but blocks interaction (portal `readonly`). */
  readonly?: boolean;
  loading?: boolean;
  /** Error/invalid state (portal `displayError`). */
  error?: boolean;
  /** Error text shown below the control when `error` is set (portal errorMessage). */
  errorMessage?: string;
  /** Helper text shown below the control when not in an error state. */
  helperText?: string;
  /** Place helper text above the control (stacked layout only). */
  helperTextOnTop?: boolean;

  label?: string;
  required?: boolean;
  /** Show an info icon beside the label (portal `showInfoIcon`). */
  showInfoIcon?: boolean;
  infoTooltipText?: string;
  /** Extra info block below the control (portal `extraInfo`). */
  extraInfo?: string;

  loadingText?: string;
  errorLoadingText?: string;
  noLocalesText?: string;

  // ===== DESIGN VARIANT INPUTS (forwarded to the wrapper, like Angular) =====
  /** Container layout. Default "default" = portal responsive label-beside grid. */
  layoutVariant?: WordlyDesignVariants["layout"];
  labelStyleVariant?: WordlyDesignVariants["labelStyle"];
  labelSizeVariant?: WordlyDesignVariants["labelSize"];
  labelContextVariant?: WordlyDesignVariants["labelContext"];
  spacingVariant?: WordlyDesignVariants["spacing"];
  contentContextVariant?: WordlyDesignVariants["contentContext"];

  className?: string;
}

export function LocaleSelector({
  value,
  onValueChange,
  locales = MOCK_LOCALES,
  labelFormatter = defaultLabelFormatter,
  placeholder = "Select locale",
  size = "default",
  triggerClass = "w-full",
  disabled = false,
  readonly = false,
  loading = false,
  error = false,
  errorMessage,
  helperText,
  helperTextOnTop = false,
  label,
  required = false,
  showInfoIcon = false,
  infoTooltipText,
  extraInfo,
  loadingText = "Loading locales...",
  errorLoadingText = "Failed to load locales",
  noLocalesText = "No locales available",
  layoutVariant = "default",
  labelStyleVariant,
  labelSizeVariant,
  labelContextVariant,
  spacingVariant,
  contentContextVariant,
  className,
}: LocaleSelectorProps) {
  // Build the select option list (mirrors `localeOptions: WordlySelectOption[]`
  // mapped from LocaleOption in the Angular component's loadData()).
  const localeOptions = React.useMemo(
    () =>
      locales.map((locale) => ({
        value: locale.value,
        label: labelFormatter(locale),
      })),
    [locales, labelFormatter]
  );

  const hasOptions = localeOptions.length > 0;
  const showError = error;

  // Loading / error / readonly block interaction (portal isLoading + readonly).
  const interactionBlocked = disabled || loading || error || readonly;

  const triggerPlaceholder = loading
    ? loadingText
    : error
      ? errorLoadingText
      : placeholder;

  return (
    <FormControlWrapper
      label={label}
      required={required}
      helperText={!error ? helperText : undefined}
      helperTextOnTop={helperTextOnTop}
      showError={showError}
      currentErrorMessage={errorMessage}
      extraInfo={extraInfo}
      showInfoIcon={showInfoIcon}
      infoTooltipText={infoTooltipText}
      layoutVariant={layoutVariant}
      labelStyleVariant={labelStyleVariant}
      labelSizeVariant={labelSizeVariant}
      labelContextVariant={labelContextVariant}
      spacingVariant={spacingVariant}
      contentContextVariant={contentContextVariant}
      className={className}
    >
      <Select
        value={value || undefined}
        onValueChange={(next) => onValueChange?.(next)}
        disabled={interactionBlocked}
      >
        <SelectTrigger
          data-size={size}
          aria-invalid={error || undefined}
          aria-readonly={readonly || undefined}
          aria-required={required || undefined}
          className={cn(
            selectTriggerVariants({ error: showError }),
            readonly && "pointer-events-none",
            triggerClass
          )}
        >
          <SelectValue
            placeholder={
              <span className="text-muted-foreground line-clamp-1 truncate">
                {triggerPlaceholder}
              </span>
            }
          />
        </SelectTrigger>
        <SelectContent className="max-h-96 min-w-[325px] pt-0 pb-0">
          {hasOptions ? (
            localeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          ) : (
            <div className="py-1.5 px-2 text-sm italic text-muted-foreground">
              {noLocalesText}
            </div>
          )}
        </SelectContent>
      </Select>
    </FormControlWrapper>
  );
}
