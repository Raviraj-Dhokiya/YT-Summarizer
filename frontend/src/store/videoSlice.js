import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { summarizeVideoApi } from '../api';

// Async thunk: video summarize karo
export const summarizeVideo = createAsyncThunk(
  'video/summarize',
  async (url, { rejectWithValue }) => {
    try {
      const res = await summarizeVideoApi(url);
      if (res.data.success) {
        return res.data.data;
      }
      return rejectWithValue(res.data.error || 'Failed to summarize video');
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Failed to summarize video'
      );
    }
  }
);

const videoSlice = createSlice({
  name: 'video',
  initialState: {
    currentVideo: null,
    loading: false,
    error: '',
  },
  reducers: {
    clearVideo: (state) => {
      state.currentVideo = null;
      state.error = '';
    },
    clearError: (state) => {
      state.error = '';
    },
    setVideo: (state, action) => {
      state.currentVideo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(summarizeVideo.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(summarizeVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVideo = action.payload;
      })
      .addCase(summarizeVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { clearVideo, clearError, setVideo } = videoSlice.actions;
export default videoSlice.reducer;
