"use client";

/**
 * InteractiveSpinner
 *
 * React/shadcn port of the production lib component
 * (wordly-react-components-lib: src/components/library/feedback/InteractiveSpinner.tsx).
 *
 * Original anatomy: an MUI `CircularProgress` with an MUI `Typography` message
 * beneath it that pulses (fade in → out) on an infinite CSS keyframe. On every
 * animation iteration the message advances to the next item in `messages`,
 * cycling forever. This port keeps that exact behavior:
 *   - The ring is a Tailwind-animated border spinner (no @mui CircularProgress).
 *   - The message uses an inline keyframe (`pulsate`) scoped to this component
 *     via a <style> tag (no @emotion `styled`), and `onAnimationIteration`
 *     advances the index — matching the lib's `animationiteration` listener.
 *
 * Theme mapping: the lib's spinner inherits the primary brand color (Brand Blue),
 * so the ring uses our `primary` / `border-primary` token. Text uses `gray-700`.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface InteractiveSpinnerProps {
  /**
   * Messages displayed beneath the spinner. Each fades in/out and is replaced by
   * the next on every animation iteration, cycling forever.
   * In production these would typically be fetched/derived (e.g. load-stage copy).
   */
  messages?: string[];

  /** Duration (seconds) of one full fade-in/out iteration of the message. */
  pulseDuration?: number;

  /**
   * Spinner diameter. A number is treated as pixels; a string is used verbatim
   * (e.g. "1em", "2.5rem"). Defaults to 40px (the lib default).
   */
  spinnerSize?: string | number;

  /** Thickness of the ring border in pixels. Defaults to 3.6 (the lib default). */
  spinnerThickness?: number;

  /** Extra classes for the message text (replaces the lib's `typographyProps`). */
  messageClassName?: string;

  /** Extra classes for the outer container. */
  className?: string;
}

const toCssSize = (size: string | number): string =>
  typeof size === "number" ? `${size}px` : size;

/**
 * Spinner that fades cycling text messages in and out below an animated ring.
 */
export function InteractiveSpinner({
  messages = [],
  pulseDuration = 5,
  spinnerSize = 40,
  spinnerThickness = 3.6,
  messageClassName,
  className,
}: InteractiveSpinnerProps) {
  const [index, setIndex] = React.useState(0);

  const advance = React.useCallback(() => {
    setIndex((current) => {
      const next = current + 1;
      return next >= messages.length ? 0 : next;
    });
  }, [messages.length]);

  const dimension = toCssSize(spinnerSize);
  const hasMessages = messages.length > 0;
  const message = messages[index] ?? "";

  // Unique keyframe name so multiple instances never collide.
  const keyframeId = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const pulseKeyframe = `pulsate-${keyframeId}`;

  return (
    <div
      className={cn("flex flex-col items-center justify-center", className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span
        className="block shrink-0 animate-spin rounded-full border-solid border-primary border-t-transparent"
        style={{
          width: dimension,
          height: dimension,
          borderWidth: `${spinnerThickness}px`,
        }}
        aria-hidden="true"
      />

      {hasMessages ? (
        <>
          <style>{`
            @keyframes ${pulseKeyframe} {
              0% { opacity: 0; }
              50% { opacity: 1; }
              100% { opacity: 0; }
            }
          `}</style>
          <p
            key={index}
            onAnimationIteration={advance}
            className={cn(
              "mt-2.5 text-center text-sm text-gray-700",
              messageClassName
            )}
            style={{
              animationName: pulseKeyframe,
              animationDuration: `${pulseDuration}s`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
            }}
          >
            {message}
          </p>
          {/* Screen readers get the live message without the visual pulse noise. */}
          <span className="sr-only">{message}</span>
        </>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </div>
  );
}

export default InteractiveSpinner;
