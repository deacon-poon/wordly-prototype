"use client";

/**
 * LanguageChip
 *
 * React/shadcn migration of the production lib `LanguageChip`
 * (wordly-react-components-lib: src/components/app/meeting/settings/LanguageChip.tsx,
 * MUI 6 + Emotion).
 *
 * Displays a language name as a selectable, dismissible pill. Used in the
 * meeting settings UI to pick attendee/translation languages. The original was
 * an MUI <Chip> (variant outlined|filled, color default|primary|error) wrapped
 * in an Emotion styled() with a theme-driven `WordlyLanguageChip` style map and
 * an `sx` override. All of that is folded into Tailwind tokens here.
 *
 * State → visual mapping (theme colors mapped to OUR tokens; Brand Blue stays
 * primary):
 *   resting    outlined: white bg, gray-900 text, gray border (MUI default)
 *   selected   filled/primary: Brand Blue fill (primary), white text/icons
 *   error      destructive border + text; not clickable (matches original guard)
 *   disabled   dimmed, pointer-events-none
 *   ALS        a "sparkle" decorator icon (MUI AutoAwesome → lucide Sparkles),
 *              shown when isALSSupported
 *   remove     trailing X button (MUI deleteIcon → lucide X)
 *
 * The MUI theme DI layer is dropped: there is no runtime theme lookup, the
 * style map collapses to static token classes. Selection/remove arrive via
 * props. No data is fetched here — `label` is supplied by the parent (in
 * production, from the meeting language settings API).
 */

import * as React from "react";
import { Sparkles, X } from "lucide-react";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Aria labels (mirrors the original `ariaLabels` prop)
// ---------------------------------------------------------------------------

export interface LanguageChipAriaLabels {
  languageChipSelected?: string;
  languageChipNotSelected?: string;
  languageChipALSNotSupported?: string;
}

// ---------------------------------------------------------------------------
// Props (mirrors the original LanguageChipProps, minus MUI's ChipProps bleed)
// ---------------------------------------------------------------------------

export interface LanguageChipProps {
  /** Text content to be displayed (e.g. "English (US)"). */
  label: string;
  /** Whether the chip should be in an error state. */
  hasError?: boolean;
  /** When disabled, the chip is grayed out and not clickable. */
  isDisabled?: boolean;
  /** Whether the chip is selected (filled / Brand Blue). */
  isSelected?: boolean;
  /** Whether the ALS (Automatic Language Selection) decorator is shown. */
  isALSSupported?: boolean;
  /** If true, do not render the remove button. */
  hideRemoveButton?: boolean;
  /** Called when the user clicks the remove (X) button. */
  onRemove?: () => void;
  /** Called when the user clicks the chip body. */
  onSelected?: () => void;
  /** Icon display size (parity with the lib; only "small" is meaningful). */
  iconSize?: "small";
  /** Aria labels for the component. */
  ariaLabels?: LanguageChipAriaLabels;
  /** Optional dynamic aria-label that overrides the default. */
  announcementAriaLabel?: string;
  /** Inline style (parity with the lib's Chip `style` passthrough). */
  style?: React.CSSProperties;
  className?: string;
  /** Fired when the chip receives focus (parity with the lib's ChipProps). */
  onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void;
  /** Fired when the chip loses focus (parity with the lib's ChipProps). */
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const LanguageChip = React.forwardRef<HTMLDivElement, LanguageChipProps>(
  function LanguageChip(
    {
      label,
      hasError = false,
      isDisabled = false,
      isSelected = false,
      isALSSupported = false,
      hideRemoveButton = false,
      onRemove,
      onSelected,
      iconSize: _iconSize = "small",
      ariaLabels = {},
      announcementAriaLabel,
      style,
      className,
      onFocus,
      onBlur,
    },
    ref
  ) {
    // Original guard: clicking is a no-op while disabled or in an error state.
    const interactionBlocked = isDisabled || hasError;
    const isValidSelection = isSelected && !hasError;

    function handleClick() {
      if (interactionBlocked) return;
      onSelected?.();
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
      if (interactionBlocked) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelected?.();
      }
    }

    function handleRemove(e: React.MouseEvent) {
      e.stopPropagation();
      if (isDisabled) return;
      onRemove?.();
    }

    // Default aria-label mirrors the original: label, plus an ALS-unsupported
    // note when applicable. `announcementAriaLabel` overrides it.
    const ariaLabel =
      announcementAriaLabel ||
      `${label}.${
        isALSSupported
          ? ""
          : ` ${ariaLabels.languageChipALSNotSupported ?? ""}.`
      }`;

    const showRemove = !hideRemoveButton;
    const contentIsLight = isValidSelection; // white content on Brand Blue fill

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={interactionBlocked ? -1 : 0}
        aria-label={ariaLabel}
        aria-pressed={isSelected}
        aria-disabled={isDisabled || undefined}
        aria-invalid={hasError || undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        style={style}
        className={cn(
          // Base anatomy — compact pill (MUI Chip dimensions: 32px tall).
          "inline-flex h-8 max-w-full select-none items-center gap-1 rounded-full border px-3 text-sm font-normal leading-none transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue-500 focus-visible:ring-offset-1",
          // Resting (outlined / default).
          !isValidSelection &&
            !hasError &&
            "border-gray-300 bg-white text-gray-900",
          !interactionBlocked &&
            !isValidSelection &&
            !hasError &&
            "cursor-pointer hover:border-primary-blue-600",
          // Selected (filled / primary → Brand Blue).
          isValidSelection &&
            "border-primary-blue-500 bg-primary-blue-500 text-white",
          isValidSelection &&
            !interactionBlocked &&
            "cursor-pointer hover:border-primary-blue-600 hover:bg-primary-blue-600",
          // Error (destructive).
          hasError && "border-destructive bg-white text-destructive",
          // Disabled.
          isDisabled && "cursor-not-allowed opacity-50",
          // Error is non-interactive but not dimmed.
          hasError && !isDisabled && "cursor-default",
          className
        )}
      >
        {/* ALS (Automatic Language Selection) leading decorator — MUI AutoAwesome.
            The lib renders it inline with no tooltip; the icon color follows the
            chip's content color (white on the selected fill). */}
        {isALSSupported ? (
          <Sparkles
            className={cn(
              "h-4 w-4 shrink-0",
              contentIsLight
                ? "text-white"
                : hasError
                  ? "text-destructive"
                  : "text-current"
            )}
            aria-hidden="true"
          />
        ) : null}

        <span className="min-w-0 truncate">{label}</span>

        {/* Remove (X) — MUI deleteIcon. Circular hit target, near-neutral icon. */}
        {showRemove ? (
          <button
            type="button"
            disabled={isDisabled}
            aria-label={`Remove ${label}`}
            title={`Remove ${label}`}
            tabIndex={isDisabled ? -1 : 0}
            onClick={handleRemove}
            className={cn(
              "ml-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue-500 focus-visible:ring-offset-1",
              contentIsLight
                ? "text-white hover:bg-white/20"
                : hasError
                  ? "text-destructive hover:bg-destructive/10"
                  : "text-gray-600 hover:bg-gray-200"
            )}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    );
  }
);

LanguageChip.displayName = "LanguageChip";
