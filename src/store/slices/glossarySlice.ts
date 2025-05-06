import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GlossaryTerm {
  id: string;
  term: string;
  translation: string;
  notes?: string;
}

interface Glossary {
  id: string;
  name: string;
  languageFrom: string;
  languageTo: string;
  terms: GlossaryTerm[];
}

interface GlossaryState {
  glossaries: Glossary[];
  currentGlossary: Glossary | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: GlossaryState = {
  glossaries: [],
  currentGlossary: null,
  isLoading: false,
  error: null,
};

const glossarySlice = createSlice({
  name: 'glossary',
  initialState,
  reducers: {
    fetchGlossariesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchGlossariesSuccess: (state, action: PayloadAction<Glossary[]>) => {
      state.isLoading = false;
      state.glossaries = action.payload;
      state.error = null;
    },
    fetchGlossariesFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setCurrentGlossary: (state, action: PayloadAction<Glossary>) => {
      state.currentGlossary = action.payload;
    },
  },
});

export const {
  fetchGlossariesStart,
  fetchGlossariesSuccess,
  fetchGlossariesFailed,
  setCurrentGlossary,
} = glossarySlice.actions;

export default glossarySlice.reducer; 