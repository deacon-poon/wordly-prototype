"use client";

/**
 * GlossarySelector
 *
 * EXACT React mirror of the production Angular `wordly-glossary-selector`
 *   wordly_portal:
 *     libs/components/business/wordly-glossary-selector/
 *       wordly-glossary-selector.component.{ts,html}
 *
 * Like the Angular original, this is a *thin proxy*: it renders the shared
 * FormControlWrapper (label / required / helper / error / info icon / extra
 * info / layout) wrapping a Select control, exactly the way the Angular
 * component proxies through `app-wordly-select` → `app-wordly-form-control-wrapper`
 * + `hlm-select-trigger`.
 *
 *   Angular:  glossary-selector → wordly-select → form-control-wrapper + hlm-select-trigger
 *   React:    GlossarySelector  → FormControlWrapper + (radix Select w/ hlm trigger anatomy)
 *
 * The Angular template binds the select as single-select:
 *   [multiple]="false" [scrollable]="true" [searchable]="false"
 * so this is a SINGLE-select control (not multi). The `displayNoneOption`
 * input prepends a "None" entry (value === 'none'), mirroring loadData().
 *
 * The trigger class string is ported verbatim from
 *   wordly_portal: libs/ui/select/src/lib/hlm-select-trigger.ts (selectTriggerVariants)
 * identical to the validated-exact account-selector reference.
 *
 * The default LAYOUT is the responsive label-beside-control grid (design
 * variant "default"), matching the portal — NOT a bespoke vertical flex-col.
 *
 * Glossary data arrives via props (mock default); the Angular DI/bridge-service
 * layer is dropped, but the bridge dataset shape and `displayNoneOption`
 * behavior are preserved.
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

export type GlossarySelectorSize = "default" | "sm";

// ---------------------------------------------------------------------------
// Data contract (mirrors the Angular GlossaryOption / WordlySelectOption type)
// ---------------------------------------------------------------------------

export interface GlossaryOption {
  label: string;
  value: string;
}

/** Value used for the optional "None" entry (mirrors the Angular literal). */
export const NONE_OPTION_VALUE = "none";

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from the glossary API via the bridge
// service. Mirrors the dataset used by the portal Overview story.
// ---------------------------------------------------------------------------

export const MOCK_GLOSSARIES: GlossaryOption[] = [
  { label: "Marketing Glossary (abc12)", value: "glossary-marketing-abc12" },
  { label: "Technical Terms (def34)", value: "glossary-technical-def34" },
  { label: "Legal Documents (ghi56)", value: "glossary-legal-ghi56" },
  { label: "Product Catalog (jkl78)", value: "glossary-product-jkl78" },
  { label: "Brand Guidelines (mno90)", value: "glossary-brand-mno90" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface GlossarySelectorProps {
  /** Controlled selected glossary value. */
  value?: string;
  /** Fired when the selection changes (empty string when cleared). */
  onValueChange?: (value: string) => void;

  /** Glossary list. Defaults to mock data. */
  glossaries?: GlossaryOption[];
  /** Prepend a "None" entry (value === NONE_OPTION_VALUE). Angular: displayNoneOption. */
  displayNoneOption?: boolean;
  /** Label for the "None" entry. Angular: noneOptionText (defaults "None"). */
  noneOptionText?: string;

  placeholder?: string;
  /**
   * Accepted for API compatibility. The Angular glossary-selector proxies
   * `wordly-select` with `searchable=false` (fixed), so this is a no-op here.
   */
  searchable?: boolean;

  /** Control height. Matches the portal `data-size`: default (h-9) or sm (h-8). */
  size?: GlossarySelectorSize;
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
  noGlossariesText?: string;

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

export function GlossarySelector({
  value,
  onValueChange,
  glossaries = MOCK_GLOSSARIES,
  displayNoneOption = false,
  noneOptionText = "None",
  placeholder = "Select glossary",
  size = "default",
  triggerClass = "",
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
  loadingText = "Loading glossaries...",
  noGlossariesText = "No glossaries available",
  layoutVariant = "default",
  labelStyleVariant,
  labelSizeVariant,
  labelContextVariant,
  spacingVariant,
  contentContextVariant,
  className,
}: GlossarySelectorProps) {
  // Build the select option list (mirrors `glossaryOptions: WordlySelectOption[]`),
  // prepending the optional "None" entry exactly like the Angular loadData().
  const glossaryOptions = React.useMemo(() => {
    if (!displayNoneOption) return glossaries;
    return [{ label: noneOptionText, value: NONE_OPTION_VALUE }, ...glossaries];
  }, [glossaries, displayNoneOption, noneOptionText]);

  const hasOptions = glossaryOptions.length > 0;
  const showError = error;

  // Loading / error / readonly block interaction (portal isLoading + readonly).
  const interactionBlocked = disabled || loading || error || readonly;

  const triggerPlaceholder = loading ? loadingText : placeholder;

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
            glossaryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          ) : (
            <div className="py-1.5 px-2 text-sm italic text-muted-foreground">
              {noGlossariesText}
            </div>
          )}
        </SelectContent>
      </Select>
    </FormControlWrapper>
  );
}
