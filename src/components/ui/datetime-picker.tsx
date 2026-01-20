"use client";

import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { CalendarIcon, ChevronDown, Clock, Globe } from "lucide-react";
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
  /** Compact mode - shows only abbreviation in a small inline selector */
  compact?: boolean;
}

export function TimezoneSelector({
  value,
  onChange,
  disabled = false,
  className,
  showLabel = false,
  compact = false,
}: TimezoneSelectorProps) {
  // Compact mode - small inline selector showing abbreviation
  if (compact) {
    return (
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className={cn(
            "w-auto h-auto px-2.5 py-2 text-xs font-medium text-gray-600 bg-gray-100 border-0 hover:bg-gray-200 focus:ring-1 focus:ring-gray-300 rounded-md",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          <SelectValue>{getTimezoneAbbr(value)}</SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {TIMEZONES.map((tz) => (
            <SelectItem key={tz.value} value={tz.value}>
              {tz.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Standard mode
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
// TimeInput Component - with 15-minute increment presets
// ============================================================================

// Generate time options in 15-minute increments
const generateTimeOptions = (): string[] => {
  const options: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const h = hour.toString().padStart(2, "0");
      const m = minute.toString().padStart(2, "0");
      options.push(`${h}:${m}`);
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

// Format time for display (12-hour format with AM/PM)
const formatTimeDisplay = (time: string): string => {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
};

interface TimeInputProps {
  value: string; // HH:mm format
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  /** Error message to display */
  error?: string;
}

export function TimeInput({
  value,
  onChange,
  disabled = false,
  className,
  label,
  error,
}: TimeInputProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Sync input value when prop changes
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Scroll to selected time when dropdown opens
  React.useEffect(() => {
    if (isOpen && scrollRef.current && value) {
      // Find the closest 15-minute option
      const [hours, minutes] = value.split(":").map(Number);
      const roundedMinutes = Math.round(minutes / 15) * 15;
      const targetTime = `${hours.toString().padStart(2, "0")}:${(roundedMinutes % 60).toString().padStart(2, "0")}`;

      const targetIndex = TIME_OPTIONS.findIndex((t) => t === targetTime);
      if (targetIndex !== -1 && scrollRef.current) {
        const itemHeight = 32; // Approximate height of each item (py-1.5 + text)
        scrollRef.current.scrollTop = Math.max(0, targetIndex * itemHeight - 100);
      }
    }
  }, [isOpen, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Validate and update if valid time format
    if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newValue)) {
      onChange(newValue);
    }
  };

  const handleInputBlur = () => {
    // On blur, try to parse and normalize the input
    if (inputValue) {
      // Try to parse various formats
      let normalized = inputValue;

      // Handle formats like "9:00" -> "09:00"
      const match = inputValue.match(/^(\d{1,2}):(\d{2})$/);
      if (match) {
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
          normalized = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
          setInputValue(normalized);
          onChange(normalized);
          return;
        }
      }

      // Reset to last valid value if invalid
      setInputValue(value);
    }
  };

  const handleSelectTime = (time: string) => {
    setInputValue(time);
    onChange(time);
    setIsOpen(false);
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onFocus={() => setIsOpen(true)}
              disabled={disabled}
              placeholder="HH:MM"
              className={cn(
                "pl-10 pr-3",
                error && "border-red-500"
              )}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[120px] p-0"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div
            ref={scrollRef}
            className="max-h-[280px] overflow-y-auto py-1"
          >
            {TIME_OPTIONS.map((time) => {
              const isSelected = time === value;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleSelectTime(time)}
                  className={cn(
                    "w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
                    isSelected && "bg-primary-blue-50 text-primary-blue-700 font-medium"
                  )}
                >
                  {formatTimeDisplay(time)}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

// ============================================================================
// CompactTimeSelect - Smaller time picker for inline use
// ============================================================================

interface CompactTimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

function CompactTimeSelect({
  value,
  onChange,
  disabled = false,
  error = false,
}: CompactTimeSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Scroll to selected time when dropdown opens
  React.useEffect(() => {
    if (isOpen && scrollRef.current && value) {
      const [hours, minutes] = value.split(":").map(Number);
      const roundedMinutes = Math.round(minutes / 15) * 15;
      const targetTime = `${hours.toString().padStart(2, "0")}:${(roundedMinutes % 60).toString().padStart(2, "0")}`;

      const targetIndex = TIME_OPTIONS.findIndex((t) => t === targetTime);
      if (targetIndex !== -1 && scrollRef.current) {
        const itemHeight = 32; // Approximate height of each item (py-1.5 + text)
        scrollRef.current.scrollTop = Math.max(0, targetIndex * itemHeight - 100);
      }
    }
  }, [isOpen, value]);

  const handleSelectTime = (time: string) => {
    onChange(time);
    setIsOpen(false);
  };

  const displayValue = value ? formatTimeDisplay(value) : "Select";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-[100px] justify-between text-left font-normal px-3",
            !value && "text-gray-500",
            error && "border-red-500"
          )}
        >
          <span className="truncate">{displayValue}</span>
          <ChevronDown className="h-3 w-3 opacity-50 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[120px] p-0"
        align="start"
      >
        <div
          ref={scrollRef}
          className="max-h-[280px] overflow-y-auto py-1"
        >
          {TIME_OPTIONS.map((time) => {
            const isSelected = time === value;
            return (
              <button
                key={time}
                type="button"
                onClick={() => handleSelectTime(time)}
                className={cn(
                  "w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
                  isSelected && "bg-primary-blue-50 text-primary-blue-700 font-medium"
                )}
              >
                {formatTimeDisplay(time)}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
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

        {/* Time range - using compact time selects */}
        <div className="flex items-center gap-1">
          <CompactTimeSelect
            value={value.startTime}
            onChange={(startTime) => onChange({ startTime })}
            disabled={disabled}
            error={!!errors.startTime}
          />
          {showEndTime && (
            <>
              <span className="text-gray-400">–</span>
              <CompactTimeSelect
                value={value.endTime}
                onChange={(endTime) => onChange({ endTime })}
                disabled={disabled}
                error={!!errors.endTime}
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

