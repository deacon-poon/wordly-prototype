"use client";

/**
 * TimezoneSelector
 *
 * EXACT React mirror of the production Angular `wordly-timezone-selector`
 *   wordly_portal:
 *     libs/components/business/wordly-timezone-selector/
 *       wordly-timezone-selector.component.{ts,html}
 *
 * Like the Angular original, this is a *thin proxy*: it renders the shared
 * FormControlWrapper (label / required / helper / error / info / extra-info /
 * layout) wrapping a combobox control, exactly the way the Angular component
 * proxies through `app-wordly-combobox` → `app-wordly-form-control-wrapper` +
 * an outline trigger + an `hlm-command` popover.
 *
 *   Angular:  timezone-selector → wordly-combobox → form-control-wrapper + (outline btn + hlm-command popover)
 *   React:    TimezoneSelector  → FormControlWrapper + (outline btn + radix Popover + Command popover)
 *
 * The Angular template pins the proxied combobox to `enableValueSearch=true`
 * and `indentGroupedOptions=true`, and forwards `compact`. Those are preserved
 * here. The trigger anatomy is ported from the combobox template:
 *   button: variant="outline" + `w-full justify-between font-normal`,
 *           a truncated label span, and a `lucideChevronsUpDown`
 *           (`opacity-50 flex-shrink-0`) trailing icon;
 *   readonly: same button without the popover trigger (non-interactive, NOT
 *           disabled), matching the `*ngIf="readonly"` branch;
 *   placeholder/destructive: `wordly-combobox-placeholder` → muted text,
 *           `showError` → `border-destructive`.
 * The dropdown is `hlm-command`: a search input, grouped options with a
 * `hlm-command-group-label` heading, `pl-6` indent on grouped options
 * (indentGroupedOptions), a truncated left-aligned label, and a trailing
 * `lucideCheck` (`ml-auto`, opacity-0 when unselected). Note the Angular
 * dropdown shows only `option.label` (not the shortLabel) — the shortLabel is
 * trigger-only (compact mode).
 *
 * The default LAYOUT is the responsive label-beside-control grid (design
 * variant "default"), matching the portal — NOT a bespoke vertical flex-col.
 *
 * Timezone data arrives via props (mock default). The Angular DI / bridge /
 * moment-timezone layer is dropped; the grouped `{ groupLabel, options:
 * [{ value, label, shortLabel }] }` shape is preserved.
 */

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
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
import { FormControlWrapper } from "@/components/ui/form-control-wrapper";
import type { WordlyDesignVariants } from "@/components/ui/design-variants";

export type TimezoneSelectorSize = "default" | "sm";

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
// Mock data — in production, derived from moment-timezone, grouped by IANA
// region, in the Angular bridge service (getTimezoneGroups()).
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
  /** Fired with the newly selected IANA value (mirrors the Angular `onSelect` output). */
  onSelect?: (value: string) => void;
  /** Grouped timezone options by IANA region. */
  groups?: TimezoneOptionGroup[];

  /** Show the abbreviation (shortLabel) in the trigger instead of the city (Angular `compact`). */
  compact?: boolean;

  placeholder?: string;

  /** Control height. Matches the portal `data-size`: default (h-9) or sm (h-8). */
  size?: TimezoneSelectorSize;

  disabled?: boolean;
  /**
   * Read-only: renders the trigger but does not open the popover (mirrors the
   * Angular combobox `readonly` branch — a non-interactive button, not disabled).
   */
  readonly?: boolean;
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

  noResultsText?: string;

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

export function TimezoneSelector({
  value,
  onValueChange,
  onSelect,
  groups = MOCK_TIMEZONE_GROUPS,
  compact = false,
  placeholder = "Select timezone",
  size = "default",
  disabled = false,
  readonly = false,
  error = false,
  errorMessage,
  helperText,
  helperTextOnTop = false,
  label,
  required = false,
  showInfoIcon = false,
  infoTooltipText,
  extraInfo,
  noResultsText = "No results found.",
  layoutVariant = "default",
  labelStyleVariant,
  labelSizeVariant,
  labelContextVariant,
  spacingVariant,
  contentContextVariant,
  className,
}: TimezoneSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const allOptions = React.useMemo(
    () => groups.flatMap((g) => g.options),
    [groups]
  );
  const currentOption = allOptions.find((o) => o.value === value);

  const showError = error;

  // Trigger text: city (or shortLabel||label in compact), else placeholder —
  // verbatim from the combobox template's currentOption expression.
  const triggerLabel = currentOption
    ? compact
      ? currentOption.shortLabel || currentOption.label
      : currentOption.label
    : placeholder;

  function handleSelect(next: string) {
    const resolved = next === value ? "" : next;
    onValueChange?.(resolved);
    onSelect?.(resolved);
    setOpen(false);
  }

  // Shared outline-trigger anatomy (combobox `variant="outline"` button).
  const triggerClassName = cn(
    buttonVariants({ variant: "outline" }),
    "w-full justify-between font-normal",
    size === "sm" ? "h-8" : "h-9",
    !currentOption && "text-muted-foreground",
    showError && "border-destructive"
  );

  const triggerInner = (
    <>
      <span className="truncate mr-2">{triggerLabel}</span>
      <ChevronsUpDown className="size-4 opacity-50 flex-shrink-0" />
    </>
  );

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
      {readonly ? (
        // Angular *ngIf="readonly": same outline button, no popover trigger.
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={false}
          aria-readonly
          aria-required={required || undefined}
          aria-invalid={error || undefined}
          className={cn(triggerClassName, "pointer-events-none")}
        >
          {triggerInner}
        </button>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-required={required || undefined}
              aria-invalid={error || undefined}
              disabled={disabled}
              className={triggerClassName}
            >
              {triggerInner}
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
          >
            <Command>
              {/* enableValueSearch=true on the proxied combobox */}
              <CommandInput placeholder={placeholder} />
              <CommandList>
                <CommandEmpty>{noResultsText}</CommandEmpty>
                {groups.map((group, i) => (
                  <CommandGroup
                    key={group.groupLabel || `group-${i}`}
                    heading={group.groupLabel || undefined}
                  >
                    {group.options.map((option) => (
                      <CommandItem
                        key={option.value}
                        // Value search spans city, abbreviation, and IANA id.
                        value={`${option.label} ${option.shortLabel} ${option.value}`}
                        onSelect={() => handleSelect(option.value)}
                        // indentGroupedOptions: pl-6 when under a group label.
                        className={cn(group.groupLabel && "pl-6")}
                      >
                        <span className="truncate flex-1 min-w-0 text-left">
                          {option.label}
                        </span>
                        <Check
                          className={cn(
                            "ml-auto size-4",
                            currentOption?.value === option.value
                              ? "opacity-100"
                              : "opacity-0"
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
    </FormControlWrapper>
  );
}
