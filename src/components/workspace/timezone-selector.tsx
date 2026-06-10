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
import {
  AlertCircle,
  Check,
  ChevronsUpDown,
  Clock,
  Loader2,
  X,
} from "lucide-react";

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

  function handleSelect(next: string) {
    const resolved = next === value ? "" : next;
    onValueChange?.(resolved);
    setOpen(false);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onValueChange?.("");
  }

  // The portal trigger is the spartan outline button at size `default`
  // (h-9 px-4 py-2, rounded-md, text-sm font-medium, gap-2, border shadow-xs).
  // Error mirrors the portal `[class.border-destructive]` + aria-invalid ring;
  // placeholder is muted-foreground (`.wordly-combobox-placeholder`).
  const trigger = (
    <Button
      type="button"
      variant="outline"
      role="combobox"
      aria-expanded={readonly ? false : open}
      aria-haspopup="listbox"
      aria-invalid={error || undefined}
      disabled={disabled || loading || error}
      className={cn(
        "h-9 w-full justify-between gap-2 px-4 py-2 text-sm font-medium",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        !selected && "font-normal text-muted-foreground",
        error &&
          "border-destructive ring-destructive/20 focus-visible:ring-destructive/20"
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        {loading ? (
          <Loader2 className="size-4 shrink-0 animate-spin opacity-50" />
        ) : showLeadingIcon ? (
          <Clock className="size-4 shrink-0 opacity-50" />
        ) : null}
        <span className="mr-2 truncate">{triggerLabel}</span>
      </span>
      <span className="flex shrink-0 items-center gap-1">
        {clearable && selected && !readonly && !loading && !error ? (
          <X
            className="size-4 shrink-0 opacity-50 hover:opacity-100"
            onClick={handleClear}
            aria-label="Clear selection"
          />
        ) : null}
        <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
      </span>
    </Button>
  );

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required ? <span className="ml-0.5 text-destructive">*</span> : null}
        </label>
      ) : null}

      {readonly ? (
        trigger
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>{trigger}</PopoverTrigger>

          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
          >
            <Command>
              {searchable ? <CommandInput placeholder={placeholder} /> : null}
              <CommandList>
                <CommandEmpty>
                  {hasOptions ? noSearchResultsText : noTimezonesText}
                </CommandEmpty>
                {groups.map((group, i) => (
                  <CommandGroup
                    key={group.groupLabel || `group-${i}`}
                    heading={group.groupLabel || undefined}
                  >
                    {group.options.map((option) => (
                      <CommandItem
                        key={option.value}
                        // Search by city, abbreviation, and IANA id (Angular value search).
                        value={`${option.label} ${option.shortLabel} ${option.value}`}
                        // Indent options under a group label (Angular indentGroupedOptions).
                        className={cn(group.groupLabel && "pl-6")}
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
      )}

      {error && errorMessage ? (
        <p className="flex items-center gap-1 pl-3 text-xs text-destructive">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </p>
      ) : helperText ? (
        <p className="pl-3 text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}
