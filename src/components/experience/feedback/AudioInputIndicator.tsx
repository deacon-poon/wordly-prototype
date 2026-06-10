"use client";

/**
 * AudioInputIndicator
 *
 * React/shadcn port of the production `AudioInputIndicator` from
 * wordly-react-components-lib (MUI 6 + Emotion). It renders a row of vertical
 * "pills" whose heights animate to reflect per-band audio amplitude — the
 * classic mic / audio-level visualizer.
 *
 * The MUI original used a `styled('div')` container and a memoized `AudioPill`
 * child built on `<Box sx={...}>`. Both are folded into Tailwind utilities here
 * (no @mui/* or @emotion/*). Colors come from our design tokens rather than the
 * lib palette: the lib's wordlyBlue / newWordlyBlue brand maps to Brand Blue
 * (`bg-primary`); the disabled `twilightHaze` gray maps to `bg-muted-foreground/40`.
 *
 * Color is driven by token-based Tailwind classes (`barClassName` /
 * `disabledBarClassName`) instead of raw hex props, per the no-raw-hex rule.
 *
 * Data arrives via props with a small inline mock default. In production the
 * `audioData` stream would be fed from a live Web Audio analyser (FFT frequency
 * bands), updated on each animation frame.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

/** A single processed frequency band. */
export interface FrequencyBand {
  /** Stable id for the band (used as the React key). */
  id: number;
  /** Normalized amplitude in the range [0, 1]. */
  amplitude: number;
}

export interface AudioInputIndicatorProps {
  /**
   * Processed audio data driving the visualization. Each entry is one bar.
   * In production this is fed from a live Web Audio analyser.
   */
  audioData?: FrequencyBand[];
  /** Disables the indicator (renders in the muted/disabled color). */
  disabled?: boolean;
  /** Maximum bar height in pixels. Bars never fall below maxHeight / 5. */
  maxHeight?: number;
  /** Animation duration in milliseconds for height transitions. */
  animationDuration?: number;
  /** Tailwind classes for the bar color when enabled (token-based). */
  barClassName?: string;
  /** Tailwind classes for the bar color when disabled (token-based). */
  disabledBarClassName?: string;
  /** Accessible label for the visualization (rendered as role="img"). */
  ariaLabel?: string;
  className?: string;
}

// Amplitude bounds mirrored from the MUI original.
const MAX_AMPLITUDE = 1;
const MIN_AMPLITUDE = 0.1;

/**
 * Mock data — a flat (silent) 5-band signal. In production, fetched/streamed
 * from a live Web Audio analyser.
 */
export const MOCK_AUDIO_DATA: FrequencyBand[] = [
  { id: 1, amplitude: 0 },
  { id: 2, amplitude: 0 },
  { id: 3, amplitude: 0 },
  { id: 4, amplitude: 0 },
  { id: 5, amplitude: 0 },
];

/**
 * Convert amplitudes to pixel heights, clamped to a floor of maxHeight / 5
 * (matches the lib's calculatePillHeights).
 */
function calculatePillHeights(
  frequencyBands: FrequencyBand[],
  maxHeight: number
): { id: number; height: number }[] {
  const minHeight = maxHeight / 5;
  return frequencyBands.map((band) => {
    if (band.amplitude < MIN_AMPLITUDE) {
      return { id: band.id, height: minHeight };
    }
    const normalized = band.amplitude / MAX_AMPLITUDE;
    const height = normalized * maxHeight;
    return { id: band.id, height: Math.max(height, minHeight) };
  });
}

/**
 * A single animated bar. Replaces the MUI `AudioPill` (`<Box sx>` + useState/
 * useEffect height settling) with a Tailwind div + inline transition timing.
 */
function AudioPill({
  height,
  animationDuration,
  colorClassName,
}: {
  height: number;
  animationDuration: number;
  colorClassName: string;
}) {
  return (
    <div
      className={cn("mx-auto w-3 shrink-0 rounded-full", colorClassName)}
      style={{
        height,
        transition: `height ${animationDuration}ms ease-in-out`,
      }}
    />
  );
}

export function AudioInputIndicator({
  audioData = MOCK_AUDIO_DATA,
  disabled = false,
  maxHeight = 50,
  animationDuration = 250,
  barClassName = "bg-primary",
  disabledBarClassName = "bg-muted-foreground/40",
  ariaLabel = "Audio input level",
  className,
}: AudioInputIndicatorProps) {
  const pillHeights = React.useMemo(
    () => calculatePillHeights(audioData, maxHeight),
    [audioData, maxHeight]
  );

  const colorClassName = disabled ? disabledBarClassName : barClassName;

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn(
        "flex flex-row items-center justify-center gap-0.5",
        className
      )}
      style={{ width: 60, height: 60 }}
    >
      {pillHeights.map((pill) => (
        <AudioPill
          key={pill.id}
          height={pill.height}
          animationDuration={animationDuration}
          colorClassName={colorClassName}
        />
      ))}
    </div>
  );
}

export default React.memo(AudioInputIndicator);
