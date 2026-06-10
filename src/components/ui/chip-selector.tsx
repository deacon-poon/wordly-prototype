"use client";

/**
 * ChipSelector
 *
 * React migration of the production Angular `app-wordly-chip-selector`
 * (wordly_portal: libs/components/core/chip-selector).
 *
 * A multi-select control rendered as a set of removable chips. Selected items
 * show as chips inside an input-style box; an "+ Add another option" link opens
 * a dialog with a (optionally searchable) checkbox list to pick more. Supports a
 * `maxSelectable` limit, hiding already-selected options from the picker, and
 * loading / error / empty states.
 *
 * The Angular original extends a form-control base (NgControl / Reactive Forms)
 * and pulls i18n from a translation service. Here we keep the same public
 * surface — controlled `value: string[]`, the same texts and state flags — but
 * drop the Angular DI / forms / RxJS layer: value + handlers arrive via props.
 *
 * Built on the shared shadcn primitives (Dialog, Button, Checkbox, Input,
 * Tooltip) so it matches the product look and feeds the reusability flywheel.
 * The chip anatomy mirrors the portal's `app-wordly-chip` (selected variant):
 * a rounded-2xl bordered pill with a 22px gray close button.
 */

import * as React from "react";
import { Info, Loader2, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ---------------------------------------------------------------------------
// Data contract (mirrors WordlyChipSelectorOption / WordlyChipSelectorValue)
// ---------------------------------------------------------------------------

export interface ChipSelectorOption {
  /** Stable identity of the option (what ends up in `value`). */
  value: string;
  /** Display label. Falls back to `value` when omitted. */
  text?: string;
  /** Optional help text, surfaced as an info tooltip on the chip / row. */
  help?: string;
}

export interface ChipSelectorProps {
  /** Controlled selection. Always an array of option `value`s. */
  value: string[];
  /** Fired with the next selection whenever it changes. */
  onValueChange: (value: string[]) => void;
  /** The full set of selectable options. */
  options: ChipSelectorOption[];

  label?: string;
  required?: boolean;

  /** Max number of options that can be selected (undefined / 0 = no limit). */
  maxSelectable?: number;
  /** Hide already-selected options from the picker dialog (default true). */
  hideSelectedOptions?: boolean;
  /** Show an info tooltip on chips/rows that have `help` text (default true). */
  showChipInfoTooltip?: boolean;
  /** Show a search box inside the picker dialog. */
  searchable?: boolean;

  disabled?: boolean;
  readOnly?: boolean;
  isLoading?: boolean;
  hasError?: boolean;
  /** Fired when the user clicks the retry button in the error state. */
  onRetry?: () => void;

  // Texts (the Angular component exposes each of these as an @Input).
  selectMoreText?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  dialogCancelText?: string;
  dialogSelectText?: string;
  emptyStateText?: string;
  loadingText?: string;
  errorText?: string;
  retryText?: string;
  searchPlaceholder?: string;
  /** "Select up to" prefix shown before the limit number. */
  selectionLimitText?: string;
  /** Name of the items, e.g. "languages" — used in info / button text. */
  itemTypeName?: string;

  className?: string;
}

function optionText(option: ChipSelectorOption): string {
  return option.text || option.value;
}

export function ChipSelector({
  value,
  onValueChange,
  options,
  label,
  required = false,
  maxSelectable,
  hideSelectedOptions = true,
  showChipInfoTooltip = true,
  searchable = false,
  disabled = false,
  readOnly = false,
  isLoading = false,
  hasError = false,
  onRetry,
  selectMoreText = "Add another option",
  dialogTitle = "Select Options",
  dialogDescription = "Choose the options you want to select.",
  dialogCancelText = "Cancel",
  dialogSelectText = "Select",
  emptyStateText = "No options selected",
  loadingText = "Loading...",
  errorText = "Failed to load data",
  retryText = "Retry",
  searchPlaceholder = "Search for options...",
  selectionLimitText = "Select up to",
  itemTypeName = "options",
  className,
}: ChipSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [tempSelected, setTempSelected] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState("");

  const hasLimit = typeof maxSelectable === "number" && maxSelectable > 0;
  const interactionDisabled = disabled || readOnly;

  const optionByValue = React.useMemo(() => {
    const map = new Map<string, ChipSelectorOption>();
    for (const option of options) map.set(option.value, option);
    return map;
  }, [options]);

  // Chips: the currently-selected options, in `options` order.
  const selectedOptions = React.useMemo(
    () => options.filter((o) => value.includes(o.value)),
    [options, value]
  );

  // Picker rows: optionally hide already-selected options, then apply search.
  const pickerOptions = React.useMemo(() => {
    let base = options;
    if (hideSelectedOptions)
      base = base.filter((o) => !value.includes(o.value));
    const term = search.trim().toLowerCase();
    if (!term) return base;
    return base.filter(
      (o) =>
        optionText(o).toLowerCase().includes(term) ||
        o.value.toLowerCase().includes(term)
    );
  }, [options, value, hideSelectedOptions, search]);

  const reachedMaxChips = hasLimit && value.length >= (maxSelectable as number);
  const reachedMaxTemp =
    hasLimit && tempSelected.length > (maxSelectable as number);

  function removeChip(toRemove: string) {
    if (interactionDisabled) return;
    onValueChange(value.filter((v) => v !== toRemove));
  }

  function openDialog() {
    if (interactionDisabled) return;
    setTempSelected([...value]);
    setSearch("");
    setOpen(true);
  }

  function toggleTemp(optionValue: string, checked: boolean) {
    setTempSelected((prev) =>
      checked
        ? prev.includes(optionValue)
          ? prev
          : [...prev, optionValue]
        : prev.filter((v) => v !== optionValue)
    );
  }

  function confirmSelection() {
    if (reachedMaxTemp) return;
    onValueChange([...tempSelected]);
    setOpen(false);
  }

  // Unlimited case is a single string; limited case splits into a label + a
  // blue-accented count, mirroring the portal's two-color banner text.
  const unlimitedSelectionText = React.useMemo(() => {
    const count = tempSelected.length;
    if (count === 0) return `No ${itemTypeName} selected`;
    if (count === 1) return `1 ${itemTypeName.replace(/s$/, "")} selected`;
    return `${count} ${itemTypeName} selected`;
  }, [itemTypeName, tempSelected]);

  // When hiding selected options, the confirm button counts only *new* picks.
  const confirmButtonText = React.useMemo(() => {
    if (!hideSelectedOptions) return dialogSelectText;
    const newCount = tempSelected.filter((v) => !value.includes(v)).length;
    if (newCount === 0) return `Add ${itemTypeName}`;
    return `Add ${newCount} ${itemTypeName}`;
  }, [
    hideSelectedOptions,
    dialogSelectText,
    tempSelected,
    value,
    itemTypeName,
  ]);

  const addMoreButton = !readOnly ? (
    <Button
      type="button"
      variant="link"
      size="sm"
      className="h-auto p-0 font-normal leading-none text-primary"
      disabled={disabled || reachedMaxChips}
      onClick={openDialog}
      aria-label={selectMoreText}
    >
      + {selectMoreText}
    </Button>
  ) : null;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <Label className="text-gray-700">
          {label}
          {required ? <span className="ml-0.5 text-destructive">*</span> : null}
        </Label>
      ) : null}

      {/* Input-style box holding the chips */}
      <div
        className={cn(
          "min-h-[2.5rem] w-full rounded-md border bg-background px-3 py-2 ring-offset-background has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2",
          hasError ? "!border-destructive" : "border-input",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        {isLoading ? (
          <div className="flex min-h-[1.5rem] items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">{loadingText}</span>
          </div>
        ) : hasError ? (
          <div className="flex min-h-[1.5rem] items-center justify-between">
            <span className="text-sm text-destructive">{errorText}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={onRetry}
            >
              {retryText}
            </Button>
          </div>
        ) : selectedOptions.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            {selectedOptions.map((option) => (
              <Chip
                key={option.value}
                option={option}
                showInfo={showChipInfoTooltip}
                showClose={!interactionDisabled}
                disabled={disabled}
                onRemove={() => removeChip(option.value)}
              />
            ))}
            {addMoreButton}
          </div>
        ) : (
          <div className="flex min-h-[1.5rem] items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {emptyStateText}
            </span>
            {addMoreButton}
          </div>
        )}
      </div>

      {/* Picker dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {searchable ? (
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="pl-9"
                />
              </div>
            ) : null}

            {/* Selection info banner (portal: bg-info / border-info-border; two-color text) */}
            <div className="rounded-lg border border-primary-blue-200 bg-primary-blue-50 p-3">
              <div className="flex items-center gap-1 text-sm font-medium">
                {hasLimit ? (
                  <>
                    <span className="text-primary-blue-700">
                      {selectionLimitText} {maxSelectable} {itemTypeName}
                    </span>
                    <span className="text-primary">
                      ({tempSelected.length} selected)
                    </span>
                  </>
                ) : (
                  <span className="text-primary-blue-700">
                    {unlimitedSelectionText}
                  </span>
                )}
              </div>
            </div>

            {/* Checkbox list / no-results */}
            {pickerOptions.length > 0 ? (
              <div className="max-h-[40vh] space-y-2 overflow-y-auto">
                {pickerOptions.map((option) => {
                  const checked = tempSelected.includes(option.value);
                  const rowDisabled =
                    !checked && hasLimit
                      ? tempSelected.length >= (maxSelectable as number)
                      : false;
                  return (
                    <label
                      key={option.value}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-md border border-input p-3 transition-colors hover:bg-gray-50",
                        rowDisabled && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        disabled={rowDisabled}
                        onCheckedChange={(c) =>
                          toggleTemp(option.value, c === true)
                        }
                      />
                      <span className="flex-1 text-sm text-gray-900">
                        {optionText(option)}
                      </span>
                      {showChipInfoTooltip && option.help ? (
                        <InfoTip help={option.help} />
                      ) : null}
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <span className="text-sm text-muted-foreground">
                  {search.trim()
                    ? `No ${itemTypeName} found matching "${search.trim()}"`
                    : `No ${itemTypeName} available`}
                </span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {dialogCancelText}
            </Button>
            <Button
              type="button"
              onClick={confirmSelection}
              disabled={reachedMaxTemp}
            >
              {confirmButtonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chip — a single selected option rendered as a removable Badge
// ---------------------------------------------------------------------------

interface ChipProps {
  option: ChipSelectorOption;
  showInfo: boolean;
  showClose: boolean;
  disabled?: boolean;
  onRemove: () => void;
}

function Chip({ option, showInfo, showClose, disabled, onRemove }: ChipProps) {
  // Mirrors the portal `app-wordly-chip` in its `selected` variant: a pill with
  // gap-1 / px-1 / py-1, rounded-2xl, a bordered fill, and a 22px close button.
  // Selected fill maps the portal's Teal-500 → our Brand Blue primary.
  return (
    <div
      role="presentation"
      title={option.help || optionText(option)}
      aria-label={optionText(option)}
      className={cn(
        "flex min-w-0 max-w-full cursor-default items-center gap-1 rounded-2xl border border-primary bg-primary px-1 py-1 text-base font-normal leading-6 text-primary-foreground transition-colors duration-200 focus:outline-none",
        disabled && "pointer-events-none cursor-not-allowed opacity-50"
      )}
    >
      {showInfo && option.help ? <InfoTip help={option.help} selected /> : null}

      {/* Text content (portal wraps the label in pl-2 pr-2). */}
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden pl-2 pr-2 leading-6">
        <span className="select-none break-words text-sm">
          {optionText(option)}
        </span>
      </div>

      {showClose ? (
        <button
          type="button"
          aria-label={`Remove ${optionText(option)}`}
          title={`Remove ${optionText(option)}`}
          disabled={disabled}
          onClick={onRemove}
          className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-900 transition-colors duration-200 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}

/**
 * Info / help tooltip trigger. The portal renders the info icon in Blue-700 by
 * default and White when on a selected chip; here `selected` swaps to the chip's
 * foreground color so it stays legible on the Brand Blue fill.
 */
function InfoTip({
  help,
  selected = false,
}: {
  help: string;
  selected?: boolean;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex shrink-0 items-center",
              selected ? "text-primary-foreground" : "text-primary-blue-700"
            )}
            aria-label={help}
          >
            <Info className="h-3.5 w-3.5" />
          </span>
        </TooltipTrigger>
        <TooltipContent>{help}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
