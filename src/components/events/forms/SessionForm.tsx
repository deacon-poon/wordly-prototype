"use client";

import React, { useState } from "react";
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
  DatePicker,
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
  ChevronDown,
  Settings2,
  Info,
  Sparkles,
  X,
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
  ACCOUNTS,
  GLOSSARIES,
  TRANSCRIPT_SETTINGS,
  ACCESS_TYPES,
  VOICE_PACKS,
  getLanguageName,
} from "./types";
import { cn } from "@/lib/utils";

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
}: SessionFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

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

      {/* Date & Time with Timezone */}
      <div className="space-y-4">
        {/* Date Picker */}
        <DatePicker
          value={data.scheduledDate}
          onChange={(date) => onChange({ scheduledDate: date })}
          disabled={readOnly}
          label="Date *"
          error={errors.scheduledDate}
        />

        {/* Start Time & End Time with Timezone */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-900">Time *</Label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id={`session-start-${index || 0}`}
                  type="time"
                  value={data.scheduledStart}
                  onChange={(e) => onChange({ scheduledStart: e.target.value })}
                  disabled={readOnly}
                  className={cn(
                    "pl-10",
                    errors.scheduledStart && "border-red-500"
                  )}
                />
              </div>
            </div>
            <span className="text-gray-400 font-medium">–</span>
            <div className="flex-1">
              <Input
                id={`session-end-${index || 0}`}
                type="time"
                value={data.endTime}
                onChange={(e) => onChange({ endTime: e.target.value })}
                disabled={readOnly}
                className={errors.endTime ? "border-red-500" : ""}
              />
            </div>
            {/* Timezone badge */}
            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-2 rounded-md whitespace-nowrap">
              {getTimezoneAbbr(data.timezone)}
            </span>
          </div>
          {(errors.scheduledStart || errors.endTime) && (
            <p className="text-sm text-red-500">
              {errors.scheduledStart || errors.endTime}
            </p>
          )}
        </div>

        {/* Timezone Selector - inline */}
        <TimezoneSelector
          value={data.timezone}
          onChange={(timezone) => onChange({ timezone })}
          disabled={readOnly}
          showLabel
        />
      </div>

      {/* Advanced Settings Toggle */}
      {!compact && (
        <TooltipProvider>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors py-2"
          >
            <Settings2 className="h-4 w-4" />
            <span>{showAdvanced ? "Hide" : "Show"} advanced settings</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                showAdvanced && "rotate-180"
              )}
            />
          </button>

          {/* Advanced Settings Content */}
          {showAdvanced && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 italic mb-5">
                These settings inherit from your Session Defaults. Override only
                if needed for this specific session.
              </p>

              {/* Account */}
              <div className="space-y-2 mb-4">
                <Label
                  htmlFor={`session-account-${index || 0}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Account
                </Label>
                <Select
                  value={data.accountId}
                  onValueChange={(value) => onChange({ accountId: value })}
                  disabled={readOnly}
                >
                  <SelectTrigger id={`session-account-${index || 0}`}>
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
              </div>

              {/* ─── Language & Translation ─────────────────────────────── */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-primary-teal-600 uppercase tracking-wide mb-4">
                  Language & Translation
                </h4>

                <div className="space-y-4">
                  {/* Starting Language */}
                  <div className="space-y-2">
                    <Label
                      htmlFor={`session-starting-lang-${index || 0}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      Language
                    </Label>
                    <Select
                      value={data.startingLanguage}
                      onValueChange={(value) =>
                        onChange({ startingLanguage: value })
                      }
                      disabled={readOnly}
                    >
                      <SelectTrigger id={`session-starting-lang-${index || 0}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            <span className="flex items-center gap-2">
                              <Sparkles className="h-3 w-3 text-primary-teal-500" />
                              {lang.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Auto Select */}
                  <div className="space-y-2">
                    <Label
                      htmlFor={`session-autoselect-${index || 0}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      Auto Select
                    </Label>
                    <Select
                      value={data.autoSelect ? "enabled" : "disabled"}
                      onValueChange={(value) =>
                        onChange({ autoSelect: value === "enabled" })
                      }
                      disabled={readOnly}
                    >
                      <SelectTrigger id={`session-autoselect-${index || 0}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selections (Output Languages) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Selections
                    </Label>
                    <div className="p-3 border border-gray-200 rounded-lg bg-white min-h-[42px]">
                      <div className="flex flex-wrap gap-2">
                        {data.languages.map((langCode) => {
                          const lang = LANGUAGES.find(
                            (l) => l.code === langCode
                          );
                          return (
                            <span
                              key={langCode}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:border-gray-400 transition-colors"
                            >
                              <Sparkles className="h-3 w-3 text-primary-teal-500" />
                              {lang?.name || langCode}
                              {!readOnly && (
                                <button
                                  type="button"
                                  onClick={() => handleLanguageToggle(langCode)}
                                  className="ml-0.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              )}
                            </span>
                          );
                        })}
                        {data.languages.length === 0 && (
                          <span className="text-sm text-gray-400 italic">
                            No languages selected
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Add language dropdown */}
                    {!readOnly && data.languages.length < 8 && (
                      <Select
                        value={undefined}
                        onValueChange={(value) => {
                          if (value && !data.languages.includes(value)) {
                            handleLanguageToggle(value);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Add language..." />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGES.filter(
                            (l) => !data.languages.includes(l.code)
                          ).map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              <span className="flex items-center gap-2">
                                <Sparkles className="h-3 w-3 text-primary-teal-500" />
                                {lang.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      disabled={readOnly}
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

              {/* ─── Output Settings ────────────────────────────────────── */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-primary-teal-600 uppercase tracking-wide mb-4">
                  Output Settings
                </h4>

                <div className="space-y-4">
                  {/* Transcript */}
                  <div className="space-y-2">
                    <Label
                      htmlFor={`session-transcript-${index || 0}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      Transcript
                    </Label>
                    <Select
                      value={data.transcriptSetting}
                      onValueChange={(
                        value: "save" | "save-workspace" | "none"
                      ) => onChange({ transcriptSetting: value })}
                      disabled={readOnly}
                    >
                      <SelectTrigger id={`session-transcript-${index || 0}`}>
                        <SelectValue />
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

                  {/* Voice Pack */}
                  <div className="space-y-2">
                    <Label
                      htmlFor={`session-voice-pack-${index || 0}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      Voice Pack
                    </Label>
                    <Select
                      value={data.voicePack}
                      onValueChange={(value) => onChange({ voicePack: value })}
                      disabled={readOnly}
                    >
                      <SelectTrigger id={`session-voice-pack-${index || 0}`}>
                        <SelectValue />
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
                </div>
              </div>

              {/* ─── Access & Audio ─────────────────────────────────────── */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-primary-teal-600 uppercase tracking-wide mb-4">
                  Access & Audio
                </h4>

                <div className="space-y-4">
                  {/* Access */}
                  <div className="space-y-2">
                    <Label
                      htmlFor={`session-access-${index || 0}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      Access
                    </Label>
                    <Select
                      value={data.accessType}
                      onValueChange={(value: "open" | "passcode") =>
                        onChange({ accessType: value })
                      }
                      disabled={readOnly}
                    >
                      <SelectTrigger id={`session-access-${index || 0}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACCESS_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Floor Audio */}
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
                            room. Useful for Q&A sessions or audience
                            participation.
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
                      disabled={readOnly}
                    />
                  </div>
                </div>
              </div>

              {/* Label - standalone at the end */}
              <div className="space-y-2">
                <Label
                  htmlFor={`session-label-${index || 0}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Label
                </Label>
                <Input
                  id={`session-label-${index || 0}`}
                  value={data.label}
                  onChange={(e) => onChange({ label: e.target.value })}
                  placeholder="Optional label for this session"
                  disabled={readOnly}
                />
              </div>
            </div>
          )}
        </TooltipProvider>
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
        <div className="flex items-center gap-1.5 text-sm font-medium text-primary-teal-700 bg-primary-teal-50 px-2 py-1 rounded">
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
