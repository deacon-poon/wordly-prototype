/**
 * Shared types for Event forms
 * These types are used across all event-related forms for consistency
 */

// ============================================================================
// Core Data Types
// ============================================================================

export interface Session {
  id: string;
  title: string;
  presenters: string[];
  scheduledDate: string;
  scheduledStart: string;
  endTime: string;
  timezone: string;
  status: "pending" | "active" | "completed" | "skipped";
  // Future: eventId, locationId, previousSessionId, nextSessionId, chainStatus
}

export interface Location {
  id: string;
  name: string;
  locationSessionId: string;
  passcode: string;
  mobileId?: string;
  sessions: Session[];
}

export interface EventDefaults {
  glossaryId: string;
  accountId: string;
  accessType: "open" | "passcode";
  publishTranscripts: boolean;
  startingLanguage: string;
  otherLanguages: string[];
  customFields: Record<string, string>;
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  timezone: string;
  defaults: EventDefaults;
  locations: Location[];
  createdAt?: Date;
  updatedAt?: Date;
}

// ============================================================================
// Form Data Types (for form state, slightly different from persisted data)
// ============================================================================

/**
 * Event details form data - simplified per Dec 31 design sync.
 * Event-level defaults have been eliminated; sessions inherit from account-level session defaults.
 */
export interface EventDetailsFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface LocationFormData {
  id?: string; // Present when editing, absent when creating
  name: string;
  // Auto-generated credentials (displayed after creation, placeholders before)
  locationSessionId?: string;
  passcode?: string;
  mobileId?: string;
}

export interface SessionFormData {
  id?: string; // Present when editing, absent when creating
  title: string;
  presenters: string; // Comma-separated string for form input
  scheduledDate: string;
  scheduledStart: string;
  endTime: string;
  timezone: string;
  // Advanced settings (inherit from Session Defaults)
  accountId: string;
  startingLanguage: string; // Primary presenter language
  autoSelect: boolean; // ALS auto-detect
  languages: string[]; // Selected output languages
  glossaryId: string;
  transcriptSetting: "save" | "save-workspace" | "none";
  accessType: "open" | "passcode";
  floorAudio: boolean;
  voicePack: string;
  label: string;
}

// ============================================================================
// Form Mode & Context Types
// ============================================================================

export type FormMode = "create" | "edit";

export type WizardStep = "details" | "schedule" | "review";

export interface EventFormState {
  mode: FormMode;
  currentStep: WizardStep;
  eventDetails: EventDetailsFormData;
  locations: LocationFormData[];
  sessionsByLocation: Record<string, SessionFormData[]>; // locationId/tempId -> sessions
  isSubmitting: boolean;
  errors: Record<string, string>;
}

// ============================================================================
// Default Values
// ============================================================================

export const DEFAULT_EVENT_DETAILS: EventDetailsFormData = {
  name: "",
  description: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
};

export const DEFAULT_LOCATION: LocationFormData = {
  name: "",
  locationSessionId: undefined,
  passcode: undefined,
  mobileId: undefined,
};

export const DEFAULT_SESSION: SessionFormData = {
  title: "",
  presenters: "",
  scheduledDate: new Date().toISOString().split("T")[0],
  scheduledStart: "09:00",
  endTime: "10:00",
  timezone: "America/Los_Angeles",
  // Advanced settings - inherit from Session Defaults
  accountId: "",
  startingLanguage: "en-US",
  autoSelect: true,
  languages: ["en-US"],
  glossaryId: "",
  transcriptSetting: "save-workspace",
  accessType: "open",
  floorAudio: false,
  voicePack: "feminine",
  label: "",
};

// ============================================================================
// Shared Constants
// ============================================================================

export const LANGUAGES = [
  { code: "en-US", name: "English (US)" },
  { code: "es", name: "Spanish (ES)" },
  { code: "es-LatAm", name: "Spanish (LatAm)" },
  { code: "fr", name: "French (FR)" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "zh-TW", name: "Chinese (Traditional)" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
  { code: "nl", name: "Dutch" },
  { code: "cy", name: "Welsh - Cymraeg" },
  { code: "hi", name: "Hindi" },
  { code: "tr", name: "Turkish" },
  { code: "pl", name: "Polish" },
  { code: "sv", name: "Swedish" },
  { code: "no", name: "Norwegian" },
] as const;

export const TIMEZONES = [
  { value: "America/New_York", label: "America/New_York (EST/EDT)" },
  { value: "America/Chicago", label: "America/Chicago (CST/CDT)" },
  { value: "America/Denver", label: "America/Denver (MST/MDT)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (PST/PDT)" },
  { value: "America/Anchorage", label: "America/Anchorage (AKST/AKDT)" },
  { value: "Pacific/Honolulu", label: "Pacific/Honolulu (HST)" },
  { value: "Europe/London", label: "Europe/London (GMT/BST)" },
  { value: "Europe/Paris", label: "Europe/Paris (CET/CEST)" },
  { value: "Europe/Berlin", label: "Europe/Berlin (CET/CEST)" },
  { value: "Europe/Madrid", label: "Europe/Madrid (CET/CEST)" },
  { value: "Europe/Rome", label: "Europe/Rome (CET/CEST)" },
  { value: "Europe/Amsterdam", label: "Europe/Amsterdam (CET/CEST)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Asia/Shanghai (CST)" },
  { value: "Asia/Hong_Kong", label: "Asia/Hong_Kong (HKT)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (SGT)" },
  { value: "Asia/Dubai", label: "Asia/Dubai (GST)" },
  { value: "Australia/Sydney", label: "Australia/Sydney (AEDT/AEST)" },
  { value: "Australia/Melbourne", label: "Australia/Melbourne (AEDT/AEST)" },
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
] as const;

// Mock accounts (in production, fetched from API)
export const ACCOUNTS = [
  { id: "acc-default", name: "Default Account" },
  { id: "acc-2a49e", name: "Deacon Poon (2a49e)" },
  { id: "acc-corp", name: "Corporate Events" },
  { id: "acc-training", name: "Training Sessions" },
] as const;

// Mock glossaries (in production, fetched from API)
export const GLOSSARIES = [
  { id: "", name: "None" },
  { id: "gloss-tech", name: "Technology Terms" },
  { id: "gloss-medical", name: "Medical Terminology" },
  { id: "gloss-legal", name: "Legal Terms" },
  { id: "gloss-finance", name: "Financial Terms" },
] as const;

export const TRANSCRIPT_SETTINGS = [
  { value: "save-workspace", label: "Save transcript to workspace" },
  { value: "save", label: "Save transcript" },
  { value: "none", label: "Don't save transcript" },
] as const;

export const ACCESS_TYPES = [
  { value: "open", label: "Open" },
  { value: "passcode", label: "Require passcode" },
] as const;

export const VOICE_PACKS = [
  { id: "feminine", name: "Feminine Voice" },
  { id: "masculine", name: "Masculine Voice" },
  { id: "neutral", name: "Neutral Voice" },
] as const;

// ============================================================================
// Utility Functions
// ============================================================================

export function getLanguageName(code: string): string {
  return LANGUAGES.find((lang) => lang.code === code)?.name || code;
}

export function getTimezoneLabel(value: string): string {
  return TIMEZONES.find((tz) => tz.value === value)?.label || value;
}

export function generateTempId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function parsePresenters(presentersString: string): string[] {
  return presentersString
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

export function formatPresenters(presenters: string[]): string {
  return presenters.join(", ");
}

/**
 * Generate a location session ID (e.g., "MAIN-1234")
 */
export function generateLocationSessionId(locationName: string): string {
  const prefix = locationName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 4)
    .padEnd(4, "X");
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${suffix}`;
}

/**
 * Generate a 6-digit passcode
 */
export function generatePasscode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate an 8-digit mobile ID
 */
export function generateMobileId(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

/**
 * Validate sessions for schedule conflicts
 */
export interface ScheduleValidationResult {
  valid: boolean;
  errors: ScheduleError[];
  warnings: ScheduleWarning[];
}

export interface ScheduleError {
  type: "overlap" | "invalid_time" | "outside_event";
  locationIndex: number;
  sessionIndex: number;
  message: string;
}

export interface ScheduleWarning {
  type: "short_duration" | "large_gap" | "outside_hours";
  locationIndex: number;
  sessionIndex: number;
  message: string;
}

export function validateSchedule(
  sessions: SessionFormData[],
  eventStartDate: string,
  eventEndDate: string
): ScheduleValidationResult {
  const errors: ScheduleError[] = [];
  const warnings: ScheduleWarning[] = [];

  // Sort sessions by date and start time
  const sortedSessions = [...sessions].sort((a, b) => {
    const dateCompare = a.scheduledDate.localeCompare(b.scheduledDate);
    if (dateCompare !== 0) return dateCompare;
    return a.scheduledStart.localeCompare(b.scheduledStart);
  });

  sortedSessions.forEach((session, index) => {
    const originalIndex = sessions.findIndex((s) => s.id === session.id);

    // Check if session is within event date range
    if (session.scheduledDate < eventStartDate || session.scheduledDate > eventEndDate) {
      errors.push({
        type: "outside_event",
        locationIndex: 0,
        sessionIndex: originalIndex,
        message: `Session "${session.title || "Untitled"}" is outside the event date range`,
      });
    }

    // Check if end time is after start time
    if (session.endTime <= session.scheduledStart) {
      errors.push({
        type: "invalid_time",
        locationIndex: 0,
        sessionIndex: originalIndex,
        message: `Session "${session.title || "Untitled"}" end time must be after start time`,
      });
    }

    // Check for overlaps with next session on same day
    if (index < sortedSessions.length - 1) {
      const nextSession = sortedSessions[index + 1];
      if (
        session.scheduledDate === nextSession.scheduledDate &&
        session.endTime > nextSession.scheduledStart
      ) {
        errors.push({
          type: "overlap",
          locationIndex: 0,
          sessionIndex: originalIndex,
          message: `Session "${session.title || "Untitled"}" overlaps with "${nextSession.title || "Untitled"}"`,
        });
      }
    }

    // Warning: Short duration (< 5 minutes)
    const startMinutes = parseInt(session.scheduledStart.split(":")[0]) * 60 + 
                        parseInt(session.scheduledStart.split(":")[1]);
    const endMinutes = parseInt(session.endTime.split(":")[0]) * 60 + 
                      parseInt(session.endTime.split(":")[1]);
    const duration = endMinutes - startMinutes;
    
    if (duration > 0 && duration < 5) {
      warnings.push({
        type: "short_duration",
        locationIndex: 0,
        sessionIndex: originalIndex,
        message: `Session "${session.title || "Untitled"}" is very short (${duration} minutes)`,
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
