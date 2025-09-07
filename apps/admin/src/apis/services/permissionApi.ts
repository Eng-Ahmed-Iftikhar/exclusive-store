import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';
import { API_ROUTES } from '../routes';

export interface Permission {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePermissionDto {
  name: string;
  displayName: string;
  description?: string;
}

export interface UpdatePermissionDto {
  displayName?: string;
  description?: string;
  isActive?: boolean;
}

export interface PermissionResponse {
  permissions: Permission[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const permissionApi = createApi({
  reducerPath: 'permissionApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Permission'],
  endpoints: (builder) => ({
    // Get all permissions with pagination
    getPermissions: builder.query<
      PermissionResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search = '' }) => ({
        url: API_ROUTES.PERMISSIONS.LIST,
        params: { page, limit, search },
      }),
      providesTags: ['Permission'],
    }),

    // Get active permissions
    getActivePermissions: builder.query<Permission[], void>({
      query: () => API_ROUTES.PERMISSIONS.ACTIVE,
      providesTags: ['Permission'],
    }),

    // Get permission by ID
    getPermissionById: builder.query<Permission, string>({
      query: (id) => `${API_ROUTES.PERMISSIONS.BASE}/${id}`,
      providesTags: (result, error, id) => [{ type: 'Permission', id }],
    }),

    // Create permission
    createPermission: builder.mutation<Permission, CreatePermissionDto>({
      query: (permission) => ({
        url: API_ROUTES.PERMISSIONS.BASE,
        method: 'POST',
        body: permission,
      }),
      invalidatesTags: ['Permission'],
    }),

    // Update permission
    updatePermission: builder.mutation<
      Permission,
      { id: string; data: UpdatePermissionDto }
    >({
      query: ({ id, data }) => ({
        url: `${API_ROUTES.PERMISSIONS.BASE}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Permission', id },
        'Permission',
      ],
    }),

    // Delete permission
    deletePermission: builder.mutation<void, string>({
      query: (id) => ({
        url: `${API_ROUTES.PERMISSIONS.BASE}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Permission'],
    }),
  }),
});

export const {
  useGetPermissionsQuery,
  useGetActivePermissionsQuery,
  useGetPermissionByIdQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} = permissionApi;
