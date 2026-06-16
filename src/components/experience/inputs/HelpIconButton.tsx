"use client";

/**
 * HelpIconButton
 *
 * React/shadcn port of the production wordly-react-components-lib component
 * (`src/components/library/inputs/HelpIconButton.tsx`, MUI 6 + Emotion).
 *
 * Lib behavior (mirrored 1:1):
 * - An icon button (MUI `IconButton`, `disableRipple`, `size="large"`) that opens
 *   a popover. The popover opens on `onMouseEnter` AND `onClick`, and closes on
 *   `onMouseLeave` / `onClose`. The icon must be passed via the `icon` prop.
 * - The popover (`MuiPopover`) anchors below-left of the trigger
 *   (anchorOrigin bottom/left, transformOrigin top/left), is `pointer-events: none`,
 *   sets `white-space: pre-line`, `font-size: 0.875em`, an optional border from
 *   `borderColor`, and a width from `popoverWidth`. It renders arbitrary `children`
 *   (typically a `HelpPopoverBubble`).
 * - Props are kept identical to the lib: `children`, `icon`, `iconColor`,
 *   `popoverWidth`, `aria-label`, `borderColor`.
 *
 * Port substitutions (no MUI / Emotion):
 * - MUI `IconButton`              → `@/components/ui/button` (variant=ghost, size=icon).
 * - MUI `Popover` (hover + click) → `@/components/ui/popover` (Radix), driven open
 *   imperatively so we can mirror the lib's mouse-enter/click open + mouse-leave close.
 * - `gray87` focus background     → the shared `focus-visible` ring (no raw hex).
 * - `iconColor` / `borderColor`   → caller-supplied colors are the one legitimate
 *   runtime-color escape hatch (same role the lib's styled props played); applied
 *   as inline styles. `iconColor` defaults to the lib's `#000`.
 *
 * Note on title/divider/RTL: in the lib those live in the sibling `HelpPopoverBubble`
 * (passed as `children`), NOT on HelpIconButton itself — so they stay out of this
 * component's prop surface, exactly as upstream.
 */

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface HelpIconButtonProps {
  /** Content that will be displayed in popover bubble. This can be anything. */
  children: React.ReactNode;

  /** Icon used to indicate popover bubble. */
  icon?: React.ReactNode;

  /** CSS color value for the icon color. */
  iconColor?: string;

  /** String for determining the width of the popover bubble. */
  popoverWidth?: string;

  /** String for setting aria-label. */
  "aria-label"?: string;

  /** CSS color value for the border of the popover bubble. */
  borderColor?: string;
}

/**
 * The HelpIconButton component consists of an icon, which must be passed as a
 * prop, and a popover that takes anything as a child.
 */
export const HelpIconButton: React.FC<HelpIconButtonProps> = ({
  icon,
  iconColor = "#000",
  popoverWidth = "100%",
  "aria-label": ariaLabel,
  borderColor = undefined,
  children,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id="help-icon-button"
          type="button"
          variant="ghost"
          size="icon"
          aria-owns={open ? "mouse-over-popover" : undefined}
          aria-haspopup="true"
          aria-label={ariaLabel}
          data-testid="help-popover-icon-button"
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
          onClick={handleOpen}
          style={{ color: iconColor }}
        >
          {icon}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        id="mouse-over-popover"
        className={cn(
          "popover-container pointer-events-none p-0",
          "text-[0.875em] whitespace-pre-line"
        )}
        data-testid="popover-bubble"
        align="start"
        side="bottom"
        sideOffset={0}
        onOpenAutoFocus={(e) => e.preventDefault()}
        style={{
          width: popoverWidth,
          border: borderColor ? `1px solid ${borderColor}` : "none",
        }}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
};

export default HelpIconButton;
