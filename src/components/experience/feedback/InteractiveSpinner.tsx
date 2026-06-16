"use client";

/**
 * InteractiveSpinner
 *
 * Faithful 1:1 port of the production lib component
 * (wordly-react-components-lib: src/components/library/feedback/InteractiveSpinner.tsx).
 *
 * Lib anatomy: an MUI `CircularProgress` (size, thickness) with an MUI
 * `Typography` message beneath it that pulses (fade in → out) on an infinite
 * `pulsate` CSS keyframe (0% opacity 0 → 50% opacity 1 → 100% opacity 0). On
 * every animation iteration the message advances to the next item in `messages`,
 * cycling forever. The message is rendered only when `messages.length > 0`.
 *
 * Port mapping (no @mui/@emotion):
 *   - `CircularProgress` → a Tailwind `animate-spin` border ring sized by
 *     `spinnerSize`/`spinnerThickness`.
 *   - `styled(Typography)` `pulsate` keyframe → an inline keyframe scoped to this
 *     component via a `<style>` tag, applied with `marginTop: 10px` + centered text.
 *   - The lib attached an `animationiteration` listener via a ref; we use the
 *     equivalent React `onAnimationIteration` handler to advance the index.
 *   - `typographyProps` (forwarded to MUI Typography) → `messageClassName` /
 *     `messageStyle` (there is no Typography element to forward arbitrary MUI
 *     props to). FLAGGED below — see report.
 *
 * Theme mapping: the lib's spinner inherits the primary brand color, so the ring
 * uses our Brand Blue primary token (`border-primary-blue-500`). Text inherits
 * `currentColor` like the lib's Typography (no forced color).
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface InteractiveSpinnerProps {
  /** Array of messages to be displayed beneath the loading spinner. */
  messages?: string[];

  /** Duration (in seconds) of a full iteration of the fadein/fadeout animation. */
  pulseDuration?: number;

  /**
   * Size of the spinner. By default this is 40px. Can provide a number (in
   * pixels) or a string which contains the size units (e.g., '1em').
   */
  spinnerSize?: string | number;

  /** Thickness of the progress circle in pixels. */
  spinnerThickness?: number;

  /**
   * Extra classes for the message element. Replaces the lib's `typographyProps`
   * (which forwarded to MUI Typography — see component header / report).
   */
  messageClassName?: string;

  /** Extra inline styles for the message element. */
  messageStyle?: React.CSSProperties;

  className?: string;
}

const toCssSize = (size: string | number): string =>
  typeof size === "number" ? `${size}px` : size;

/**
 * Spinner component that fades in and out text messages below the animated
 * spinner.
 */
export const InteractiveSpinner: React.FC<InteractiveSpinnerProps> = ({
  messages = [],
  pulseDuration = 5,
  spinnerSize = 40,
  spinnerThickness = 3.6,
  messageClassName,
  messageStyle,
  ...otherProps
}) => {
  const [index, setIndex] = React.useState(0);

  // Get a new message after each iteration of the animation (lib behavior).
  const handleAnimationIteration = React.useCallback(() => {
    setIndex((currentIndex) => {
      let newIndex = currentIndex + 1;
      if (newIndex >= messages.length) {
        newIndex = 0;
      }
      return newIndex;
    });
  }, [messages.length]);

  const dimension = toCssSize(spinnerSize);

  // Unique keyframe name so multiple instances never collide.
  const keyframeId = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const pulseKeyframe = `pulsate-${keyframeId}`;

  return (
    <div className="flex flex-col items-center justify-center" {...otherProps}>
      <span
        role="progressbar"
        className="block shrink-0 animate-spin rounded-full border-solid border-primary-blue-500 border-t-transparent"
        style={{
          width: dimension,
          height: dimension,
          borderWidth: `${spinnerThickness}px`,
        }}
        aria-hidden="true"
      />

      {messages.length > 0 && (
        <>
          <style>{`
            @keyframes ${pulseKeyframe} {
              0% { opacity: 0; }
              50% { opacity: 1; }
              100% { opacity: 0; }
            }
          `}</style>
          <p
            onAnimationIteration={handleAnimationIteration}
            className={cn("mt-2.5 text-center", messageClassName)}
            style={{
              animationName: pulseKeyframe,
              animationDuration: `${pulseDuration}s`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              ...messageStyle,
            }}
          >
            {messages[index]}
          </p>
        </>
      )}
    </div>
  );
};

export default InteractiveSpinner;
