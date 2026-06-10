"use client";

/**
 * TranscriptMetadata
 *
 * React/shadcn migration of the production lib component
 * (wordly-react-components-lib: src/components/app/meeting/transcript/TranscriptMetadata.tsx).
 *
 * The original was a thin Emotion `styled(Typography)` row: a speaker name +
 * an italic language label, with `alignRight` to right-justify and reverse the
 * order, plus `boldName` and per-element hex color props.
 *
 * Port notes:
 *  - All @mui/material (Typography, styled) removed. The two styled atoms (Name,
 *    Language) fold into Tailwind utility classes inline.
 *  - The lib exposed free-form `nameColor` / `languageColor` hex props. To stay
 *    on design tokens (no raw hex), those become a small `tone` enum mapped to
 *    our token classes (default / muted / primary / success / destructive /
 *    teal). The default mirrors the lib look: solid name text + muted language.
 *  - MUI `variant` (caption/body2/...) collapses to a `size` prop (xs/sm/base)
 *    on text-* utilities.
 *
 * In production the name/language/micName would be fetched from the transcript
 * stream API; here they arrive via props with small inline mock defaults.
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Tone → token class mapping. Replaces the lib's free-form hex color props.
// Brand Blue stays primary; success → accent-green; error → destructive.
// ---------------------------------------------------------------------------

const NAME_TONE: Record<string, string> = {
  default: "text-gray-900",
  muted: "text-gray-500",
  primary: "text-primary",
  success: "text-accent-green-600",
  destructive: "text-destructive",
  teal: "text-action-teal-600",
};

const LANGUAGE_TONE: Record<string, string> = {
  default: "text-gray-900",
  muted: "text-gray-500",
  primary: "text-primary",
  success: "text-accent-green-600",
  destructive: "text-destructive",
  teal: "text-action-teal-600",
};

export type TranscriptMetadataTone = keyof typeof NAME_TONE;

const rootVariants = cva("flex w-full flex-row items-center gap-2 p-0", {
  variants: {
    alignRight: {
      true: "justify-end flex-row-reverse",
      false: "justify-start",
    },
  },
  defaultVariants: {
    alignRight: false,
  },
});

const textSizeVariants = cva("", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
    },
  },
  defaultVariants: {
    size: "xs",
  },
});

// ---------------------------------------------------------------------------
// Props — same public surface as the lib component, minus raw-hex color props
// (replaced by tone tokens).
// ---------------------------------------------------------------------------

export interface TranscriptMetadataProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof textSizeVariants> {
  /** The name of the user who spoke this phrase. */
  name?: string;
  /** The name of the microphone associated with the speaker (fallback for name). */
  micName?: string;
  /** Align metadata to the right and reverse the display order of name + language. */
  alignRight?: boolean;
  /** Language associated with this phrase. */
  language?: string;
  /** Token tone for the name text (replaces the lib's `nameColor` hex). */
  nameTone?: TranscriptMetadataTone;
  /** Token tone for the language text (replaces the lib's `languageColor` hex). */
  languageTone?: TranscriptMetadataTone;
  /** Whether to bold the name. */
  boldName?: boolean;
}

/**
 * Displays metadata about a transcript phrase: the speaker name (or mic name
 * fallback) and their language. `alignRight` right-justifies and reverses order.
 */
export function TranscriptMetadata({
  name = "Michael Scott",
  micName = "",
  language = "English",
  alignRight = false,
  nameTone = "default",
  languageTone = "muted",
  boldName = false,
  size = "xs",
  className,
  ...rest
}: TranscriptMetadataProps) {
  const displayName = name || micName || "";

  return (
    <div className={cn(rootVariants({ alignRight }), className)} {...rest}>
      {displayName ? (
        <span
          className={cn(
            "max-w-full overflow-hidden truncate whitespace-nowrap",
            textSizeVariants({ size }),
            NAME_TONE[nameTone],
            boldName ? "font-bold" : "font-normal"
          )}
        >
          {displayName}
        </span>
      ) : null}
      {language ? (
        <span
          className={cn(
            "overflow-hidden truncate whitespace-nowrap italic",
            textSizeVariants({ size }),
            LANGUAGE_TONE[languageTone]
          )}
        >
          {language}
        </span>
      ) : null}
    </div>
  );
}

export default TranscriptMetadata;
