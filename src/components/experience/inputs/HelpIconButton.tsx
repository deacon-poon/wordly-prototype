"use client";

/**
 * HelpIconButton
 *
 * React/shadcn port of the production wordly-react-components-lib component
 * (`src/components/library/inputs/HelpIconButton.tsx`, MUI 6 + Emotion).
 *
 * The original renders an MUI `IconButton` that opens an MUI `Popover` on hover
 * (onMouseEnter/onMouseLeave) and on click, displaying arbitrary children. Its
 * sibling `HelpPopoverBubble` formats the content with an optional title + divider.
 *
 * This port:
 * - Replaces MUI IconButton → `@/components/ui/button` (ghost icon button).
 * - Replaces MUI Popover (hover-triggered) → `@/components/ui/hover-card`
 *   (Radix HoverCard is the hover-to-open primitive, matching the original UX).
 * - Folds the `HelpPopoverBubble` title/divider formatting in via the optional
 *   `title` prop (uses `@/components/ui/separator`).
 * - Replaces the MUI `HelpOutline` icon default → lucide `HelpCircle`.
 * - Drops hex-coded `iconColor`/`borderColor`/`gray87` styled props in favor of
 *   our design tokens (Brand Blue primary, muted-foreground, border).
 *
 * Content arrives via props with a small inline mock default; in production the
 * help copy would typically be sourced from a CMS/API.
 */

import * as React from "react";
import { HelpCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export interface HelpIconButtonProps {
  /** Content displayed inside the popover bubble. Can be anything. */
  children?: React.ReactNode;
  /** Optional title rendered above the content with a divider (HelpPopoverBubble). */
  title?: string;
  /** Icon used to trigger the popover. Defaults to a lucide HelpCircle. */
  icon?: React.ReactNode;
  /** Width of the popover bubble (any CSS width value). Defaults to 16rem. */
  popoverWidth?: string;
  /** When true, content is laid out right-to-left. */
  rtl?: boolean;
  /** Accessible label for the trigger button. */
  "aria-label"?: string;
  /** Extra classes for the trigger button. */
  className?: string;
}

// Inline mock default — in production this copy would be sourced from a CMS/API.
const DEFAULT_HELP_CONTENT = (
  <p className="text-sm text-gray-700">
    This is contextual help. Hover or focus the icon to learn more about this
    field.
  </p>
);

export function HelpIconButton({
  children = DEFAULT_HELP_CONTENT,
  title,
  icon,
  popoverWidth = "16rem",
  rtl = false,
  "aria-label": ariaLabel = "Help",
  className,
}: HelpIconButtonProps) {
  return (
    <HoverCard openDelay={0} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={ariaLabel}
          aria-haspopup="true"
          data-testid="help-popover-icon-button"
          className={cn(
            "text-muted-foreground hover:text-primary focus-visible:text-primary",
            className
          )}
        >
          {icon ?? <HelpCircle className="size-5" />}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        sideOffset={6}
        style={{ width: popoverWidth }}
        data-testid="popover-bubble"
        dir={rtl ? "rtl" : "ltr"}
        className={cn(
          "flex max-w-[min(90vw,32rem)] flex-col gap-2 whitespace-pre-line p-0 text-sm text-gray-900",
          rtl ? "text-right" : "text-left"
        )}
      >
        {title ? (
          <div className="flex flex-col gap-2 px-4 pt-3">
            <p
              data-testid="title"
              className="text-base font-semibold text-gray-900"
            >
              {title}
            </p>
            <Separator data-testid="divider" />
          </div>
        ) : null}
        <div
          className={cn(
            "w-full overflow-auto px-4 pb-4",
            title ? "pt-1" : "pt-4"
          )}
        >
          {children}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default HelpIconButton;
