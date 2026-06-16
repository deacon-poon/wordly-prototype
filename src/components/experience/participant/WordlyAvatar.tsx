"use client";

/**
 * WordlyAvatar
 *
 * Faithful 1:1 port of the production wordly-react-components-lib component
 * `src/components/app/dialogs/participant/WordlyAvatar.tsx` (MUI 6 + Emotion),
 * rebuilt on the shared shadcn `Avatar` primitive (Radix).
 *
 * Lib structure (mirrored exactly):
 *   const AvatarComponent = hidden ? HiddenAvatar : StyledAvatar;
 *   <AvatarComponent small color textColor alt={name} {...otherProps}>{initials}</AvatarComponent>
 *
 * StyledAvatar sizing (kept in em so it scales with surrounding font-size):
 *   height/width 2.1875em (small) / 2.5em
 *   fontSize     0.75em   (small) / 0.875em
 *   color: textColor   backgroundColor: color
 * HiddenAvatar adds visibility:hidden.
 *
 * Color parity: the lib `color` / `textColor` props were raw hex (defaults
 * white bubble / black text). To honor the lab's "design tokens only, no raw
 * hex" rule, these props keep the SAME NAMES but accept Tailwind classes:
 *   color     → background class (default `bg-muted`, lib white)
 *   textColor → text class       (default `text-foreground`, lib black)
 * Brand Blue stays primary and is available via class (e.g. color="bg-primary").
 */

import * as React from "react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

/**
 * The minimum number of characters a name can have before we just use all of
 * the characters. (Ported verbatim from the lib helper.)
 */
const MINIMUM_NAME_CHARACTERS = 3;

/**
 * Extract initials from a name, assuming a given name followed by a family
 * name. For other syllabic languages this just takes the first 3 characters.
 * (Ported verbatim from the lib's `extractInitials`.)
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

export interface WordlyAvatarProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Avatar>,
  "color"
> {
  /** Name of the user; initials are derived from it. */
  name?: string;

  /** Optional image source. When it loads, it replaces the initials. */
  src?: string;

  /** If small, decreases the avatar + typography size. */
  small?: boolean;

  /**
   * If true, sets the avatar's visibility to "hidden": it is not displayed but
   * still consumes layout space (mirrors the lib `HiddenAvatar`).
   */
  hidden?: boolean;

  /**
   * Color of the avatar bubble. Lib accepted a hex string; here it accepts a
   * Tailwind background class. Defaults to `bg-muted` (lib white).
   */
  color?: string;

  /**
   * Color of the avatar text. Lib accepted a hex string; here it accepts a
   * Tailwind text-color class. Defaults to `text-foreground` (lib black).
   */
  textColor?: string;
}

/**
 * Avatar showing a participant's initials, on the shared shadcn Avatar.
 */
export function WordlyAvatar({
  name = "",
  src,
  small,
  hidden,
  color = "bg-muted",
  textColor = "text-foreground",
  className,
  ...otherProps
}: WordlyAvatarProps) {
  const initials = React.useMemo(() => extractInitials(name), [name]);

  return (
    <Avatar
      aria-label={name || undefined}
      className={cn(
        // StyledAvatar size (em-based, lib parity).
        small ? "h-[2.1875em] w-[2.1875em]" : "h-[2.5em] w-[2.5em]",
        hidden && "invisible",
        className
      )}
      {...otherProps}
    >
      {src ? <AvatarImage src={src} alt={name} /> : null}
      <AvatarFallback
        className={cn(
          "select-none font-medium",
          small ? "text-[0.75em]" : "text-[0.875em]",
          color,
          textColor
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

export default WordlyAvatar;
