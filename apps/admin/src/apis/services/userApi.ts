import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';
import { API_ROUTES } from '../routes';

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isEmailVerified: boolean;
  provider: string;
  createdAt: string;
  role: {
    id: string;
    name: string;
    displayName: string;
  };
}

export interface GetUsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export interface UsersListResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Users', 'Customers'],
  endpoints: (builder) => ({
    // Get all users
    getUsers: builder.query<UsersListResponse, GetUsersQueryParams>({
      query: (params) => ({
        url: API_ROUTES.USERS.LIST,
        params,
      }),
      providesTags: ['Users'],
    }),

    // Get customers only
    getCustomers: builder.query<UsersListResponse, GetUsersQueryParams>({
      query: (params) => ({
        url: API_ROUTES.USERS.CUSTOMERS,
        params,
      }),
      providesTags: ['Customers'],
    }),

    // Get user by ID
    getUserById: builder.query<User, string>({
      query: (id) => API_ROUTES.USERS.BY_ID(id),
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),
  }),
});

export const { useGetUsersQuery, useGetCustomersQuery, useGetUserByIdQuery } =
  userApi;
