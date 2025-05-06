import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import sessionReducer from './slices/sessionSlice';
import transcriptReducer from './slices/transcriptSlice';
import glossaryReducer from './slices/glossarySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    session: sessionReducer,
    transcript: transcriptReducer,
    glossary: glossaryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 