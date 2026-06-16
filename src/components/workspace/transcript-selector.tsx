"use client";

/**
 * TranscriptSelector
 *
 * EXACT React mirror of the production Angular `wordly-transcript-selector`
 *   wordly_portal:
 *     libs/components/business/wordly-transcript-selector/
 *       wordly-transcript-selector.component.{ts,html}
 *
 * In Angular this is a *thin proxy* over the core `wordly-select`
 * (`WordlyProxyControlBase`): the template is a single `<app-wordly-select>`
 * that forwards every form-control input/output and is fed a fixed list of
 * three transcript-save-mode options built in `loadData()` from
 * `ConstantsService.transcriptMode` + `transcriptLabels` (resolved through the
 * translation service).
 *
 *   Angular:  transcript-selector → wordly-select → form-control-wrapper + hlm-select-trigger
 *   React:    TranscriptSelector  → FormControlWrapper + (radix Select w/ hlm trigger anatomy)
 *
 * Mirrors the validated AccountSelector reference exactly: the trigger class
 * string is ported verbatim from
 *   wordly_portal: libs/ui/select/src/lib/hlm-select-trigger.ts (selectTriggerVariants)
 * and the default LAYOUT is the responsive label-beside-control grid (design
 * variant "default"), matching the portal.
 *
 * The transcript options arrive via props (mock default mirrors the production
 * ConstantsService labels); the Angular DI/constants/translation layer is
 * dropped, but the option set (nosave / presenter / all) is preserved 1:1.
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
// (wordly_portal libs/ui/select/src/lib/hlm-select-trigger.ts), identical to
// the validated AccountSelector reference. Angular targets `[&>ng-icon]`; the
// React radix trigger renders its chevron as an svg, so the icon-targeting
// utilities are mapped to `[&>svg]` while every other token is identical.
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

export type TranscriptSelectorSize = "default" | "sm";

// ---------------------------------------------------------------------------
// Data contract (mirrors the Angular WordlySelectOption built in loadData())
// ---------------------------------------------------------------------------

export interface TranscriptOption {
  /** Option value (mirrors ConstantsService.transcriptMode). */
  value: string;
  /** Display label (mirrors ConstantsService.transcriptLabels). */
  label: string;
}

/**
 * Transcript-save modes — matches ConstantsService.transcriptMode.
 * (presenterNonSSO exists in constants but the selector only uses these three.)
 */
export const TRANSCRIPT_MODE = {
  nosave: "NONE",
  presenter: "PRESENTER",
  all: "ALL",
} as const;

// ---------------------------------------------------------------------------
// Mock data — in production, built in loadData() from ConstantsService
// transcriptMode + transcriptLabels (resolved via the translation service).
// Labels ported verbatim from the production ConstantsService.transcriptLabels.
// ---------------------------------------------------------------------------

export const MOCK_TRANSCRIPT_OPTIONS: TranscriptOption[] = [
  {
    label: "Do not save transcript",
    value: TRANSCRIPT_MODE.nosave,
  },
  {
    label: "Save transcript to workspace",
    value: TRANSCRIPT_MODE.presenter,
  },
  {
    label: "Save and allow attendees to copy full transcript",
    value: TRANSCRIPT_MODE.all,
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface TranscriptSelectorProps {
  /** Controlled selected transcript-mode value. */
  value?: string;
  /** Fired when the selection changes (Angular `valueChanged`). */
  onValueChange?: (value: string) => void;

  /** Transcript-mode options. Defaults to mock data. */
  options?: TranscriptOption[];

  placeholder?: string;
  /** Control height. Matches the portal `data-size`: default (h-9) or sm (h-8). */
  size?: TranscriptSelectorSize;
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
  noOptionsText?: string;

  /** Fired when the trigger loses focus (Angular `inputBlur`). */
  onBlur?: () => void;
  /** Fired when the trigger gains focus (Angular `inputFocus`). */
  onFocus?: () => void;

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

export function TranscriptSelector({
  value,
  onValueChange,
  options = MOCK_TRANSCRIPT_OPTIONS,
  placeholder = "Select transcript mode",
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
  loadingText = "Loading transcript options...",
  errorLoadingText = "Failed to load transcript options",
  noOptionsText = "No transcript options available",
  onBlur,
  onFocus,
  layoutVariant = "default",
  labelStyleVariant,
  labelSizeVariant,
  labelContextVariant,
  spacingVariant,
  contentContextVariant,
  className,
}: TranscriptSelectorProps) {
  const hasOptions = options.length > 0;
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
          onBlur={onBlur}
          onFocus={onFocus}
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
            options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          ) : (
            <div className="py-1.5 px-2 text-sm italic text-muted-foreground">
              {noOptionsText}
            </div>
          )}
        </SelectContent>
      </Select>
    </FormControlWrapper>
  );
}
