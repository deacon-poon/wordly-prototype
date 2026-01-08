"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TimezoneSelector } from "@/components/ui/datetime-picker";
import { EventDetailsFormData, FormMode } from "./types";

// ============================================================================
// Props
// ============================================================================

interface EventDetailsFormProps {
  /** Form data */
  data: EventDetailsFormData;
  /** Callback when any field changes */
  onChange: (data: Partial<EventDetailsFormData>) => void;
  /** Validation errors */
  errors?: Record<string, string>;
  /** Form mode (create or edit) */
  mode?: FormMode;
  /** Whether the form is read-only */
  readOnly?: boolean;
}

// ============================================================================
// Component - Simplified per Dec 31 design sync
// Event-level defaults eliminated; sessions inherit from account session defaults.
// Timezone added per Jan 2026 design sync - event-level timezone setting.
// ============================================================================

export function EventDetailsForm({
  data,
  onChange,
  errors = {},
  mode = "create",
  readOnly = false,
}: EventDetailsFormProps) {
  return (
    <div className="space-y-6">
      {/* Event Name */}
      <div className="space-y-2">
        <Label
          htmlFor="event-name"
          className="text-sm font-semibold text-gray-900"
        >
          Event Name *
        </Label>
        <Input
          id="event-name"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Enter event name"
          disabled={readOnly}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="start-date"
            className="text-sm font-semibold text-gray-900"
          >
            Start Date *
          </Label>
          <Input
            id="start-date"
            type="date"
            value={data.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
            disabled={readOnly}
            className={errors.startDate ? "border-red-500" : ""}
          />
          {errors.startDate && (
            <p className="text-sm text-red-500">{errors.startDate}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="end-date"
            className="text-sm font-semibold text-gray-900"
          >
            End Date *
          </Label>
          <Input
            id="end-date"
            type="date"
            value={data.endDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
            disabled={readOnly}
            min={data.startDate}
            className={errors.endDate ? "border-red-500" : ""}
          />
          {errors.endDate && (
            <p className="text-sm text-red-500">{errors.endDate}</p>
          )}
        </div>
      </div>

      {/* Event Timezone */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-900">
          Event Timezone *
        </Label>
        <p className="text-xs text-gray-500 mb-1.5">
          All session times will be displayed in this timezone
        </p>
        <TimezoneSelector
          value={data.timezone}
          onChange={(timezone) => onChange({ timezone })}
          disabled={readOnly}
        />
        {errors.timezone && (
          <p className="text-sm text-red-500">{errors.timezone}</p>
        )}
      </div>
    </div>
  );
}
