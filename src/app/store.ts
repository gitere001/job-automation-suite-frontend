import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/profileSlice';

// Create the Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: import.meta.env.VITE_MODE !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;