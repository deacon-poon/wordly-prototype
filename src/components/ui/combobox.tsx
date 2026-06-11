"use client";

/**
 * Combobox
 *
 * React migration of the production Angular `app-wordly-combobox`
 * (wordly_portal: libs/components/core/combobox).
 *
 * A searchable single-select. Faithful to the Angular public surface:
 * - Flat or grouped options (`ComboboxOptionGroup` with a `groupLabel`).
 * - Search by label only by default; `enableValueSearch` also matches values.
 * - `compact` shows `shortLabel` (falling back to `label`) in the trigger.
 * - `indentGroupedOptions` indents options under a group label.
 * - Per-option `icon`, `shortcut`, and `disabled`.
 * - `showFooter` renders a sticky footer slot (`footer` prop here).
 * - Form-control affordances: label, required, error, readonly, disabled.
 *
 * The Angular DI / RxJS / reactive-forms layer is dropped: data and the
 * selection handler arrive via props (controlled `value` + `onValueChange`).
 *
 * Built on the shared shadcn primitives (Command + Popover), matching the
 * repo idiom established by `workspace-selector.tsx`.
 */

import * as React from "react";
import { Check, ChevronDown, type LucideIcon } from "lucide-react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ---------------------------------------------------------------------------
// Data contract (mirrors the Angular WordlyComboboxOption / *Group / *Type)
// ---------------------------------------------------------------------------

export interface ComboboxOption {
  label: string;
  value: string;
  disabled?: boolean;
  /** lucide-react icon component rendered before the label. */
  icon?: LucideIcon;
  /** Right-aligned shortcut hint (e.g. "Ctrl+K"). */
  shortcut?: string;
  /** Shown in the trigger instead of `label` when `compact` is true. */
  shortLabel?: string;
}

export interface ComboboxOptionGroup {
  groupLabel: string;
  options: ComboboxOption[];
  /** Render a separator after this group. */
  showSeparator?: boolean;
}

export type ComboboxOptionType = ComboboxOption | ComboboxOptionGroup;

function isGroup(item: ComboboxOptionType): item is ComboboxOptionGroup {
  return "groupLabel" in item;
}

// ---------------------------------------------------------------------------
// Trigger anatomy — mirrors the portal `selectTriggerVariants`
// (wordly_portal libs/ui/select/src/lib/hlm-select-trigger.ts). This is a
// SELECT-style control, so the trigger matches hlm-select-trigger exactly —
// identical to the validated `workspace/account-selector.tsx` reference:
// border-input, rounded-md (6px), px-3 py-2, text-sm, shadow-xs, gap-2, sizes
// default=h-9 / sm=h-8, focus ring [3px] on --ring + border-ring (no offset),
// destructive border+text+ring on error. No hover state on the trigger.
// Brand-color note: the portal focus ring resolves to --ring, which in this
// repo is Brand Blue 600 — i.e. our primary stays Brand Blue (not teal).
// ---------------------------------------------------------------------------

const comboboxTriggerVariants = cva(
  "flex w-full items-center justify-between gap-2 whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8",
        default: "h-9",
        lg: "h-10",
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

export type ComboboxSize = "sm" | "default" | "lg";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface ComboboxProps {
  /** Flat options and/or labeled groups. */
  options: ComboboxOptionType[];
  /** Controlled selected value. */
  value?: string;
  /** Fired when the selection changes. */
  onValueChange?: (value: string) => void;

  placeholder?: string;
  /** Empty-state copy when no option matches the search. */
  noResultsText?: string;

  /** Also match option values (not just labels) while searching. @default false */
  enableValueSearch?: boolean;
  /** Trigger shows `shortLabel` (falling back to `label`). @default false */
  compact?: boolean;
  /** Indent options that live under a group label. @default false */
  indentGroupedOptions?: boolean;
  /** Render the `footer` slot pinned to the bottom of the list. @default false */
  showFooter?: boolean;
  /** Footer content (only rendered when `showFooter` is true). */
  footer?: React.ReactNode;

  disabled?: boolean;
  /** Renders a non-interactive trigger (no dropdown). */
  readonly?: boolean;

  label?: string;
  required?: boolean;
  /** Error styling on the trigger. */
  error?: boolean;

  /**
   * Trigger height/padding, matching the portal button sizes.
   * @default "default"
   */
  size?: ComboboxSize;

  className?: string;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  noResultsText = "No results found",
  enableValueSearch = false,
  compact = false,
  indentGroupedOptions = false,
  showFooter = false,
  footer,
  disabled = false,
  readonly = false,
  label,
  required = false,
  error = false,
  size = "default",
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const allOptions = React.useMemo<ComboboxOption[]>(
    () => options.flatMap((item) => (isGroup(item) ? item.options : [item])),
    [options]
  );

  const selected = allOptions.find((o) => o.value === value);

  const triggerLabel = selected
    ? compact
      ? selected.shortLabel || selected.label
      : selected.label
    : placeholder;

  // Mirrors the Angular customFilter: label-only by default, +value when enabled.
  // cmdk passes the CommandItem `value` (we set it to the option value) and the
  // current search text; return >0 to keep, 0 to filter out.
  const filter = React.useCallback(
    (itemValue: string, search: string) => {
      if (!search) return 1;
      const needle = search.toLowerCase();
      const option = allOptions.find((o) => o.value === itemValue);
      if (!option) {
        return enableValueSearch && itemValue.toLowerCase().includes(needle)
          ? 1
          : 0;
      }
      const labelMatch = option.label.toLowerCase().includes(needle);
      const valueMatch =
        enableValueSearch && option.value.toLowerCase().includes(needle);
      return labelMatch || valueMatch ? 1 : 0;
    },
    [allOptions, enableValueSearch]
  );

  function handleSelect(next: string) {
    onValueChange?.(next);
    setOpen(false);
  }

  const trigger = (
    <button
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={readonly ? false : open}
      aria-invalid={error || undefined}
      aria-readonly={readonly || undefined}
      aria-required={required || undefined}
      disabled={disabled}
      className={cn(
        comboboxTriggerVariants({ size, error }),
        !selected && "text-muted-foreground",
        readonly && "pointer-events-none"
      )}
    >
      <span className="mr-2 truncate text-left">{triggerLabel}</span>
      <ChevronDown className="size-4 shrink-0 opacity-50" />
    </button>
  );

  const renderItem = (option: ComboboxOption, indent: boolean) => {
    const Icon = option.icon;
    return (
      <CommandItem
        key={option.value}
        value={option.value}
        disabled={option.disabled}
        onSelect={handleSelect}
        className={cn(indent && "pl-6")}
      >
        {Icon ? <Icon className="mr-2 size-4 shrink-0" /> : null}
        <span className="min-w-0 flex-1 truncate text-left">
          {option.label}
        </span>
        {option.shortcut ? (
          <CommandShortcut>{option.shortcut}</CommandShortcut>
        ) : null}
        <Check
          className={cn(
            "ml-auto size-4 shrink-0",
            value === option.value ? "opacity-100" : "opacity-0"
          )}
        />
      </CommandItem>
    );
  };

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
            <Command
              filter={filter}
              // Group/section heading matches the portal hlm-select-label:
              // text-sm font-semibold text-muted-foreground (overrides the
              // shared command.tsx default of text-xs/medium/gray-500).
              className="[&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              <CommandInput placeholder={placeholder} />
              <CommandList>
                <CommandEmpty>{noResultsText}</CommandEmpty>
                {options.map((item, i) => {
                  if (!isGroup(item)) {
                    return (
                      <CommandGroup key={`opt-${item.value}`}>
                        {renderItem(item, false)}
                      </CommandGroup>
                    );
                  }
                  return (
                    <React.Fragment key={`group-${item.groupLabel || i}`}>
                      <CommandGroup heading={item.groupLabel || undefined}>
                        {item.options.map((option) =>
                          renderItem(
                            option,
                            indentGroupedOptions && !!item.groupLabel
                          )
                        )}
                      </CommandGroup>
                      {item.showSeparator ? <CommandSeparator /> : null}
                    </React.Fragment>
                  );
                })}
              </CommandList>
              {showFooter && footer ? (
                <div className="sticky bottom-0 border-t border-border bg-popover py-2">
                  {footer}
                </div>
              ) : null}
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
