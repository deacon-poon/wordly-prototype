"use client";

/**
 * AudioPill
 *
 * Faithful 1:1 port of the production library `AudioPill`
 * (wordly-react-components-lib: src/components/library/feedback/AudioPill.tsx),
 * originally an MUI `<Box>` styled via the `sx` prop with Emotion.
 *
 * A single vertical bar whose height animates to represent one frequency band
 * of an audio level meter. It is the atomic unit composed by `AudioInputIndicator`
 * (one pill per frequency band).
 *
 * Port notes (mirroring the lib exactly):
 * - Lib anatomy: `width: 12px`, `borderRadius: 6px`, `margin: 0 auto`,
 *   `backgroundColor: color`, `transition: height ${animationDuration}ms ease-in-out`,
 *   `height: currentHeight`. Reproduced here on a plain `<div>` with Tailwind for
 *   the static anatomy (`w-3` = 12px, `rounded-md` = 6px, `mx-auto`) and inline
 *   styles for the two genuinely dynamic runtime values (animated `height` and
 *   the caller-controlled `animationDuration`) — neither are design tokens.
 * - Lib behavior: a `useState`/`useEffect` pair sets `currentHeight` to the prop
 *   and resets it to `null` on unmount. Preserved verbatim.
 * - Lib is wrapped in `React.memo`. Preserved.
 * - Color: the lib `color` prop is a required CSS color string (no default; the
 *   indicator always passes one). To honour the no-raw-hex rule, our default is
 *   the Brand Blue primary token (`hsl(var(--primary-blue-500))`). Callers may
 *   still pass any CSS color string exactly as the production indicator does.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Props for the Audio Pill component.
 */
export interface AudioPillProps {
  /** Determines the height of the pill in pixels. */
  height: number;
  /**
   * Determines the color of the indicator. Any CSS color string. Defaults to
   * the Brand Blue primary token; the production indicator overrides this (e.g.
   * with a muted gray when disabled).
   */
  color?: string;
  /** Determines the duration of the animation in milliseconds. */
  animationDuration?: number;
  className?: string;
}

/**
 * Represents a visual indicator for audio levels whose pill height is animated.
 */
function AudioPillBase({
  height,
  color = "hsl(var(--primary-blue-500))",
  animationDuration = 250,
  className,
}: AudioPillProps) {
  const [currentHeight, setCurrentHeight] = React.useState<number | null>(
    height
  );

  React.useEffect(() => {
    setCurrentHeight(height);
    // Configures a cleanup function to reset the height to null on unmount.
    return () => {
      setCurrentHeight(null);
    };
  }, [height]);

  return (
    <div
      className={cn("mx-auto w-3 rounded-md", className)}
      style={{
        height: currentHeight ?? undefined,
        backgroundColor: color,
        transition: `height ${animationDuration}ms ease-in-out`,
      }}
    />
  );
}

/** Memoized to match the production component (`React.memo`). */
export const AudioPill = React.memo(AudioPillBase);

export default AudioPill;
