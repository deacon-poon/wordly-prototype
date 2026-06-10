/**
 * FullSummary
 *
 * React migration of the production lib component
 * (wordly-react-components-lib: src/components/library/display/published-summaries/FullSummary.tsx).
 *
 * The original was MUI 6 + Emotion: a `Paper` root with a styled header
 * (icon + title) and a styled body (stacked `Typography` paragraphs), plus an
 * optional `body` slot used to inject placeholder states (e.g. PendingState).
 * This port rebuilds it on the shared Card primitive + Tailwind, dropping all
 * @mui/* and @emotion/* deps.
 *
 * Theme mapping (lib palette name -> our token class):
 *   porcelain (root border)        -> border-gray-200
 *   header bg (translucent slate)  -> bg-gray-50/50
 *   lightGrayish (header rule)     -> border-gray-100
 *   onyx (title)                   -> text-gray-900
 *   lightnessGray23 (body)         -> text-gray-700
 *   muted grays (pending state)    -> text-gray-500 / text-muted-foreground
 *
 * Content arrives via props with small inline mock defaults; in production the
 * summary paragraphs would be fetched from the summaries API.
 */

import * as React from "react";
import { CalendarClock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

// ---------------------------------------------------------------------------
// PendingState — body-only placeholder shown while a section is generating.
// Ported from the lib's sibling PendingState component (centered glyph +
// heading + subtitle). Rendered into FullSummary's `body` slot.
// ---------------------------------------------------------------------------

export interface PendingStateProps {
  /** Heading copy. */
  heading?: string;
  /** Subtitle copy. */
  subtitle?: string;
  className?: string;
}

export function PendingState({
  heading = "Summary is being created",
  subtitle = "The summary will be available soon.",
  className,
}: PendingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 px-5 py-6 text-center",
        className
      )}
    >
      <CalendarClock
        className="h-10 w-10 text-gray-300"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <p className="text-base font-medium leading-6 text-gray-500">{heading}</p>
      <p className="text-sm leading-relaxed text-gray-400">{subtitle}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FullSummary
// ---------------------------------------------------------------------------

export interface FullSummaryProps {
  /** Icon element displayed in the header, rendered at 20x20. */
  icon?: React.ReactNode;

  /** Title text displayed next to the icon in the header. */
  title: string;

  /**
   * Paragraph nodes to display in the body. Accepts plain text or React nodes
   * for inline formatting. Ignored when `body` is provided.
   */
  paragraphs?: React.ReactNode[];

  /**
   * Override for the card body. When provided, takes the place of `paragraphs`
   * — useful for in-progress / empty placeholders (e.g. <PendingState />).
   */
  body?: React.ReactNode;

  /**
   * DOM element type for the title heading. Defaults to `'h2'`. Pass `'h3'`
   * etc. to render the title at a different semantic level without changing
   * its visual styling.
   */
  titleAs?: React.ElementType;

  className?: string;
}

const MOCK_PARAGRAPHS: React.ReactNode[] = [
  "Dr. Chen opened the conference with a compelling vision of technology’s trajectory over the next decade. She emphasized three key themes: the democratization of AI tools, the shift toward sustainable computing, and the growing importance of human-AI collaboration.",
  "The keynote began with a historical perspective on technological revolutions, drawing parallels between the current AI transformation and previous industrial shifts. Dr. Chen noted that unlike previous revolutions, the AI era will affect knowledge workers most profoundly.",
];

/**
 * Displays a published full summary with an icon, title, and paragraph content.
 * Part of the Published Summaries component family.
 */
export function FullSummary({
  icon,
  title,
  paragraphs = MOCK_PARAGRAPHS,
  body,
  titleAs: TitleTag = "h2",
  className,
}: FullSummaryProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden rounded-xl border-gray-200 shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/50 px-5 pb-[17px] pt-4">
        {icon ? (
          <span className="flex h-5 w-5 shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full">
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
    </Card>
  );
}

export default FullSummary;
