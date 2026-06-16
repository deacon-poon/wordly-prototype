/**
 * CapsuleSummaryCM
 *
 * Faithful 1:1 port of the lib's `CapsuleSummaryCM`
 * (library/display/published-summaries/CapsuleSummaryCM.tsx) — the CSS-Module
 * variant of `CapsuleSummary`. In the lib it differs from the Emotion base only
 * in styling source (`CapsuleSummary.module.css`); the rendered result is
 * identical. On our Tailwind stack both variants resolve to the same classes.
 *
 * Mirrors the lib by reusing `CapsuleSummaryProps` from `./CapsuleSummary`.
 *
 * Token mapping (no raw hex):
 *   lightnessBlue97 (fill)   #F0F7FF → primary-blue-25
 *   lightnessBlue85 (border) #B2D8FF → primary-blue-100
 *   lightnessGray15 (text)   #212529 → gray-800
 */

import { FC } from "react";

import { cn } from "@/lib/utils";
import { CapsuleSummaryProps } from "./CapsuleSummary";

/**
 * Displays a brief capsule summary in a highlighted container.
 * CSS Module variant of CapsuleSummary.
 */
export const CapsuleSummaryCM: FC<CapsuleSummaryProps> = ({
  text,
  className,
}) => (
  <div
    className={cn(
      "rounded-xl border border-primary-blue-100 bg-primary-blue-25 p-[25px] shadow-none",
      className
    )}
  >
    <p className="text-[1.125rem] font-medium leading-[1.75rem] text-gray-800">
      {text}
    </p>
  </div>
);

export default CapsuleSummaryCM;
