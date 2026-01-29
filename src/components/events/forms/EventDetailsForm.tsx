"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimezoneSelector } from "@/components/ui/datetime-picker";
import { EventDetailsFormData, FormMode, ACCOUNTS } from "./types";
import { cn } from "@/lib/utils";

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
          Event Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="event-name"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Enter event name"
          disabled={readOnly}
          className={cn(
            errors.name && "border-red-500 focus-visible:ring-red-500"
          )}
        />
        {errors.name && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            {errors.name}
          </p>
        )}
      </div>

      {/* Event Timezone */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-900">
          Event Timezone <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-gray-500 mb-1.5">
          All session times will be displayed in this timezone
        </p>
        <div className={cn(errors.timezone && "[&>button]:border-red-500")}>
          <TimezoneSelector
            value={data.timezone}
            onChange={(timezone) => onChange({ timezone })}
            disabled={readOnly}
          />
        </div>
        {errors.timezone && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            {errors.timezone}
          </p>
        )}
      </div>

      {/* Account - One account per event */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-900">
          Account <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-gray-500 mb-1.5">
          All sessions in this event will be billed to this account
        </p>
        <Select
          value={data.accountId}
          onValueChange={(value) => onChange({ accountId: value })}
          disabled={readOnly}
        >
          <SelectTrigger
            className={cn(
              errors.accountId && "border-red-500 focus:ring-red-500"
            )}
          >
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            {ACCOUNTS.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.accountId && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            {errors.accountId}
          </p>
        )}
      </div>
    </div>
  );
}
