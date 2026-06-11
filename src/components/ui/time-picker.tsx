"use client";

/**
 * TimePicker
 *
 * React migration of the production Angular `wordly-time-picker`
 * (wordly_portal: libs/components/core/time-picker).
 *
 * The Angular original is a SINGLE native `<input type="time">` wrapped in the
 * shared form control wrapper (label / required / helperText / error / disabled)
 * with a leading clock icon button that calls the input's `showPicker()`. The
 * value is a 24-hour "HH:mm" string via ControlValueAccessor; the browser renders
 * 12/24h per locale and handles 1-minute resolution natively.
 *
 * Here we keep that same public surface (label, required, helperText,
 * placeholder, disabled, error + errorMessage, controlled "HH:mm" value) and
 * drop the Angular DI / forms / RxJS layer - value + change arrive via props.
 *
 * The native calendar-picker indicator is hidden (matching the portal SCSS) so
 * the leading clock button is the only affordance to open the picker.
 */

import * as React from "react";
import { Clock, AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface TimePickerProps {
  /** Controlled value as a 24-hour "HH:mm" string (e.g. "09:30", "14:05"). */
  value?: string;
  /** Fired with the new "HH:mm" string whenever the input changes. */
  onValueChange?: (value: string) => void;

  /** Field label rendered above the control. */
  label?: string;
  /** Marks the field required (shows a red asterisk after the label). */
  required?: boolean;
  /** Helper text under the control (hidden when an error message is shown). */
  helperText?: string;

  /** Placeholder shown when no value is selected. */
  placeholder?: string;
  /** Disables the whole control. */
  disabled?: boolean;

  /** Error state - red border + ring, and renders `errorMessage` if provided. */
  error?: boolean;
  /** Message shown (in red) when `error` is true. */
  errorMessage?: string;

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
  placeholder,
  disabled = false,
  error = false,
  errorMessage,
  id,
  className,
}: TimePickerProps) {
  const reactId = React.useId();
  const controlId = id ?? reactId;
  const inputRef = React.useRef<HTMLInputElement>(null);

  const showError = error;
  const showMessage = showError && !!errorMessage;

  function openPicker() {
    inputRef.current?.showPicker?.();
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <Label
          htmlFor={controlId}
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
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          aria-label="Open time picker"
          onClick={openPicker}
          className={cn(
            "flex h-full shrink-0 items-center pl-3 pr-2",
            showError ? "text-destructive" : "text-muted-foreground"
          )}
        >
          <Clock className="size-4" />
        </button>

        <input
          ref={inputRef}
          id={controlId}
          type="time"
          value={value ?? ""}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onChange={(e) => onValueChange?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") openPicker();
          }}
          className={cn(
            "h-full min-w-0 flex-1 border-none bg-transparent pr-3 text-sm outline-none",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            // Hide the native calendar-picker indicator (matches portal SCSS);
            // the leading clock button is the only affordance to open the picker.
            "[&::-webkit-calendar-picker-indicator]:hidden"
          )}
        />
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
