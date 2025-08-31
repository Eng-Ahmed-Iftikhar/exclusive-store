import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi, User } from '../../apis/services/authApi';
import { logout } from './authSlice';

export interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

// Async thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>('user/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.endpoints.getCurrentUser.initiate();
    if ('data' in response && response.data) {
      return (response.data as { user: User }).user;
    } else {
      return rejectWithValue('Failed to fetch user profile');
    }
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch user profile');
  }
});

// Async thunk to refresh user profile
export const refreshUserProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>('user/refreshProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.endpoints.getCurrentUser.initiate();
    if ('data' in response && response.data) {
      return (response.data as { user: User }).user;
    } else {
      return rejectWithValue('Failed to refresh user profile');
    }
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to refresh user profile');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
      state.lastFetched = Date.now();
    },
    clearUser: (state) => {
      state.user = null;
      state.error = null;
      state.lastFetched = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        state.lastFetched = Date.now();
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
        state.lastFetched = Date.now();
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Refresh user profile
      .addCase(refreshUserProfile.pending, (state) => {
        state.error = null;
      })
      .addCase(refreshUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
        state.lastFetched = Date.now();
      })
      .addCase(refreshUserProfile.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Handle logout automatically
      .addCase(logout, (state) => {
        state.user = null;
        state.error = null;
        state.lastFetched = null;
      })
      // Handle logout API response automatically
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.error = null;
        state.lastFetched = null;
      })
      .addMatcher(authApi.endpoints.logout.matchRejected, (state) => {
        // Even if API fails, clear user data
        state.user = null;
        state.error = null;
        state.lastFetched = null;
      });
  },
});

export const { setUser, clearUser, updateUser, setError, clearError } =
  userSlice.actions;
export default userSlice.reducer;
