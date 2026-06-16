/**
 * FullSummary
 *
 * Faithful 1:1 port of the lib's `FullSummary`
 * (wordly-react-components-lib: library/display/published-summaries/FullSummary.tsx),
 * MUI 6 + Emotion → shadcn/Tailwind.
 *
 * Anatomy preserved 1:1: a `Paper elevation={1}` rounded-12px card (porcelain
 * border, overflow hidden) with a header band (icon 20x20 + title) and a body of
 * stacked paragraphs (26px gap, 26px line-height). An optional `body` slot
 * replaces the paragraphs (used for in-progress / empty placeholders, e.g.
 * <PendingState />). `titleAs` defaults to `'h6'` (MUI's variantMapping for
 * subtitle1).
 *
 * Token mapping (no raw hex):
 *   porcelain (root border)   #E3E6E8 → border-gray-200
 *   header bg (rgba slate 50%)        → bg-gray-50/50
 *   lightGrayish (header rule) #EEF0F2 → border-gray-100
 *   onyx (title)              #121416 → text-gray-900
 *   lightnessGray23 (body)    #343A40 → text-gray-700
 */

import { ElementType, FC, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface FullSummaryProps {
  /** Icon element displayed in the header, rendered at 20x20 */
  icon: ReactNode;

  /** Title text displayed next to the icon in the header */
  title: string;

  /** Array of paragraph nodes to display in the body. Accepts plain text or React nodes for inline formatting. Ignored when `body` is provided. */
  paragraphs?: ReactNode[];

  /** Optional override for the card body. When provided, takes the place of the `paragraphs` content — useful for in-progress / empty placeholders. */
  body?: ReactNode;

  /** Optional CSS class name for external styling */
  className?: string;

  /** Optional DOM element type for the title. Defaults to `'h6'`. Pass `'h2'` etc. to render the title as a real heading at a different level without changing its visual styling. */
  titleAs?: ElementType;
}

/**
 * Displays a published full summary with an icon, title, and paragraph content.
 * Part of the Published Summaries component family.
 */
export const FullSummary: FC<FullSummaryProps> = ({
  icon,
  title,
  paragraphs,
  body,
  className,
  titleAs: TitleTag = "h6",
}) => (
  <div
    className={cn(
      "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm",
      className
    )}
  >
    <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/50 px-5 pb-[17px] pt-4">
      <span className="flex size-5 shrink-0 items-center justify-center [&>*]:size-full">
        {icon}
      </span>
      <TitleTag className="text-base font-semibold text-gray-900">
        {title}
      </TitleTag>
    </div>
    {body !== undefined ? (
      body
    ) : paragraphs && paragraphs.length > 0 ? (
      <div className="flex flex-col gap-[26px] px-5 pb-[21px] pt-5">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-base leading-[1.625rem] text-gray-700">
            {paragraph}
          </p>
        ))}
      </div>
    ) : null}
  </div>
);

export default FullSummary;
