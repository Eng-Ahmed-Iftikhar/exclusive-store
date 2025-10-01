import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';
import { API_ROUTES } from '../routes';

// Subcategory Types
export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconFileId?: string;
  isActive: boolean;
  sortOrder: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  iconFile?: {
    id: string;
    url: string;
    originalName: string;
  };
}

export interface CreateSubcategoryRequest {
  name: string;
  slug: string;
  description?: string;
  iconFileId?: string;
  isActive?: boolean;
  sortOrder?: number;
  categoryId: string;
}

export interface UpdateSubcategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  iconFileId?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface SubcategoryQueryParams {
  search?: string;
  categoryId?: string;
  includeInactive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'sortOrder' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface SubcategoryListResponse {
  subcategories: Subcategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const subcategoryApi = createApi({
  reducerPath: 'subcategoryApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Subcategory'],
  endpoints: (builder) => ({
    // Get all subcategories with pagination and filters
    getSubcategories: builder.query<
      SubcategoryListResponse,
      SubcategoryQueryParams
    >({
      query: (params = {}) => ({
        url: API_ROUTES.SUBCATEGORIES.LIST,
        params: {
          search: params.search,
          categoryId: params.categoryId,
          includeInactive: params.includeInactive,
          page: params.page || 1,
          limit: params.limit || 10,
          sortBy: params.sortBy || 'sortOrder',
          sortOrder: params.sortOrder || 'asc',
        },
      }),
      providesTags: ['Subcategory'],
    }),

    // Get subcategory by ID
    getSubcategoryById: builder.query<Subcategory, string>({
      query: (id) => `${API_ROUTES.SUBCATEGORIES.LIST}/${id}`,
      providesTags: (result, error, id) => [{ type: 'Subcategory', id }],
    }),

    // Get subcategory by slug
    getSubcategoryBySlug: builder.query<Subcategory, string>({
      query: (slug) => `${API_ROUTES.SUBCATEGORIES.LIST}/slug/${slug}`,
      providesTags: (result, error, slug) => [
        { type: 'Subcategory', id: slug },
      ],
    }),

    // Get subcategories by category ID
    getSubcategoriesByCategory: builder.query<Subcategory[], string>({
      query: (categoryId) => ({
        url: API_ROUTES.SUBCATEGORIES.LIST,
        params: {
          categoryId,
          includeInactive: false,
          limit: 100, // Get all subcategories for a category
        },
      }),
      transformResponse: (response: SubcategoryListResponse) =>
        response.subcategories,
      providesTags: (result, error, categoryId) => [
        { type: 'Subcategory', id: `category-${categoryId}` },
      ],
    }),

    // Create subcategory
    createSubcategory: builder.mutation<Subcategory, CreateSubcategoryRequest>({
      query: (data) => ({
        url: API_ROUTES.SUBCATEGORIES.LIST,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subcategory'],
    }),

    // Update subcategory
    updateSubcategory: builder.mutation<
      Subcategory,
      { id: string; data: UpdateSubcategoryRequest }
    >({
      query: ({ id, data }) => ({
        url: `${API_ROUTES.SUBCATEGORIES.LIST}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Subcategory', id },
        'Subcategory',
      ],
    }),

    // Delete subcategory
    deleteSubcategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `${API_ROUTES.SUBCATEGORIES.LIST}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subcategory'],
    }),
  }),
});

export const {
  useGetSubcategoriesQuery,
  useGetSubcategoryByIdQuery,
  useGetSubcategoryBySlugQuery,
  useGetSubcategoriesByCategoryQuery,
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
} = subcategoryApi;
