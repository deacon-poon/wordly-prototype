/**
 * SpeakerList
 *
 * React migration of the wordly-react-components-lib `SpeakerList`
 * (src/components/library/display/published-summaries/SpeakerList.tsx),
 * ported from MUI 6 + Emotion to shadcn/Tailwind per the repo convention proof
 * (src/components/workspace/workspace-selector.tsx).
 *
 * Displays a list of speaker names preceded by a person icon. Renders nothing
 * when the speakers array is empty. Part of the Published Summaries family.
 *
 * Theme mapping from the lib palette to our tokens:
 *   - iconColor default `lightnessBlue33` (Navy)      → `text-primary` (Brand Blue 500)
 *   - textColor default `lightnessGray31` (mid gray)  → `text-gray-700`
 * The Emotion `iconColor` / `textColor` overrides become optional Tailwind
 * className escape hatches (`iconClassName` / `textClassName`) so callers stay
 * on token classes instead of raw hex.
 *
 * Data arrives via props (no API/DI layer). In production these speaker names
 * would be fetched from the published-summaries API.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Speaker person icon — preserves the source SVG paths 1:1 (a person/user
// glyph). Inlined as an SVG so we keep the exact lib artwork; color is driven
// by `currentColor` so it inherits our token text color.
// ---------------------------------------------------------------------------

function SpeakerIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-5 shrink-0", className)}
    >
      <path d="M15.8333 17.5V15.8333C15.8333 14.9493 15.4821 14.1014 14.857 13.4763C14.2319 12.8512 13.3841 12.5 12.5 12.5H7.5C6.61595 12.5 5.7681 12.8512 5.14298 13.4763C4.51786 14.1014 4.16667 14.9493 4.16667 15.8333V17.5" />
      <path d="M10 9.16667C11.8409 9.16667 13.3333 7.67428 13.3333 5.83333C13.3333 3.99238 11.8409 2.5 10 2.5C8.15905 2.5 6.66667 3.99238 6.66667 5.83333C6.66667 7.67428 8.15905 9.16667 10 9.16667Z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Data contract (mirrors the Angular/MUI SpeakerListProps)
// ---------------------------------------------------------------------------

export interface SpeakerListProps {
  /** Array of speaker names to display. Empty array renders nothing. */
  speakers: string[];

  /**
   * Token class override for the icon color (Emotion `iconColor` equivalent).
   * Defaults to the lib's `lightnessBlue33` → `text-primary` (Brand Navy).
   */
  iconClassName?: string;

  /**
   * Token class override for the speaker name text (Emotion `textColor`
   * equivalent). Defaults to the lib's `lightnessGray31` → `text-gray-700`.
   */
  textClassName?: string;

  /** Optional class on the root for external layout styling. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Mock default — in production, fetched from the published-summaries API.
// ---------------------------------------------------------------------------

export const MOCK_SPEAKERS: string[] = ["Dr. Sarah Chen", "John Smith"];

export function SpeakerList({
  speakers = MOCK_SPEAKERS,
  iconClassName,
  textClassName,
  className,
}: SpeakerListProps) {
  if (speakers.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <SpeakerIcon className={cn("text-primary", iconClassName)} />
      <p
        className={cn(
          "text-base font-medium leading-6 text-gray-700",
          textClassName
        )}
      >
        {speakers.join(", ")}
      </p>
    </div>
  );
}

export default SpeakerList;
