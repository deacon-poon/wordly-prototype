/**
 * EventTimestamp
 *
 * Faithful 1:1 port of the lib's `EventTimestamp`
 * (wordly-react-components-lib: library/display/published-summaries/EventTimestamp.tsx),
 * MUI 6 + Emotion → shadcn/Tailwind.
 *
 * The lib renders a flex row: a 20x20 `CalendarTodayOutlined` icon + a
 * `Typography variant="body1"` (24px line-height) showing a friendly,
 * locale-aware date/time. It exposes Emotion-only `iconColor` / `textColor`
 * overrides (defaulting to brand tokens). This port preserves that exact prop
 * API: when an override is passed it is applied via inline `color`; otherwise
 * the brand token classes are used (no raw hex in our defaults).
 *
 *   icon `lightnessBlue33` (#0051A8) → text-primary-blue-600
 *   text `lightnessGray31` (#495057) → text-gray-700
 *
 * Icon swapped MUI `CalendarTodayOutlined` → lucide-react `Calendar` (no MUI dep).
 * Part of the Published Summaries component family.
 */

import { FC } from "react";
import { Calendar } from "lucide-react";

import { cn } from "@/lib/utils";

export interface EventTimestampProps {
  /** ISO 8601 date/time string (e.g. "2026-03-10T09:00:00Z") */
  dateTime: string;

  /** BCP 47 locale tag used to format the date/time. Defaults to 'en-US'. */
  locale?: string;

  /**
   * IANA time zone name (e.g. 'UTC', 'America/Los_Angeles') used to format the
   * date/time. When omitted, the viewer's local time zone is used -- so a
   * `Z`-suffixed ISO string will render differently depending on where the
   * viewer is. Pass an explicit value when you need deterministic output across
   * viewers (or in tests).
   */
  timeZone?: string;

  /** Optional CSS class name for external styling */
  className?: string;
}

export interface EventTimestampStyledProps extends EventTimestampProps {
  /** Color for the calendar icon. Defaults to the brand token. Emotion variant only. */
  iconColor?: string;

  /** Color for the date/time text. Defaults to the brand token. Emotion variant only. */
  textColor?: string;
}

function formatDateTime(
  isoString: string,
  locale = "en-US",
  timeZone?: string
): string {
  const date = new Date(isoString);
  const datePart = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone,
  }).format(date);
  const timePart = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  }).format(date);
  return `${datePart} ${timePart}`;
}

/**
 * Displays a formatted date/time with a calendar icon.
 * Accepts an ISO 8601 string and formats it as a friendly date and time.
 * Part of the Published Summaries component family.
 */
export const EventTimestamp: FC<EventTimestampStyledProps> = ({
  dateTime,
  iconColor,
  textColor,
  locale = "en-US",
  timeZone,
  className,
}) => (
  <div className={cn("flex items-center gap-2", className)}>
    <Calendar
      className={cn("h-5 w-5 shrink-0", !iconColor && "text-primary-blue-600")}
      style={iconColor ? { color: iconColor } : undefined}
      aria-hidden="true"
    />
    <span
      className={cn("text-base leading-6", !textColor && "text-gray-700")}
      style={textColor ? { color: textColor } : undefined}
    >
      {formatDateTime(dateTime, locale, timeZone)}
    </span>
  </div>
);

export default EventTimestamp;
