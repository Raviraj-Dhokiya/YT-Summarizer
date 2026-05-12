import { configureStore } from '@reduxjs/toolkit';
import videoReducer from './videoSlice';
import historyReducer from './historySlice';
import themeReducer from './themeSlice';

const store = configureStore({
  reducer: {
    video: videoReducer,
    history: historyReducer,
    theme: themeReducer,
  },
});

export default store;
