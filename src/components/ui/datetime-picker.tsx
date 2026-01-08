"use client";

import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { CalendarIcon, Clock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ============================================================================
// Timezone Data
// ============================================================================

export const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)", abbr: "ET" },
  { value: "America/Chicago", label: "Central Time (CT)", abbr: "CT" },
  { value: "America/Denver", label: "Mountain Time (MT)", abbr: "MT" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)", abbr: "PT" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)", abbr: "AKT" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)", abbr: "HT" },
  { value: "America/Phoenix", label: "Arizona (MST)", abbr: "MST" },
  { value: "UTC", label: "UTC", abbr: "UTC" },
  { value: "Europe/London", label: "London (GMT/BST)", abbr: "GMT" },
  { value: "Europe/Paris", label: "Central European (CET)", abbr: "CET" },
  { value: "Europe/Berlin", label: "Berlin (CET)", abbr: "CET" },
  { value: "Asia/Tokyo", label: "Japan (JST)", abbr: "JST" },
  { value: "Asia/Shanghai", label: "China (CST)", abbr: "CST" },
  { value: "Asia/Singapore", label: "Singapore (SGT)", abbr: "SGT" },
  { value: "Asia/Dubai", label: "Dubai (GST)", abbr: "GST" },
  { value: "Asia/Kolkata", label: "India (IST)", abbr: "IST" },
  { value: "Australia/Sydney", label: "Sydney (AEST)", abbr: "AEST" },
  { value: "Australia/Melbourne", label: "Melbourne (AEST)", abbr: "AEST" },
  { value: "Pacific/Auckland", label: "New Zealand (NZST)", abbr: "NZST" },
] as const;

export type TimezoneValue = (typeof TIMEZONES)[number]["value"] | string;

// Get timezone abbreviation for display
export function getTimezoneAbbr(timezone: string): string {
  const tz = TIMEZONES.find((t) => t.value === timezone);
  if (tz) return tz.abbr;
  // For custom timezones, extract from the value
  try {
    const now = new Date();
    return formatInTimeZone(now, timezone, "zzz");
  } catch {
    return timezone.split("/").pop() || timezone;
  }
}

// ============================================================================
// TimezoneSelector Component
// ============================================================================

interface TimezoneSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  showLabel?: boolean;
}

export function TimezoneSelector({
  value,
  onChange,
  disabled = false,
  className,
  showLabel = false,
}: TimezoneSelectorProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabel && (
        <Label className="text-sm font-medium text-gray-700">Timezone</Label>
      )}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-400" />
            <SelectValue placeholder="Select timezone" />
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {TIMEZONES.map((tz) => (
            <SelectItem key={tz.value} value={tz.value}>
              {tz.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// ============================================================================
// TimeInput Component
// ============================================================================

interface TimeInputProps {
  value: string; // HH:mm format
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

function TimeInput({
  value,
  onChange,
  disabled = false,
  className,
  label,
}: TimeInputProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
      )}
      <div className="relative">
        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="pl-10"
        />
      </div>
    </div>
  );
}

// ============================================================================
// DateTimePicker Component (Full)
// ============================================================================

export interface DateTimePickerValue {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  timezone: string;
}

interface DateTimePickerProps {
  value: DateTimePickerValue;
  onChange: (value: Partial<DateTimePickerValue>) => void;
  disabled?: boolean;
  className?: string;
  /** Show end time field */
  showEndTime?: boolean;
  /** Show timezone selector */
  showTimezone?: boolean;
  /** Compact mode for inline display */
  compact?: boolean;
  /** Label for the date field */
  dateLabel?: string;
  /** Label for the start time field */
  startTimeLabel?: string;
  /** Label for the end time field */
  endTimeLabel?: string;
  /** Errors object */
  errors?: {
    date?: string;
    startTime?: string;
    endTime?: string;
    timezone?: string;
  };
}

export function DateTimePicker({
  value,
  onChange,
  disabled = false,
  className,
  showEndTime = true,
  showTimezone = true,
  compact = false,
  dateLabel = "Date",
  startTimeLabel = "Start Time",
  endTimeLabel = "End Time",
  errors = {},
}: DateTimePickerProps) {
  const [calendarOpen, setCalendarOpen] = React.useState(false);

  // Parse date string to Date object
  const selectedDate = React.useMemo(() => {
    if (!value.date) return undefined;
    const parsed = parse(value.date, "yyyy-MM-dd", new Date());
    return isValid(parsed) ? parsed : undefined;
  }, [value.date]);

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange({ date: format(date, "yyyy-MM-dd") });
      setCalendarOpen(false);
    }
  };

  // Get display string for the selected date
  const dateDisplayString = React.useMemo(() => {
    if (!selectedDate) return "Select date";
    return format(selectedDate, "MMM d, yyyy");
  }, [selectedDate]);

  // Get timezone abbreviation for display
  const timezoneAbbr = getTimezoneAbbr(value.timezone);

  if (compact) {
    // Compact inline display
    return (
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        {/* Date */}
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className={cn(
                "justify-start text-left font-normal",
                !selectedDate && "text-gray-500",
                errors.date && "border-red-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateDisplayString}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Time range */}
        <div className="flex items-center gap-1">
          <Input
            type="time"
            value={value.startTime}
            onChange={(e) => onChange({ startTime: e.target.value })}
            disabled={disabled}
            className={cn("w-[110px]", errors.startTime && "border-red-500")}
          />
          {showEndTime && (
            <>
              <span className="text-gray-400">–</span>
              <Input
                type="time"
                value={value.endTime}
                onChange={(e) => onChange({ endTime: e.target.value })}
                disabled={disabled}
                className={cn("w-[110px]", errors.endTime && "border-red-500")}
              />
            </>
          )}
        </div>

        {/* Timezone badge */}
        {showTimezone && (
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {timezoneAbbr}
          </span>
        )}
      </div>
    );
  }

  // Full form layout
  return (
    <div className={cn("space-y-4", className)}>
      {/* Date Picker */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-gray-700">{dateLabel}</Label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-gray-500",
                errors.date && "border-red-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateDisplayString}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-sm text-red-500">{errors.date}</p>
        )}
      </div>

      {/* Time inputs */}
      <div className={cn("grid gap-4", showEndTime ? "grid-cols-2" : "grid-cols-1")}>
        <TimeInput
          value={value.startTime}
          onChange={(startTime) => onChange({ startTime })}
          disabled={disabled}
          label={startTimeLabel}
        />
        {showEndTime && (
          <TimeInput
            value={value.endTime}
            onChange={(endTime) => onChange({ endTime })}
            disabled={disabled}
            label={endTimeLabel}
          />
        )}
      </div>
      {(errors.startTime || errors.endTime) && (
        <p className="text-sm text-red-500">
          {errors.startTime || errors.endTime}
        </p>
      )}

      {/* Timezone */}
      {showTimezone && (
        <TimezoneSelector
          value={value.timezone}
          onChange={(timezone) => onChange({ timezone })}
          disabled={disabled}
          showLabel
        />
      )}
      {errors.timezone && (
        <p className="text-sm text-red-500">{errors.timezone}</p>
      )}
    </div>
  );
}

// ============================================================================
// DatePicker Component (Simple - just date)
// ============================================================================

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  error?: string;
}

export function DatePicker({
  value,
  onChange,
  disabled = false,
  className,
  label,
  placeholder = "Select date",
  error,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;
    const parsed = parse(value, "yyyy-MM-dd", new Date());
    return isValid(parsed) ? parsed : undefined;
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, "yyyy-MM-dd"));
      setOpen(false);
    }
  };

  const displayString = selectedDate
    ? format(selectedDate, "MMM d, yyyy")
    : placeholder;

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-gray-500",
              error && "border-red-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayString}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

// ============================================================================
// Utility: Format time with timezone for display
// ============================================================================

export function formatTimeWithTimezone(
  time: string,
  timezone: string,
  includeTimezone = true
): string {
  const abbr = getTimezoneAbbr(timezone);
  return includeTimezone ? `${time} ${abbr}` : time;
}

export function formatTimeRangeWithTimezone(
  startTime: string,
  endTime: string,
  timezone: string,
  includeTimezone = true
): string {
  const abbr = getTimezoneAbbr(timezone);
  const range = `${startTime} – ${endTime}`;
  return includeTimezone ? `${range} ${abbr}` : range;
}

