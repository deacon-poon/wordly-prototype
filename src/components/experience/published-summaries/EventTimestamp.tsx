/**
 * EventTimestamp
 *
 * React/shadcn migration of the production wordly-react-components-lib component
 * `library/display/published-summaries/EventTimestamp.tsx` (MUI 6 + Emotion).
 *
 * The original rendered a calendar icon + a friendly, locale-aware date/time
 * string. We drop MUI/Emotion entirely:
 *   - MUI `styled('div')` flex row     → Tailwind `flex items-center gap-2`
 *   - MUI `<Typography variant="body1">` → semantic `<span>` + text utilities
 *   - `@mui/icons-material CalendarTodayOutlined` → lucide-react `Calendar`
 *
 * Theme mapping (lib palette → our tokens):
 *   - icon `lightnessBlue33` (#0051A8, the lib's navy CTA) → `text-primary-blue-600`
 *     (exact #0051A8 in our Navy/Brand Blue scale).
 *   - text `lightnessGray31` (#495057) → `text-gray-700`.
 *
 * The Emotion-only `iconColor` / `textColor` overrides are preserved as optional
 * Tailwind class overrides (`iconClassName` / `textClassName`) instead of raw hex,
 * honoring the no-raw-hex rule.
 *
 * Part of the Published Summaries component family.
 */

import * as React from "react";
import { Calendar } from "lucide-react";

import { cn } from "@/lib/utils";

export interface EventTimestampProps {
  /** ISO 8601 date/time string (e.g. "2026-03-10T09:00:00Z"). In production, fetched from the event API. */
  dateTime: string;

  /** BCP 47 locale tag used to format the date/time. Defaults to "en-US". */
  locale?: string;

  /**
   * IANA time zone name (e.g. "UTC", "America/Los_Angeles") used to format the
   * date/time. When omitted, the viewer's local time zone is used -- so a
   * `Z`-suffixed ISO string will render differently depending on where the viewer
   * is. Pass an explicit value when you need deterministic output across viewers
   * (or in tests).
   */
  timeZone?: string;

  /** Optional Tailwind class override for the calendar icon (replaces the Emotion `iconColor`). */
  iconClassName?: string;

  /** Optional Tailwind class override for the date/time text (replaces the Emotion `textColor`). */
  textClassName?: string;

  /** Optional CSS class name for the root, for external styling. */
  className?: string;
}

function formatDateTime(
  isoString: string,
  locale = "en-US",
  timeZone?: string
): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
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
 */
export function EventTimestamp({
  // In production, fetched from the event API; sensible default for previews.
  dateTime = "2026-03-10T09:00:00",
  locale = "en-US",
  timeZone,
  iconClassName,
  textClassName,
  className,
}: EventTimestampProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Calendar
        className={cn("h-5 w-5 shrink-0 text-primary-blue-600", iconClassName)}
        aria-hidden="true"
      />
      <span className={cn("text-base leading-6 text-gray-700", textClassName)}>
        {formatDateTime(dateTime, locale, timeZone)}
      </span>
    </div>
  );
}

export default EventTimestamp;
