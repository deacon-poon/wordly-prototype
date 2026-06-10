/**
 * CapsuleSummary
 *
 * Port of the production `CapsuleSummary` from wordly-react-components-lib
 * (MUI 6 + Emotion → shadcn/Tailwind). Part of the Published Summaries family.
 *
 * Displays a brief capsule summary in a highlighted container. The original
 * used a styled MUI `Paper` (elevation 0) with a light-blue fill, blue border,
 * 12px radius, and 25px padding wrapping a 20px / 500-weight Typography body.
 *
 * Token mapping (no raw hex):
 *   lightnessBlue97 (fill)   → primary-blue-25   (Brand Blue, kept as primary)
 *   lightnessBlue85 (border) → primary-blue-100
 *   lightnessGray15 (text)   → gray-800
 *
 * Pure presentational component — content arrives via props (in production the
 * summary text would be fetched from the API).
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface CapsuleSummaryProps {
  /** Content to display. Accepts plain text or React nodes for inline formatting. */
  text: React.ReactNode;

  /** Optional CSS class name for external styling. */
  className?: string;
}

const DEFAULT_TEXT =
  "AI assistants will be standard for knowledge workers by 2030, fundamentally changing how we approach problem-solving and creativity.";

export const CapsuleSummary: React.FC<CapsuleSummaryProps> = ({
  text = DEFAULT_TEXT,
  className,
}) => (
  <div
    className={cn(
      "rounded-xl border border-primary-blue-100 bg-primary-blue-25 p-[25px]",
      className
    )}
  >
    <p className="text-[20px] font-medium leading-[32.5px] text-gray-800">
      {text}
    </p>
  </div>
);

CapsuleSummary.displayName = "CapsuleSummary";

export default CapsuleSummary;
