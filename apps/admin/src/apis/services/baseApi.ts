import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { RootState } from '@/store';

const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

// Custom base query with authentication and refresh token logic
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get token from auth state
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    // Add content type for JSON requests
    headers.set('Content-Type', 'application/json');
    return headers;
  },
  credentials: 'include', // Include cookies for session management
});

// Refresh token function
const refreshToken = async (accessToken: string) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.accessToken;
    }
    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

// Enhanced base query with refresh token logic
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401 (Unauthorized) error, try to refresh the token
  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    const accessToken = state.auth.token;

    if (accessToken) {
      // Try to refresh the token
      const newToken = await refreshToken(accessToken);

      if (newToken) {
        // Update the token in the store
        api.dispatch({
          type: 'auth/setToken',
          payload: { token: newToken },
        });

        // Retry the original request with the new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, logout the user
        api.dispatch({ type: 'auth/logout' });
        return {
          error: {
            status: 401,
            data: { message: 'Authentication failed. Please login again.' },
          },
        };
      }
    } else {
      // No refresh token, logout the user
      api.dispatch({ type: 'auth/logout' });
      return {
        error: {
          status: 401,
          data: { message: 'No refresh token available. Please login again.' },
        },
      };
    }
  }

  return result;
};
