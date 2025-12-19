"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Trash2, Plus, GripVertical, User, Users } from "lucide-react";
import {
  SessionFormData,
  FormMode,
  LANGUAGES,
  TIMEZONES,
  getLanguageName,
} from "./types";

// ============================================================================
// Single Session Form Props
// ============================================================================

interface SessionFormProps {
  /** Form data */
  data: SessionFormData;
  /** Callback when any field changes */
  onChange: (data: Partial<SessionFormData>) => void;
  /** Validation errors */
  errors?: Record<string, string>;
  /** Form mode (create or edit) */
  mode?: FormMode;
  /** Whether the form is read-only */
  readOnly?: boolean;
  /** Whether to show the full form or a compact version */
  compact?: boolean;
  /** Session index (for display purposes) */
  index?: number;
  /** Callback when delete is requested */
  onDelete?: () => void;
  /** Whether delete is allowed */
  canDelete?: boolean;
  /** Location name (for context display) */
  locationName?: string;
  /** Location Session ID (read-only display) */
  locationSessionId?: string;
  /** Location Passcode (read-only display) */
  locationPasscode?: string;
}

/**
 * Single session form - can be used standalone or as part of a list
 */
export function SessionForm({
  data,
  onChange,
  errors = {},
  mode = "create",
  readOnly = false,
  compact = false,
  index,
  onDelete,
  canDelete = true,
  locationName,
  locationSessionId,
  locationPasscode,
}: SessionFormProps) {
  const handleLanguageToggle = (code: string) => {
    if (readOnly) return;
    const selected = data.languages.includes(code)
      ? data.languages.filter((l) => l !== code)
      : [...data.languages, code];
    // Limit to 8 languages (ALS limit)
    onChange({ languages: selected.slice(0, 8) });
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Label
          htmlFor={`session-title-${index || 0}`}
          className="text-sm font-semibold text-gray-900"
        >
          Title *
        </Label>
        <Input
          id={`session-title-${index || 0}`}
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Opening Keynote, Workshop: Advanced Topics"
          disabled={readOnly}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
      </div>

      {/* Location (read-only context display) */}
      {locationName && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Location</Label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
            {locationName}
          </div>
        </div>
      )}

      {/* Presenters */}
      <div className="space-y-2">
        <Label
          htmlFor={`session-presenters-${index || 0}`}
          className="text-sm font-semibold text-gray-900"
        >
          Presenters *
        </Label>
        <Input
          id={`session-presenters-${index || 0}`}
          value={data.presenters}
          onChange={(e) => onChange({ presenters: e.target.value })}
          placeholder="Enter names separated by commas"
          disabled={readOnly}
          className={errors.presenters ? "border-red-500" : ""}
        />
        <p className="text-xs text-gray-500">
          Separate multiple presenters with commas
        </p>
        {errors.presenters && (
          <p className="text-sm text-red-500">{errors.presenters}</p>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label
          htmlFor={`session-date-${index || 0}`}
          className="text-sm font-semibold text-gray-900"
        >
          Date *
        </Label>
        <Input
          id={`session-date-${index || 0}`}
          type="date"
          value={data.scheduledDate}
          onChange={(e) => onChange({ scheduledDate: e.target.value })}
          disabled={readOnly}
          className={errors.scheduledDate ? "border-red-500" : ""}
        />
        {errors.scheduledDate && (
          <p className="text-sm text-red-500">{errors.scheduledDate}</p>
        )}
      </div>

      {/* Start Time & End Time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor={`session-start-${index || 0}`}
            className="text-sm font-semibold text-gray-900"
          >
            Start Time *
          </Label>
          <Input
            id={`session-start-${index || 0}`}
            type="time"
            value={data.scheduledStart}
            onChange={(e) => onChange({ scheduledStart: e.target.value })}
            disabled={readOnly}
            className={errors.scheduledStart ? "border-red-500" : ""}
          />
          {errors.scheduledStart && (
            <p className="text-sm text-red-500">{errors.scheduledStart}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor={`session-end-${index || 0}`}
            className="text-sm font-semibold text-gray-900"
          >
            End Time *
          </Label>
          <Input
            id={`session-end-${index || 0}`}
            type="time"
            value={data.endTime}
            onChange={(e) => onChange({ endTime: e.target.value })}
            disabled={readOnly}
            className={errors.endTime ? "border-red-500" : ""}
          />
          {errors.endTime && (
            <p className="text-sm text-red-500">{errors.endTime}</p>
          )}
        </div>
      </div>

      {/* Timezone */}
      {!compact && (
        <div className="space-y-2">
          <Label
            htmlFor={`session-timezone-${index || 0}`}
            className="text-sm font-medium text-gray-700"
          >
            Timezone
          </Label>
          <Select
            value={data.timezone}
            onValueChange={(value) => onChange({ timezone: value })}
            disabled={readOnly}
          >
            <SelectTrigger id={`session-timezone-${index || 0}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Session ID (read-only, location-level) */}
      {locationSessionId && !compact && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Session ID (Location-level)
          </Label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md font-mono text-sm text-gray-900">
            {locationSessionId}
          </div>
          <p className="text-xs text-gray-500">
            Shared across all presentations in this location
          </p>
        </div>
      )}

      {/* Passcode (read-only) */}
      {locationPasscode && !compact && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Passcode (Location-level)
          </Label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md font-mono text-sm text-gray-900">
            {locationPasscode}
          </div>
          <p className="text-xs text-gray-500">
            Shared across all presentations in this location
          </p>
        </div>
      )}

      {/* Languages */}
      {!compact && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Languages (up to 8)
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {LANGUAGES.slice(0, 8).map((lang) => (
              <div key={lang.code} className="flex items-center space-x-2">
                <Checkbox
                  id={`lang-${lang.code}-${index || 0}`}
                  checked={data.languages.includes(lang.code)}
                  onCheckedChange={() => handleLanguageToggle(lang.code)}
                  disabled={
                    readOnly ||
                    (data.languages.length >= 8 &&
                      !data.languages.includes(lang.code))
                  }
                />
                <label
                  htmlFor={`lang-${lang.code}-${index || 0}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {lang.name}
                </label>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Selected: {data.languages.length}/8 (ALS automatically detects
            languages)
          </p>
        </div>
      )}

      {/* Delete button for list context */}
      {onDelete && canDelete && !readOnly && (
        <div className="flex justify-end pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove Session
          </Button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Session List Form Props (for wizard multi-session editing per location)
// ============================================================================

interface SessionListFormProps {
  /** Array of session data */
  sessions: SessionFormData[];
  /** Callback when a session changes */
  onUpdateSession: (index: number, data: Partial<SessionFormData>) => void;
  /** Callback to add a new session */
  onAddSession: () => void;
  /** Callback to remove a session */
  onRemoveSession: (index: number) => void;
  /** Errors by session index: { "0.title": "error message" } */
  errors?: Record<string, string>;
  /** Whether the form is read-only */
  readOnly?: boolean;
  /** Location name for context */
  locationName: string;
  /** Default timezone for new sessions */
  defaultTimezone?: string;
}

/**
 * Session list form - used in wizard for managing multiple sessions per location
 */
export function SessionListForm({
  sessions,
  onUpdateSession,
  onAddSession,
  onRemoveSession,
  errors = {},
  readOnly = false,
  locationName,
}: SessionListFormProps) {
  const getSessionErrors = (index: number): Record<string, string> => {
    const sessionErrors: Record<string, string> = {};
    Object.entries(errors).forEach(([key, value]) => {
      if (key.startsWith(`${index}.`)) {
        sessionErrors[key.replace(`${index}.`, "")] = value;
      }
    });
    return sessionErrors;
  };

  return (
    <div className="space-y-4">
      {/* Location context */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <Clock className="h-4 w-4 text-primary-teal-600" />
        <span>
          Sessions for: <strong>{locationName}</strong>
        </span>
      </div>

      {/* Session cards */}
      <div className="space-y-4">
        {sessions.map((session, index) => (
          <Card key={session.id || index} className="p-4 border-gray-200">
            <div className="flex items-start gap-3">
              {/* Drag handle */}
              <div className="pt-2 text-gray-400 cursor-grab">
                <GripVertical className="h-5 w-5" />
              </div>

              {/* Session icon */}
              <div className="pt-2">
                <Clock className="h-5 w-5 text-primary-teal-600" />
              </div>

              {/* Form fields */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Session {index + 1}
                  </h4>
                  {sessions.length > 0 && !readOnly && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveSession(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <SessionForm
                  data={session}
                  onChange={(data) => onUpdateSession(index, data)}
                  errors={getSessionErrors(index)}
                  readOnly={readOnly}
                  compact={true}
                  index={index}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add session button */}
      {!readOnly && (
        <Button
          type="button"
          variant="outline"
          onClick={onAddSession}
          className="w-full border-dashed border-2 border-gray-300 hover:border-primary-teal-400 hover:bg-primary-teal-50 text-gray-600 hover:text-primary-teal-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Session
        </Button>
      )}

      {/* Empty state */}
      {sessions.length === 0 && (
        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Clock className="h-10 w-10 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No sessions added yet.</p>
          <p className="text-xs">You can add sessions now or later.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Session Card (compact read-only display)
// ============================================================================

interface SessionCardProps {
  session: SessionFormData;
  onEdit?: () => void;
  onDelete?: () => void;
}

/**
 * Session card - compact read-only display used in review step
 */
export function SessionCard({ session, onEdit, onDelete }: SessionCardProps) {
  const presenters = session.presenters
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
      <div className="flex-1 min-w-0">
        <h5 className="font-medium text-gray-900 truncate">{session.title}</h5>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            {presenters.length > 1 ? (
              <Users className="h-3 w-3" />
            ) : (
              <User className="h-3 w-3" />
            )}
            {presenters.join(", ") || "No presenters"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 ml-4">
        <div className="text-sm font-medium text-primary-teal-700 bg-primary-teal-50 px-2 py-1 rounded">
          {session.scheduledStart} - {session.endTime}
        </div>
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-8 px-2"
          >
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 h-8 px-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
