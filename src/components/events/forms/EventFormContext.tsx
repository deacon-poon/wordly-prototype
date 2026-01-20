"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  EventFormState,
  EventDetailsFormData,
  RoomFormData,
  SessionFormData,
  WizardStep,
  FormMode,
  DEFAULT_EVENT_DETAILS,
  DEFAULT_ROOM,
  DEFAULT_SESSION,
  generateTempId,
  generateRoomSessionId,
  generatePasscode,
  generateMobileId,
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
  | { type: "ADD_ROOM"; payload?: RoomFormData }
  | {
      type: "UPDATE_ROOM";
      payload: { index: number; data: Partial<RoomFormData> };
    }
  | { type: "REMOVE_ROOM"; payload: number }
  | {
      type: "ADD_SESSION";
      payload: { roomIndex: number; session?: SessionFormData };
    }
  | {
      type: "UPDATE_SESSION";
      payload: {
        roomIndex: number;
        sessionIndex: number;
        data: Partial<SessionFormData>;
      };
    }
  | {
      type: "REMOVE_SESSION";
      payload: { roomIndex: number; sessionIndex: number };
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
        rooms: RoomFormData[];
        sessionsByRoom: Record<string, SessionFormData[]>;
      };
    };

// ============================================================================
// Step Order
// ============================================================================

const STEP_ORDER: WizardStep[] = ["details", "schedule", "review"];

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
  rooms: [],
  sessionsByRoom: {},
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

    case "ADD_ROOM": {
      const tempId = generateTempId();
      const roomName =
        action.payload?.name || `Room ${state.rooms.length + 1}`;
      const newRoom: RoomFormData = action.payload || {
        ...DEFAULT_ROOM,
        id: tempId,
        name: roomName,
      };
      if (!newRoom.id) {
        newRoom.id = tempId;
      }
      // Auto-generate credentials for new rooms
      if (!newRoom.roomSessionId) {
        newRoom.roomSessionId = generateRoomSessionId();
      }
      if (!newRoom.passcode) {
        newRoom.passcode = generatePasscode();
      }
      if (!newRoom.mobileId) {
        newRoom.mobileId = generateMobileId();
      }
      return {
        ...state,
        rooms: [...state.rooms, newRoom],
        sessionsByRoom: {
          ...state.sessionsByRoom,
          [newRoom.id!]: [],
        },
      };
    }

    case "UPDATE_ROOM": {
      const updatedRooms = [...state.rooms];
      updatedRooms[action.payload.index] = {
        ...updatedRooms[action.payload.index],
        ...action.payload.data,
      };
      return { ...state, rooms: updatedRooms };
    }

    case "REMOVE_ROOM": {
      const removedRoom = state.rooms[action.payload];
      const newRooms = state.rooms.filter(
        (_, i) => i !== action.payload
      );
      const newSessionsByRoom = { ...state.sessionsByRoom };
      if (removedRoom?.id) {
        delete newSessionsByRoom[removedRoom.id];
      }
      return {
        ...state,
        rooms: newRooms,
        sessionsByRoom: newSessionsByRoom,
      };
    }

    case "ADD_SESSION": {
      const room = state.rooms[action.payload.roomIndex];
      if (!room?.id) return state;

      const newSession: SessionFormData = action.payload.session || {
        ...DEFAULT_SESSION,
        id: generateTempId(),
        scheduledDate: state.eventDetails.startDate,
      };
      if (!newSession.id) {
        newSession.id = generateTempId();
      }

      const currentSessions = state.sessionsByRoom[room.id] || [];
      return {
        ...state,
        sessionsByRoom: {
          ...state.sessionsByRoom,
          [room.id]: [...currentSessions, newSession],
        },
      };
    }

    case "UPDATE_SESSION": {
      const room = state.rooms[action.payload.roomIndex];
      if (!room?.id) return state;

      const sessions = [...(state.sessionsByRoom[room.id] || [])];
      sessions[action.payload.sessionIndex] = {
        ...sessions[action.payload.sessionIndex],
        ...action.payload.data,
      };
      return {
        ...state,
        sessionsByRoom: {
          ...state.sessionsByRoom,
          [room.id]: sessions,
        },
      };
    }

    case "REMOVE_SESSION": {
      const room = state.rooms[action.payload.roomIndex];
      if (!room?.id) return state;

      const sessions = (state.sessionsByRoom[room.id] || []).filter(
        (_, i) => i !== action.payload.sessionIndex
      );
      return {
        ...state,
        sessionsByRoom: {
          ...state.sessionsByRoom,
          [room.id]: sessions,
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
        rooms: action.payload.rooms,
        sessionsByRoom: action.payload.sessionsByRoom,
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
  addRoom: (data?: RoomFormData) => void;
  updateRoom: (index: number, data: Partial<RoomFormData>) => void;
  removeRoom: (index: number) => void;
  addSession: (roomIndex: number, session?: SessionFormData) => void;
  updateSession: (
    roomIndex: number,
    sessionIndex: number,
    data: Partial<SessionFormData>
  ) => void;
  removeSession: (roomIndex: number, sessionIndex: number) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  resetForm: () => void;
  getSessionsForRoom: (roomIndex: number) => SessionFormData[];
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
  initialRooms?: RoomFormData[];
  initialSessionsByRoom?: Record<string, SessionFormData[]>;
}

export function EventFormProvider({
  children,
  initialMode = "create",
  initialEventDetails,
  initialRooms,
  initialSessionsByRoom,
}: EventFormProviderProps) {
  const [state, dispatch] = useReducer(eventFormReducer, {
    ...initialState,
    mode: initialMode,
    eventDetails: initialEventDetails || DEFAULT_EVENT_DETAILS,
    rooms: initialRooms || [],
    sessionsByRoom: initialSessionsByRoom || {},
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

    addRoom: (data) => dispatch({ type: "ADD_ROOM", payload: data }),
    updateRoom: (index, data) =>
      dispatch({ type: "UPDATE_ROOM", payload: { index, data } }),
    removeRoom: (index) =>
      dispatch({ type: "REMOVE_ROOM", payload: index }),

    addSession: (roomIndex, session) =>
      dispatch({ type: "ADD_SESSION", payload: { roomIndex, session } }),
    updateSession: (roomIndex, sessionIndex, data) =>
      dispatch({
        type: "UPDATE_SESSION",
        payload: { roomIndex, sessionIndex, data },
      }),
    removeSession: (roomIndex, sessionIndex) =>
      dispatch({
        type: "REMOVE_SESSION",
        payload: { roomIndex, sessionIndex },
      }),

    setSubmitting: (isSubmitting) =>
      dispatch({ type: "SET_SUBMITTING", payload: isSubmitting }),
    setError: (field, message) =>
      dispatch({ type: "SET_ERROR", payload: { field, message } }),
    clearError: (field) => dispatch({ type: "CLEAR_ERROR", payload: field }),
    clearAllErrors: () => dispatch({ type: "CLEAR_ALL_ERRORS" }),
    resetForm: () => dispatch({ type: "RESET_FORM" }),

    getSessionsForRoom: (roomIndex) => {
      const room = state.rooms[roomIndex];
      return room?.id ? state.sessionsByRoom[room.id] || [] : [];
    },

    canProceed: () => {
      switch (state.currentStep) {
        case "details":
          return !!state.eventDetails.name.trim();
        case "schedule":
          // At least one room is required, and all rooms must have names
          return (
            state.rooms.length > 0 &&
            state.rooms.every((r) => r.name.trim())
          );
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

export function useStandaloneRoomForm(initialData?: RoomFormData) {
  const [room, setRoom] = React.useState<RoomFormData>(
    initialData || { ...DEFAULT_ROOM, id: generateTempId() }
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const updateRoom = (data: Partial<RoomFormData>) => {
    setRoom((prev) => ({ ...prev, ...data }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!room.name.trim()) {
      newErrors.name = "Room name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setRoom({ ...DEFAULT_ROOM, id: generateTempId() });
    setErrors({});
  };

  return { room, updateRoom, errors, validate, reset };
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
