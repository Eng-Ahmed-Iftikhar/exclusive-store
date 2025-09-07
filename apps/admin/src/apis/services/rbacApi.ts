import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';

export interface ResourcePermission {
  resource: string;
  permissions: string[];
}

export interface CheckPermissionRequest {
  resource: string;
  permission: string;
}

export interface CheckPermissionResponse {
  hasPermission: boolean;
  userId: string;
  resource: string;
  permission: string;
}

export const rbacApi = createApi({
  reducerPath: 'rbacApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['UserPermissions'],
  endpoints: (builder) => ({
    // Get all permissions for current user
    getUserPermissions: builder.query<ResourcePermission[], void>({
      query: () => '/rbac/permissions/user',
      providesTags: ['UserPermissions'],
    }),

    // Check if user has specific permission
    checkUserPermission: builder.mutation<
      CheckPermissionResponse,
      CheckPermissionRequest
    >({
      query: (body: CheckPermissionRequest) => ({
        url: '/rbac/permissions/check',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetUserPermissionsQuery, useCheckUserPermissionMutation } =
  rbacApi;
