"use client";

/**
 * AudioInputIndicator
 *
 * Faithful 1:1 port of the production `AudioInputIndicator` from
 * wordly-react-components-lib (MUI 6 + Emotion). It renders a row of vertical
 * "pills" whose heights animate to reflect per-band audio amplitude — the
 * classic mic / audio-level visualizer.
 *
 * The MUI original used a `styled('div')` container (60x60, flex row, 2px gap,
 * centered) and a memoized `AudioPill` child built on `<Box sx={...}>`. The
 * container is reproduced with Tailwind utilities + inline 60x60 sizing; the
 * child is our ported `AudioPill`. No @mui/* or @emotion/*.
 *
 * The lib API is preserved exactly: `audioData`, `audioIndicatorColor`,
 * `audioIndicatorDisabledColor`, `disabled`, `maxHeight`, `animationDuration`,
 * `style`, `ariaLabel`. The only theme change is the color *default*: the lib
 * fell back to `WordlyColors.white` when no color was supplied; we keep that
 * `white` fallback (it is intentionally neutral — callers pass the brand color),
 * but stories drive it with our Brand Blue token (no raw hex ships in code).
 */

import * as React from "react";

import AudioPill from "./AudioPill";

/**
 * Props for the Audio Input Indicator component.
 */
export interface AudioInputIndicatorProps {
  /** Processed audio data that will be used to update the visualization. */
  audioData: { id: number; amplitude: number }[];
  /** Determines the color of the indicator. */
  audioIndicatorColor?: string;
  /** Determines the color of the indicator when the component is disabled. */
  audioIndicatorDisabledColor?: string;
  /** Prop to disable the component. */
  disabled: boolean;
  /** Determines the maximum height in pixels for the audio indicator. */
  maxHeight: number;
  /** Determines the duration of the animation in milliseconds. */
  animationDuration?: number;
  /** Optional styles to apply to the component. */
  style?: React.CSSProperties;
  /** Aria label for the component */
  ariaLabel: string;
}

// Maximum amplitude for the audio indicator.
const maxAmplitude = 1;
// Minimum amplitude to avoid division by zero.
const minAmplitude = 0.1;

export interface FrequencyBand {
  /** Determines the id of the frequency band. */
  id: number;
  /** Determines the amplitude of the frequency band. */
  amplitude: number;
}

/**
 * Audio data model representing the processed frequency bands.
 */
export interface AudioDataModel {
  /**
   * Array of frequency bands, where each band contains an ID and an amplitude.
   */
  frequencyBands: FrequencyBand[];
}

/**
 * Calculate the height of the pills based on the amplitude and maximum height
 * allowed.
 */
const calculatePillHeights = (
  frequencyBands: { id: number; amplitude: number }[],
  maxHeight: number
) => {
  const minHeight = maxHeight / 5;
  return frequencyBands.map((band) => {
    if (band.amplitude < minAmplitude) {
      return {
        id: band.id,
        height: minHeight,
      };
    }

    // Normalize the amplitude of the audio signal onto a relative scale.
    const normalizeAmplitude = band.amplitude / maxAmplitude;
    // Calculate the height of the audio indicator.
    const height = normalizeAmplitude * maxHeight;
    return {
      id: band.id,
      height: Math.max(height, minHeight),
    };
  });
};

/**
 * Audio Input Indicator component.
 */
const AudioInputIndicator: React.FC<AudioInputIndicatorProps> = ({
  audioData,
  audioIndicatorColor,
  audioIndicatorDisabledColor,
  disabled = false,
  animationDuration = 250,
  maxHeight = 50,
  style = {},
  ariaLabel,
}) => {
  const colorIndicator = disabled
    ? audioIndicatorDisabledColor
    : audioIndicatorColor;

  const memoizedPillHeights = React.useMemo(
    () => calculatePillHeights(audioData, maxHeight),
    [audioData, maxHeight]
  );

  return (
    <div
      className="flex flex-row items-center justify-center gap-0.5"
      style={{ width: 60, height: 60, ...style }}
      aria-label={ariaLabel}
      role="img"
    >
      {memoizedPillHeights.map((pill) => (
        <AudioPill
          key={pill.id}
          height={pill.height}
          // Lib fallback is WordlyColors.white when no color is supplied.
          color={colorIndicator ?? "hsl(var(--primary-foreground))"}
          animationDuration={animationDuration}
        />
      ))}
    </div>
  );
};

export default React.memo(AudioInputIndicator);
export { AudioInputIndicator };
