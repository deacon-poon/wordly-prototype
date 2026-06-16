/**
 * PendingState
 *
 * Faithful 1:1 port of the lib's `PendingState`
 * (wordly-react-components-lib: library/display/published-summaries/PendingState.tsx),
 * MUI 6 + Emotion → shadcn/Tailwind.
 *
 * Body-only placeholder shown inside a published-summary section card while the
 * section is still being generated. Renders a centered calendar-with-clock glyph
 * + heading + subtitle; relies on its host (e.g. a section card's `body` slot)
 * for outer chrome.
 *
 * Layout/type preserved 1:1: flex column, centered, gap 8px, 24px vertical
 * padding; 40x40 icon; heading 500 / 16px / 24px; subtitle 400 / 14px / 19.6px.
 *
 * Token mapping (no raw hex):
 *   heading  lightnessGray23 (#343A40) → text-gray-700
 *   subtitle lightnessGray43 (#646E78) → text-gray-500
 *   icon stroke lightnessGray43 (#646E78) → text-gray-500 (via currentColor)
 *
 * The glyph paths are copied 1:1 from the lib (Figma node 1114:643).
 */

import { FC } from "react";

import { cn } from "@/lib/utils";

export interface PendingStateProps {
  /** Heading copy. Defaults to 'Summary is being created'. */
  heading?: string;

  /** Subtitle copy. Defaults to 'The summary will be available soon.'. */
  subtitle?: string;

  /** Optional CSS class name for external styling */
  className?: string;
}

/**
 * Calendar-with-clock glyph used by the pending-state placeholder.
 * Sourced from the Figma design (node 1114:643). Stroke inherits `currentColor`
 * so the surrounding muted-gray text color drives it.
 */
export const PendingIcon: FC = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="presentation"
    aria-hidden="true"
  >
    <g
      stroke="currentColor"
      strokeWidth="3.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M35 12.5V10C35 9.11595 34.6488 8.2681 34.0237 7.64298C33.3986 7.01786 32.5507 6.66667 31.6667 6.66667H8.33333C7.44928 6.66667 6.60143 7.01786 5.97631 7.64298C5.35119 8.2681 5 9.11595 5 10V33.3333C5 34.2174 5.35119 35.0652 5.97631 35.6904C6.60143 36.3155 7.44928 36.6667 8.33333 36.6667H14.1667" />
      <path d="M26.6667 3.33333V10" />
      <path d="M13.3333 3.33333V10" />
      <path d="M5 16.6667H13.3333" />
      <path d="M29.1667 29.1667L26.6667 27.0833V23.3333" />
      <path d="M36.6667 26.6667C36.6667 29.3188 35.6131 31.8624 33.7377 33.7377C31.8624 35.6131 29.3188 36.6667 26.6667 36.6667C24.0145 36.6667 21.471 35.6131 19.5956 33.7377C17.7202 31.8624 16.6667 29.3188 16.6667 26.6667C16.6667 24.0145 17.7202 21.471 19.5956 19.5956C21.471 17.7202 24.0145 16.6667 26.6667 16.6667C29.3188 16.6667 31.8624 17.7202 33.7377 19.5956C35.6131 21.471 36.6667 24.0145 36.6667 26.6667Z" />
    </g>
  </svg>
);

/**
 * Body-only placeholder used inside a published-summary section card while the
 * section is still being generated. Renders just the centered icon + heading +
 * subtitle -- relies on its host (e.g. `KeyTakeaways` / `FullSummary`'s `body`
 * slot) for outer chrome.
 */
export const PendingState: FC<PendingStateProps> = ({
  heading = "Summary is being created",
  subtitle = "The summary will be available soon.",
  className,
}) => (
  <div className={cn("flex flex-col items-center gap-2 py-6", className)}>
    <div className="h-10 w-10 text-gray-500">
      <PendingIcon />
    </div>
    <p className="text-center text-base font-medium leading-6 text-gray-700">
      {heading}
    </p>
    <p className="text-center text-sm font-normal leading-[19.6px] text-gray-500">
      {subtitle}
    </p>
  </div>
);

export default PendingState;
