"use client";

/**
 * TimePicker
 *
 * EXACT React mirror of the production Angular `wordly-time-picker`
 *   wordly_portal:
 *     libs/components/core/time-picker/
 *       wordly-time-picker.component.{ts,html}
 *
 * Like the Angular original, the control is a SINGLE native `<input type="time">`
 * with a leading clock icon button (calls the input's `showPicker()`), wrapped in
 * the shared `app-wordly-form-control-wrapper` for label / required / helperText /
 * error / extraInfo / info-icon affordances. The value is a 24-hour "HH:mm" string;
 * the browser renders 12/24h per locale and handles 1-minute resolution natively.
 *
 *   Angular:  wordly-time-picker → form-control-wrapper + (clock button + native input)
 *   React:    TimePicker        → FormControlWrapper    + (clock button + native input)
 *
 * The inner control box mirrors the portal HTML verbatim (border-input,
 * focus-within ring [3px] on --ring, destructive on error). The native
 * calendar-picker indicator is hidden (matching the portal SCSS) so the leading
 * clock button is the only affordance to open the picker.
 *
 * The Angular DI / forms / RxJS layer is dropped: value + change arrive via props.
 *
 * Brand-color note: the portal focus ring resolves to --ring, which in this repo
 * is Brand Blue — i.e. our primary stays Brand Blue (no raw hex).
 */

import * as React from "react";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { FormControlWrapper } from "@/components/ui/form-control-wrapper";
import type { WordlyDesignVariants } from "@/components/ui/design-variants";

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
  /** Place helper text above the control (stacked layout only). */
  helperTextOnTop?: boolean;

  /** Placeholder shown when no value is selected. */
  placeholder?: string;
  /** Disables the whole control. */
  disabled?: boolean;

  /** Error state - red border + ring, and renders `errorMessage` if provided. */
  error?: boolean;
  /** Message shown (in red) when `error` is true. */
  errorMessage?: string;

  /** Show an info icon beside the label (portal `showInfoIcon`). */
  showInfoIcon?: boolean;
  /** Tooltip text for the info icon (portal `infoTooltipText`). */
  infoTooltipText?: string;
  /** Extra info block below the control (portal `extraInfo`). */
  extraInfo?: string;

  /** Stable id used to associate the label with the control. */
  id?: string;

  // ===== DESIGN VARIANT INPUTS (forwarded to the wrapper, like Angular) =====
  /** Container layout. Default "default" = portal responsive label-beside grid. */
  layoutVariant?: WordlyDesignVariants["layout"];
  labelStyleVariant?: WordlyDesignVariants["labelStyle"];
  labelSizeVariant?: WordlyDesignVariants["labelSize"];
  labelContextVariant?: WordlyDesignVariants["labelContext"];
  spacingVariant?: WordlyDesignVariants["spacing"];
  contentContextVariant?: WordlyDesignVariants["contentContext"];

  /** Extra classes for the wrapper container (portal `extraContainerClasses`). */
  extraContainerClasses?: string;
  /** Extra classes for the content wrapper (portal `extraContentClasses`). */
  extraContentClasses?: string;

  className?: string;
}

export function TimePicker({
  value,
  onValueChange,
  label,
  required = false,
  helperText,
  helperTextOnTop = false,
  placeholder,
  disabled = false,
  error = false,
  errorMessage,
  showInfoIcon = false,
  infoTooltipText,
  extraInfo,
  id,
  layoutVariant = "default",
  labelStyleVariant,
  labelSizeVariant,
  labelContextVariant,
  spacingVariant,
  contentContextVariant,
  extraContainerClasses,
  extraContentClasses,
  className,
}: TimePickerProps) {
  const reactId = React.useId();
  const controlId = id ?? reactId;
  const inputRef = React.useRef<HTMLInputElement>(null);

  const showError = error;

  function openPicker() {
    inputRef.current?.showPicker?.();
  }

  return (
    <FormControlWrapper
      controlId={controlId}
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
      className={cn(extraContainerClasses, className)}
      contentClasses={extraContentClasses}
    >
      {/* Inner control box — mirrors the portal time-picker HTML verbatim. */}
      <div
        className={cn(
          "flex h-9 w-full items-center rounded-md border bg-transparent shadow-xs transition-[color,box-shadow]",
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
          className="flex h-full shrink-0 items-center pl-3 pr-2 text-muted-foreground"
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
    </FormControlWrapper>
  );
}
