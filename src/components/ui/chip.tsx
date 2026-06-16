"use client";

/**
 * Chip
 *
 * React migration of the production Angular `app-wordly-chip`
 * (wordly_portal: libs/components/core/chip).
 *
 * A compact tag/chip that can be:
 * - read-only (display a label),
 * - dismissible (an X "remove" button -> onRemove),
 * - selectable (toggles a "selected" visual + emits onClick), and
 * - annotated with a help icon + tooltip.
 *
 * It renders a shadcn-styled pill (rounded-full, brand tokens) and adds the
 * close button / selection / help affordances from the Angular original.
 * The Angular DI / Reactive Forms layer is dropped: selection is a controlled
 * `selected` prop (with `onSelectedChange`), and handlers arrive via props.
 *
 * Variants mirror the Angular `WordlyChipVariant` ('default' | 'selected' |
 * 'info') and use the project's brand Tailwind tokens (no raw hex).
 *
 * Visual anatomy is aligned 1:1 with the portal SCSS/HTML:
 *   container  px-1 py-1, rounded-2xl (16px), border, text-sm, leading-6
 *   default    bg-white, text-gray-900, border-gray-900;
 *              selectable hover -> border primary-blue-600
 *   selected   bg/border primary-blue-500, text-white;
 *              selectable hover -> bg/border primary-blue-600
 *              (portal's primary Teal maps to OUR Brand Blue primary)
 *   info       blue-300 fill+border (info scale), black text
 *   disabled   opacity-50, not-allowed, pointer-events-none
 *   close btn  22px square, rounded-full, bg-gray-100, hover bg-gray-200,
 *              icon always near-black (text-gray-900)
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Info, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ---------------------------------------------------------------------------
// Variants (mirrors Angular WordlyChipVariant)
// ---------------------------------------------------------------------------

const chipVariants = cva(
  "inline-flex items-center gap-1 rounded-2xl border px-1 py-1 text-sm font-normal leading-6 transition-colors duration-200 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring min-w-0 max-w-full select-none",
  {
    variants: {
      variant: {
        // Neutral resting chip - white fill, full dark border (portal default).
        default: "bg-white text-gray-900 border-gray-900",
        // Active / chosen state. Portal's primary Teal maps to OUR Brand Blue.
        selected: "bg-primary-blue-500 text-white border-primary-blue-500",
        // Informational accent - portal info chip: --blue-300 fill + border,
        // black text (informational blue scale, not the brand-blue scale).
        info: "bg-blue-300 text-black border-blue-300",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
        false: "",
      },
      selectable: {
        true: "cursor-pointer",
        false: "cursor-default",
      },
    },
    // Selectable hover states mirror the portal SCSS (default -> blue border;
    // selected -> darker blue fill+border). Disabled wins via pointer-events.
    compoundVariants: [
      {
        variant: "default",
        selectable: true,
        disabled: false,
        className: "hover:border-primary-blue-600",
      },
      {
        variant: "selected",
        selectable: true,
        disabled: false,
        className: "hover:bg-primary-blue-600 hover:border-primary-blue-600",
      },
    ],
    defaultVariants: {
      variant: "default",
      disabled: false,
      selectable: false,
    },
  }
);

// ---------------------------------------------------------------------------
// Props (mirrors the Angular @Inputs / @Outputs)
// ---------------------------------------------------------------------------

export interface ChipProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "onClick" | "children">,
    Pick<VariantProps<typeof chipVariants>, "variant"> {
  /** The chip label text. */
  text: string;
  /** Disables interaction and dims the chip. */
  disabled?: boolean;
  /** When true, the chip toggles selection on click/Enter/Space. */
  selectable?: boolean;
  /**
   * Controlled selection state for `selectable` chips. When provided, the
   * effective variant becomes "selected" while true.
   */
  selected?: boolean;
  /** Fired when a `selectable` chip's selection toggles. */
  onSelectedChange?: (selected: boolean) => void;
  /** Fired on chip body click (selectable chips), mirrors `chipClicked`. */
  onClick?: () => void;
  /**
   * Show the dismiss (X) button. When `onRemove` is provided this defaults to
   * true; otherwise the button is hidden.
   */
  showCloseButton?: boolean;
  /** Fired when the close button is activated, mirrors `closeClicked`. */
  onRemove?: () => void;
  /** Show an info icon that reveals `helpText` in a tooltip. */
  showHelpIcon?: boolean;
  /** Tooltip / title text for the help icon. */
  helpText?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(function Chip(
  {
    text,
    variant = "default",
    disabled = false,
    selectable = false,
    selected,
    onSelectedChange,
    onClick,
    showCloseButton,
    onRemove,
    showHelpIcon = false,
    helpText,
    className,
    ...props
  },
  ref
) {
  // Effective variant: a selected, selectable chip renders as "selected".
  const isSelected = selectable && Boolean(selected);
  const effectiveVariant = isSelected ? "selected" : (variant ?? "default");

  // Close button shows when explicitly requested, or implicitly when an
  // onRemove handler is provided (the common dismissible-tag case).
  const closeVisible = showCloseButton ?? typeof onRemove === "function";

  // Portal icon coloring: info icon is brand-blue when resting, white when
  // selected; the close icon is always near-black regardless of chip state.
  const iconSelected = effectiveVariant === "selected";

  function handleChipClick() {
    if (disabled || !selectable) return;
    onClick?.();
    onSelectedChange?.(!selected);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!selectable || disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleChipClick();
    }
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    if (disabled) return;
    onRemove?.();
  }

  return (
    <div
      ref={ref}
      className={cn(
        chipVariants({ variant: effectiveVariant, disabled, selectable }),
        className
      )}
      role={selectable ? "button" : "presentation"}
      tabIndex={disabled || !selectable ? -1 : 0}
      aria-label={text}
      aria-pressed={selectable ? isSelected : undefined}
      aria-disabled={disabled || undefined}
      title={helpText || text}
      onClick={handleChipClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {showHelpIcon && helpText ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className="flex shrink-0 items-center"
              // Keep the icon out of the tab order; it is decorative + has a
              // tooltip surfaced on hover/focus of the chip.
              aria-hidden="true"
            >
              <Info
                className={cn(
                  "h-4 w-4 shrink-0",
                  iconSelected ? "text-white" : "text-blue-700"
                )}
              />
            </span>
          </TooltipTrigger>
          <TooltipContent>{helpText}</TooltipContent>
        </Tooltip>
      ) : null}

      <span className="flex min-w-0 flex-1 items-center overflow-hidden px-2 text-sm leading-6 break-words">
        {text}
      </span>

      {closeVisible ? (
        <button
          type="button"
          disabled={disabled}
          aria-label={`Remove ${text}`}
          title={`Remove ${text}`}
          tabIndex={disabled ? -1 : 0}
          onClick={handleRemove}
          className={cn(
            "flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-900 transition-colors duration-200 hover:bg-gray-200 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
          )}
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
});

Chip.displayName = "Chip";

export { Chip, chipVariants };
