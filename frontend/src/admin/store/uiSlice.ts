import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type UiState = {
  saveStatus: SaveStatus;
  hasUnsavedChanges: boolean;
  sidebarOpen: boolean;
};

const initialState: UiState = {
  saveStatus: 'idle',
  hasUnsavedChanges: false,
  sidebarOpen: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSaveStatus: (state, action: PayloadAction<SaveStatus>) => {
      state.saveStatus = action.payload;
    },
    setHasUnsavedChanges: (state, action: PayloadAction<boolean>) => {
      state.hasUnsavedChanges = action.payload;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { setSaveStatus, setHasUnsavedChanges, setSidebarOpen } = uiSlice.actions;
export default uiSlice.reducer;
