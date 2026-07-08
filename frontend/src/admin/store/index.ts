import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import uiReducer from './uiSlice';
import mediaReducer from './mediaSlice';

export const adminStore = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    media: mediaReducer,
  },
});

export type AdminRootState = ReturnType<typeof adminStore.getState>;
export type AdminDispatch = typeof adminStore.dispatch;
