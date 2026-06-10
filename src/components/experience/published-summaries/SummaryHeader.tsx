/**
 * SummaryHeader
 *
 * React/shadcn port of the production `wordly-react-components-lib`
 * SummaryHeader (MUI 6 + Emotion):
 *   src/components/library/display/published-summaries/SummaryHeader.tsx
 *
 * The original renders a single MUI `Typography variant="h2"` styled bold,
 * 36px / 46.8px line-height, colored `WordlyColors.onyx` (the brand ink).
 * This port replaces MUI/Emotion with a semantic heading + Tailwind
 * utilities. Onyx maps to our near-black ink token (`text-gray-900`); the exact
 * type scale (700 weight, 36px, 1.3 line-height) is preserved via `text-[36px]`
 * and `leading-[46.8px]`.
 *
 * Part of the Published Summaries component family. In production the `title`
 * would be fetched from the published-summary API; here it arrives via props
 * with an inline mock default.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface SummaryHeaderProps {
  /** The title text to display. */
  title?: string;

  /**
   * Heading level to render. Defaults to `h2` to match the original
   * `Typography variant="h2"`. Visual styling is identical across levels.
   */
  as?: "h1" | "h2" | "h3";

  /** Optional CSS class name for external styling. */
  className?: string;
}

/** In production, fetched from the published-summary API. */
const DEFAULT_TITLE = "Opening Keynote: The Future of Technology";

/**
 * Displays a bold header title for a published summary.
 * Part of the Published Summaries component family.
 */
export function SummaryHeader({
  title = DEFAULT_TITLE,
  as: Heading = "h2",
  className,
}: SummaryHeaderProps) {
  return (
    <Heading
      className={cn(
        "font-bold text-[36px] leading-[46.8px] text-gray-900",
        className
      )}
    >
      {title}
    </Heading>
  );
}

export default SummaryHeader;
