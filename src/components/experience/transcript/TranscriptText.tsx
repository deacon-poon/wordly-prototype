"use client";

/**
 * TranscriptText
 *
 * Faithful 1:1 port of the production library component
 * `wordly-react-components-lib/src/components/app/meeting/transcript/TranscriptText.tsx`
 * (originally `styled(Typography)` on MUI 6 + Emotion) onto our Tailwind/shadcn stack.
 *
 * The lib component is a thin `styled(Typography)` wrapper:
 *   - `width: 100%; height: auto`
 *   - `color: <textColor>`            (free-form hex prop)
 *   - `direction: rtl|ltr`            (from `rtl`)
 *   - `text-align: right | inherit`   (from `rtl`)
 *   - MUI Typography `variant` (body1 default) drives the type scale.
 *
 * Port decisions (kept the public prop surface identical):
 *   - MUI `Typography` + `styled` → a plain text element + Tailwind classes that
 *     mirror the MUI type scale (body1 default, headings, subtitles, caption…).
 *   - The lib's free-form `textColor` hex prop is PRESERVED (same name/type) so the
 *     API is 1:1, but per the lab no-raw-hex guardrail we apply it via inline
 *     `style` only when the caller passes one; the default color comes from our
 *     `text-gray-900` token (the lib's stories passed `#1F1F1F`).
 *   - `variant` accepts the same MUI variant strings.
 *   - `rtl` → `dir` + right/inherit text-align, 1:1 with the lib CSS.
 *
 * In production, transcript lines are streamed from the captioning API; here the
 * text arrives via `children`.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

/** The MUI Typography variants the transcript surfaces use. */
export type TranscriptTextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "subtitle1"
  | "subtitle2"
  | "body1"
  | "body2"
  | "caption"
  | "overline";

// Maps the MUI Typography variant scale onto our Tailwind text scale
// (aligned with @/components/ui/typography so transcript text matches the product).
const VARIANT_CLASS: Record<TranscriptTextVariant, string> = {
  h1: "text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "text-3xl font-semibold tracking-tight",
  h3: "text-2xl font-semibold tracking-tight",
  h4: "text-xl font-semibold tracking-tight",
  h5: "text-lg font-semibold tracking-tight",
  h6: "text-base font-semibold tracking-tight",
  subtitle1: "text-base font-medium leading-7",
  subtitle2: "text-sm font-medium leading-6",
  // body1 is the default transcript line; shrinks on small viewports (mirrors
  // the original's responsive shrink note).
  body1: "text-base leading-7 sm:text-lg",
  body2: "text-sm leading-6 sm:text-base",
  caption: "text-xs leading-5",
  overline: "text-xs font-medium uppercase tracking-widest",
};

export interface TranscriptTextProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "color"
> {
  /** Text content to be displayed. */
  children?: React.ReactNode;

  /** Class name for styling. */
  className?: string;

  /** Whether or not the text should be right justified. */
  rtl?: boolean;

  /** String indicating the Typography variant to use. */
  variant?: TranscriptTextVariant;

  /**
   * Text color for the text (lib prop, same name/type). Per the lab no-raw-hex
   * guardrail prefer a token class via `className`; this remains for 1:1 parity
   * with library callers and is applied as an inline color only when provided.
   */
  textColor?: string;
}

function elementFor(
  variant: TranscriptTextVariant
): keyof JSX.IntrinsicElements {
  switch (variant) {
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return variant;
    case "caption":
    case "overline":
      return "span";
    default:
      return "p";
  }
}

/**
 * React component for displaying transcribed text with the appropriate Wordly
 * styles. The `rtl` prop right-justifies the text for right-to-left languages,
 * and the text shrinks at small breakpoints (matching the lib component).
 */
export const TranscriptText = React.forwardRef<
  HTMLElement,
  TranscriptTextProps
>(
  (
    {
      rtl = false,
      className = "",
      children,
      variant = "body1",
      textColor,
      style,
      ...otherProps
    },
    ref
  ) => {
    const Component = elementFor(variant);

    return React.createElement(
      Component,
      {
        ref,
        dir: rtl ? "rtl" : "ltr",
        className: cn(
          "h-auto w-full",
          VARIANT_CLASS[variant],
          // lib: text-align: right (rtl) | inherit (ltr). Default color token.
          rtl ? "text-right" : "text-inherit",
          textColor ? undefined : "text-gray-900",
          className
        ),
        style: textColor ? { color: textColor, ...style } : style,
        ...otherProps,
      },
      children
    );
  }
);

TranscriptText.displayName = "TranscriptText";

export default TranscriptText;
