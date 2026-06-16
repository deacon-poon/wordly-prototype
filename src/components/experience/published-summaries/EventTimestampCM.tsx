/**
 * EventTimestampCM
 *
 * Faithful 1:1 port of the lib's `EventTimestampCM`
 * (library/display/published-summaries/EventTimestampCM.tsx) — the CSS-Module
 * variant of `EventTimestamp`. Colors are owned by the stylesheet and are NOT
 * exposed as runtime props (use the `EventTimestamp` variant for icon/text
 * color overrides). Mirrors the lib by reusing `EventTimestampProps`.
 *
 * Token mapping (CSS module → our tokens, no raw hex):
 *   icon #0051a8 (lightnessBlue33) → text-primary-blue-600
 *   text #495057 (lightnessGray31) → text-gray-700
 *
 * Icon swapped MUI `CalendarTodayOutlined` → lucide-react `Calendar`.
 * Part of the Published Summaries component family.
 */

import { FC } from "react";
import { Calendar } from "lucide-react";

import { cn } from "@/lib/utils";
import { EventTimestampProps } from "./EventTimestamp";

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
 * CSS Module variant of EventTimestamp.
 */
export const EventTimestampCM: FC<EventTimestampProps> = ({
  dateTime,
  locale = "en-US",
  timeZone,
  className,
}) => (
  <div className={cn("flex items-center gap-2", className)}>
    <Calendar
      className="h-5 w-5 shrink-0 text-primary-blue-600"
      aria-hidden="true"
    />
    <span className="text-base leading-6 text-gray-700">
      {formatDateTime(dateTime, locale, timeZone)}
    </span>
  </div>
);

export default EventTimestampCM;
