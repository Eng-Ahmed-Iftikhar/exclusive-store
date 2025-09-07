import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi, User } from '../../apis/services/authApi';

export interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.getCurrentUser.matchFulfilled,
        (state, action) => {
          state.user = action.payload.user;
        }
      )
      .addMatcher(authApi.endpoints.getCurrentUser.matchRejected, (state) => {
        state.user = null;
      })
      // Handle logout API response automatically
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
      })
      .addMatcher(authApi.endpoints.logout.matchRejected, (state) => {
        // Even if API fails, clear user data
        state.user = null;
      });
  },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
