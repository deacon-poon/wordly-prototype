import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * FullSummaryCM
 *
 * Port of the production lib `FullSummaryCM`
 * (wordly-react-components-lib: library/display/published-summaries/FullSummaryCM.tsx,
 * the CSS-Module variant of `FullSummary`).
 *
 * The original is MUI `Paper` + `Typography` styled via a co-located CSS module
 * (`FullSummary.module.css`). This rebuild drops MUI/Emotion entirely and uses a
 * plain card + Tailwind, mapping the lib palette to our tokens:
 *   - border porcelain       → border-gray-200
 *   - header bg (translucent) → bg-gray-50/50
 *   - header divider          → border-gray-100
 *   - title onyx              → text-gray-900
 *   - body text               → text-gray-700
 *
 * Anatomy preserved 1:1: rounded-12px card, header row (icon 20x20 + title),
 * body of stacked paragraphs with 26px gap / 26px line-height. The `body`
 * override slot (for pending/empty placeholders) is kept.
 *
 * Data arrives via props; defaults below are inline mocks (in production the
 * summary content is fetched from the digest API).
 */

export interface FullSummaryProps {
  /** Icon element displayed in the header, rendered at 20x20. */
  icon?: React.ReactNode;

  /** Title text displayed next to the icon in the header. */
  title?: string;

  /**
   * Array of paragraph nodes to display in the body. Accepts plain text or
   * React nodes for inline formatting. Ignored when `body` is provided.
   */
  paragraphs?: React.ReactNode[];

  /**
   * Optional override for the card body. When provided, takes the place of the
   * `paragraphs` content — useful for in-progress / empty placeholders.
   */
  body?: React.ReactNode;

  /** Optional CSS class name for external styling. */
  className?: string;

  /**
   * Optional DOM element type for the title. Defaults to `'h6'`. Pass `'h2'`
   * etc. to render the title as a real heading at a different level without
   * changing its visual styling.
   */
  titleAs?: React.ElementType;
}

// ---------------------------------------------------------------------------
// Inline mock content — in production, fetched from the digest/summary API.
// ---------------------------------------------------------------------------

const MOCK_PARAGRAPHS: string[] = [
  "Dr. Chen opened the conference with a compelling vision of technology’s trajectory over the next decade. She emphasized three key themes: the democratization of AI tools, the shift toward sustainable computing, and the growing importance of human-AI collaboration.",
  "The keynote began with a historical perspective on technological revolutions, drawing parallels between the current AI transformation and previous industrial shifts. Dr. Chen noted that unlike previous revolutions, the AI era will affect knowledge workers most profoundly.",
  "A significant portion of the talk focused on the democratization of AI tools. She demonstrated how platforms are making sophisticated AI capabilities accessible to non-technical users, predicting that by 2030, AI assistants will be standard in every knowledge worker’s toolkit.",
];

export function FullSummaryCM({
  icon,
  title = "Full Summary",
  paragraphs = MOCK_PARAGRAPHS,
  body,
  className,
  titleAs: TitleTag = "h6",
}: FullSummaryProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/50 px-5 pb-[17px] pt-4">
        {icon ? (
          <span className="flex size-5 shrink-0 items-center justify-center [&>svg]:size-full [&>*]:size-full">
            {icon}
          </span>
        ) : null}
        <TitleTag className="text-base font-semibold text-gray-900">
          {title}
        </TitleTag>
      </div>

      {body !== undefined ? (
        body
      ) : paragraphs && paragraphs.length > 0 ? (
        <div className="flex flex-col gap-[26px] px-5 pb-[21px] pt-5">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-base leading-[26px] text-gray-700">
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default FullSummaryCM;
