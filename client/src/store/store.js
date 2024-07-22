import { configureStore } from '@reduxjs/toolkit';
import userReducer from './states/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
