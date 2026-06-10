"use client";

/**
 * DateRangePicker
 *
 * React migration of the production Angular `WordlyDateRangePickerComponent`
 * (wordly_portal: libs/components/core/date-range-picker).
 *
 * The Angular original pairs a preset list (All Time, Today, Last 7/30/90 days,
 * This/Last month, This/Last year, Custom Range) with a range calendar inside a
 * popover. The trigger shows the active preset label, or a formatted date range
 * when in custom mode. Picking a preset computes a [start, end] range; clicking
 * the calendar enters custom mode and lets the user anchor + complete a range.
 *
 * Here we keep that public surface (controlled `value` as [Date, Date] | null,
 * `onValueChange`, `min`/`max`, `defaultPreset`, label/helper/error/disabled)
 * but drop the Angular DI / RxJS / ControlValueAccessor / i18next layers — data
 * and handlers arrive via props.
 *
 * Built on the shared shadcn primitives: Popover + the react-day-picker Calendar
 * (mode="range"). The trigger reproduces the portal's `hlmInput` anatomy
 * (h-9 / rounded-md / border-input / focus-visible ring / px-3) rather than the
 * Button component, so it matches the Angular source 1:1. Brand tokens only —
 * no raw hex. Error styling uses the `destructive` token; the portal's primary
 * Teal maps to our Brand Blue, so nothing teal is reintroduced as primary.
 */

import * as React from "react";
import { ChevronDown, AlertCircle } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ---------------------------------------------------------------------------
// Preset model (ported from constants/ + utils/)
// ---------------------------------------------------------------------------

export const DATE_RANGE_PRESET_IDS = {
  allTime: "allTime",
  today: "today",
  yesterday: "yesterday",
  last7: "last7",
  last30: "last30",
  last90: "last90",
  thisMonth: "thisMonth",
  lastMonth: "lastMonth",
  thisYear: "thisYear",
  lastYear: "lastYear",
  custom: "custom",
} as const;

export type DateRangePresetId =
  (typeof DATE_RANGE_PRESET_IDS)[keyof typeof DATE_RANGE_PRESET_IDS];

export const DATE_RANGE_PRESET_LABELS: Record<DateRangePresetId, string> = {
  allTime: "All Time",
  today: "Today",
  yesterday: "Yesterday",
  last7: "Last 7 days",
  last30: "Last 30 days",
  last90: "Last 90 days",
  thisMonth: "This month",
  lastMonth: "Last month",
  thisYear: "This year",
  lastYear: "Last year",
  custom: "Custom Range",
};

export interface DateRangePreset {
  id: DateRangePresetId;
  label: string;
  /** null for All Time / Custom (no fixed range). */
  compute: (() => [Date, Date]) | null;
}

// ---------------------------------------------------------------------------
// Date helpers (ported 1:1 from wordly-date-range-picker.utils.ts)
// ---------------------------------------------------------------------------

export function startOfDay(d: Date = new Date()): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

export function endOfDay(d: Date = new Date()): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return startOfDay(d);
}

function thisMonthRange(): [Date, Date] {
  const now = new Date();
  return [
    startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)),
    endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  ];
}

function lastMonthRange(): [Date, Date] {
  const now = new Date();
  return [
    startOfDay(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
    endOfDay(new Date(now.getFullYear(), now.getMonth(), 0)),
  ];
}

function thisYearRange(): [Date, Date] {
  const now = new Date();
  return [
    startOfDay(new Date(now.getFullYear(), 0, 1)),
    endOfDay(new Date(now.getFullYear(), 11, 31)),
  ];
}

function lastYearRange(): [Date, Date] {
  const now = new Date();
  return [
    startOfDay(new Date(now.getFullYear() - 1, 0, 1)),
    endOfDay(new Date(now.getFullYear() - 1, 11, 31)),
  ];
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export const DATE_RANGE_PRESETS: DateRangePreset[] = [
  { id: "allTime", label: DATE_RANGE_PRESET_LABELS.allTime, compute: null },
  {
    id: "today",
    label: DATE_RANGE_PRESET_LABELS.today,
    compute: () => [startOfDay(), endOfDay()],
  },
  {
    id: "yesterday",
    label: DATE_RANGE_PRESET_LABELS.yesterday,
    compute: () => [startOfDay(daysAgo(1)), endOfDay(daysAgo(1))],
  },
  {
    id: "last7",
    label: DATE_RANGE_PRESET_LABELS.last7,
    compute: () => [daysAgo(6), endOfDay()],
  },
  {
    id: "last30",
    label: DATE_RANGE_PRESET_LABELS.last30,
    compute: () => [daysAgo(29), endOfDay()],
  },
  {
    id: "last90",
    label: DATE_RANGE_PRESET_LABELS.last90,
    compute: () => [daysAgo(89), endOfDay()],
  },
  {
    id: "thisMonth",
    label: DATE_RANGE_PRESET_LABELS.thisMonth,
    compute: () => thisMonthRange(),
  },
  {
    id: "lastMonth",
    label: DATE_RANGE_PRESET_LABELS.lastMonth,
    compute: () => lastMonthRange(),
  },
  {
    id: "thisYear",
    label: DATE_RANGE_PRESET_LABELS.thisYear,
    compute: () => thisYearRange(),
  },
  {
    id: "lastYear",
    label: DATE_RANGE_PRESET_LABELS.lastYear,
    compute: () => lastYearRange(),
  },
  { id: "custom", label: DATE_RANGE_PRESET_LABELS.custom, compute: null },
];

/** Which preset (if any) the current [start, end] matches. Mirrors getActivePresetId. */
function getActivePresetId(
  isCustomMode: boolean,
  start: Date | undefined,
  end: Date | undefined,
  presets: DateRangePreset[],
  max?: Date
): DateRangePresetId {
  if (isCustomMode) return "custom";
  if (!start && !end) return "allTime";
  if (!start || !end) return "custom";

  for (const preset of presets) {
    if (preset.id === "allTime" || preset.id === "custom" || !preset.compute) {
      continue;
    }
    const [presetStart, presetEnd] = preset.compute();
    const effectiveEnd = max && presetEnd > max ? max : presetEnd;
    if (isSameDay(start, presetStart) && isSameDay(end, effectiveEnd)) {
      return preset.id;
    }
  }
  return "custom";
}

function formatRange(start: Date, end: Date): string {
  const fmt = (date: Date) =>
    date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  return `${fmt(start)} - ${fmt(end)}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export type DateRangeValue = [Date, Date] | null;

export interface DateRangePickerProps {
  /** Controlled range value. `null` means "All Time" / no range. */
  value?: DateRangeValue;
  /** Fired with the new [start, end] range, or `null` when cleared/All Time. */
  onValueChange?: (value: DateRangeValue) => void;

  /** Earliest selectable date. */
  min?: Date;
  /** Latest selectable date. Caps preset end dates too. */
  max?: Date;

  /** Preset applied when uncontrolled and no value is set yet. */
  defaultPreset?: DateRangePresetId;
  /** Which presets to show in the side rail. Defaults to all. */
  presets?: DateRangePreset[];

  disabled?: boolean;
  /** Field label rendered above the trigger. */
  label?: string;
  /** Marks the field required (red asterisk). */
  required?: boolean;
  /** Helper text below the trigger. */
  helperText?: string;
  /** When set, renders the field in an error state with this message. */
  errorMessage?: string;

  /** Extra classes for the trigger button. */
  triggerClassName?: string;
  className?: string;
}

export function DateRangePicker({
  value,
  onValueChange,
  min,
  max,
  defaultPreset = "last30",
  presets = DATE_RANGE_PRESETS,
  disabled = false,
  label,
  required = false,
  helperText,
  errorMessage,
  triggerClassName,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [isCustomMode, setIsCustomMode] = React.useState(false);
  // Anchor for an in-progress custom range (after the first calendar click,
  // before the range completes). Mirrors Angular's startDate-set/endDate-undefined
  // intermediate state — no value is emitted until the range completes.
  const [pendingFrom, setPendingFrom] = React.useState<Date | undefined>(
    undefined
  );

  // Seed an uncontrolled default from defaultPreset (matches Angular ngOnInit).
  const seedDefault = React.useCallback((): DateRangeValue => {
    const preset = presets.find((p) => p.id === defaultPreset);
    if (!preset || !preset.compute) return null;
    const [start, end] = preset.compute();
    const cappedEnd = max && end > endOfDay(max) ? endOfDay(max) : end;
    return [start, cappedEnd];
  }, [presets, defaultPreset, max]);

  const [internal, setInternal] = React.useState<DateRangeValue>(seedDefault);

  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const start = current?.[0];
  const end = current?.[1];

  const commit = React.useCallback(
    (next: DateRangeValue) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  const activePresetId = getActivePresetId(
    isCustomMode,
    start,
    end,
    presets,
    max
  );

  const hasRange = !!start && !!end;
  const triggerLabel =
    activePresetId === "custom" && hasRange
      ? formatRange(start, end)
      : (presets.find((p) => p.id === activePresetId)?.label ??
        DATE_RANGE_PRESET_LABELS.custom);

  function applyPreset(presetId: DateRangePresetId) {
    const preset = presets.find((p) => p.id === presetId);
    if (!preset) return;

    // Picking any preset abandons an in-progress custom range anchor.
    setPendingFrom(undefined);

    if (preset.id === "allTime") {
      setIsCustomMode(false);
      commit(null);
    } else if (preset.id === "custom") {
      setIsCustomMode(true);
      if (!start || !end) {
        commit([startOfDay(), endOfDay()]);
      }
    } else if (preset.compute) {
      setIsCustomMode(false);
      const [s, e] = preset.compute();
      const effectiveMax = max ? endOfDay(max) : undefined;
      commit([s, effectiveMax && e > effectiveMax ? effectiveMax : e]);
    }
    // Popover stays open so the highlighted range is visible (matches Angular).
  }

  // react-day-picker range selection → drive custom mode + commit on complete.
  // Mirrors the Angular two-step contract: the first click anchors a start date
  // and emits NOTHING (range incomplete); only the second click (full range)
  // commits a value. We hold the in-progress anchor in `pendingFrom` rather than
  // committing a zero-width [from, from] range, so completing a custom range works
  // in controlled mode too.
  function handleCalendarSelect(range: DateRange | undefined) {
    setIsCustomMode(true);
    const from = range?.from;
    const to = range?.to;
    if (from && to) {
      // Range complete — commit and clear the anchor.
      setPendingFrom(undefined);
      commit([startOfDay(from), endOfDay(to)]);
    } else if (from) {
      // First click — anchor the start; do not emit until the range completes.
      setPendingFrom(startOfDay(from));
    } else {
      // Cleared.
      setPendingFrom(undefined);
      commit(null);
    }
  }

  // The calendar shows the committed range, or the in-progress anchor (pendingFrom)
  // while a custom range is being picked.
  const calendarRange: DateRange | undefined = hasRange
    ? { from: start, to: end }
    : pendingFrom
      ? { from: pendingFrom, to: undefined }
      : start
        ? { from: start, to: undefined }
        : undefined;

  const hasError = !!errorMessage;

  return (
    // Form-control-wrapper anatomy: stacked label + control + hint/error.
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {label ? (
        <label className="text-sm font-medium leading-none text-foreground">
          {label}
          {required ? <span className="text-destructive">&nbsp;*</span> : null}
        </label>
      ) : null}

      {/* Inner control wrapper — mirrors the portal's `relative flex flex-col gap-2 w-full`. */}
      <div className="relative flex w-full flex-col gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            {/* Trigger reproduces hlmInput: h-9 / rounded-md / border-input / px-3 / focus ring. */}
            <button
              type="button"
              role="combobox"
              aria-expanded={open}
              aria-invalid={hasError || undefined}
              disabled={disabled}
              className={cn(
                "flex h-9 w-auto min-w-[220px] items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none transition-[color,box-shadow]",
                "cursor-pointer hover:bg-accent",
                "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                !hasRange &&
                  activePresetId === "allTime" &&
                  "text-muted-foreground",
                hasError &&
                  "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
                triggerClassName
              )}
            >
              <span className="truncate">{triggerLabel}</span>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </button>
          </PopoverTrigger>

          <PopoverContent
            className="w-max max-w-[calc(100vw-2rem)] p-0"
            align="start"
          >
            <div className="flex overflow-x-auto">
              {/* Preset rail — portal: py-2 min-w-[160px] border-r border-border. */}
              <div className="flex min-w-[160px] flex-col border-r border-border py-2">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset.id)}
                    className={cn(
                      "px-4 py-1.5 text-left text-sm transition-colors hover:bg-accent",
                      activePresetId === preset.id && "bg-accent font-medium"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Calendar panel — between-range fill matches the portal accent-green-100.
                  react-day-picker v9 exposes the in-between state via the `range_middle`
                  classNames slot (not a data-* attribute), so the fill is applied there. */}
              <Calendar
                mode="range"
                numberOfMonths={2}
                selected={calendarRange}
                onSelect={handleCalendarSelect}
                defaultMonth={start}
                disabled={[
                  ...(min ? [{ before: min }] : []),
                  ...(max ? [{ after: max }] : []),
                ]}
                className="rounded-none border-0"
                classNames={{
                  range_middle:
                    "aria-selected:bg-accent-green-100 aria-selected:text-foreground",
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Error takes precedence over helper text — portal renders one or the other. */}
      {hasError ? (
        <div className="flex items-center gap-1.5 pl-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : helperText ? (
        <p className="pl-3 text-sm text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}

DateRangePicker.displayName = "DateRangePicker";
