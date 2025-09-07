import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';
import { API_ROUTES } from '../routes';

export interface Resource {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResourceDto {
  name: string;
  displayName: string;
  description?: string;
}

export interface UpdateResourceDto {
  displayName?: string;
  description?: string;
  isActive?: boolean;
}

export interface ResourceResponse {
  resources: Resource[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const resourceApi = createApi({
  reducerPath: 'resourceApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Resource'],
  endpoints: (builder) => ({
    // Get all resources with pagination
    getResources: builder.query<
      ResourceResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search = '' }) => ({
        url: API_ROUTES.RESOURCES.LIST,
        params: { page, limit, search },
      }),
      providesTags: ['Resource'],
    }),

    // Get active resources
    getActiveResources: builder.query<Resource[], void>({
      query: () => API_ROUTES.RESOURCES.ACTIVE,
      providesTags: ['Resource'],
    }),

    // Get resource by ID
    getResourceById: builder.query<Resource, string>({
      query: (id) => `${API_ROUTES.RESOURCES.BASE}/${id}`,
      providesTags: (result, error, id) => [{ type: 'Resource', id }],
    }),

    // Create resource
    createResource: builder.mutation<Resource, CreateResourceDto>({
      query: (resource) => ({
        url: API_ROUTES.RESOURCES.BASE,
        method: 'POST',
        body: resource,
      }),
      invalidatesTags: ['Resource'],
    }),

    // Update resource
    updateResource: builder.mutation<
      Resource,
      { id: string; data: UpdateResourceDto }
    >({
      query: ({ id, data }) => ({
        url: `${API_ROUTES.RESOURCES.BASE}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Resource', id },
        'Resource',
      ],
    }),

    // Delete resource
    deleteResource: builder.mutation<void, string>({
      query: (id) => ({
        url: `${API_ROUTES.RESOURCES.BASE}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Resource'],
    }),
  }),
});

export const {
  useGetResourcesQuery,
  useGetActiveResourcesQuery,
  useGetResourceByIdQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
} = resourceApi;
