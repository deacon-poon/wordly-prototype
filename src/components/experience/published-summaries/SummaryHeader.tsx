/**
 * SummaryHeader
 *
 * Faithful 1:1 port of the production `wordly-react-components-lib`
 * SummaryHeader (MUI 6 + Emotion):
 *   src/components/library/display/published-summaries/SummaryHeader.tsx
 *
 * The lib renders a single MUI `<Typography variant="h2">` styled bold,
 * 2.25rem / 2.925rem line-height, colored `WordlyColors.onyx` (#121416, the
 * brand ink). This port drops MUI/Emotion for a semantic `<h2>` + Tailwind
 * utilities. Onyx maps to our near-black ink token (`text-gray-900`); the exact
 * type scale (700 weight, 2.25rem, 2.925rem line-height) is preserved via
 * arbitrary Tailwind values to match the source pixel-for-pixel.
 *
 * Part of the Published Summaries component family.
 */

import { FC } from "react";

import { cn } from "@/lib/utils";

export interface SummaryHeaderProps {
  /** The title text to display */
  title: string;

  /** Optional CSS class name for external styling */
  className?: string;
}

/**
 * Displays a bold header title for a published summary.
 * Part of the Published Summaries component family.
 */
export const SummaryHeader: FC<SummaryHeaderProps> = ({ title, className }) => (
  <h2
    className={cn(
      "font-bold text-[2.25rem] leading-[2.925rem] text-gray-900",
      className
    )}
  >
    {title}
  </h2>
);

export default SummaryHeader;
