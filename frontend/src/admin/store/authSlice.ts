import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AdminUser } from '../types/cms';

type AuthState = {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action: PayloadAction<AdminUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
      state.isLoading = false;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
});

export const { setAuthLoading, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
