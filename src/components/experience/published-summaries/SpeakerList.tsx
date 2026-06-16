/**
 * SpeakerList
 *
 * Faithful 1:1 port of the lib's `SpeakerList`
 * (wordly-react-components-lib: library/display/published-summaries/SpeakerList.tsx),
 * MUI 6 + Emotion → shadcn/Tailwind.
 *
 * The lib renders a flex row: a 20x20 person/user SVG glyph + a
 * `Typography variant="body1"` (500 weight, 1.5rem line-height) of comma-joined
 * speaker names. Renders nothing when `speakers` is empty. It exposes
 * Emotion-only `iconColor` / `textColor` overrides (defaulting to brand tokens),
 * preserved here: defaults use token classes, overrides apply via inline color.
 *
 *   icon `lightnessBlue33` (#0051A8) → text-primary-blue-600
 *   text `lightnessGray31` (#495057) → text-gray-700
 *
 * The person SVG paths are copied 1:1 from the lib; `currentColor` drives the
 * stroke so the token / override color flows through.
 * Part of the Published Summaries component family.
 */

import { FC } from "react";

import { cn } from "@/lib/utils";

export interface SpeakerListProps {
  /** Array of speaker names to display */
  speakers: string[];

  /** Optional CSS class name for external styling */
  className?: string;
}

export interface SpeakerListStyledProps extends SpeakerListProps {
  /** Color for the speaker icon. Defaults to the brand token. Emotion variant only. */
  iconColor?: string;

  /** Color for the speaker name text. Defaults to the brand token. Emotion variant only. */
  textColor?: string;
}

const SpeakerIcon: FC<{ className?: string; color?: string }> = ({
  className,
  color,
}) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke={color ?? "currentColor"}
    strokeWidth="1.66667"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M15.8333 17.5V15.8333C15.8333 14.9493 15.4821 14.1014 14.857 13.4763C14.2319 12.8512 13.3841 12.5 12.5 12.5H7.5C6.61595 12.5 5.7681 12.8512 5.14298 13.4763C4.51786 14.1014 4.16667 14.9493 4.16667 15.8333V17.5" />
    <path d="M10 9.16667C11.8409 9.16667 13.3333 7.67428 13.3333 5.83333C13.3333 3.99238 11.8409 2.5 10 2.5C8.15905 2.5 6.66667 3.99238 6.66667 5.83333C6.66667 7.67428 8.15905 9.16667 10 9.16667Z" />
  </svg>
);

/**
 * Displays a list of speaker names with a person icon.
 * Renders nothing if the speakers array is empty.
 * Part of the Published Summaries component family.
 */
export const SpeakerList: FC<SpeakerListStyledProps> = ({
  speakers,
  iconColor,
  textColor,
  className,
}) => {
  if (speakers.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <SpeakerIcon
        className={cn("size-5 shrink-0", !iconColor && "text-primary-blue-600")}
        color={iconColor}
      />
      <span
        className={cn(
          "text-base font-medium leading-6",
          !textColor && "text-gray-700"
        )}
        style={textColor ? { color: textColor } : undefined}
      >
        {speakers.join(", ")}
      </span>
    </div>
  );
};

export default SpeakerList;
