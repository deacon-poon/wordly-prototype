"use client";

/**
 * TextButton
 *
 * React migration of the production wordly-react-components-lib `TextButton`
 * (MUI 6 `<Button>` wrapper). The original exposes three "prominence" levels
 * that map onto MUI button variants:
 *
 *   primary   → contained  (solid Brand Blue fill)
 *   secondary → outlined   (transparent w/ border)
 *   tertiary  → text       (no fill, no border)
 *
 * Here we rebuild that surface on the shared shadcn `Button` (DEC-003), mapping
 * each prominence onto a shadcn variant:
 *
 *   primary   → "default"  (bg-primary / Brand Blue)
 *   secondary → "outline"
 *   tertiary  → "ghost"
 *
 * The original also accepted a `customColor` hex escape hatch (used when a button
 * must render outside the theme — e.g. on a colored hero). That is intentionally
 * an arbitrary runtime color, so it can't be expressed as a token class; we honor
 * it via an inline `style` (the same escape-hatch role MUI's `sx` played), while
 * the default themed path uses token classes only. `primaryLabelColor` overrides
 * the label color for the outlined/secondary custom case, mirroring the original.
 */

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";

export type TextButtonProminence = "primary" | "secondary" | "tertiary";

export interface TextButtonProps extends Omit<
  ButtonProps,
  "variant" | "children" | "placeholder"
> {
  /** Text label for the button. */
  label: string;

  /**
   * Visual hierarchy of the button. Higher-prominence actions use `"primary"`
   * (solid Brand Blue); de-emphasized actions use `"tertiary"`.
   * @default "primary"
   */
  prominence?: TextButtonProminence;

  /** Click handler (matches the original `handleClick` prop name). */
  handleClick?: () => void;

  /**
   * Optional hex color override for buttons that must render outside the theme
   * (e.g. on a colored surface). Escape hatch — prefer prominence + tokens.
   * In production this is rare; most buttons should stay on-theme.
   */
  customColor?: string;

  /**
   * Label color for a custom-colored secondary (outlined) button. Only applied
   * when `customColor` is set and `prominence` is `"secondary"`.
   */
  primaryLabelColor?: string;

  className?: string;
}

const PROMINENCE_TO_VARIANT: Record<
  TextButtonProminence,
  NonNullable<ButtonProps["variant"]>
> = {
  primary: "default",
  secondary: "outline",
  tertiary: "ghost",
};

/**
 * Build the inline style for the `customColor` escape hatch. Returns `undefined`
 * when no custom color is set, so the default token-driven theme path is used.
 */
function getCustomColorStyle(
  prominence: TextButtonProminence,
  customColor?: string,
  primaryLabelColor?: string
): React.CSSProperties | undefined {
  if (!customColor) return undefined;

  switch (prominence) {
    case "secondary":
      return {
        color: primaryLabelColor ?? customColor,
        backgroundColor: "transparent",
        borderColor: customColor,
      };
    case "tertiary":
      return { color: customColor };
    case "primary":
    default:
      // Only the background/border are arbitrary (escape hatch). When no label
      // override is given, omit `color` so the Button's `text-primary-foreground`
      // token class (white) carries through — no raw hex literal needed.
      return {
        backgroundColor: customColor,
        ...(primaryLabelColor ? { color: primaryLabelColor } : null),
        borderColor: customColor,
      };
  }
}

/**
 * Text Button wrapper with three prominence levels (primary, secondary,
 * tertiary) that keep button styling consistent across surfaces.
 */
export const TextButton = React.forwardRef<HTMLButtonElement, TextButtonProps>(
  (
    {
      label,
      prominence = "primary",
      handleClick,
      customColor,
      primaryLabelColor,
      className,
      onClick,
      style,
      ...otherProps
    },
    ref
  ) => {
    const customStyle = getCustomColorStyle(
      prominence,
      customColor,
      primaryLabelColor
    );

    function handlePress(event: React.MouseEvent<HTMLButtonElement>) {
      onClick?.(event);
      handleClick?.();
    }

    return (
      <Button
        ref={ref}
        variant={PROMINENCE_TO_VARIANT[prominence]}
        onClick={handlePress}
        // When a custom color is supplied we drop hover token classes so the
        // inline color isn't fought by themed hovers; otherwise stay on-theme.
        className={cn(customStyle && "hover:opacity-90", className)}
        style={customStyle ? { ...customStyle, ...style } : style}
        {...otherProps}
      >
        {label}
      </Button>
    );
  }
);

TextButton.displayName = "TextButton";
