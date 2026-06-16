"use client";

/**
 * SyncButton
 *
 * React/shadcn port of the production `wordly-react-components-lib`
 * `SyncButton` (originally an MUI 6 IconButton + Material Sync icon, with an
 * Emotion-styled keyframe rotation).
 *
 * The original was an icon button showing a Sync glyph that spins continuously
 * while a sync is in progress (disabled during the spin so it can't be
 * re-triggered). This port keeps the same public surface — `syncing`, `color`,
 * `disabled`, `secondsPerRevolution`, `onClick` — and rebuilds it on the shared
 * shadcn `Button` (variant=ghost, size=icon) + the lucide `RefreshCw` icon, with
 * the rotation driven by an inline `animationDuration` so the
 * `secondsPerRevolution` prop is honored without touching `tailwind.config` or
 * `globals.css`.
 *
 * Theme mapping (lib palette → our tokens, Brand Blue stays primary):
 *   wordlyBlue/newWordlyBlue (brand) → `text-primary` (Brand Blue)
 *   secondary / midnight teal-ish    → `text-action-teal-600`
 *   default                          → `text-gray-600`
 *   inherit                          → `text-current`
 *
 * An optional `tooltip` (not in the MUI original) surfaces the action label for
 * accessibility, reusing the shared Tooltip primitive.
 */

import * as React from "react";
import { RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type SyncButtonColor = "default" | "inherit" | "primary" | "secondary";

// Lib `color` prop → token-based icon color. Brand Blue is primary.
const colorClassMap: Record<SyncButtonColor, string> = {
  default: "text-gray-600",
  inherit: "text-current",
  primary: "text-primary",
  secondary: "text-action-teal-600",
};

export interface SyncButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "color"
> {
  /** Whether the button is currently syncing. While syncing, the icon rotates and the button is disabled. */
  syncing?: boolean;
  /** Color theming applied to the icon. */
  color?: SyncButtonColor;
  /** Whether the button is disabled. */
  disabled?: boolean;
  /** Seconds for one full revolution of the icon while syncing. */
  secondsPerRevolution?: number;
  /** Click handler. */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Optional accessible tooltip / hint shown on hover + focus. */
  tooltip?: React.ReactNode;
  /** Accessible label for the icon-only button (defaults to "Sync"). */
  "aria-label"?: string;
}

export function SyncButton({
  syncing = false,
  color = "default",
  disabled = false,
  secondsPerRevolution = 0.5,
  onClick,
  tooltip,
  className,
  "aria-label": ariaLabel = "Sync",
  ...otherProps
}: SyncButtonProps) {
  const button = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={ariaLabel}
      aria-busy={syncing || undefined}
      disabled={syncing || disabled}
      onClick={onClick}
      className={cn("rounded-full", className)}
      {...otherProps}
    >
      <RefreshCw
        className={cn(
          "size-5 shrink-0",
          colorClassMap[color],
          syncing && "animate-spin"
        )}
        // Inline duration honors `secondsPerRevolution`; the keyframes come from
        // Tailwind's built-in `animate-spin` (no global CSS needed).
        style={
          syncing
            ? { animationDuration: `${secondsPerRevolution}s` }
            : undefined
        }
        aria-hidden="true"
      />
    </Button>
  );

  if (!tooltip) return button;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default SyncButton;
