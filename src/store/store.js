import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth,
  },
});
