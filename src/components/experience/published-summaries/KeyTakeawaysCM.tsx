/**
 * KeyTakeawaysCM
 *
 * React migration of the production wordly-react-components-lib
 * `KeyTakeawaysCM` (MUI 6 Paper/Typography + CSS Module variant). Part of the
 * Published Summaries component family: a numbered list of key takeaways inside
 * a summary card with an icon + title header.
 *
 * Port notes (MUI/Emotion → shadcn + Tailwind):
 * - MUI `<Paper elevation={1}>` + styled root → a plain bordered/rounded card
 *   built with Tailwind (`@/components/ui/card` is unused here because the
 *   original is a hand-rolled bordered surface with a tinted header band and a
 *   bottom-bordered divider, which Tailwind expresses directly).
 * - MUI `<Typography>` → semantic elements with Tailwind text utilities.
 * - Styled `NumberBadge` / `TakeawaysList` / `TakeawayItem` → inline Tailwind.
 *
 * Color mapping (lib palette → our brand tokens, see globals.css / tailwind.config.js):
 * - porcelain (root border)        → border-gray-200
 * - translucent band (header)      → bg-gray-50/50
 * - lightGrayish (header divider)  → border-gray-100
 * - onyx (title)                   → text-gray-900
 * - lightnessBlue85 (badge bg)     → bg-primary-blue-100
 * - lightnessBlue28 (badge text)   → text-primary-blue-700 (exact match)
 * - lightnessGray23 (item text)    → text-gray-700
 *
 * Data arrives via props (icon/title/items or a body override). In production
 * these summaries would be fetched from the published-summaries API.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface KeyTakeawaysCMProps {
  /** Icon element displayed in the header, rendered at 20x20. */
  icon: React.ReactNode;

  /** Title text displayed next to the icon in the header. */
  title: string;

  /**
   * Array of takeaway nodes, each rendered as a numbered item. Accepts plain
   * text or React nodes for inline formatting. Ignored when `body` is provided.
   */
  items?: React.ReactNode[];

  /**
   * Optional override for the card body. When provided, takes the place of the
   * `items` list — useful for in-progress / empty placeholders.
   */
  body?: React.ReactNode;

  /** Optional CSS class name for external styling. */
  className?: string;

  /**
   * Optional DOM element type for the title. Defaults to `'h6'` (mirrors MUI's
   * variantMapping for `subtitle1`). Pass `'h2'` etc. to render the title as a
   * real heading at a different level without changing its visual styling.
   */
  titleAs?: React.ElementType;
}

/**
 * Displays a numbered list of key takeaways inside a summary card.
 * Part of the Published Summaries component family.
 */
export function KeyTakeawaysCM({
  icon,
  title,
  items,
  body,
  className,
  titleAs: TitleTag = "h6",
}: KeyTakeawaysCMProps) {
  return (
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
        <TitleTag className="text-base font-semibold leading-normal text-gray-900">
          {title}
        </TitleTag>
      </div>

      {body !== undefined ? (
        body
      ) : items && items.length > 0 ? (
        <ol className="m-0 flex list-none flex-col gap-3 px-5 pb-[21px] pt-5">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex size-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-primary-blue-100 text-sm font-semibold leading-none text-primary-blue-700"
              >
                {index + 1}
              </span>
              <span className="text-base leading-[26px] text-gray-700">
                {item}
              </span>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

export default KeyTakeawaysCM;
