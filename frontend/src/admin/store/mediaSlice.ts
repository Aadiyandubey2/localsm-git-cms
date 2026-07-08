import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MediaItem } from '../types/cms';

const MEDIA_KEY = 'localsm_media_library';

const loadMedia = (): MediaItem[] => {
  try {
    const raw = localStorage.getItem(MEDIA_KEY);
    return raw ? (JSON.parse(raw) as MediaItem[]) : [];
  } catch {
    return [];
  }
};

const persistMedia = (items: MediaItem[]) => {
  localStorage.setItem(MEDIA_KEY, JSON.stringify(items));
};

type MediaState = {
  items: MediaItem[];
};

const initialState: MediaState = {
  items: loadMedia(),
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    addMediaItem: (state, action: PayloadAction<MediaItem>) => {
      const exists = state.items.some((item) => item.url === action.payload.url);
      if (!exists) {
        state.items.unshift(action.payload);
        persistMedia(state.items);
      }
    },
    removeMediaItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      persistMedia(state.items);
    },
    mergeDiscoveredUrls: (state, action: PayloadAction<string[]>) => {
      const existing = new Set(state.items.map((item) => item.url));
      const additions = action.payload
        .filter((url) => url && !existing.has(url))
        .map((url) => ({
          id: `discovered-${url}`,
          url,
          name: url.split('/').pop() || 'image',
          uploadedAt: new Date().toISOString(),
        }));

      if (additions.length > 0) {
        state.items = [...state.items, ...additions];
        persistMedia(state.items);
      }
    },
  },
});

export const { addMediaItem, removeMediaItem, mergeDiscoveredUrls } = mediaSlice.actions;
export default mediaSlice.reducer;
