"use client";

/**
 * TimePicker
 *
 * React migration of the production Angular `wordly-time-picker`
 * (wordly_portal: libs/components/core/time-picker).
 *
 * The Angular original wraps a native `<input type="time">` in the shared form
 * control wrapper (label / required / helperText / error / disabled) with a
 * leading clock icon, and exposes the value as a "HH:mm" string via
 * ControlValueAccessor.
 *
 * Here we keep that same public surface (label, required, helperText,
 * placeholder, disabled, error + errorMessage, controlled "HH:mm" value) and
 * drop the Angular DI / forms / RxJS layer — value + change arrive via props.
 *
 * The picker UI is composed from the shared shadcn `Select` primitives
 * (hour / minute, plus an optional AM/PM segment) per the implementation hint,
 * so it matches the product look and avoids the native time-input chrome.
 * The canonical wire value is always 24-hour "HH:mm" regardless of display.
 */

import * as React from "react";
import { Clock, AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ---------------------------------------------------------------------------
// Helpers — parse / format the canonical "HH:mm" (24h) string
// ---------------------------------------------------------------------------

interface ParsedTime {
  hours: number; // 0-23
  minutes: number; // 0-59
}

function parseTime(value?: string): ParsedTime | null {
  if (!value) return null;
  const match = /^(\d{1,2}):(\d{1,2})$/.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return { hours, minutes };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatTime(t: ParsedTime): string {
  return `${pad(t.hours)}:${pad(t.minutes)}`;
}

// 24h hour -> { hour12, meridiem }
function to12Hour(hours24: number): { hour12: number; meridiem: "AM" | "PM" } {
  const meridiem = hours24 < 12 ? "AM" : "PM";
  const hour12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return { hour12, meridiem };
}

// { hour12, meridiem } -> 24h hour
function to24Hour(hour12: number, meridiem: "AM" | "PM"): number {
  if (meridiem === "AM") return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface TimePickerProps {
  /** Controlled value as a 24-hour "HH:mm" string (e.g. "09:30", "14:05"). */
  value?: string;
  /** Fired with the new "HH:mm" string whenever hour/minute/meridiem changes. */
  onValueChange?: (value: string) => void;

  /** Field label rendered above the control. */
  label?: string;
  /** Marks the field required (shows a red asterisk after the label). */
  required?: boolean;
  /** Helper text under the control (hidden when an error message is shown). */
  helperText?: string;

  /** Placeholder shown in each segment when no value is selected. */
  placeholder?: string;
  /** Disables the whole control. */
  disabled?: boolean;

  /** Error state — red border + ring, and renders `errorMessage` if provided. */
  error?: boolean;
  /** Message shown (in red) when `error` is true. */
  errorMessage?: string;

  /** Render hour as 12-hour with an AM/PM segment. Wire value stays 24h. */
  use12Hour?: boolean;
  /** Minute granularity in the dropdown (e.g. 5 → 00, 05, 10…). Default 5. */
  minuteStep?: number;

  /** Stable id used to associate the label with the control. */
  id?: string;
  className?: string;
}

export function TimePicker({
  value,
  onValueChange,
  label,
  required = false,
  helperText,
  placeholder = "--",
  disabled = false,
  error = false,
  errorMessage,
  use12Hour = false,
  minuteStep = 5,
  id,
  className,
}: TimePickerProps) {
  const reactId = React.useId();
  const controlId = id ?? reactId;

  const parsed = parseTime(value);

  // ----- option lists -------------------------------------------------------
  const hourOptions = React.useMemo(() => {
    if (use12Hour) {
      // 12, 1, 2, ... 11  (12 first to match analog/AM-PM ordering)
      return [12, ...Array.from({ length: 11 }, (_, i) => i + 1)];
    }
    return Array.from({ length: 24 }, (_, i) => i);
  }, [use12Hour]);

  const minuteOptions = React.useMemo(() => {
    const step = minuteStep > 0 ? minuteStep : 1;
    const list: number[] = [];
    for (let m = 0; m < 60; m += step) list.push(m);
    // Ensure the current minute is selectable even if off-step.
    if (parsed && !list.includes(parsed.minutes)) {
      list.push(parsed.minutes);
      list.sort((a, b) => a - b);
    }
    return list;
  }, [minuteStep, parsed]);

  // ----- current segment values --------------------------------------------
  const display = parsed
    ? use12Hour
      ? to12Hour(parsed.hours)
      : { hour12: parsed.hours, meridiem: "AM" as const }
    : null;

  const hourValue = display ? String(display.hour12) : undefined;
  const minuteValue = parsed ? String(parsed.minutes) : undefined;
  const meridiemValue = display ? display.meridiem : undefined;

  // ----- emit helpers --------------------------------------------------------
  function emit(
    next: Partial<{ hour12: number; minutes: number; meridiem: "AM" | "PM" }>
  ) {
    const baseHour12 = display?.hour12 ?? (use12Hour ? 12 : 0);
    const baseMeridiem = display?.meridiem ?? "AM";
    const baseMinutes = parsed?.minutes ?? 0;

    const hour12 = next.hour12 ?? baseHour12;
    const meridiem = next.meridiem ?? baseMeridiem;
    const minutes = next.minutes ?? baseMinutes;

    const hours24 = use12Hour ? to24Hour(hour12, meridiem) : hour12;
    onValueChange?.(formatTime({ hours: hours24, minutes }));
  }

  function hourLabel(h: number): string {
    return use12Hour ? String(h) : pad(h);
  }

  const showError = error;
  const showMessage = showError && !!errorMessage;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <Label
          htmlFor={`${controlId}-hour`}
          className="flex items-center gap-2.5 text-sm font-bold tracking-wider text-black"
        >
          {label}
          {required ? <span className="text-destructive">*</span> : null}
        </Label>
      ) : null}

      <div
        className={cn(
          "flex h-9 w-full items-center rounded-md border bg-transparent shadow-xs transition-[color,box-shadow]",
          disabled && "pointer-events-none cursor-not-allowed opacity-50",
          showError
            ? "border-destructive focus-within:ring-[3px] focus-within:ring-destructive/20"
            : "border-input focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50"
        )}
      >
        <span
          aria-hidden
          className={cn(
            "flex h-full shrink-0 items-center pl-3 pr-2",
            showError ? "text-destructive" : "text-muted-foreground"
          )}
        >
          <Clock className="size-4" />
        </span>

        {/* Hour */}
        <Select
          value={hourValue}
          disabled={disabled}
          onValueChange={(v) => emit({ hour12: Number(v) })}
        >
          <SelectTrigger
            id={`${controlId}-hour`}
            aria-label="Hour"
            className="h-7 w-[4.5rem] border-0 px-2 shadow-none focus-visible:ring-0"
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {hourOptions.map((h) => (
              <SelectItem key={h} value={String(h)}>
                {hourLabel(h)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span aria-hidden className="text-muted-foreground">
          :
        </span>

        {/* Minute */}
        <Select
          value={minuteValue}
          disabled={disabled}
          onValueChange={(v) => emit({ minutes: Number(v) })}
        >
          <SelectTrigger
            aria-label="Minute"
            className={cn(
              "h-7 w-[4.5rem] border-0 px-2 shadow-none focus-visible:ring-0",
              !use12Hour && "mr-1"
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {minuteOptions.map((m) => (
              <SelectItem key={m} value={String(m)}>
                {pad(m)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Meridiem (12-hour mode only) */}
        {use12Hour ? (
          <Select
            value={meridiemValue}
            disabled={disabled}
            onValueChange={(v) => emit({ meridiem: v as "AM" | "PM" })}
          >
            <SelectTrigger
              aria-label="AM or PM"
              className="mr-1 h-7 w-[4.25rem] border-0 px-2 shadow-none focus-visible:ring-0"
            >
              <SelectValue placeholder="AM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        ) : null}
      </div>

      {showMessage ? (
        <div className="flex items-center gap-2 pl-3 text-sm leading-5 text-destructive">
          <AlertCircle aria-hidden className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : helperText ? (
        <p className="pl-3 text-sm leading-5 text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
