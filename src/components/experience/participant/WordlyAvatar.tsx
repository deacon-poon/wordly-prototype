"use client";

/**
 * WordlyAvatar
 *
 * React/shadcn migration of the production wordly-react-components-lib
 * `WordlyAvatar` (originally built on MUI 6 + an Emotion-styled Avatar) at
 * src/components/app/dialogs/participant/WordlyAvatar.tsx.
 *
 * Renders a participant/presenter avatar showing the person's initials.
 * The MUI original applied colors via raw hex props (`color` / `textColor`).
 * To honor the lab's "design tokens only, no raw hex" rule, we replace those
 * with a token-backed `variant` palette (Brand Blue stays primary). An image
 * source is also supported, falling back to initials.
 *
 * Built on the shared shadcn Avatar primitive (Radix). In production the name /
 * image would be fetched from the participants API.
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

/**
 * The minimum number of characters a name can have before we just use all of
 * the characters. (Ported verbatim from the lib helper.)
 */
const MINIMUM_NAME_CHARACTERS = 3;

/**
 * Extract initials from a name, assuming a given name followed by a family
 * name. For non-space-delimited / syllabic languages this falls back to the
 * first 3 characters. (Ported verbatim from the lib's `extractInitials`.)
 */
export function extractInitials(name: string): string {
  const names = name.trim().toUpperCase().split(" ");

  // Single contiguous string (also covers empty strings): take up to 3 chars.
  if (names.length === 1) {
    return names[0].slice(0, MINIMUM_NAME_CHARACTERS);
  }

  // 2 or 3 names: first initial of each, capped at 3.
  if (names.length <= 3) {
    return names
      .map((n) => n[0])
      .join("")
      .slice(0, 3);
  }

  // 4+ names: initial of the very first and very last names.
  return names[0].slice(0, 1) + names[names.length - 1].slice(0, 1);
}

// ---------------------------------------------------------------------------
// Token-backed color variants (replaces the MUI `color`/`textColor` hex props).
// Brand Blue is primary; the rest map the lib palette to our tokens.
// ---------------------------------------------------------------------------

const wordlyAvatarVariants = cva("select-none font-medium", {
  variants: {
    variant: {
      // Brand Blue primary CTA color.
      primary: "bg-primary text-primary-foreground",
      // Action Teal (lib's wordlyBlue/teal family).
      teal: "bg-action-teal-500 text-white",
      // Accent Green success.
      success: "bg-accent-green-500 text-white",
      // Error / destructive.
      destructive: "bg-destructive text-destructive-foreground",
      // Neutral gray (lib default gray73 bubble).
      neutral: "bg-gray-200 text-gray-700",
      // Muted (matches the bare shadcn fallback look).
      muted: "bg-muted text-muted-foreground",
    },
    size: {
      // ~2.5em bubble / 0.875em text in the original.
      default: "h-10 w-10 text-sm",
      // ~2.1875em bubble / 0.75em text (the original `small` prop).
      small: "h-9 w-9 text-xs",
    },
  },
  defaultVariants: {
    variant: "neutral",
    size: "default",
  },
});

export type WordlyAvatarVariant = NonNullable<
  VariantProps<typeof wordlyAvatarVariants>["variant"]
>;

export interface WordlyAvatarProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Avatar>,
  "color"
> {
  /** Name of the user; initials are derived from it. */
  name?: string;

  /** Optional image source. When it loads, it replaces the initials. */
  src?: string;

  /**
   * Decreases the avatar + typography size (the lib's `small` prop).
   * Equivalent to `size="small"`.
   */
  small?: boolean;

  /**
   * If true, the avatar is visually hidden but still consumes layout space
   * (mirrors the lib's `hidden` HiddenAvatar variant).
   */
  hidden?: boolean;

  /** Token-backed color palette for the bubble (replaces hex `color`). */
  variant?: WordlyAvatarVariant;
}

/**
 * Avatar showing a participant's initials, on the shared shadcn Avatar.
 */
export function WordlyAvatar({
  name = "",
  src,
  small,
  hidden,
  variant = "neutral",
  className,
  ...props
}: WordlyAvatarProps) {
  const initials = React.useMemo(() => extractInitials(name), [name]);
  const size = small ? "small" : "default";

  return (
    <Avatar
      aria-label={name || undefined}
      className={cn(hidden && "invisible", className)}
      {...props}
    >
      {src ? <AvatarImage src={src} alt={name} /> : null}
      <AvatarFallback className={cn(wordlyAvatarVariants({ variant, size }))}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

export default WordlyAvatar;
