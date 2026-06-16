/**
 * KeyTakeaways
 *
 * Faithful 1:1 port of the lib's `KeyTakeaways`
 * (wordly-react-components-lib: library/display/published-summaries/KeyTakeaways.tsx),
 * MUI 6 + Emotion → shadcn/Tailwind.
 *
 * Anatomy preserved 1:1: a `Paper elevation={1}` rounded-12px card (porcelain
 * border, overflow hidden) with a header band (icon 20x20 + title) and a body
 * that is a numbered `<ol>` (12px gap). Each item is a flex row: a 24x24 circular
 * number badge + the takeaway text. An optional `body` slot replaces the list
 * (used for in-progress / empty placeholders). `titleAs` defaults to `'h6'`.
 *
 * Token mapping (no raw hex; Brand Blue kept as primary):
 *   porcelain (root border)   #E3E6E8 → border-gray-200
 *   header bg (rgba slate 50%)        → bg-gray-50/50
 *   lightGrayish (header rule) #EEF0F2 → border-gray-100
 *   onyx (title)              #121416 → text-gray-900
 *   lightnessBlue85 (badge bg) #B2D8FF → bg-primary-blue-100
 *   lightnessBlue28 (badge fg) #00458F → text-primary-blue-700
 *   lightnessGray23 (item body) #343A40 → text-gray-700
 */

import { ElementType, FC, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface KeyTakeawaysProps {
  /** Icon element displayed in the header, rendered at 20x20 */
  icon: ReactNode;

  /** Title text displayed next to the icon in the header */
  title: string;

  /** Array of takeaway nodes, each rendered as a numbered item. Accepts plain text or React nodes for inline formatting. Ignored when `body` is provided. */
  items?: ReactNode[];

  /** Optional override for the card body. When provided, takes the place of the `items` list — useful for in-progress / empty placeholders. */
  body?: ReactNode;

  /** Optional CSS class name for external styling */
  className?: string;

  /** Optional DOM element type for the title. Defaults to `'h6'`. Pass `'h2'` etc. to render the title as a real heading at a different level without changing its visual styling. */
  titleAs?: ElementType;
}

/**
 * Displays a numbered list of key takeaways inside a summary card.
 * Part of the Published Summaries component family.
 */
export const KeyTakeaways: FC<KeyTakeawaysProps> = ({
  icon,
  title,
  items,
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
    ) : items && items.length > 0 ? (
      <ol className="m-0 flex list-none flex-col gap-3 px-5 pb-[21px] pt-5">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 flex size-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-primary-blue-100 text-[0.875rem] font-semibold leading-[1rem] text-primary-blue-700"
            >
              {index + 1}
            </span>
            <span className="text-base leading-[1.625rem] text-gray-700">
              {item}
            </span>
          </li>
        ))}
      </ol>
    ) : null}
  </div>
);

export default KeyTakeaways;
