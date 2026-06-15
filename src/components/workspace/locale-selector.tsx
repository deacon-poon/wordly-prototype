"use client";

/**
 * LocaleSelector
 *
 * React migration of the production Angular `wordly-locale-selector`
 * (wordly_portal: libs/components/business/wordly-locale-selector).
 *
 * The Angular original is a proxy over the core `wordly-select`, populated with
 * supported-locale data from a bridge service (ConstantsService.SUPPORTED_LOCALES).
 * Here we keep the same public surface (label, placeholder, required, disabled,
 * readonly, helper text, and loading/error/empty states) but drop the Angular
 * DI/service layer: locales arrive via props, defaulting to mock data.
 *
 * Built on the shared shadcn primitives (Command + Popover) per the
 * WorkspaceSelector proof. In production these locales would be fetched from the
 * API / ConstantsService.SUPPORTED_LOCALES.
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { selectTriggerVariants } from "@/components/ui/select-trigger";
// AlertCircle is this lucide-react version's name for the portal's lucideAlertCircle glyph.
import { AlertCircle, Check, ChevronDown, Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ---------------------------------------------------------------------------
// Trigger anatomy — mirrors the portal `selectTriggerVariants`
// (wordly_portal libs/ui/select/src/lib/hlm-select-trigger.ts). The portal
// proxies wordly-locale-selector → wordly-select → hlm-select-trigger, so the
// real control anatomy lives there: border-input, rounded-md, px-3 py-2,
// text-sm, shadow-xs, gap-2, sizes default=h-9 / sm=h-8, focus ring [3px] on
// ring (no offset) with focus-visible:border-ring, destructive border+text+ring
// on error. No hover state on the trigger.
// ---------------------------------------------------------------------------

export type LocaleSelectorSize = NonNullable<
  VariantProps<typeof selectTriggerVariants>["size"]
>;

// ---------------------------------------------------------------------------
// Data contract (mirrors the Angular LocaleOption model)
// ---------------------------------------------------------------------------

export interface LocaleOption {
  /** Display label for the locale (e.g., "English", "Espanol"). */
  label: string;
  /** Short locale code (e.g., "en", "es"). */
  value: string;
  /** Specific locale code for internal use (e.g., "en-US", "es-419"). */
  use?: string;
}

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from the API (ConstantsService.SUPPORTED_LOCALES)
// ---------------------------------------------------------------------------

export const MOCK_LOCALES: LocaleOption[] = [
  { label: "English", value: "en", use: "en-US" },
  { label: "Español", value: "es", use: "es-419" },
  { label: "Français", value: "fr", use: "fr-FR" },
  { label: "Deutsch", value: "de", use: "de-DE" },
  { label: "日本語", value: "ja", use: "ja-JP" },
  { label: "中文", value: "zh", use: "zh-CN" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface LocaleSelectorProps {
  /** Controlled selected locale value (the short locale code). */
  value?: string;
  /** Fired when the selection changes (empty string when cleared). */
  onValueChange?: (value: string) => void;
  /** Available locale options. */
  locales?: LocaleOption[];

  placeholder?: string;
  /** Show a search input to filter locales. */
  searchable?: boolean;
  /** Allow clearing the current selection. */
  clearable?: boolean;

  /** Control height. Matches the portal `data-size`: default (h-9) or sm (h-8). */
  size?: LocaleSelectorSize;

  disabled?: boolean;
  /** Read-only: shows the value but blocks interaction (portal `readonly`). */
  readonly?: boolean;
  loading?: boolean;
  error?: boolean;

  label?: string;
  required?: boolean;
  /** Helper text shown beneath the field (Angular `helperText`). */
  helperText?: string;
  /** Error message shown beneath the field when `error` is set (Angular `errorMessage`). */
  errorMessage?: string;

  loadingText?: string;
  errorLoadingText?: string;
  noLocalesText?: string;
  noSearchResultsText?: string;

  className?: string;
}

export function LocaleSelector({
  value,
  onValueChange,
  locales = MOCK_LOCALES,
  placeholder = "Select locale",
  searchable = false,
  clearable = false,
  size = "default",
  disabled = false,
  readonly = false,
  loading = false,
  error = false,
  label,
  required = false,
  helperText,
  errorMessage,
  loadingText = "Loading locales...",
  errorLoadingText = "Failed to load locales",
  noLocalesText = "No locales available",
  noSearchResultsText = "No locales match that search query",
  className,
}: LocaleSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const selected = locales.find((o) => o.value === value);
  const hasOptions = locales.length > 0;

  const triggerLabel = loading
    ? loadingText
    : error
      ? errorLoadingText
      : (selected?.label ?? placeholder);

  // Loading / error block the trigger; readonly keeps appearance but blocks open.
  const interactionBlocked = disabled || loading || error || readonly;

  function handleSelect(next: string) {
    onValueChange?.(next === value ? "" : next);
    setOpen(false);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onValueChange?.("");
  }

  const showClear = clearable && !!selected && !loading && !error && !readonly;

  return (
    // Container — portal wordlyContainerVariants default: flex flex-col gap-4
    <div className={cn("flex flex-col gap-4", className)}>
      {label ? (
        // Label — portal wordlyLabelVariants base:
        // flex items-center gap-2.5 font-bold text-sm tracking-wider text-black
        // (portal "bold" = 600 = font-semibold; required indicator = text-destructive)
        <label className="flex items-center gap-2.5 font-semibold text-sm tracking-wider text-black">
          {label}
          {required ? <span className="text-destructive">*</span> : null}
        </label>
      ) : null}

      {/* Content — portal wordlyContentVariants default: flex flex-col gap-3 */}
      <div className="flex flex-col gap-3">
        <Popover
          open={open}
          onOpenChange={interactionBlocked ? undefined : setOpen}
        >
          <div className="relative">
            <PopoverTrigger asChild>
              <button
                type="button"
                role="combobox"
                aria-expanded={open}
                aria-invalid={error || undefined}
                aria-readonly={readonly || undefined}
                aria-required={required || undefined}
                disabled={disabled || loading || error}
                className={cn(
                  selectTriggerVariants({ size, error }),
                  // placeholder uses muted-foreground (wordly-select-placeholder)
                  !selected && "text-muted-foreground",
                  // Make room for the clear button + chevron when clearable.
                  showClear && "pr-12",
                  readonly && "pointer-events-none"
                )}
              >
                <span
                  className={cn(
                    "flex min-w-0 items-center gap-2 truncate",
                    !selected && "text-muted-foreground"
                  )}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  ) : null}
                  <span className="truncate">{triggerLabel}</span>
                </span>
                <ChevronDown className="ml-2 size-4 shrink-0 text-muted-foreground" />
              </button>
            </PopoverTrigger>

            {/* Clear button: portal places it absolutely at right-8, before the chevron. */}
            {showClear ? (
              <button
                type="button"
                aria-label="Clear selection"
                onClick={handleClear}
                className="absolute right-8 top-1/2 z-10 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:bg-muted"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>

          <PopoverContent
            className="min-w-[8rem] w-[var(--radix-popover-trigger-width)] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
            align="start"
          >
            <Command>
              {searchable ? <CommandInput placeholder={placeholder} /> : null}
              <CommandList>
                <CommandEmpty className="py-1.5 text-sm italic text-muted-foreground">
                  {hasOptions ? noSearchResultsText : noLocalesText}
                </CommandEmpty>
                <CommandGroup>
                  {locales.map((option) => {
                    const isSelected = value === option.value;
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={() => handleSelect(option.value)}
                        className="relative cursor-default gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
                      >
                        <span className="flex-1 truncate">{option.label}</span>
                        {option.use ? (
                          <span className="ml-2 text-xs text-muted-foreground">
                            {option.use}
                          </span>
                        ) : null}
                        <span className="absolute right-2 flex size-3.5 items-center justify-center">
                          {isSelected ? (
                            <Check className="size-4 shrink-0 text-primary" />
                          ) : null}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Error — portal wordlyErrorVariants base:
            font-normal text-sm flex items-center gap-2 leading-5 text-destructive,
            with lucideAlertCircle icon, indented pl-3 by the wrapper. */}
        {error && errorMessage ? (
          <div className="flex items-center gap-2 pl-3 text-sm font-normal leading-5 text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        ) : helperText ? (
          // Helper — portal wordlyHelperTextVariants base:
          // font-normal text-sm text-muted-foreground, indented pl-3 by wrapper.
          <p className="pl-3 text-sm font-normal leading-5 text-muted-foreground">
            {helperText}
          </p>
        ) : null}
      </div>
    </div>
  );
}
