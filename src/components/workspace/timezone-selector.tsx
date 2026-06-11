"use client";

/**
 * TimezoneSelector
 *
 * React migration of the production Angular `wordly-timezone-selector`
 * (wordly_portal: libs/components/business/wordly-timezone-selector).
 *
 * The Angular original is a proxy over the core `wordly-combobox`, populated
 * with IANA timezone data by a bridge service (moment-timezone → grouped
 * options by region, each with value/label/shortLabel). Here we keep the same
 * public surface (grouped, searchable, a `compact` trigger using the
 * abbreviation, clearable, and loading/error/empty states) but drop the Angular
 * DI/service/moment-timezone layer: data arrives via props, defaulting to a
 * small mock set.
 *
 * Built on the shared shadcn primitives (Command + Popover) per the
 * WorkspaceSelector proof. In production these zones would be derived from
 * moment-timezone via an API (see the Angular bridge service).
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, Check, ChevronDown, Clock, X } from "lucide-react";

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
// proxies wordly-timezone-selector → wordly-combobox → hlm-select-trigger, so
// the real control anatomy lives there: border-input, rounded-md, px-3 py-2,
// text-sm, shadow-xs, gap-2, sizes default=h-9 / sm=h-8, focus ring [3px] on
// ring (no offset), destructive border+text+ring on error.
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

export type TimezoneSelectorSize = NonNullable<
  VariantProps<typeof selectTriggerVariants>["size"]
>;

// ---------------------------------------------------------------------------
// Data contract (mirrors the Angular WordlyComboboxOption / OptionGroup types)
// ---------------------------------------------------------------------------

export interface TimezoneOption {
  /** IANA timezone identifier, e.g. "America/Los_Angeles". */
  value: string;
  /** Human-readable city, e.g. "Los Angeles". */
  label: string;
  /** Compact label — abbreviation or city, e.g. "PST". */
  shortLabel: string;
}

export interface TimezoneOptionGroup {
  /** IANA region name, e.g. "America". */
  groupLabel: string;
  options: TimezoneOption[];
}

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from API (derived from moment-timezone,
// grouped by IANA region, in the Angular bridge service)
// ---------------------------------------------------------------------------

export const MOCK_TIMEZONE_GROUPS: TimezoneOptionGroup[] = [
  {
    groupLabel: "America",
    options: [
      { value: "America/Los_Angeles", label: "Los Angeles", shortLabel: "PST" },
      { value: "America/Chicago", label: "Chicago", shortLabel: "CST" },
      { value: "America/New_York", label: "New York", shortLabel: "EST" },
    ],
  },
  {
    groupLabel: "Europe",
    options: [
      { value: "Europe/London", label: "London", shortLabel: "GMT" },
      { value: "Europe/Paris", label: "Paris", shortLabel: "CET" },
    ],
  },
  {
    groupLabel: "Asia",
    options: [{ value: "Asia/Tokyo", label: "Tokyo", shortLabel: "JST" }],
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface TimezoneSelectorProps {
  /** Controlled selected IANA timezone value. */
  value?: string;
  /** Fired when the selection changes (empty string when cleared). */
  onValueChange?: (value: string) => void;
  /** Grouped timezone options by IANA region. */
  groups?: TimezoneOptionGroup[];

  /** Show the abbreviation (shortLabel) in the trigger instead of the city. */
  compact?: boolean;

  placeholder?: string;
  /** Show a search input to filter timezones (Angular `enableValueSearch`). */
  searchable?: boolean;
  /** Allow clearing the current selection. */
  clearable?: boolean;
  /** Show the leading clock icon in the trigger. Off by default to match the portal. */
  showLeadingIcon?: boolean;

  /** Control height. Matches the portal `data-size`: default (h-9) or sm (h-8). */
  size?: TimezoneSelectorSize;

  disabled?: boolean;
  /**
   * Read-only: renders the trigger but does not open the popover (mirrors the
   * Angular combobox `readonly` input — a non-interactive button, not disabled).
   */
  readonly?: boolean;
  loading?: boolean;
  error?: boolean;

  label?: string;
  required?: boolean;
  /** Mirrors the Angular `errorMessage`; shown when `error` is set. */
  errorMessage?: string;
  /** Mirrors the Angular `helperText`. */
  helperText?: string;

  loadingText?: string;
  errorLoadingText?: string;
  noTimezonesText?: string;
  noSearchResultsText?: string;

  className?: string;
}

export function TimezoneSelector({
  value,
  onValueChange,
  groups = MOCK_TIMEZONE_GROUPS,
  compact = false,
  placeholder = "Select timezone",
  searchable = true,
  clearable = false,
  showLeadingIcon = false,
  size = "default",
  disabled = false,
  readonly = false,
  loading = false,
  error = false,
  label,
  required = false,
  errorMessage,
  helperText,
  loadingText = "Loading timezones...",
  errorLoadingText = "Failed to load timezones",
  noTimezonesText = "No timezones available",
  noSearchResultsText = "No timezones match that search query",
  className,
}: TimezoneSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const allOptions = React.useMemo(
    () => groups.flatMap((g) => g.options),
    [groups]
  );
  const selected = allOptions.find((o) => o.value === value);
  const hasOptions = allOptions.length > 0;

  const selectedLabel = selected
    ? compact
      ? selected.shortLabel
      : selected.label
    : null;

  const triggerLabel = loading
    ? loadingText
    : error
      ? errorLoadingText
      : (selectedLabel ?? placeholder);

  // Loading / error block the trigger; readonly keeps appearance but blocks open.
  const interactionBlocked = disabled || loading || error || readonly;

  function handleSelect(next: string) {
    const resolved = next === value ? "" : next;
    onValueChange?.(resolved);
    setOpen(false);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onValueChange?.("");
  }

  const showClear = clearable && !!selected && !readonly && !loading && !error;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required ? <span className="ml-0.5 text-destructive">*</span> : null}
        </label>
      ) : null}

      <Popover
        open={open}
        onOpenChange={interactionBlocked ? undefined : setOpen}
      >
        <div className="relative">
          <PopoverTrigger asChild>
            <button
              type="button"
              role="combobox"
              aria-expanded={readonly ? false : open}
              aria-haspopup="listbox"
              aria-invalid={error || undefined}
              aria-readonly={readonly || undefined}
              aria-required={required || undefined}
              disabled={disabled || loading || error}
              className={cn(
                selectTriggerVariants({ size, error }),
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
                  <span
                    className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent"
                    aria-hidden="true"
                  />
                ) : showLeadingIcon ? (
                  <Clock className="size-4 shrink-0 text-muted-foreground" />
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
                {hasOptions ? noSearchResultsText : noTimezonesText}
              </CommandEmpty>
              {groups.map((group, i) => (
                <CommandGroup
                  key={group.groupLabel || `group-${i}`}
                  heading={group.groupLabel || undefined}
                  // Group heading mirrors portal hlm-select-label:
                  // text-sm font-semibold text-muted-foreground.
                  className="[&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground"
                >
                  {group.options.map((option) => (
                    <CommandItem
                      key={option.value}
                      // Search by city, abbreviation, and IANA id (Angular value search).
                      value={`${option.label} ${option.shortLabel} ${option.value}`}
                      // Indent options under a group label (Angular indentGroupedOptions).
                      className={cn(
                        "relative cursor-default gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground",
                        group.groupLabel && "pl-6"
                      )}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <span className="min-w-0 flex-1 truncate text-left">
                        {option.label}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {option.shortLabel}
                      </span>
                      <Check
                        className={cn(
                          "ml-auto size-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {error && errorMessage ? (
        <p className="flex items-center gap-1 pl-3 text-xs text-destructive">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </p>
      ) : helperText && !error ? (
        <p className="pl-3 text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}
