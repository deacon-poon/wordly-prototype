"use client";

/**
 * TranscriptMetadata
 *
 * Faithful 1:1 port of the production library component
 * `wordly-react-components-lib/src/components/app/meeting/transcript/TranscriptMetadata.tsx`
 * (MUI 6 + Emotion `styled`) onto our Tailwind/shadcn stack.
 *
 * Lib structure reproduced exactly:
 *   - Root: `display:flex; flex-direction:row; justify-content: flex-end|flex-start
 *     (alignRight); align-items:center; width:100%; padding:0; gap:8px`.
 *     NOTE: the lib only flips `justify-content` for alignRight — it does NOT
 *     reverse the name/language order — so this port no longer reverses either.
 *   - Name: `color:<nameColor>; display: inline|none (name present?); font-weight:
 *     bold|normal (boldName); text-overflow:ellipsis; overflow:hidden;
 *     max-width:100%; white-space:nowrap`.
 *   - Language: `color:<languageColor>; display:inline; font-style:italic;
 *     text-overflow:ellipsis; overflow:hidden; white-space:nowrap` — rendered
 *     only when `language` is truthy.
 *   - MUI Typography `variant` defaults to `caption` (→ text-xs here).
 *
 * The lib's `nameColor`/`languageColor` hex props are PRESERVED for 1:1 API
 * parity, but per the lab no-raw-hex guardrail their DEFAULTS use our tokens
 * (gray-900 / gray-500, matching the lib's #000 / #999) and a passed value is
 * applied via inline color only when provided.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

/** MUI Typography variants → Tailwind text size. Lib default is `caption`. */
export type TranscriptMetadataVariant =
  | "caption"
  | "body1"
  | "body2"
  | "subtitle1"
  | "subtitle2"
  | "overline";

const VARIANT_SIZE: Record<TranscriptMetadataVariant, string> = {
  caption: "text-xs",
  body2: "text-sm",
  subtitle2: "text-sm",
  body1: "text-base",
  subtitle1: "text-base",
  overline: "text-xs uppercase tracking-widest",
};

export interface TranscriptMetadataProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "color"
> {
  /** The name of the user who spoke this phrase. */
  name?: string;
  /** The name of the microphone associated with the speaker. */
  micName?: string;
  /** If true, aligns the metadata to the right (lib: only changes justify-content). */
  alignRight?: boolean;
  /** Language associated with this phrase. */
  language?: string;
  /**
   * Text color for the name (lib prop, same name/type). Defaults to a token
   * (gray-900, matching the lib's #000); apply a token via className when you can.
   */
  nameColor?: string;
  /**
   * Text color for the language (lib prop, same name/type). Defaults to a token
   * (gray-500, matching the lib's #999).
   */
  languageColor?: string;
  /** String indicating the Typography variant to use. */
  variant?: TranscriptMetadataVariant;
  /** Whether to bold the name. */
  boldName?: boolean;
}

/**
 * React component for displaying metadata regarding the speaker and their
 * language. `alignRight` right-justifies the row. Also supports per-element
 * name/language colors (defaulted to design tokens).
 */
export const TranscriptMetadata: React.FC<TranscriptMetadataProps> = ({
  alignRight,
  name = "",
  micName = "",
  language = "",
  nameColor,
  languageColor,
  variant = "caption",
  boldName = false,
  className,
  ...otherProps
}) => {
  const displayName = name || micName || "";
  const sizeClass = VARIANT_SIZE[variant];

  return (
    <div
      className={cn(
        "flex w-full flex-row items-center gap-2 p-0",
        alignRight ? "justify-end" : "justify-start",
        className
      )}
      {...otherProps}
    >
      {displayName ? (
        <span
          className={cn(
            "max-w-full overflow-hidden truncate whitespace-nowrap",
            sizeClass,
            nameColor ? undefined : "text-gray-900",
            boldName ? "font-bold" : "font-normal"
          )}
          style={nameColor ? { color: nameColor } : undefined}
        >
          {displayName}
        </span>
      ) : null}
      {language ? (
        <span
          className={cn(
            "overflow-hidden truncate whitespace-nowrap italic",
            sizeClass,
            languageColor ? undefined : "text-gray-500"
          )}
          style={languageColor ? { color: languageColor } : undefined}
        >
          {language}
        </span>
      ) : null}
    </div>
  );
};

export default TranscriptMetadata;
