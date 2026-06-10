"use client";

/**
 * AudioPill
 *
 * React migration of the production library `AudioPill`
 * (wordly-react-components-lib: src/components/library/feedback/AudioPill.tsx),
 * originally an MUI `<Box>` styled via the `sx` prop with Emotion.
 *
 * A single vertical bar whose height animates to represent one frequency band
 * of an audio level meter. It is the atomic unit composed by an audio input
 * indicator (one pill per frequency band).
 *
 * Port notes:
 * - MUI `<Box sx={{...}}>` → plain `<div>` with Tailwind utilities for the
 *   static anatomy (fixed 12px width, 6px radius, centered, smooth height
 *   transition). The two genuinely dynamic values — the animated `height` and
 *   the caller-controlled `animationDuration` — stay as inline styles because
 *   they are arbitrary runtime numbers, not design tokens.
 * - The original keyed the CSS transition off `animationDuration`; we preserve
 *   that one-way "set height on prop change, clear on unmount" behavior.
 * - Color: the library defaulted to `WordlyColors.wordlyBlue` (a hex). Here the
 *   default maps to our Brand Blue primary token via `hsl(var(--primary))`, so
 *   no raw hex ships. Callers may still pass any CSS color string (e.g. a
 *   disabled gray) exactly as the production indicator does.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface AudioPillProps {
  /** Target height of the pill in pixels; the bar animates to this value. */
  height: number;
  /**
   * Bar color as any CSS color string. Defaults to the Brand Blue primary
   * token. The production audio indicator overrides this with a muted gray
   * when disabled.
   */
  color?: string;
  /** Duration of the height transition in milliseconds. */
  animationDuration?: number;
  className?: string;
}

function AudioPillBase({
  height,
  color = "hsl(var(--primary))",
  animationDuration = 250,
  className,
}: AudioPillProps) {
  // Mirrors the original: drive height off the prop, reset on unmount.
  const [currentHeight, setCurrentHeight] = React.useState<number | null>(
    height
  );

  React.useEffect(() => {
    setCurrentHeight(height);
    return () => {
      setCurrentHeight(null);
    };
  }, [height]);

  return (
    <div
      aria-hidden="true"
      className={cn("mx-auto w-3 rounded-full", className)}
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
