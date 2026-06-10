/**
 * KeyTakeaways
 *
 * React migration of the wordly-react-components-lib `KeyTakeaways`
 * (src/components/library/display/published-summaries/KeyTakeaways.tsx),
 * originally built on MUI 6 (Paper / Box / Typography) + Emotion `styled`.
 *
 * Ported to the prototype's shadcn/Tailwind foundation:
 * - MUI `Paper` (elevation=1, rounded card) → a plain bordered/rounded `div`
 *   using `Card`-style tokens (border-gray-200, rounded-xl, shadow-sm, bg-card).
 * - Emotion `styled` helpers (TakeawaysRoot/Header/List/Item, NumberBadge) →
 *   folded into inline Tailwind utility classes.
 * - MUI `Typography` → semantic elements with token text classes.
 *
 * Color mapping (lib palette → our design tokens, Brand Blue stays primary):
 *   porcelain        → border-gray-200      (card border)
 *   lightGrayish     → border-gray-100      (header divider)
 *   header fill      → bg-gray-50/50        (header fill)
 *   onyx             → text-gray-900        (title)
 *   lightnessBlue85  → bg-primary-blue-100  (number badge fill, Brand Blue)
 *   lightnessBlue28  → text-primary-blue-700 (number badge text, Brand Blue)
 *   lightnessGray23  → text-gray-700        (item body text)
 *
 * Data arrives via props with small inline mock defaults; in production the
 * takeaways would be fetched from the published-summaries API.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface KeyTakeawaysProps {
  /** Icon element displayed in the header, rendered at 20x20. */
  icon?: React.ReactNode;

  /** Title text displayed next to the icon in the header. */
  title?: string;

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
   * DOM element type for the title. Defaults to `"h3"`. Pass `"h2"` etc. to
   * render the title at a different heading level without changing its styling.
   */
  titleAs?: React.ElementType;
}

/**
 * Default takeaways — in production these would be fetched from the
 * published-summaries API for a given session.
 */
const DEFAULT_ITEMS: React.ReactNode[] = [
  "AI tools are becoming democratized and accessible to everyone",
  "Sustainable computing is no longer optional—it’s a business imperative",
  "Human-AI collaboration will define the next era of productivity",
  "Organizations must adapt strategies while maintaining ethics",
];

/**
 * Displays a numbered list of key takeaways inside a summary card.
 * Part of the Published Summaries component family.
 */
export function KeyTakeaways({
  icon,
  title = "Key Takeaways",
  items = DEFAULT_ITEMS,
  body,
  className,
  titleAs: TitleTag = "h3",
}: KeyTakeawaysProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-gray-200 bg-card text-card-foreground shadow-sm",
        className
      )}
    >
      {/* Header — icon + title, divider below, subtle gray fill. */}
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/50 px-5 pb-[17px] pt-4">
        {icon ? (
          <span className="flex size-5 shrink-0 items-center justify-center text-primary [&>*]:size-full">
            {icon}
          </span>
        ) : null}
        <TitleTag className="text-base font-semibold leading-6 text-gray-900">
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

export default KeyTakeaways;
