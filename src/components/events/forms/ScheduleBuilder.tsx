"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  MapPin,
  Plus,
  Trash2,
  ChevronDown,
  Clock,
  AlertCircle,
  AlertTriangle,
  Copy,
  Check,
  GripVertical,
  Calendar,
} from "lucide-react";
import {
  LocationFormData,
  SessionFormData,
  TIMEZONES,
  DEFAULT_SESSION,
  generateTempId,
  validateSchedule,
  ScheduleError,
  ScheduleWarning,
} from "./types";

// ============================================================================
// Props
// ============================================================================

interface ScheduleBuilderProps {
  /** Array of locations */
  locations: LocationFormData[];
  /** Sessions grouped by location ID */
  sessionsByLocation: Record<string, SessionFormData[]>;
  /** Event date range for validation */
  eventStartDate: string;
  eventEndDate: string;
  /** Default timezone for new sessions */
  defaultTimezone: string;
  /** Callbacks */
  onAddLocation: () => void;
  onUpdateLocation: (index: number, data: Partial<LocationFormData>) => void;
  onRemoveLocation: (index: number) => void;
  onAddSession: (locationIndex: number) => void;
  onUpdateSession: (
    locationIndex: number,
    sessionIndex: number,
    data: Partial<SessionFormData>
  ) => void;
  onRemoveSession: (locationIndex: number, sessionIndex: number) => void;
  /** Get sessions for a location */
  getSessionsForLocation: (locationIndex: number) => SessionFormData[];
  /** Whether the form is read-only */
  readOnly?: boolean;
  /** External errors */
  errors?: Record<string, string>;
}

// ============================================================================
// Helper Components
// ============================================================================

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2 py-1 text-xs font-mono bg-gray-100 hover:bg-gray-200 rounded transition-colors"
      title={`Copy ${label}`}
    >
      <span className="text-gray-700">{value}</span>
      {copied ? (
        <Check className="h-3 w-3 text-accent-green-600" />
      ) : (
        <Copy className="h-3 w-3 text-gray-400" />
      )}
    </button>
  );
}

// ============================================================================
// Session Row Component (inline editing)
// ============================================================================

interface SessionRowProps {
  session: SessionFormData;
  index: number;
  onUpdate: (data: Partial<SessionFormData>) => void;
  onRemove: () => void;
  defaultTimezone: string;
  readOnly?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  hasWarning?: boolean;
  warningMessage?: string;
}

function SessionRow({
  session,
  index,
  onUpdate,
  onRemove,
  defaultTimezone,
  readOnly = false,
  hasError = false,
  errorMessage,
  hasWarning = false,
  warningMessage,
}: SessionRowProps) {
  return (
    <div
      className={`p-4 border rounded-lg bg-white ${
        hasError
          ? "border-red-300 bg-red-50"
          : hasWarning
          ? "border-yellow-300 bg-yellow-50"
          : "border-gray-200"
      }`}
    >
      {/* Error/Warning message */}
      {(hasError || hasWarning) && (
        <div
          className={`flex items-center gap-2 mb-3 text-sm ${
            hasError ? "text-red-600" : "text-yellow-700"
          }`}
        >
          {hasError ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <span>{errorMessage || warningMessage}</span>
        </div>
      )}

      {/* Two-row layout for better UX */}
      <div className="space-y-3">
        {/* Row 1: Title & Presenters */}
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-primary-teal-100 text-primary-teal-700 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-6">
            {index + 1}
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">
                Title *
              </Label>
              <Input
                value={session.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="Session title"
                disabled={readOnly}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">
                Presenters
              </Label>
              <Input
                value={session.presenters}
                onChange={(e) => onUpdate({ presenters: e.target.value })}
                placeholder="Comma-separated names"
                disabled={readOnly}
                className="h-9"
              />
            </div>
          </div>
          {!readOnly && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="h-9 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0 mt-5"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Row 2: Date & Time */}
        <div className="flex items-start gap-3 pl-10">
          <div className="flex-1 grid grid-cols-4 gap-3">
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Date</Label>
              <Input
                type="date"
                value={session.scheduledDate}
                onChange={(e) => onUpdate({ scheduledDate: e.target.value })}
                disabled={readOnly}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">
                Start Time
              </Label>
              <Input
                type="time"
                value={session.scheduledStart}
                onChange={(e) => onUpdate({ scheduledStart: e.target.value })}
                disabled={readOnly}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">
                End Time
              </Label>
              <Input
                type="time"
                value={session.endTime}
                onChange={(e) => onUpdate({ endTime: e.target.value })}
                disabled={readOnly}
                className="h-9"
              />
            </div>
            <div className="flex items-end">
              <span className="text-xs text-gray-400 mb-2">
                {session.scheduledStart && session.endTime && (
                  <>
                    {(() => {
                      const startMinutes =
                        parseInt(session.scheduledStart.split(":")[0]) * 60 +
                        parseInt(session.scheduledStart.split(":")[1]);
                      const endMinutes =
                        parseInt(session.endTime.split(":")[0]) * 60 +
                        parseInt(session.endTime.split(":")[1]);
                      const duration = endMinutes - startMinutes;
                      if (duration > 0) {
                        const hours = Math.floor(duration / 60);
                        const mins = duration % 60;
                        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
                      }
                      return "";
                    })()}
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Location Card Component
// ============================================================================

interface LocationCardProps {
  location: LocationFormData;
  index: number;
  sessions: SessionFormData[];
  onUpdateLocation: (data: Partial<LocationFormData>) => void;
  onRemoveLocation: () => void;
  onAddSession: () => void;
  onUpdateSession: (
    sessionIndex: number,
    data: Partial<SessionFormData>
  ) => void;
  onRemoveSession: (sessionIndex: number) => void;
  defaultTimezone: string;
  eventStartDate: string;
  eventEndDate: string;
  readOnly?: boolean;
  canDelete?: boolean;
  errors?: Record<string, string>;
  defaultExpanded?: boolean;
}

function LocationCard({
  location,
  index,
  sessions,
  onUpdateLocation,
  onRemoveLocation,
  onAddSession,
  onUpdateSession,
  onRemoveSession,
  defaultTimezone,
  eventStartDate,
  eventEndDate,
  readOnly = false,
  canDelete = true,
  errors = {},
  defaultExpanded = true,
}: LocationCardProps) {
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  const [isEditingName, setIsEditingName] = useState(!location.name);

  // Sort sessions by date and start time
  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
      const dateCompare = a.scheduledDate.localeCompare(b.scheduledDate);
      if (dateCompare !== 0) return dateCompare;
      return a.scheduledStart.localeCompare(b.scheduledStart);
    });
  }, [sessions]);

  // Validate sessions for this location
  const validation = useMemo(() => {
    return validateSchedule(sessions, eventStartDate, eventEndDate);
  }, [sessions, eventStartDate, eventEndDate]);

  const hasErrors = validation.errors.length > 0;
  const hasWarnings = validation.warnings.length > 0;

  return (
    <Card
      className={`overflow-hidden transition-all ${
        hasErrors
          ? "border-red-300"
          : hasWarnings
          ? "border-yellow-300"
          : isOpen
          ? "border-primary-teal-300 shadow-md"
          : "border-gray-200"
      }`}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full" asChild>
          <div className="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              {/* Expand/Collapse Icon */}
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  isOpen ? "rotate-0" : "-rotate-90"
                }`}
              />

              {/* Location Icon */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  hasErrors
                    ? "bg-red-100"
                    : hasWarnings
                    ? "bg-yellow-100"
                    : "bg-primary-teal-100"
                }`}
              >
                <MapPin
                  className={`h-5 w-5 ${
                    hasErrors
                      ? "text-red-600"
                      : hasWarnings
                      ? "text-yellow-600"
                      : "text-primary-teal-600"
                  }`}
                />
              </div>

              {/* Location Info */}
              <div className="flex-1 min-w-0">
                {isEditingName && isOpen ? (
                  <Input
                    value={location.name}
                    onChange={(e) => onUpdateLocation({ name: e.target.value })}
                    onBlur={() => {
                      if (location.name.trim()) setIsEditingName(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && location.name.trim()) {
                        setIsEditingName(false);
                      }
                    }}
                    placeholder="Enter location name"
                    autoFocus
                    className="h-8 max-w-xs"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <h3
                    className="font-semibold text-gray-900 truncate"
                    onClick={(e) => {
                      if (!readOnly) {
                        e.stopPropagation();
                        setIsEditingName(true);
                        setIsOpen(true);
                      }
                    }}
                  >
                    {location.name || `Location ${index + 1}`}
                  </h3>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">
                    {sessions.length}{" "}
                    {sessions.length === 1 ? "session" : "sessions"}
                  </span>
                  {hasErrors && (
                    <Badge variant="destructive" className="text-xs">
                      {validation.errors.length} error
                      {validation.errors.length > 1 ? "s" : ""}
                    </Badge>
                  )}
                  {hasWarnings && !hasErrors && (
                    <Badge
                      variant="outline"
                      className="text-xs border-yellow-500 text-yellow-700"
                    >
                      {validation.warnings.length} warning
                      {validation.warnings.length > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Credentials */}
              <div
                className="flex items-center gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                {location.locationSessionId && (
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">
                      Session ID
                    </span>
                    <CopyButton
                      value={location.locationSessionId}
                      label="Session ID"
                    />
                  </div>
                )}
                {location.passcode && (
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">
                      Passcode
                    </span>
                    <CopyButton value={location.passcode} label="Passcode" />
                  </div>
                )}
              </div>

              {/* Actions */}
              {!readOnly && canDelete && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveLocation();
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4">
            {/* Divider */}
            <div className="h-px bg-gray-200" />

            {/* Location Description */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Description (optional)
              </Label>
              <Textarea
                value={location.description || ""}
                onChange={(e) =>
                  onUpdateLocation({ description: e.target.value })
                }
                placeholder="Brief description of this location"
                disabled={readOnly}
                rows={2}
                className="resize-none"
              />
            </div>

            {/* Sessions Header */}
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary-teal-600" />
                Sessions
              </h4>
              {!readOnly && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onAddSession}
                  className="text-primary-teal-600 border-primary-teal-600 hover:bg-primary-teal-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Session
                </Button>
              )}
            </div>

            {/* Sessions List */}
            {sortedSessions.length > 0 ? (
              <div className="space-y-3">
                {sortedSessions.map((session, sessionIndex) => {
                  const originalIndex = sessions.findIndex(
                    (s) => s.id === session.id
                  );
                  const sessionError = validation.errors.find(
                    (e) => e.sessionIndex === originalIndex
                  );
                  const sessionWarning = validation.warnings.find(
                    (w) => w.sessionIndex === originalIndex
                  );

                  return (
                    <SessionRow
                      key={session.id || sessionIndex}
                      session={session}
                      index={sessionIndex}
                      onUpdate={(data) => onUpdateSession(originalIndex, data)}
                      onRemove={() => onRemoveSession(originalIndex)}
                      defaultTimezone={defaultTimezone}
                      readOnly={readOnly}
                      hasError={!!sessionError}
                      errorMessage={sessionError?.message}
                      hasWarning={!!sessionWarning}
                      warningMessage={sessionWarning?.message}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-500">No sessions yet</p>
                <p className="text-xs text-gray-400">
                  Click "Add Session" to create one
                </p>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

// ============================================================================
// Main ScheduleBuilder Component
// ============================================================================

export function ScheduleBuilder({
  locations,
  sessionsByLocation,
  eventStartDate,
  eventEndDate,
  defaultTimezone,
  onAddLocation,
  onUpdateLocation,
  onRemoveLocation,
  onAddSession,
  onUpdateSession,
  onRemoveSession,
  getSessionsForLocation,
  readOnly = false,
  errors = {},
}: ScheduleBuilderProps) {
  return (
    <div className="space-y-4">
      {/* Info text */}
      <div className="p-4 bg-primary-teal-50 border border-primary-teal-200 rounded-lg">
        <p className="text-sm text-primary-teal-800">
          <strong>Build your schedule:</strong> Add locations where
          presentations will take place, then add sessions to each location.
          Sessions will be automatically ordered by time.
        </p>
      </div>

      {/* Global error */}
      {errors.locations && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          {errors.locations}
        </div>
      )}

      {/* Location Cards */}
      <div className="space-y-4">
        {locations.map((location, index) => {
          const sessions = getSessionsForLocation(index);
          return (
            <LocationCard
              key={location.id || index}
              location={location}
              index={index}
              sessions={sessions}
              onUpdateLocation={(data) => onUpdateLocation(index, data)}
              onRemoveLocation={() => onRemoveLocation(index)}
              onAddSession={() => onAddSession(index)}
              onUpdateSession={(sessionIndex, data) =>
                onUpdateSession(index, sessionIndex, data)
              }
              onRemoveSession={(sessionIndex) =>
                onRemoveSession(index, sessionIndex)
              }
              defaultTimezone={defaultTimezone}
              eventStartDate={eventStartDate}
              eventEndDate={eventEndDate}
              readOnly={readOnly}
              canDelete={locations.length > 1}
              errors={errors}
              defaultExpanded={index === locations.length - 1}
            />
          );
        })}
      </div>

      {/* Add Location Button */}
      {!readOnly && (
        <Button
          type="button"
          variant="outline"
          onClick={onAddLocation}
          className="w-full border-dashed border-2 border-gray-300 hover:border-primary-teal-400 hover:bg-primary-teal-50 text-gray-600 hover:text-primary-teal-700 py-6"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Location
        </Button>
      )}

      {/* Empty State */}
      {locations.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No locations added yet</p>
          <p className="text-sm mt-1">Add at least one location to continue</p>
        </div>
      )}
    </div>
  );
}
