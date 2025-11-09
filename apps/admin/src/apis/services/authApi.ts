import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../routes';
import { baseQueryWithReauth } from './baseApi';
import { Role } from './roleApi';

// Types matching backend response
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  roleDetails?: {
    id: string;
    name: string;
    displayName: string;
  };
  permissions: string[];
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface CurrentUserResponse {
  user: User;
}

export interface SetupPasswordRequest {
  token: string;
  password: string;
}

export interface SetupPasswordResponse {
  message: string;
  success: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    // Login
    login: builder.mutation<
      AuthResponse,
      { email: string; password: string; rememberMe?: boolean }
    >({
      query: (credentials) => ({
        url: API_ROUTES.AUTH.LOGIN,
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Get current user
    getCurrentUser: builder.query<CurrentUserResponse, void>({
      query: () => API_ROUTES.AUTH.ME,
      providesTags: ['Auth'],
    }),

    // Logout
    logout: builder.mutation({
      query: () => ({
        url: API_ROUTES.AUTH.LOGOUT,
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),

    // Setup password with magic link token
    setupPassword: builder.mutation<
      SetupPasswordResponse,
      SetupPasswordRequest
    >({
      query: (data) => ({
        url: API_ROUTES.AUTH.SETUP_PASSWORD,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Forgot password
    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
      query: (data) => ({
        url: API_ROUTES.AUTH.ADMIN_FORGOT_PASSWORD,
        method: 'POST',
        body: data,
      }),
    }),

    // Reset password
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (data) => ({
        url: API_ROUTES.AUTH.RESET_PASSWORD,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useLazyGetCurrentUserQuery,
  useSetupPasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
