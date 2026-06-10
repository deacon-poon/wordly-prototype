"use client";

/**
 * GlossarySelector
 *
 * React migration of the production Angular `wordly-glossary-selector`
 * (wordly_portal: libs/components/business/wordly-glossary-selector).
 *
 * The Angular original is a proxy over the core `wordly-select`, populated with
 * glossary data from a bridge service that calls the glossary API. Here we keep
 * the same public surface (single-select, optional "None" entry, label /
 * placeholder / helper text / error message, required, disabled, loading and
 * empty states) but drop the Angular DI/service layer: data arrives via props,
 * defaulting to mock data.
 *
 * Visual anatomy is matched 1:1 to the portal's core `wordly-select` trigger
 * (spartan/ui `selectTriggerVariants` + `hlm-select-trigger`):
 *   - trigger: `border border-input bg-transparent rounded-md px-3 py-2 text-sm
 *     shadow-xs gap-2`, sizes default `h-9` / sm `h-8`
 *   - focus-visible: `border-ring ring-ring/50 ring-[3px]`
 *   - disabled: `cursor-not-allowed opacity-50`
 *   - error: `text-destructive border-destructive ring-destructive/20`
 *   - chevron: `lucideChevronDown`, `size-4 text-muted-foreground ml-2 flex-none`
 *   - placeholder: `text-muted-foreground line-clamp-1 truncate`
 *   - selected check / spinner: `text-primary` / `border-primary` (Brand Blue —
 *     the portal's primary Teal maps to our Brand Blue primary)
 *   - dropdown content: `max-h-96 min-w-[325px]`
 *
 * Built on the shared shadcn primitives (Command + Popover) per the
 * WorkspaceSelector proof. In production these glossaries would be fetched from
 * the glossary API.
 */

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

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
// Data contract (mirrors the Angular GlossaryOption / WordlySelectOption type)
// ---------------------------------------------------------------------------

export interface GlossaryOption {
  label: string;
  value: string;
}

export const NONE_OPTION_VALUE = "none";

// ---------------------------------------------------------------------------
// Trigger anatomy — mirrors the portal's spartan `selectTriggerVariants`
// (libs/ui/select/src/lib/hlm-select-trigger.ts). Primary Teal maps to our
// Brand Blue primary; everything else matches the portal exactly.
// ---------------------------------------------------------------------------

const selectTriggerSizes = {
  /** data-[size=default]:h-9 */
  default: "h-9",
  /** data-[size=sm]:h-8 */
  sm: "h-8",
} as const;

export type GlossarySelectorSize = keyof typeof selectTriggerSizes;

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from the glossary API
// ---------------------------------------------------------------------------

export const MOCK_GLOSSARIES: GlossaryOption[] = [
  { label: "Medical Terminology", value: "gl-medical" },
  { label: "Legal & Compliance", value: "gl-legal" },
  { label: "Financial Services", value: "gl-finance" },
  { label: "Product Brand Names", value: "gl-brand" },
  { label: "Technical / Engineering", value: "gl-technical" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface GlossarySelectorProps {
  /** Controlled selected glossary value (empty string when none). */
  value?: string;
  /** Fired when the selection changes (empty string when cleared). */
  onValueChange?: (value: string) => void;
  /** Available glossaries. Defaults to mock data. */
  glossaries?: GlossaryOption[];

  placeholder?: string;
  /** Trigger height variant. Portal: data-size default (h-9) / sm (h-8). */
  size?: GlossarySelectorSize;
  /** Show a search input to filter glossaries. */
  searchable?: boolean;
  /** Prepend a "None" entry (value === NONE_OPTION_VALUE). Angular: displayNoneOption. */
  displayNoneOption?: boolean;
  /** Label for the "None" entry. Angular: noneOptionText. */
  noneOptionText?: string;

  disabled?: boolean;
  /** Read-only: rendered but not interactive. Angular: readonly. */
  readonly?: boolean;
  loading?: boolean;

  label?: string;
  required?: boolean;
  /** Helper text shown beneath the control. Angular: helperText. */
  helperText?: string;
  /** Error message; when set the control renders in its error state. */
  errorMessage?: string;

  loadingText?: string;
  noGlossariesText?: string;
  noSearchResultsText?: string;

  /** Extra classes applied to the trigger button. Angular: triggerClass. */
  triggerClass?: string;
  className?: string;
}

export function GlossarySelector({
  value,
  onValueChange,
  glossaries = MOCK_GLOSSARIES,
  placeholder = "Select glossary",
  size = "default",
  searchable = false,
  displayNoneOption = false,
  noneOptionText = "None",
  disabled = false,
  readonly = false,
  loading = false,
  label,
  required = false,
  helperText,
  errorMessage,
  loadingText = "Loading glossaries...",
  noGlossariesText = "No glossaries available",
  noSearchResultsText = "No glossaries match that search query",
  triggerClass,
  className,
}: GlossarySelectorProps) {
  const [open, setOpen] = React.useState(false);

  const error = Boolean(errorMessage);

  // Prepend the optional "None" entry, mirroring the Angular displayNoneOption.
  const options: GlossaryOption[] = React.useMemo(() => {
    if (!displayNoneOption) return glossaries;
    return [{ label: noneOptionText, value: NONE_OPTION_VALUE }, ...glossaries];
  }, [glossaries, displayNoneOption, noneOptionText]);

  const selected = options.find((o) => o.value === value);
  const hasOptions = options.length > 0;
  const showPlaceholder = !selected && !loading;

  function handleSelect(next: string) {
    onValueChange?.(next === value ? "" : next);
    setOpen(false);
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required ? <span className="ml-0.5 text-destructive">*</span> : null}
        </label>
      ) : null}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-invalid={error || undefined}
            aria-readonly={readonly || undefined}
            aria-required={required || undefined}
            disabled={disabled || readonly || loading}
            data-size={size}
            className={cn(
              // selectTriggerVariants base (spartan/ui)
              "flex w-full items-center justify-between gap-2 whitespace-nowrap",
              "rounded-md border border-input bg-transparent px-3 py-2",
              "text-sm shadow-xs outline-none transition-[color,box-shadow]",
              selectTriggerSizes[size],
              // focus-visible ring
              "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
              // disabled
              "disabled:cursor-not-allowed disabled:opacity-50",
              // readonly keeps normal appearance, no pointer interaction
              readonly && !disabled && "pointer-events-none",
              // error state — token-based (portal: border/text-destructive)
              error &&
                "border-destructive text-destructive focus-visible:ring-destructive/20",
              triggerClass
            )}
          >
            <span className="flex items-center gap-2 line-clamp-1 truncate">
              {loading ? (
                <span
                  className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent"
                  aria-hidden
                />
              ) : null}
              <span
                className={cn(
                  "line-clamp-1 truncate",
                  showPlaceholder && "text-muted-foreground"
                )}
              >
                {loading ? loadingText : (selected?.label ?? placeholder)}
              </span>
            </span>
            <ChevronDown className="ml-2 size-4 flex-none text-muted-foreground" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="max-h-96 w-[var(--radix-popover-trigger-width)] min-w-[325px] p-0"
          align="start"
        >
          <Command>
            {searchable ? (
              <CommandInput placeholder="Search glossaries..." />
            ) : null}
            <CommandList>
              <CommandEmpty>
                {hasOptions ? noSearchResultsText : noGlossariesText}
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option.value)}
                  >
                    {option.label}
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

      {errorMessage ? (
        <p className="text-xs text-destructive" role="alert" aria-live="polite">
          {errorMessage}
        </p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}
