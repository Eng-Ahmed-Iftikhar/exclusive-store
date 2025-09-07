import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';
import { API_ROUTES } from '../routes';

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  isSystem: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    roleResources: number;
    userTeams: number;
  };
}

export interface RoleWithResources extends Role {
  roleResources: Array<{
    id: string;
    resourceId: string;
    permissionId: string;
    resource: {
      id: string;
      name: string;
      displayName: string;
    };
    permission: {
      id: string;
      name: string;
      displayName: string;
    };
  }>;
}

export interface CreateRoleDto {
  name: string;
  displayName: string;
  description?: string;
  assignments?: Array<{
    resourceId: string;
    permissionId: string;
  }>;
}

export interface UpdateRoleDto {
  displayName?: string;
  description?: string;
  isActive?: boolean;
  assignments?: Array<{
    resourceId: string;
    permissionId: string;
  }>;
}

export interface AssignResourceToRoleDto {
  roleId: string;
  resourceId: string;
  permissionId: string;
}

export interface BulkAssignResourcesDto {
  roleId: string;
  assignments: Array<{
    resourceId: string;
    permissionId: string;
  }>;
}

export interface RoleResponse {
  roles: Role[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const roleApi = createApi({
  reducerPath: 'roleApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Role'],
  endpoints: (builder) => ({
    // Get all roles with pagination
    getRoles: builder.query<
      RoleResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search = '' }) => ({
        url: API_ROUTES.ROLES.LIST,
        params: { page, limit, search },
      }),
      providesTags: ['Role'],
    }),

    // Get all active roles
    getActiveRoles: builder.query<Role[], void>({
      query: () => API_ROUTES.ROLES.ACTIVE,
      providesTags: ['Role'],
    }),

    // Get system roles
    getSystemRoles: builder.query<Role[], void>({
      query: () => API_ROUTES.ROLES.SYSTEM,
      providesTags: ['Role'],
    }),

    // Get role by ID
    getRoleById: builder.query<RoleWithResources, string>({
      query: (id) => `${API_ROUTES.ROLES.BASE}/${id}`,
      providesTags: (result, error, id) => [{ type: 'Role', id }],
    }),

    // Create role
    createRole: builder.mutation<Role, CreateRoleDto>({
      query: (role) => ({
        url: API_ROUTES.ROLES.BASE,
        method: 'POST',
        body: role,
      }),
      invalidatesTags: ['Role'],
    }),

    // Update role
    updateRole: builder.mutation<Role, { id: string; data: UpdateRoleDto }>({
      query: ({ id, data }) => ({
        url: `${API_ROUTES.ROLES.BASE}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Role', id },
        'Role',
      ],
    }),

    // Delete role
    deleteRole: builder.mutation<void, string>({
      query: (id) => ({
        url: `${API_ROUTES.ROLES.BASE}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Role'],
    }),

    // Assign resource to role
    assignResourceToRole: builder.mutation<any, AssignResourceToRoleDto>({
      query: ({ roleId, resourceId, permissionId }) => ({
        url: `${API_ROUTES.ROLES.BASE}/${roleId}/resources`,
        method: 'POST',
        body: { roleId, resourceId, permissionId },
      }),
      invalidatesTags: (result, error, { roleId }) => [
        { type: 'Role', id: roleId },
        'Role',
      ],
    }),

    // Bulk assign resources to role
    bulkAssignResourcesToRole: builder.mutation<any, BulkAssignResourcesDto>({
      query: ({ roleId, assignments }) => ({
        url: `${API_ROUTES.ROLES.BASE}/${roleId}/resources/bulk`,
        method: 'POST',
        body: { roleId, assignments },
      }),
      invalidatesTags: (result, error, { roleId }) => [
        { type: 'Role', id: roleId },
        'Role',
      ],
    }),

    // Get role resources
    getRoleResources: builder.query<any[], string>({
      query: (roleId) => `${API_ROUTES.ROLES.BASE}/${roleId}/resources`,
      providesTags: (result, error, roleId) => [{ type: 'Role', id: roleId }],
    }),

    // Remove resource from role
    removeResourceFromRole: builder.mutation<
      void,
      { roleId: string; resourceId: string; permissionId: string }
    >({
      query: ({ roleId, resourceId, permissionId }) => ({
        url: `${API_ROUTES.ROLES.BASE}/${roleId}/resources/${resourceId}/permissions/${permissionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { roleId }) => [
        { type: 'Role', id: roleId },
        'Role',
      ],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetActiveRolesQuery,
  useGetSystemRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useAssignResourceToRoleMutation,
  useBulkAssignResourcesToRoleMutation,
  useGetRoleResourcesQuery,
  useRemoveResourceFromRoleMutation,
} = roleApi;
