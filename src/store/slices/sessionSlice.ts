import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Session {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
  duration: number;
  languageFrom: string;
  languageTo: string;
}

interface SessionState {
  sessions: Session[];
  currentSession: Session | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  sessions: [],
  currentSession: null,
  isLoading: false,
  error: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    fetchSessionsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchSessionsSuccess: (state, action: PayloadAction<Session[]>) => {
      state.isLoading = false;
      state.sessions = action.payload;
      state.error = null;
    },
    fetchSessionsFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setCurrentSession: (state, action: PayloadAction<Session>) => {
      state.currentSession = action.payload;
    },
    clearCurrentSession: (state) => {
      state.currentSession = null;
    },
    createSession: (state, action: PayloadAction<Session>) => {
      state.sessions.push(action.payload);
    },
    updateSession: (state, action: PayloadAction<Session>) => {
      const index = state.sessions.findIndex(
        (session) => session.id === action.payload.id
      );
      if (index !== -1) {
        state.sessions[index] = action.payload;
      }
    },
    deleteSession: (state, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter(
        (session) => session.id !== action.payload
      );
    },
  },
});

export const {
  fetchSessionsStart,
  fetchSessionsSuccess,
  fetchSessionsFailed,
  setCurrentSession,
  clearCurrentSession,
  createSession,
  updateSession,
  deleteSession,
} = sessionSlice.actions;

export default sessionSlice.reducer; 