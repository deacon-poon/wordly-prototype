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
 * helper text, and loading/error/empty states) but drop the Angular DI/service
 * layer: locales arrive via props, defaulting to mock data.
 *
 * Built on the shared shadcn primitives (Command + Popover) per the
 * WorkspaceSelector proof. In production these locales would be fetched from the
 * API / ConstantsService.SUPPORTED_LOCALES.
 */

import * as React from "react";
// AlertCircle is this lucide-react version's name for the portal's lucideAlertCircle glyph.
import { AlertCircle, Check, ChevronsUpDown, Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

  disabled?: boolean;
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
  disabled = false,
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

  function handleSelect(next: string) {
    onValueChange?.(next === value ? "" : next);
    setOpen(false);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onValueChange?.("");
  }

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
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-invalid={error || undefined}
              aria-required={required || undefined}
              disabled={disabled || loading || error}
              className={cn(
                "w-full justify-between font-normal",
                // placeholder uses muted-foreground (wordly-select-placeholder)
                !selected && "text-muted-foreground",
                // error state mirrors core select: .border-destructive
                error && "border-destructive text-destructive"
              )}
            >
              <span className="flex items-center gap-x-2 truncate">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                <span className="line-clamp-1 truncate">{triggerLabel}</span>
              </span>
              <span className="flex items-center gap-1">
                {clearable && selected && !loading && !error ? (
                  // Clear button — mirrors core select clear: rounded-sm,
                  // hover:bg-muted, text-muted-foreground
                  <span
                    role="button"
                    tabIndex={0}
                    className="rounded-sm p-0.5 text-muted-foreground hover:bg-muted"
                    onClick={handleClear}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleClear(e as unknown as React.MouseEvent);
                      }
                    }}
                    aria-label="Clear selection"
                  >
                    <X className="h-4 w-4 shrink-0" />
                  </span>
                ) : null}
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
              </span>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
          >
            <Command>
              {searchable ? <CommandInput placeholder={placeholder} /> : null}
              <CommandList>
                <CommandEmpty>
                  {hasOptions ? noSearchResultsText : noLocalesText}
                </CommandEmpty>
                <CommandGroup>
                  {locales.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => handleSelect(option.value)}
                    >
                      {/* Check icon — core select renders it text-primary */}
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 text-primary",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="flex-1">{option.label}</span>
                      {option.use ? (
                        <span className="ml-2 text-xs text-muted-foreground">
                          {option.use}
                        </span>
                      ) : null}
                    </CommandItem>
                  ))}
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
