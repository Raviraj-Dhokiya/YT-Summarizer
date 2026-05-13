import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    isDark: localStorage.getItem('theme') !== 'light', // default: dark
  },
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
      // ✅ Only pure state update + localStorage here.
      // DOM side effects (data-theme, class) are handled in App.jsx useEffect.
      localStorage.setItem('theme', state.isDark ? 'dark' : 'light');
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
