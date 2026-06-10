/**
 * CapsuleSummaryCM
 *
 * Ported from the production wordly-react-components-lib
 * (`src/components/library/display/published-summaries/CapsuleSummaryCM.tsx`),
 * which used a MUI Paper + Typography pairing themed via a CSS module.
 * Rebuilt on this repo's shadcn/Tailwind foundation.
 *
 * Displays a brief capsule summary in a highlighted container. Part of the
 * Published Summaries component family.
 *
 * Original theme mapping (lib palette -> our tokens):
 *   - lightnessBlue97 background  -> primary-blue-25
 *   - lightnessBlue85 border      -> primary-blue-100
 *   - lightnessGray15 text        -> gray-900
 *
 * Pure presentational component: content arrives via the `text` prop. In
 * production this text is fetched from the published-summary API.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface CapsuleSummaryCMProps {
  /** Content to display. Accepts plain text or React nodes for inline formatting. */
  text?: React.ReactNode;

  /** Optional class name for external styling. */
  className?: string;
}

// Mock default — in production this is fetched from the published-summary API.
const MOCK_TEXT =
  "AI assistants will be standard for knowledge workers by 2030, fundamentally changing how we approach problem-solving and creativity.";

export function CapsuleSummaryCM({
  text = MOCK_TEXT,
  className,
}: CapsuleSummaryCMProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-primary-blue-100 bg-primary-blue-25 p-[25px]",
        className
      )}
    >
      <p className="text-[20px] font-medium leading-[32.5px] text-gray-900">
        {text}
      </p>
    </div>
  );
}

export default CapsuleSummaryCM;
