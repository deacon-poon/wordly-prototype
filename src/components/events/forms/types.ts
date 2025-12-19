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
  description?: string;
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

export interface EventDetailsFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  timezone: string;
  glossaryId: string;
  accountId: string;
  accessType: "open" | "passcode";
  publishTranscripts: boolean;
  startingLanguage: string;
  otherLanguages: string[];
  customFields: Record<string, string>;
}

export interface LocationFormData {
  id?: string; // Present when editing, absent when creating
  name: string;
  description: string;
}

export interface SessionFormData {
  id?: string; // Present when editing, absent when creating
  title: string;
  presenters: string; // Comma-separated string for form input
  scheduledDate: string;
  scheduledStart: string;
  endTime: string;
  timezone: string;
  languages: string[];
}

// ============================================================================
// Form Mode & Context Types
// ============================================================================

export type FormMode = "create" | "edit";

export type WizardStep = "details" | "locations" | "sessions" | "review";

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
  timezone: "America/Los_Angeles",
  glossaryId: "",
  accountId: "",
  accessType: "open",
  publishTranscripts: true,
  startingLanguage: "en-US",
  otherLanguages: ["en-US"],
  customFields: {},
};

export const DEFAULT_LOCATION: LocationFormData = {
  name: "",
  description: "",
};

export const DEFAULT_SESSION: SessionFormData = {
  title: "",
  presenters: "",
  scheduledDate: new Date().toISOString().split("T")[0],
  scheduledStart: "09:00",
  endTime: "10:00",
  timezone: "America/Los_Angeles",
  languages: ["en-US"],
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
