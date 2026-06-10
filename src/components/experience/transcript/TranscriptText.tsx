"use client";

/**
 * TranscriptText
 *
 * React migration of the production library component
 * (wordly-react-components-lib: src/components/app/meeting/transcript/TranscriptText.tsx).
 *
 * The MUI original is a thin `styled(Typography)` wrapper that renders transcribed
 * text with the Wordly type scale, supports right-to-left justification, and takes
 * an arbitrary `textColor` hex. This port drops MUI + Emotion entirely:
 *
 *   - MUI `Typography` + `styled`  -> a plain text element + Tailwind classes.
 *   - MUI `variant` (body1/body2/h1-h6/caption/...) -> a `variant` map onto our text
 *     scale (mirrors @/components/ui/typography sizing).
 *   - The raw `textColor` hex prop -> a token-based `tone` prop (default / muted /
 *     primary / success / error / subtle) so no raw hex enters the design system.
 *     An escape hatch (`style`/`className`) still allows one-off colors.
 *   - `rtl` -> `dir` + `text-right`, preserved 1:1.
 *
 * In production, transcript lines are streamed from the captioning API; here the
 * text arrives via `children` with small inline defaults for the stories.
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Variant scale — maps the MUI Typography variants the transcript surfaces used
// (body1, body2, headings, subtitle, caption) onto our Tailwind text scale.
// Aligns with @/components/ui/typography so transcript text matches the product.
// ---------------------------------------------------------------------------

const transcriptTextVariants = cva("h-auto w-full", {
  variants: {
    variant: {
      h1: "text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "text-3xl font-semibold tracking-tight",
      h3: "text-2xl font-semibold tracking-tight",
      h4: "text-xl font-semibold tracking-tight",
      h5: "text-lg font-semibold tracking-tight",
      h6: "text-base font-semibold tracking-tight",
      subtitle1: "text-base font-medium leading-7",
      subtitle2: "text-sm font-medium leading-6",
      // body1 is the default transcript line: comfortable reading size that
      // shrinks on small viewports (mirrors the original's responsive shrink).
      body1: "text-base leading-7 sm:text-lg",
      body2: "text-sm leading-6 sm:text-base",
      caption: "text-xs leading-5",
      overline: "text-xs font-medium uppercase tracking-widest",
    },
    tone: {
      // Token-based colors only — no raw hex (the original passed #1F1F1F etc.).
      default: "text-gray-900",
      muted: "text-gray-700",
      subtle: "text-muted-foreground",
      primary: "text-primary",
      success: "text-accent-green-600",
      error: "text-destructive",
    },
  },
  defaultVariants: {
    variant: "body1",
    tone: "default",
  },
});

export type TranscriptTextVariant = NonNullable<
  VariantProps<typeof transcriptTextVariants>["variant"]
>;
export type TranscriptTextTone = NonNullable<
  VariantProps<typeof transcriptTextVariants>["tone"]
>;

export interface TranscriptTextProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "color"
> {
  /** Text content to be displayed. */
  children?: React.ReactNode;

  /** Class name for styling. */
  className?: string;

  /** Whether the text should be right justified (right-to-left languages). */
  rtl?: boolean;

  /** Type scale, mapped from the original MUI Typography variants. */
  variant?: TranscriptTextVariant;

  /**
   * Semantic text color, replacing the original raw `textColor` hex prop.
   * Use the `style`/`className` escape hatch only for genuine one-offs.
   */
  tone?: TranscriptTextTone;

  /**
   * Element to render as. Defaults to a heading tag for h1–h6, otherwise `p`,
   * matching the semantics the MUI variant would have produced.
   */
  component?: keyof JSX.IntrinsicElements;
}

function defaultComponentFor(
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
 * Displays transcribed text with Wordly type styles. `rtl` right-justifies the
 * text for right-to-left languages, and the text shrinks on small viewports.
 */
export const TranscriptText = React.forwardRef<
  HTMLElement,
  TranscriptTextProps
>(
  (
    {
      rtl = false,
      className,
      children,
      variant = "body1",
      tone = "default",
      component,
      ...otherProps
    },
    ref
  ) => {
    const Component = (component ??
      defaultComponentFor(variant)) as keyof JSX.IntrinsicElements;

    return React.createElement(
      Component,
      {
        ref,
        dir: rtl ? "rtl" : "ltr",
        className: cn(
          transcriptTextVariants({ variant, tone }),
          rtl ? "text-right" : "text-left",
          className
        ),
        ...otherProps,
      },
      children
    );
  }
);

TranscriptText.displayName = "TranscriptText";

export default TranscriptText;
