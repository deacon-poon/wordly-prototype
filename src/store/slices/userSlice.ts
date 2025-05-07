import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface UserPlan {
  name: string;
  availableTime: number;
  scheduledTime: number;
}

interface UserActivity {
  lastSession: string | null;
  nextSession: string | null;
}

interface UserState {
  plan: UserPlan;
  activity: UserActivity;
}

const initialState: UserState = {
  plan: {
    name: 'Trial',
    availableTime: 20,
    scheduledTime: 0,
  },
  activity: {
    lastSession: null,
    nextSession: null,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updatePlan: (state, action: PayloadAction<UserPlan>) => {
      state.plan = action.payload;
    },
    updateActivity: (state, action: PayloadAction<UserActivity>) => {
      state.activity = action.payload;
    },
  },
});

export const { updatePlan, updateActivity } = userSlice.actions;

export const selectUserPlan = (state: RootState) => state.user.plan;
export const selectUserActivity = (state: RootState) => state.user.activity;

export default userSlice.reducer; 