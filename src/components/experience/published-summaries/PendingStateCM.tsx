/**
 * PendingStateCM
 *
 * Faithful 1:1 port of the lib's `PendingStateCM`
 * (library/display/published-summaries/PendingStateCM.tsx) — the CSS-Module
 * variant of `PendingState`. In the lib it differs from the base only in styling
 * source (`PendingState.module.css`); the rendered result is identical. Mirrors
 * the lib by reusing `PendingIcon` and `PendingStateProps` from `./PendingState`.
 *
 * Token mapping (CSS module → our tokens, no raw hex):
 *   heading  #343A40 (lightnessGray23) → text-gray-700
 *   subtitle #646E78 (lightnessGray43) → text-gray-500
 *   icon stroke #646E78 → text-gray-500 (via currentColor)
 *
 * Body-only placeholder rendered inside a published-summary section card while
 * that section is still being generated.
 */

import { FC } from "react";

import { cn } from "@/lib/utils";
import { PendingIcon, PendingStateProps } from "./PendingState";

/**
 * Body-only placeholder used inside a published-summary section card while the
 * section is still being generated. CSS Module variant of PendingState.
 */
export const PendingStateCM: FC<PendingStateProps> = ({
  heading = "Summary is being created",
  subtitle = "The summary will be available soon.",
  className,
}) => (
  <div className={cn("flex flex-col items-center gap-2 py-6", className)}>
    <div className="h-10 w-10 text-gray-500">
      <PendingIcon />
    </div>
    <p className="text-center text-base font-medium leading-6 text-gray-700">
      {heading}
    </p>
    <p className="text-center text-sm font-normal leading-[19.6px] text-gray-500">
      {subtitle}
    </p>
  </div>
);

export default PendingStateCM;
