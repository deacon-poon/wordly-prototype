"use client";

import React, { useState, useRef, useEffect } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DatePicker,
  TimeInput,
  TimezoneSelector,
  getTimezoneAbbr,
} from "@/components/ui/datetime-picker";
import {
  Clock,
  Trash2,
  Plus,
  GripVertical,
  User,
  Users,
  ChevronRight,
  Settings2,
  Info,
  X,
  MapPin,
  FileText,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  SessionFormData,
  FormMode,
  LANGUAGES,
  GLOSSARIES,
  TRANSCRIPT_SETTINGS,
  VOICE_PACKS,
  POOL_OF_MINUTES,
  NON_AUTO_SELECT_LANGUAGES,
} from "./types";
import { cn } from "@/lib/utils";

// ============================================================================
// Single Session Form Props
// ============================================================================

/** Room option for dropdown */
interface RoomOption {
  id: string;
  name: string;
}

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
  /** Whether session is active (in progress) - only end time is editable */
  activeSessionMode?: boolean;
  /** Whether to show the full form or a compact version */
  compact?: boolean;
  /** Session index (for display purposes) */
  index?: number;
  /** Callback when delete is requested */
  onDelete?: () => void;
  /** Whether delete is allowed */
  canDelete?: boolean;
  /** Room name (for context display) - used when rooms not provided */
  roomName?: string;
  /** Available rooms for dropdown */
  rooms?: RoomOption[];
  /** Currently selected room ID */
  selectedRoomId?: string;
  /** Callback when room is changed */
  onRoomChange?: (roomId: string) => void;
  /** Callback to add a new room */
  onAddRoom?: () => void;
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
  activeSessionMode = false,
  compact = false,
  index,
  onDelete,
  canDelete = true,
  roomName,
  rooms,
  selectedRoomId,
  onRoomChange,
  onAddRoom,
}: SessionFormProps) {
  // In active session mode, all fields except end time are disabled
  const isFieldDisabled = readOnly || activeSessionMode;
  const [showAdvanced, setShowAdvanced] = useState(false);
  const advancedSectionRef = useRef<HTMLDivElement>(null);

  const handleLanguageToggle = (code: string) => {
    if (isFieldDisabled) return;
    const selected = data.languages.includes(code)
      ? data.languages.filter((l) => l !== code)
      : [...data.languages, code];
    // Limit to 8 languages (ALS limit)
    onChange({ languages: selected.slice(0, 8) });
  };

  // Scroll to advanced settings when expanded
  useEffect(() => {
    if (showAdvanced && advancedSectionRef.current) {
      // Small delay to allow animation to start
      setTimeout(() => {
        advancedSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 50);
    }
  }, [showAdvanced]);

  // Helper to add 1 hour to a time string (HH:MM format)
  const addOneHour = (time: string): string => {
    const [hours, minutes] = time.split(":").map(Number);
    const newHours = (hours + 1) % 24;
    return `${newHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  // Handle start time change - also update end time to start + 1 hour
  const handleStartTimeChange = (newStartTime: string) => {
    const updates: Partial<typeof data> = { scheduledStart: newStartTime };

    // Auto-set end time to start time + 1 hour
    if (newStartTime) {
      updates.endTime = addOneHour(newStartTime);
    }

    onChange(updates);
  };

  return (
    <div className="space-y-6">
      {/* ─── Session Details Section ─────────────────────────────────── */}
      <div>
        <h4 className="text-xs font-semibold text-primary-teal-600 uppercase tracking-wide mb-4 flex items-center gap-2">
          <FileText className="h-3.5 w-3.5" />
          Session Details
        </h4>

        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label
              htmlFor={`session-title-${index || 0}`}
              className="text-sm font-medium text-gray-700"
            >
              Title *
            </Label>
            <Input
              id={`session-title-${index || 0}`}
              value={data.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="e.g., Opening Keynote, Workshop: Advanced Topics"
              disabled={isFieldDisabled}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* Room - editable dropdown if rooms provided, read-only otherwise */}
          {(rooms && rooms.length > 0) ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Room</Label>
              <Select
                value={selectedRoomId}
                onValueChange={(value) => {
                  if (value === "__add_new__" && onAddRoom) {
                    onAddRoom();
                  } else if (onRoomChange) {
                    onRoomChange(value);
                  }
                }}
                disabled={isFieldDisabled}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Select room" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((rm) => (
                    <SelectItem key={rm.id} value={rm.id}>
                      {rm.name}
                    </SelectItem>
                  ))}
                  {onAddRoom && (
                    <>
                      <div className="border-t my-1" />
                      <SelectItem value="__add_new__" className="text-primary-teal-600">
                        <span className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Add New Room
                        </span>
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          ) : roomName ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Room</Label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                {roomName}
              </div>
            </div>
          ) : null}

          {/* Presenters */}
          <div className="space-y-2">
            <Label
              htmlFor={`session-presenters-${index || 0}`}
              className="text-sm font-medium text-gray-700"
            >
              Presenters *
            </Label>
            <Input
              id={`session-presenters-${index || 0}`}
              value={data.presenters}
              onChange={(e) => onChange({ presenters: e.target.value })}
              placeholder="Enter names separated by commas"
              disabled={isFieldDisabled}
              className={errors.presenters ? "border-red-500" : ""}
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple presenters with commas
            </p>
            {errors.presenters && (
              <p className="text-sm text-red-500">{errors.presenters}</p>
            )}
          </div>

          {/* Glossary */}
          <div className="space-y-2">
            <Label
              htmlFor={`session-glossary-${index || 0}`}
              className="text-sm font-medium text-gray-700"
            >
              Glossary
            </Label>
            <Select
              value={data.glossaryId}
              onValueChange={(value) => onChange({ glossaryId: value })}
              disabled={isFieldDisabled}
            >
              <SelectTrigger id={`session-glossary-${index || 0}`}>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                {GLOSSARIES.map((glossary) => (
                  <SelectItem key={glossary.id} value={glossary.id}>
                    {glossary.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ─── Schedule Section ────────────────────────────────────────── */}
      <div>
        <h4 className="text-xs font-semibold text-primary-teal-600 uppercase tracking-wide mb-4 flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5" />
          Schedule
        </h4>

        <div className="space-y-4">
          {/* Date Picker */}
          <DatePicker
            value={data.scheduledDate}
            onChange={(date) => onChange({ scheduledDate: date })}
            disabled={isFieldDisabled}
            label="Date *"
            error={errors.scheduledDate}
          />

          {/* Start Time & End Time with Timezone */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Time *</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TimeInput
                  value={data.scheduledStart}
                  onChange={(time) => handleStartTimeChange(time)}
                  disabled={isFieldDisabled}
                  error={errors.scheduledStart}
                />
              </div>
              <span className="text-gray-400 font-medium">–</span>
              <div className="flex-1">
                <TimeInput
                  value={data.endTime}
                  onChange={(time) => onChange({ endTime: time })}
                  disabled={readOnly}
                  error={errors.endTime}
                />
              </div>
              {/* Timezone selector - compact inline version */}
              <TimezoneSelector
                value={data.timezone}
                onChange={(timezone) => onChange({ timezone })}
                disabled={isFieldDisabled}
                compact
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Advanced Settings Accordion ────────────────────────────────── */}
      {!compact && (
        <TooltipProvider>
          <div
            className={cn(
              "rounded-lg border overflow-hidden transition-all duration-200",
              showAdvanced ? "border-gray-300 bg-white" : "border-gray-200"
            )}
          >
            {/* Accordion Header */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 transition-colors",
                showAdvanced
                  ? "bg-gray-50 border-b border-gray-200"
                  : "bg-white hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-1.5 rounded-md transition-colors",
                  showAdvanced ? "bg-primary-teal-100" : "bg-gray-100"
                )}>
                  <Settings2 className={cn(
                    "h-4 w-4 transition-colors",
                    showAdvanced ? "text-primary-teal-600" : "text-muted-foreground"
                  )} />
                </div>
                <div className="text-left">
                  <span className="text-sm font-medium text-gray-900">
                    Advanced Settings
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Transcript, voice, speakers&apos; language
                  </p>
                </div>
              </div>
              <ChevronRight
                className={cn(
                  "h-5 w-5 text-gray-400 transition-transform duration-200",
                  showAdvanced && "rotate-90"
                )}
              />
            </button>

            {/* Accordion Content */}
            <div
              ref={advancedSectionRef}
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                showAdvanced ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="p-4 space-y-6 bg-white">
                {/* Info text with link */}
                <p className="text-sm text-muted-foreground">
                  You can{" "}
                  <button
                    type="button"
                    className="text-primary-teal-600 hover:text-primary-teal-700 underline underline-offset-2"
                  >
                    change these defaults
                  </button>{" "}
                  in the workspace settings.
                </p>

                {/* ─── Pool of Minutes ──────────────────────────────────── */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Label className="text-sm font-medium text-gray-700">
                      Pool of minutes
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">
                          Select the account pool to use for this session&apos;s translation minutes.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select
                    value={data.accountId}
                    onValueChange={(value) => onChange({ accountId: value })}
                    disabled={isFieldDisabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account pool" />
                    </SelectTrigger>
                    <SelectContent>
                      {POOL_OF_MINUTES.map((pool) => (
                        <SelectItem key={pool.id} value={pool.id}>
                          {pool.name} ({pool.accountCode}) - {pool.minutesRemaining} minutes remaining
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* ─── Save Transcript ──────────────────────────────────── */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Label className="text-sm font-medium text-gray-700">
                      Save Transcript
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">
                          Choose how session transcripts are saved and shared.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select
                    value={data.transcriptSetting}
                    onValueChange={(value: "save-workspace" | "save-attendees" | "none") =>
                      onChange({ transcriptSetting: value })
                    }
                    disabled={isFieldDisabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transcript setting" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSCRIPT_SETTINGS.map((setting) => (
                        <SelectItem key={setting.value} value={setting.value}>
                          {setting.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* ─── Floor Audio ──────────────────────────────────────── */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor={`session-floor-audio-${index || 0}`}
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      Floor audio
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">
                          Enable floor audio to capture ambient sound in the
                          room. Useful for Q&A sessions or audience participation.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Checkbox
                    id={`session-floor-audio-${index || 0}`}
                    checked={data.floorAudio}
                    onCheckedChange={(checked) =>
                      onChange({ floorAudio: checked === true })
                    }
                    disabled={isFieldDisabled}
                  />
                </div>

                {/* ─── Voice Pack ───────────────────────────────────────── */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Label className="text-sm font-medium text-gray-700">
                      Voice pack
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">
                          Choose the voice type for text-to-speech output.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select
                    value={data.voicePack}
                    onValueChange={(value) => onChange({ voicePack: value })}
                    disabled={isFieldDisabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select voice pack" />
                    </SelectTrigger>
                    <SelectContent>
                      {VOICE_PACKS.map((pack) => (
                        <SelectItem key={pack.id} value={pack.id}>
                          {pack.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* ─── Speakers' Language ───────────────────────────────── */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Label className="text-sm font-medium text-gray-700">
                      Speakers&apos; language
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">
                          Select the languages that will be spoken by presenters during the session.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Language tags */}
                  <div className="flex flex-col gap-2">
                    {data.languages.map((langCode) => {
                      const lang = LANGUAGES.find((l) => l.code === langCode);
                      const isNonAutoSelect = NON_AUTO_SELECT_LANGUAGES.includes(
                        langCode as (typeof NON_AUTO_SELECT_LANGUAGES)[number]
                      );
                      return (
                        <div
                          key={langCode}
                          className={cn(
                            "inline-flex items-center justify-between px-3 py-2 rounded-md border text-sm",
                            isNonAutoSelect
                              ? "bg-amber-50 border-amber-200 text-amber-900"
                              : "bg-primary-teal-50 border-primary-teal-200 text-primary-teal-900"
                          )}
                        >
                          <span className="flex items-center gap-2">
                            {isNonAutoSelect && (
                              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                            )}
                            {lang?.name || langCode}
                          </span>
                          {!isFieldDisabled && (
                            <button
                              type="button"
                              onClick={() => handleLanguageToggle(langCode)}
                              className="ml-2 text-gray-400 hover:text-gray-600 p-0.5"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {/* +Add another language */}
                    {!isFieldDisabled && data.languages.length < 8 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="text-sm text-primary-teal-600 hover:text-primary-teal-700 text-left"
                          >
                            +Add another language
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-2" align="start">
                          <div className="max-h-48 overflow-y-auto space-y-0.5">
                            {LANGUAGES.filter(
                              (l) => !data.languages.includes(l.code)
                            ).map((lang) => (
                              <button
                                key={lang.code}
                                type="button"
                                onClick={() => handleLanguageToggle(lang.code)}
                                className="w-full text-left px-3 py-1.5 text-sm text-gray-700 rounded hover:bg-gray-100 transition-colors"
                              >
                                {lang.name}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>

                  {/* Helper text */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Any supported languages can be manually selected by speakers during the event. These settings enable quick selection. Add only languages that you know will be spoken.
                  </p>

                  {/* Warning banner for non-auto-select languages */}
                  {data.languages.some((code) =>
                    NON_AUTO_SELECT_LANGUAGES.includes(
                      code as (typeof NON_AUTO_SELECT_LANGUAGES)[number]
                    )
                  ) && (
                    <div className="flex gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800">
                        One or more languages does not support auto-selection. (Automatic language selection will be disabled.)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TooltipProvider>
      )}

      {/* Delete button for list context */}
      {onDelete && canDelete && !isFieldDisabled && (
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
// Session List Form Props (for wizard multi-session editing per room)
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
  /** Room name for context */
  roomName: string;
  /** Default timezone for new sessions */
  defaultTimezone?: string;
}

/**
 * Session list form - used in wizard for managing multiple sessions per room
 */
export function SessionListForm({
  sessions,
  onUpdateSession,
  onAddSession,
  onRemoveSession,
  errors = {},
  readOnly = false,
  roomName,
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
      {/* Room context */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Clock className="h-4 w-4 text-primary-teal-600" />
        <span>
          Sessions for: <strong>{roomName}</strong>
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
          className="w-full border-dashed border-2 border-gray-300 hover:border-primary-blue-400 hover:bg-primary-blue-50 text-muted-foreground hover:text-primary-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Session
        </Button>
      )}

      {/* Empty state */}
      {sessions.length === 0 && (
        <div className="text-center py-6 text-muted-foreground bg-gray-50 rounded-lg border border-dashed border-gray-300">
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
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
        <div className="flex items-center gap-1.5 text-sm font-medium text-primary-blue-800 bg-primary-blue-50 px-2 py-1 rounded">
          <span>
            {session.scheduledStart} – {session.endTime}
          </span>
          <span className="text-xs text-primary-teal-600">
            {getTimezoneAbbr(session.timezone)}
          </span>
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
