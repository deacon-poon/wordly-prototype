/**
 * CapsuleSummary
 *
 * Faithful 1:1 port of the lib's `CapsuleSummary`
 * (wordly-react-components-lib: library/display/published-summaries/CapsuleSummary.tsx),
 * MUI 6 + Emotion → shadcn/Tailwind. Part of the Published Summaries family.
 *
 * The lib uses a styled MUI `Paper` (elevation 0, boxShadow none) with a
 * light-blue fill, blue border, 12px radius, and 25px padding, wrapping a
 * Typography body (500 weight, 1.125rem / 1.75rem line-height).
 *
 * Token mapping (no raw hex; Brand Blue kept as primary):
 *   lightnessBlue97 (fill)   #F0F7FF → primary-blue-25
 *   lightnessBlue85 (border) #B2D8FF → primary-blue-100
 *   lightnessGray15 (text)   #212529 → gray-800
 */

import { FC, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface CapsuleSummaryProps {
  /** Content to display. Accepts plain text or React nodes for inline formatting. */
  text: ReactNode;

  /** Optional CSS class name for external styling */
  className?: string;
}

/**
 * Displays a brief capsule summary in a highlighted container.
 * Part of the Published Summaries component family.
 */
export const CapsuleSummary: FC<CapsuleSummaryProps> = ({
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

export default CapsuleSummary;
