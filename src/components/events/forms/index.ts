/**
 * Event Forms - Composable form components for event management
 * 
 * This module provides a scalable form architecture that supports:
 * - Creating new events (wizard flow)
 * - Editing existing events
 * - Adding/editing rooms
 * - Adding/editing sessions
 * 
 * All forms share the same context and types for consistency.
 */

// Types
export * from "./types";

// Context & Hooks
export {
  EventFormProvider,
  useEventForm,
  useStandaloneRoomForm,
  useStandaloneSessionForm,
} from "./EventFormContext";

// Form Components
export { EventDetailsForm } from "./EventDetailsForm";
export { RoomForm, RoomListForm, RoomCard } from "./RoomForm";
export { SessionForm, SessionListForm, SessionCard } from "./SessionForm";
export { ScheduleBuilder } from "./ScheduleBuilder";
