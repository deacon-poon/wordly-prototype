/**
 * FullSummaryCM
 *
 * Faithful 1:1 port of the lib's `FullSummaryCM`
 * (library/display/published-summaries/FullSummaryCM.tsx) — the CSS-Module
 * variant of `FullSummary`. In the lib it differs from the base only in styling
 * source (`FullSummary.module.css`); the rendered result is identical. Mirrors
 * the lib by reusing `FullSummaryProps` from `./FullSummary`.
 *
 * Token mapping (no raw hex):
 *   porcelain (root border)   #E3E6E8 → border-gray-200
 *   header bg (rgba slate 50%)        → bg-gray-50/50
 *   lightGrayish (header rule) #EEF0F2 → border-gray-100
 *   onyx (title)              #121416 → text-gray-900
 *   lightnessGray23 (body)    #343A40 → text-gray-700
 */

import { FC } from "react";

import { cn } from "@/lib/utils";
import { FullSummaryProps } from "./FullSummary";

/**
 * Displays a published full summary with an icon, title, and paragraph content.
 * CSS Module variant of FullSummary.
 */
export const FullSummaryCM: FC<FullSummaryProps> = ({
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

export default FullSummaryCM;
