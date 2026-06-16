/**
 * SummaryHeaderCM
 *
 * Faithful 1:1 port of the lib's `SummaryHeaderCM`
 * (src/components/library/display/published-summaries/SummaryHeaderCM.tsx) — the
 * CSS-Module variant of `SummaryHeader`. In the lib the only difference from the
 * Emotion base is that styling comes from `SummaryHeader.module.css`
 * (font-weight 700, 2.25rem, 2.925rem line-height, color onyx #121416) instead
 * of an inline `sx`. On our Tailwind stack both variants resolve to the same
 * utility classes, so the visual output is identical to `SummaryHeader`.
 *
 * Mirrors the lib by reusing `SummaryHeaderProps` from `./SummaryHeader`.
 *
 * Part of the Published Summaries component family.
 */

import { FC } from "react";

import { cn } from "@/lib/utils";
import { SummaryHeaderProps } from "./SummaryHeader";

/**
 * Displays a bold header title for a published summary.
 * CSS Module variant of SummaryHeader.
 */
export const SummaryHeaderCM: FC<SummaryHeaderProps> = ({
  title,
  className,
}) => (
  <h2
    className={cn(
      "font-bold text-[2.25rem] leading-[2.925rem] text-gray-900",
      className
    )}
  >
    {title}
  </h2>
);

export default SummaryHeaderCM;
