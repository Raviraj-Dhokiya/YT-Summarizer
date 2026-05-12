import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getHistoryApi, deleteVideoApi } from '../api';

// Async thunk: history fetch karo
export const fetchHistory = createAsyncThunk(
  'history/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getHistoryApi();
      if (res.data.success) {
        return res.data.data;
      }
      return rejectWithValue('Failed to fetch history');
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk: video delete karo
export const deleteVideo = createAsyncThunk(
  'history/delete',
  async (videoId, { rejectWithValue }) => {
    try {
      await deleteVideoApi(videoId);
      return videoId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const historySlice = createSlice({
  name: 'history',
  initialState: {
    items: [],
    loading: false,
    error: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch History
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Video
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.items = state.items.filter((v) => v.videoId !== action.payload);
      });
  },
});

export default historySlice.reducer;
