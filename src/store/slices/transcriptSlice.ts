import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Segment {
  id: string;
  text: string;
  translation: string;
  startTime: number;
  endTime: number;
  speaker: string;
  status: 'pending' | 'translated' | 'edited' | 'approved';
}

interface Transcript {
  id: string;
  sessionId: string;
  title: string;
  status: 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
  segments: Segment[];
}

interface TranscriptState {
  transcripts: Transcript[];
  currentTranscript: Transcript | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TranscriptState = {
  transcripts: [],
  currentTranscript: null,
  isLoading: false,
  error: null,
};

const transcriptSlice = createSlice({
  name: 'transcript',
  initialState,
  reducers: {
    fetchTranscriptsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchTranscriptsSuccess: (state, action: PayloadAction<Transcript[]>) => {
      state.isLoading = false;
      state.transcripts = action.payload;
      state.error = null;
    },
    fetchTranscriptsFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setCurrentTranscript: (state, action: PayloadAction<Transcript>) => {
      state.currentTranscript = action.payload;
    },
    clearCurrentTranscript: (state) => {
      state.currentTranscript = null;
    },
    updateSegment: (state, action: PayloadAction<Segment>) => {
      if (state.currentTranscript) {
        const index = state.currentTranscript.segments.findIndex(
          (segment) => segment.id === action.payload.id
        );
        if (index !== -1) {
          state.currentTranscript.segments[index] = action.payload;
        }
      }
    },
    updateTranscript: (state, action: PayloadAction<Transcript>) => {
      const index = state.transcripts.findIndex(
        (transcript) => transcript.id === action.payload.id
      );
      if (index !== -1) {
        state.transcripts[index] = action.payload;
      }
      if (state.currentTranscript?.id === action.payload.id) {
        state.currentTranscript = action.payload;
      }
    },
  },
});

export const {
  fetchTranscriptsStart,
  fetchTranscriptsSuccess,
  fetchTranscriptsFailed,
  setCurrentTranscript,
  clearCurrentTranscript,
  updateSegment,
  updateTranscript,
} = transcriptSlice.actions;

export default transcriptSlice.reducer; 