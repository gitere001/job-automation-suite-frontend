import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Define Admin interface
export interface Admin {
  id: string;
  email: string;
  name: string;

}

interface AuthState {
  isAuthenticated: boolean;
  admin: Admin | null;
  isLoading: boolean;
  error: string | null;
  errorCode: number | null;
}

// Define the expected API response type
interface AuthProfileResponse {
  admin: Admin;
}

export const fetchAdminProfile = createAsyncThunk<Admin, void, { rejectValue: { message: string; code: number | null } }>(
  'auth/fetchAdminProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<AuthProfileResponse>(`${apiUrl}/api/v1/auth/get-profile`, {
        withCredentials: true,
      });

      if (response.data?.admin) {
        return response.data.admin;
      } else {
        throw new Error('Admin data not found in response');
      }
    } catch (error) {
      let errorMessage = 'Failed to fetch admin profile';
      let errorCode = null;

      // Check if error is an Axios error
      if (error && typeof error === 'object' && 'isAxiosError' in error) {
        const axiosError = error as unknown as {
          response?: { data?: { message?: string }; status?: number };
          message: string;
        };
        errorMessage = axiosError.response?.data?.message || axiosError.message || 'Unknown error';
        errorCode = axiosError.response?.status || null;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      return rejectWithValue({
        message: errorMessage,
        code: errorCode
      });
    }
  }
);

const initialState: AuthState = {
  isAuthenticated: false,
  admin: null,
  isLoading: false,
  error: null,
  errorCode: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<Admin>) => {
      state.admin = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      state.errorCode = null;
    },
    unsetAdmin: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
      state.error = null;
      state.errorCode = null;
    },
    clearError: (state) => {
      state.error = null;
      state.errorCode = null;
    },
    setAuthError: (state, action: PayloadAction<{ message: string; code: number | null }>) => {
      state.error = action.payload.message;
      state.errorCode = action.payload.code;
      state.isAuthenticated = false;
      state.admin = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.errorCode = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admin = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        state.errorCode = null;
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.admin = null;
        state.isAuthenticated = false;

        if (action.payload) {
          state.error = action.payload.message;
          state.errorCode = action.payload.code;
        } else {
          state.error = action.error.message || 'Unknown error occurred';
          state.errorCode = null;
        }
      });
  },
});

export const { setAdmin, unsetAdmin, clearError, setAuthError } = authSlice.actions;

// Selectors for easier access to auth state
export const selectAuthError = (state: { auth: AuthState }) => ({
  error: state.auth.error,
  errorCode: state.auth.errorCode,
  isAuthError: state.auth.errorCode === 401 || state.auth.errorCode === 403,
});

export default authSlice.reducer;