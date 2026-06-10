/**
 * SummaryHeaderCM
 *
 * Ported from wordly-react-components-lib
 * (src/components/library/display/published-summaries/SummaryHeaderCM.tsx),
 * the MUI 6 + Emotion / CSS-module original. Rebuilt on our shadcn + Tailwind
 * foundation: the MUI `<Typography variant="h2">` plus the `SummaryHeader.module.css`
 * styled title (font-weight 700, 36px / 46.8px line-height, color onyx #121416)
 * collapse into a single semantic `<h2>` with Tailwind utilities.
 *
 * Color mapping: the lib's `onyx` (#121416) → our `text-gray-900` token.
 *
 * Displays a bold header title for a published summary. Part of the Published
 * Summaries component family. Pure presentational component (no state), so no
 * "use client" directive is required.
 */

import { cn } from "@/lib/utils";

export interface SummaryHeaderCMProps {
  /** The title text to display. In production, fetched from the API. */
  title: string;

  /** Optional CSS class name for external styling. */
  className?: string;
}

/**
 * Bold header title for a published summary.
 *
 * Original sizing preserved exactly: 36px font / 46.8px line-height (the
 * non-standard line-height is carried as an arbitrary Tailwind value).
 */
export function SummaryHeaderCM({ title, className }: SummaryHeaderCMProps) {
  return (
    <h2
      className={cn(
        "font-bold text-[36px] leading-[46.8px] text-gray-900",
        className
      )}
    >
      {title}
    </h2>
  );
}

export default SummaryHeaderCM;
