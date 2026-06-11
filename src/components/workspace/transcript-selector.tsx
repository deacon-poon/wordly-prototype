"use client";

/**
 * TranscriptSelector
 *
 * React migration of the production Angular `wordly-transcript-selector`
 * (wordly_portal: libs/components/business/wordly-transcript-selector).
 *
 * The Angular original is a proxy over the core `wordly-select`, populated with
 * the three transcript-save modes (none / private / public) that come from the
 * ConstantsService + WordlyTranslationService. Here we keep the same public
 * surface (a single-select of transcript modes with label/placeholder/helper +
 * error and disabled/readonly states) but drop the Angular DI/service layer:
 * the options and copy arrive via props, defaulting to mock data.
 *
 * Built on the shared shadcn primitives (Command + Popover) per DEC-003, matching
 * the WorkspaceSelector proof. In production the option labels would be resolved
 * from the translation/constants layer (see DEC-007).
 */

import * as React from "react";
import { cva } from "class-variance-authority";
import { Check, ChevronDown, AlertCircle } from "lucide-react";

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
// proxies wordly-transcript-selector -> wordly-select -> hlm-select-trigger, so
// the real control anatomy lives there: border-input, rounded-md, px-3 py-2,
// text-sm, shadow-xs, gap-2, sizes default=h-9 / sm=h-8, focus ring [3px] on
// ring (no offset), destructive border+text+ring on error. No hover state.
// Identical to the validated AccountSelector reference.
// ---------------------------------------------------------------------------

const selectTriggerVariants = cva(
  "flex w-full items-center justify-between gap-2 whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:pointer-events-none [&>svg]:text-muted-foreground",
  {
    variants: {
      size: {
        default: "h-9",
        sm: "h-8",
      },
      error: {
        true: "border-destructive text-destructive focus-visible:ring-destructive/20",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      error: false,
    },
  }
);

// ---------------------------------------------------------------------------
// Data contract (mirrors the Angular WordlySelectOption + transcriptMode enum)
// ---------------------------------------------------------------------------

export interface TranscriptOption {
  label: string;
  value: string;
  /** Optional secondary line describing what the mode does. */
  description?: string;
}

/** Transcript-save modes — matches ConstantsService.transcriptMode. */
export const TRANSCRIPT_MODE = {
  none: "nosave",
  private: "presenter",
  public: "all",
} as const;

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from the constants/translation API (DEC-007)
// ---------------------------------------------------------------------------

export const MOCK_TRANSCRIPT_OPTIONS: TranscriptOption[] = [
  {
    label: "None",
    value: TRANSCRIPT_MODE.none,
    description: "Don't save a transcript of this session",
  },
  {
    label: "Private",
    value: TRANSCRIPT_MODE.private,
    description: "Only the presenter can view the transcript",
  },
  {
    label: "Public",
    value: TRANSCRIPT_MODE.public,
    description: "All attendees can view the transcript",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface TranscriptSelectorProps {
  /** Controlled selected transcript-mode value. */
  value?: string;
  /** Fired when the selection changes (empty string when cleared). */
  onValueChange?: (value: string) => void;
  /** Transcript-mode options. */
  options?: TranscriptOption[];

  /** Mirrors the Angular `triggerClass` input — extra classes on the trigger. */
  triggerClass?: string;
  /**
   * Trigger height, matching the portal `hlm-select-trigger` `data-size`:
   * `default` → h-9, `sm` → h-8.
   */
  size?: "default" | "sm";

  placeholder?: string;
  /** Show a search input to filter options. */
  searchable?: boolean;

  label?: string;
  required?: boolean;
  /** Helper text rendered under the trigger. */
  helperText?: string;

  disabled?: boolean;
  readonly?: boolean;
  loading?: boolean;
  error?: boolean;
  /** Mirrors Angular `errorMessage` — shown when `error`/`displayError`. */
  errorMessage?: string;

  loadingText?: string;
  noOptionsText?: string;
  noSearchResultsText?: string;

  /** Fired when the trigger loses focus (Angular `inputBlur`). */
  onBlur?: () => void;
  /** Fired when the trigger gains focus (Angular `inputFocus`). */
  onFocus?: () => void;

  className?: string;
}

export function TranscriptSelector({
  value,
  onValueChange,
  options = MOCK_TRANSCRIPT_OPTIONS,
  triggerClass,
  size = "default",
  placeholder = "Select transcript mode",
  searchable = false,
  label,
  required = false,
  helperText,
  disabled = false,
  readonly = false,
  loading = false,
  error = false,
  errorMessage,
  loadingText = "Loading transcript options...",
  noOptionsText = "No transcript options available",
  noSearchResultsText = "No options match that search query",
  onBlur,
  onFocus,
  className,
}: TranscriptSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const selected = options.find((o) => o.value === value);
  const hasOptions = options.length > 0;

  const triggerLabel = selected?.label ?? placeholder;

  function handleSelect(next: string) {
    onValueChange?.(next === value ? "" : next);
    setOpen(false);
  }

  const showLoading = loading;

  return (
    // Portal container: form-control-wrapper stacked layout → flex flex-col gap-3.
    <div className={cn("flex flex-col gap-3", className)}>
      {label ? (
        // Portal label variant: bold (600 → font-semibold), text-sm, tracking-wider,
        // text-black, with a flex/gap-2.5 row; required marker is text-destructive.
        <label
          className={cn(
            "flex items-center gap-2.5 font-semibold text-sm tracking-wider text-black"
          )}
        >
          {label}
          {required ? <span className="text-destructive">*</span> : null}
        </label>
      ) : null}

      {showLoading ? (
        // Portal loadingState template: spinner (border-primary) + muted text.
        <div className="flex items-center gap-2 min-h-[1.5rem]">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">{loadingText}</span>
        </div>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              role="combobox"
              aria-expanded={open}
              aria-invalid={error || undefined}
              aria-required={required || undefined}
              aria-readonly={readonly || undefined}
              disabled={disabled || readonly}
              onBlur={onBlur}
              onFocus={onFocus}
              className={cn(
                selectTriggerVariants({ size, error }),
                readonly && "pointer-events-none",
                triggerClass
              )}
            >
              <span
                className={cn(
                  "flex min-w-0 items-center gap-2 truncate",
                  !selected && "text-muted-foreground"
                )}
              >
                <span className="truncate">{triggerLabel}</span>
              </span>
              <ChevronDown className="ml-2 size-4 shrink-0 flex-none text-muted-foreground" />
            </button>
          </PopoverTrigger>

          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] min-w-[325px] p-0"
            align="start"
          >
            <Command>
              {searchable ? (
                <CommandInput placeholder="Search transcript options..." />
              ) : null}
              <CommandList>
                <CommandEmpty>
                  {hasOptions ? noSearchResultsText : noOptionsText}
                </CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <span className="flex flex-col">
                        <span>{option.label}</span>
                        {option.description ? (
                          <span className="text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        ) : null}
                      </span>
                      {/* Portal selected indicator: lucideCheck, text-primary, right-aligned */}
                      <Check
                        className={cn(
                          "ml-auto size-4 shrink-0 text-primary",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {error && errorMessage ? (
        // Portal error row: flex/gap-2, leading-5, text-sm, text-destructive,
        // lucideAlertCircle icon, pl-3 indent.
        <div className="flex items-center gap-2 pl-3 text-sm leading-5 text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : helperText ? (
        // Portal helper row: text-sm, leading-5, text-muted-foreground, pl-3.
        <p className="pl-3 text-sm leading-5 text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
