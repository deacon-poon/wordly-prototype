"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  EventFormState,
  EventDetailsFormData,
  LocationFormData,
  SessionFormData,
  WizardStep,
  FormMode,
  DEFAULT_EVENT_DETAILS,
  DEFAULT_LOCATION,
  DEFAULT_SESSION,
  generateTempId,
} from "./types";

// ============================================================================
// Action Types
// ============================================================================

type EventFormAction =
  | { type: "SET_MODE"; payload: FormMode }
  | { type: "SET_STEP"; payload: WizardStep }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "UPDATE_EVENT_DETAILS"; payload: Partial<EventDetailsFormData> }
  | { type: "SET_EVENT_DETAILS"; payload: EventDetailsFormData }
  | { type: "ADD_LOCATION"; payload?: LocationFormData }
  | {
      type: "UPDATE_LOCATION";
      payload: { index: number; data: Partial<LocationFormData> };
    }
  | { type: "REMOVE_LOCATION"; payload: number }
  | {
      type: "ADD_SESSION";
      payload: { locationIndex: number; session?: SessionFormData };
    }
  | {
      type: "UPDATE_SESSION";
      payload: {
        locationIndex: number;
        sessionIndex: number;
        data: Partial<SessionFormData>;
      };
    }
  | {
      type: "REMOVE_SESSION";
      payload: { locationIndex: number; sessionIndex: number };
    }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_ERROR"; payload: { field: string; message: string } }
  | { type: "CLEAR_ERROR"; payload: string }
  | { type: "CLEAR_ALL_ERRORS" }
  | { type: "RESET_FORM" }
  | {
      type: "LOAD_EVENT";
      payload: {
        eventDetails: EventDetailsFormData;
        locations: LocationFormData[];
        sessionsByLocation: Record<string, SessionFormData[]>;
      };
    };

// ============================================================================
// Step Order
// ============================================================================

const STEP_ORDER: WizardStep[] = ["details", "locations", "sessions", "review"];

function getNextStep(current: WizardStep): WizardStep {
  const currentIndex = STEP_ORDER.indexOf(current);
  return STEP_ORDER[Math.min(currentIndex + 1, STEP_ORDER.length - 1)];
}

function getPrevStep(current: WizardStep): WizardStep {
  const currentIndex = STEP_ORDER.indexOf(current);
  return STEP_ORDER[Math.max(currentIndex - 1, 0)];
}

// ============================================================================
// Initial State
// ============================================================================

const initialState: EventFormState = {
  mode: "create",
  currentStep: "details",
  eventDetails: DEFAULT_EVENT_DETAILS,
  locations: [],
  sessionsByLocation: {},
  isSubmitting: false,
  errors: {},
};

// ============================================================================
// Reducer
// ============================================================================

function eventFormReducer(
  state: EventFormState,
  action: EventFormAction
): EventFormState {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload };

    case "SET_STEP":
      return { ...state, currentStep: action.payload };

    case "NEXT_STEP":
      return { ...state, currentStep: getNextStep(state.currentStep) };

    case "PREV_STEP":
      return { ...state, currentStep: getPrevStep(state.currentStep) };

    case "UPDATE_EVENT_DETAILS":
      return {
        ...state,
        eventDetails: { ...state.eventDetails, ...action.payload },
      };

    case "SET_EVENT_DETAILS":
      return { ...state, eventDetails: action.payload };

    case "ADD_LOCATION": {
      const newLocation: LocationFormData = action.payload || {
        ...DEFAULT_LOCATION,
        id: generateTempId(),
      };
      if (!newLocation.id) {
        newLocation.id = generateTempId();
      }
      return {
        ...state,
        locations: [...state.locations, newLocation],
        sessionsByLocation: {
          ...state.sessionsByLocation,
          [newLocation.id!]: [],
        },
      };
    }

    case "UPDATE_LOCATION": {
      const updatedLocations = [...state.locations];
      updatedLocations[action.payload.index] = {
        ...updatedLocations[action.payload.index],
        ...action.payload.data,
      };
      return { ...state, locations: updatedLocations };
    }

    case "REMOVE_LOCATION": {
      const removedLocation = state.locations[action.payload];
      const newLocations = state.locations.filter(
        (_, i) => i !== action.payload
      );
      const newSessionsByLocation = { ...state.sessionsByLocation };
      if (removedLocation?.id) {
        delete newSessionsByLocation[removedLocation.id];
      }
      return {
        ...state,
        locations: newLocations,
        sessionsByLocation: newSessionsByLocation,
      };
    }

    case "ADD_SESSION": {
      const location = state.locations[action.payload.locationIndex];
      if (!location?.id) return state;

      const newSession: SessionFormData = action.payload.session || {
        ...DEFAULT_SESSION,
        id: generateTempId(),
        scheduledDate: state.eventDetails.startDate,
        timezone: state.eventDetails.timezone,
      };
      if (!newSession.id) {
        newSession.id = generateTempId();
      }

      const currentSessions = state.sessionsByLocation[location.id] || [];
      return {
        ...state,
        sessionsByLocation: {
          ...state.sessionsByLocation,
          [location.id]: [...currentSessions, newSession],
        },
      };
    }

    case "UPDATE_SESSION": {
      const location = state.locations[action.payload.locationIndex];
      if (!location?.id) return state;

      const sessions = [...(state.sessionsByLocation[location.id] || [])];
      sessions[action.payload.sessionIndex] = {
        ...sessions[action.payload.sessionIndex],
        ...action.payload.data,
      };
      return {
        ...state,
        sessionsByLocation: {
          ...state.sessionsByLocation,
          [location.id]: sessions,
        },
      };
    }

    case "REMOVE_SESSION": {
      const location = state.locations[action.payload.locationIndex];
      if (!location?.id) return state;

      const sessions = (state.sessionsByLocation[location.id] || []).filter(
        (_, i) => i !== action.payload.sessionIndex
      );
      return {
        ...state,
        sessionsByLocation: {
          ...state.sessionsByLocation,
          [location.id]: sessions,
        },
      };
    }

    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.payload };

    case "SET_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.field]: action.payload.message,
        },
      };

    case "CLEAR_ERROR": {
      const newErrors = { ...state.errors };
      delete newErrors[action.payload];
      return { ...state, errors: newErrors };
    }

    case "CLEAR_ALL_ERRORS":
      return { ...state, errors: {} };

    case "RESET_FORM":
      return initialState;

    case "LOAD_EVENT":
      return {
        ...state,
        mode: "edit",
        eventDetails: action.payload.eventDetails,
        locations: action.payload.locations,
        sessionsByLocation: action.payload.sessionsByLocation,
      };

    default:
      return state;
  }
}

// ============================================================================
// Context
// ============================================================================

interface EventFormContextValue {
  state: EventFormState;
  dispatch: React.Dispatch<EventFormAction>;
  // Convenience methods
  setMode: (mode: FormMode) => void;
  setStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateEventDetails: (data: Partial<EventDetailsFormData>) => void;
  addLocation: (data?: LocationFormData) => void;
  updateLocation: (index: number, data: Partial<LocationFormData>) => void;
  removeLocation: (index: number) => void;
  addSession: (locationIndex: number, session?: SessionFormData) => void;
  updateSession: (
    locationIndex: number,
    sessionIndex: number,
    data: Partial<SessionFormData>
  ) => void;
  removeSession: (locationIndex: number, sessionIndex: number) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  resetForm: () => void;
  getSessionsForLocation: (locationIndex: number) => SessionFormData[];
  canProceed: () => boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const EventFormContext = createContext<EventFormContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

interface EventFormProviderProps {
  children: ReactNode;
  initialMode?: FormMode;
  initialEventDetails?: EventDetailsFormData;
  initialLocations?: LocationFormData[];
  initialSessionsByLocation?: Record<string, SessionFormData[]>;
}

export function EventFormProvider({
  children,
  initialMode = "create",
  initialEventDetails,
  initialLocations,
  initialSessionsByLocation,
}: EventFormProviderProps) {
  const [state, dispatch] = useReducer(eventFormReducer, {
    ...initialState,
    mode: initialMode,
    eventDetails: initialEventDetails || DEFAULT_EVENT_DETAILS,
    locations: initialLocations || [],
    sessionsByLocation: initialSessionsByLocation || {},
  });

  const value: EventFormContextValue = {
    state,
    dispatch,

    setMode: (mode) => dispatch({ type: "SET_MODE", payload: mode }),
    setStep: (step) => dispatch({ type: "SET_STEP", payload: step }),
    nextStep: () => dispatch({ type: "NEXT_STEP" }),
    prevStep: () => dispatch({ type: "PREV_STEP" }),

    updateEventDetails: (data) =>
      dispatch({ type: "UPDATE_EVENT_DETAILS", payload: data }),

    addLocation: (data) => dispatch({ type: "ADD_LOCATION", payload: data }),
    updateLocation: (index, data) =>
      dispatch({ type: "UPDATE_LOCATION", payload: { index, data } }),
    removeLocation: (index) =>
      dispatch({ type: "REMOVE_LOCATION", payload: index }),

    addSession: (locationIndex, session) =>
      dispatch({ type: "ADD_SESSION", payload: { locationIndex, session } }),
    updateSession: (locationIndex, sessionIndex, data) =>
      dispatch({
        type: "UPDATE_SESSION",
        payload: { locationIndex, sessionIndex, data },
      }),
    removeSession: (locationIndex, sessionIndex) =>
      dispatch({
        type: "REMOVE_SESSION",
        payload: { locationIndex, sessionIndex },
      }),

    setSubmitting: (isSubmitting) =>
      dispatch({ type: "SET_SUBMITTING", payload: isSubmitting }),
    setError: (field, message) =>
      dispatch({ type: "SET_ERROR", payload: { field, message } }),
    clearError: (field) => dispatch({ type: "CLEAR_ERROR", payload: field }),
    clearAllErrors: () => dispatch({ type: "CLEAR_ALL_ERRORS" }),
    resetForm: () => dispatch({ type: "RESET_FORM" }),

    getSessionsForLocation: (locationIndex) => {
      const location = state.locations[locationIndex];
      return location?.id ? state.sessionsByLocation[location.id] || [] : [];
    },

    canProceed: () => {
      switch (state.currentStep) {
        case "details":
          return !!state.eventDetails.name.trim();
        case "locations":
          return (
            state.locations.length > 0 &&
            state.locations.every((l) => l.name.trim())
          );
        case "sessions":
          return true; // Sessions are optional per location
        case "review":
          return true;
        default:
          return false;
      }
    },

    isFirstStep: state.currentStep === STEP_ORDER[0],
    isLastStep: state.currentStep === STEP_ORDER[STEP_ORDER.length - 1],
  };

  return (
    <EventFormContext.Provider value={value}>
      {children}
    </EventFormContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useEventForm(): EventFormContextValue {
  const context = useContext(EventFormContext);
  if (!context) {
    throw new Error("useEventForm must be used within an EventFormProvider");
  }
  return context;
}

// ============================================================================
// Standalone Hook (for forms used outside the wizard)
// ============================================================================

export function useStandaloneLocationForm(initialData?: LocationFormData) {
  const [location, setLocation] = React.useState<LocationFormData>(
    initialData || { ...DEFAULT_LOCATION, id: generateTempId() }
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const updateLocation = (data: Partial<LocationFormData>) => {
    setLocation((prev) => ({ ...prev, ...data }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!location.name.trim()) {
      newErrors.name = "Location name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setLocation({ ...DEFAULT_LOCATION, id: generateTempId() });
    setErrors({});
  };

  return { location, updateLocation, errors, validate, reset };
}

export function useStandaloneSessionForm(
  initialData?: SessionFormData,
  defaultTimezone?: string
) {
  const [session, setSession] = React.useState<SessionFormData>(
    initialData || {
      ...DEFAULT_SESSION,
      id: generateTempId(),
      timezone: defaultTimezone || DEFAULT_SESSION.timezone,
    }
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const updateSession = (data: Partial<SessionFormData>) => {
    setSession((prev) => ({ ...prev, ...data }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!session.title.trim()) {
      newErrors.title = "Session title is required";
    }
    if (!session.scheduledDate) {
      newErrors.scheduledDate = "Date is required";
    }
    if (!session.scheduledStart) {
      newErrors.scheduledStart = "Start time is required";
    }
    if (!session.endTime) {
      newErrors.endTime = "End time is required";
    }
    if (session.scheduledStart >= session.endTime) {
      newErrors.endTime = "End time must be after start time";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setSession({ ...DEFAULT_SESSION, id: generateTempId() });
    setErrors({});
  };

  return { session, updateSession, errors, validate, reset };
}
