/**
 * SpeakerListCM
 *
 * Faithful 1:1 port of the lib's `SpeakerListCM`
 * (library/display/published-summaries/SpeakerListCM.tsx) — the CSS-Module
 * variant of `SpeakerList`. Colors are owned by the stylesheet and the SVG
 * markup (use the `SpeakerList` variant for runtime color overrides). Mirrors
 * the lib by reusing `SpeakerListProps`.
 *
 * Token mapping (no raw hex):
 *   icon stroke #0051A8 (lightnessBlue33) → text-primary-blue-600
 *   text        #495057 (lightnessGray31) → text-gray-700
 *
 * The person SVG paths are copied 1:1 from the lib.
 * Part of the Published Summaries component family.
 */

import { FC } from "react";

import { cn } from "@/lib/utils";
import { SpeakerListProps } from "./SpeakerList";

const SpeakerIcon: FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.66667"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="size-5 shrink-0 text-primary-blue-600"
  >
    <path d="M15.8333 17.5V15.8333C15.8333 14.9493 15.4821 14.1014 14.857 13.4763C14.2319 12.8512 13.3841 12.5 12.5 12.5H7.5C6.61595 12.5 5.7681 12.8512 5.14298 13.4763C4.51786 14.1014 4.16667 14.9493 4.16667 15.8333V17.5" />
    <path d="M10 9.16667C11.8409 9.16667 13.3333 7.67428 13.3333 5.83333C13.3333 3.99238 11.8409 2.5 10 2.5C8.15905 2.5 6.66667 3.99238 6.66667 5.83333C6.66667 7.67428 8.15905 9.16667 10 9.16667Z" />
  </svg>
);

/**
 * Displays a list of speaker names with a person icon.
 * CSS Module variant of SpeakerList.
 */
export const SpeakerListCM: FC<SpeakerListProps> = ({
  speakers,
  className,
}) => {
  if (speakers.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <SpeakerIcon />
      <span className="text-base font-medium leading-6 text-gray-700">
        {speakers.join(", ")}
      </span>
    </div>
  );
};

export default SpeakerListCM;
