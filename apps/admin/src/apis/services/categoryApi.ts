import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';
import { API_ROUTES } from '../routes';

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  isActive?: boolean;
  sortOrder?: number;
  subcategories?: CreateSubcategoryRequest[];
}

export interface CreateSubcategoryRequest {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  icon?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateSubcategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  icon?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface CategoryQueryParams {
  includeInactive?: boolean;
}

export interface SubcategoryQueryParams {
  categoryId: string;
  includeInactive?: boolean;
}

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Category', 'Subcategory'],
  endpoints: (builder) => ({
    // Category endpoints
    getCategories: builder.query<Category[], CategoryQueryParams>({
      query: (params = {}) => ({
        url: API_ROUTES.CATEGORIES.LIST,
        params: {
          includeInactive: params.includeInactive ? 'true' : 'false',
        },
      }),
      providesTags: ['Category'],
    }),

    getCategoryById: builder.query<Category, string>({
      query: (id) => `${API_ROUTES.CATEGORIES.LIST}/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    getCategoryBySlug: builder.query<Category, string>({
      query: (slug) => `${API_ROUTES.CATEGORIES.LIST}/slug/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Category', id: slug }],
    }),

    createCategory: builder.mutation<Category, CreateCategoryRequest>({
      query: (data) => ({
        url: API_ROUTES.CATEGORIES.LIST,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),

    updateCategory: builder.mutation<
      Category,
      { id: string; data: UpdateCategoryRequest }
    >({
      query: ({ id, data }) => ({
        url: `${API_ROUTES.CATEGORIES.LIST}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Category', id },
        'Category',
      ],
    }),

    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `${API_ROUTES.CATEGORIES.LIST}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),

    // Subcategory endpoints
    getSubcategories: builder.query<Subcategory[], SubcategoryQueryParams>({
      query: ({ categoryId, includeInactive = false }) => ({
        url: `${API_ROUTES.CATEGORIES.LIST}/${categoryId}/subcategories`,
        params: {
          includeInactive: includeInactive ? 'true' : 'false',
        },
      }),
      providesTags: (result, error, { categoryId }) => [
        { type: 'Subcategory', id: categoryId },
      ],
    }),

    getSubcategoryById: builder.query<Subcategory, string>({
      query: (id) => `${API_ROUTES.CATEGORIES.LIST}/subcategories/${id}`,
      providesTags: (result, error, id) => [{ type: 'Subcategory', id }],
    }),

    createSubcategory: builder.mutation<
      Subcategory,
      { categoryId: string; data: CreateSubcategoryRequest }
    >({
      query: ({ categoryId, data }) => ({
        url: `${API_ROUTES.CATEGORIES.LIST}/${categoryId}/subcategories`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { categoryId }) => [
        { type: 'Subcategory', id: categoryId },
        'Category',
      ],
    }),

    updateSubcategory: builder.mutation<
      Subcategory,
      { id: string; data: UpdateSubcategoryRequest }
    >({
      query: ({ id, data }) => ({
        url: `${API_ROUTES.CATEGORIES.LIST}/subcategories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Subcategory', id },
        'Subcategory',
      ],
    }),

    deleteSubcategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `${API_ROUTES.CATEGORIES.LIST}/subcategories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subcategory', 'Category'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetCategoryBySlugQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetSubcategoriesQuery,
  useGetSubcategoryByIdQuery,
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
} = categoryApi;
