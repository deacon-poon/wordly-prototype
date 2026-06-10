/**
 * PendingState
 *
 * Ported from the production library component
 * (wordly-react-components-lib: src/components/library/display/published-summaries/PendingState.tsx),
 * originally built on MUI 6 + Emotion `styled`. Rebuilt here on Tailwind utility
 * classes with a lucide-react icon, per the prototype's shadcn/Tailwind foundation.
 *
 * Body-only placeholder shown inside a published-summary section card while the
 * section is still being generated. Renders a centered icon + heading + subtitle;
 * relies on its host (e.g. a section card's `body` slot) for outer chrome.
 *
 * Color mapping (lib token -> our Tailwind gray token, matched by value):
 *   lightnessGray43 (heading)  -> text-gray-500
 *   lightnessGray64 (subtitle) -> text-gray-400
 *   lightnessGray82 (icon)     -> text-gray-300 (via currentColor)
 *
 * Copy arrives via props with inline defaults; in production these would be
 * driven by the summary-section status returned from the API.
 */

import * as React from "react";
import { CalendarClock } from "lucide-react";

import { cn } from "@/lib/utils";

export interface PendingStateProps {
  /** Heading copy. Defaults to "Summary is being created". */
  heading?: string;

  /** Subtitle copy. Defaults to "The summary will be available soon.". */
  subtitle?: string;

  /** Optional CSS class name for external styling. */
  className?: string;
}

export function PendingState({
  heading = "Summary is being created",
  subtitle = "The summary will be available soon.",
  className,
}: PendingStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2 py-6", className)}>
      <CalendarClock
        className="h-10 w-10 text-gray-300"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <p className="text-center text-base font-medium leading-6 text-gray-500">
        {heading}
      </p>
      <p className="text-center text-sm font-normal leading-[19.6px] text-gray-400">
        {subtitle}
      </p>
    </div>
  );
}

export default PendingState;
