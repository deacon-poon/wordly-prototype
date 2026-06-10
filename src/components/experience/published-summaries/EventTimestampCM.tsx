/**
 * EventTimestampCM
 *
 * Port of the production library component
 * (wordly-react-components-lib: src/components/library/display/published-summaries/
 * EventTimestampCM.tsx — the CSS-Module variant of EventTimestamp).
 *
 * The original was MUI `Typography` + `@mui/icons-material/CalendarTodayOutlined`
 * with colors owned by an `EventTimestamp.module.css` (icon `#0051a8`, text
 * `#495057`). Here it is rebuilt on plain Tailwind utilities + a lucide icon,
 * with colors mapped to our brand tokens:
 *   - icon `#0051a8` (lib lightnessBlue33 / Navy) → `text-primary-blue-600`
 *   - text `#495057` (lib lightnessGray31)        → `text-gray-700`
 *
 * Displays a formatted date/time with a calendar icon. Part of the Published
 * Summaries component family. Pure display — no client-side state required.
 */

import * as React from "react";
import { CalendarDays } from "lucide-react";

import { cn } from "@/lib/utils";

export interface EventTimestampCMProps {
  /** ISO 8601 date/time string (e.g. "2026-03-10T09:00:00Z"). */
  dateTime: string;

  /** BCP 47 locale tag used to format the date/time. Defaults to 'en-US'. */
  locale?: string;

  /**
   * IANA time zone name (e.g. 'UTC', 'America/Los_Angeles') used to format the
   * date/time. When omitted, the viewer's local time zone is used — so a
   * `Z`-suffixed ISO string renders differently depending on where the viewer
   * is. Pass an explicit value when you need deterministic output across
   * viewers (or in tests).
   */
  timeZone?: string;

  /** Optional CSS class name for external styling. */
  className?: string;
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

export function EventTimestampCM({
  dateTime,
  locale = "en-US",
  timeZone,
  className,
}: EventTimestampCMProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <CalendarDays
        className="size-5 shrink-0 text-primary-blue-600"
        aria-hidden="true"
      />
      <span className="text-base leading-6 text-gray-700">
        {formatDateTime(dateTime, locale, timeZone)}
      </span>
    </div>
  );
}

export default EventTimestampCM;
