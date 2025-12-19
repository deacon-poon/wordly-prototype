/**
 * Event Forms - Composable form components for event management
 * 
 * This module provides a scalable form architecture that supports:
 * - Creating new events (wizard flow)
 * - Editing existing events
 * - Adding/editing locations
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
  useStandaloneLocationForm,
  useStandaloneSessionForm,
} from "./EventFormContext";

// Form Components
export { EventDetailsForm } from "./EventDetailsForm";
export { LocationForm, LocationListForm, LocationCard } from "./LocationForm";
export { SessionForm, SessionListForm, SessionCard } from "./SessionForm";
