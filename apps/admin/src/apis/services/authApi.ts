import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../routes';
import { baseQueryWithReauth } from './baseApi';

// Types matching backend response
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  roleDetails?: {
    id: string;
    name: string;
    displayName: string;
    description: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface CurrentUserResponse {
  user: User;
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
  }),
});

export const {
  useLoginMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useLazyGetCurrentUserQuery,
} = authApi;
