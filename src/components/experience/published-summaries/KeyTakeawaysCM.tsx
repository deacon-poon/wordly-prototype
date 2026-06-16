/**
 * KeyTakeawaysCM
 *
 * Faithful 1:1 port of the lib's `KeyTakeawaysCM`
 * (library/display/published-summaries/KeyTakeawaysCM.tsx) — the CSS-Module
 * variant of `KeyTakeaways`. In the lib it differs from the base only in styling
 * source (`KeyTakeaways.module.css`); the rendered result is identical. Mirrors
 * the lib by reusing `KeyTakeawaysProps` from `./KeyTakeaways`.
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

import { FC } from "react";

import { cn } from "@/lib/utils";
import { KeyTakeawaysProps } from "./KeyTakeaways";

/**
 * Displays a numbered list of key takeaways inside a summary card.
 * CSS Module variant of KeyTakeaways.
 */
export const KeyTakeawaysCM: FC<KeyTakeawaysProps> = ({
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

export default KeyTakeawaysCM;
