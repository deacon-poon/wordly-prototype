/**
 * Simple event store using localStorage for prototype persistence.
 * In production, this would be replaced with API calls and proper state management.
 */

interface Session {
  id: string;
  title: string;
  presenters: string[];
  scheduledDate: string;
  scheduledStart: string;
  endTime: string;
  status: "pending" | "active" | "completed" | "skipped";
}

interface Location {
  id: string;
  name: string;
  sessionCount: number;
  locationSessionId: string;
  passcode: string;
  sessions: Session[];
}

interface Event {
  id: string;
  name: string;
  dateRange: string;
  startDate: string; // ISO string for serialization
  endDate: string; // ISO string for serialization
  locationCount: number;
  sessionCount: number;
  description: string;
  publicSummaryUrl?: string;
  locations: Location[];
}

const STORAGE_KEY = "wordly_events";

/**
 * Get all stored events from localStorage
 */
export function getStoredEvents(): Event[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Get a specific event by ID
 */
export function getStoredEvent(eventId: string): Event | null {
  const events = getStoredEvents();
  return events.find((e) => e.id === eventId) || null;
}

/**
 * Save an event (creates or updates)
 */
export function saveEvent(event: Event): void {
  if (typeof window === "undefined") return;
  const events = getStoredEvents();
  const existingIndex = events.findIndex((e) => e.id === event.id);

  if (existingIndex >= 0) {
    events[existingIndex] = event;
  } else {
    events.unshift(event);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

/**
 * Delete an event by ID
 */
export function deleteEvent(eventId: string): void {
  if (typeof window === "undefined") return;
  const events = getStoredEvents().filter((e) => e.id !== eventId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

/**
 * Convert Date objects to ISO strings for storage
 */
export function serializeEvent(event: {
  id: string;
  name: string;
  dateRange: string;
  startDate: Date;
  endDate: Date;
  locationCount: number;
  sessionCount: number;
  description: string;
  publicSummaryUrl?: string;
  locations: Location[];
}): Event {
  return {
    ...event,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate.toISOString(),
  };
}

/**
 * Convert ISO strings back to Date objects
 */
export function deserializeEvent(event: Event): {
  id: string;
  name: string;
  dateRange: string;
  startDate: Date;
  endDate: Date;
  locationCount: number;
  sessionCount: number;
  description: string;
  publicSummaryUrl?: string;
  locations: Location[];
} {
  return {
    ...event,
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
  };
}
