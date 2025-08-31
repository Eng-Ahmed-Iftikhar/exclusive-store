import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi, AuthResponse } from '@/apis/services/authApi';

// User interface moved to userSlice - no longer needed here

export interface AuthState {
  token: string | null;

  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  token: null,

  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;

      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setToken: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle logout API response automatically
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.token = null;

        state.isAuthenticated = false;
      })
      .addMatcher(authApi.endpoints.logout.matchRejected, (state) => {
        // Even if API fails, clear local auth state
        state.token = null;

        state.isAuthenticated = false;
      })
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state: AuthState, action: PayloadAction<AuthResponse>) => {
          state.token = action.payload.accessToken;
          state.isAuthenticated = true;
        }
      )
      .addMatcher(authApi.endpoints.login.matchRejected, (state) => {
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setCredentials, logout, setLoading, setToken } =
  authSlice.actions;
export default authSlice.reducer;
