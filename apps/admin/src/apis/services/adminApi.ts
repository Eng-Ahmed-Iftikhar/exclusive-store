import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../routes';
import { baseQueryWithReauth } from './baseApi';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Dashboard', 'Products', 'Orders', 'Activity'],
  endpoints: (builder) => ({
    // Dashboard Statistics
    getDashboardStats: builder.query({
      providesTags: ['Dashboard'],
      query: () => API_ROUTES.ADMIN.DASHBOARD_STATS,
    }),

    // Dashboard Charts
    getDashboardCharts: builder.query({
      providesTags: ['Dashboard'],
      query: () => API_ROUTES.ADMIN.DASHBOARD_CHARTS,
    }),

    // Activity endpoints
    getRecentActivities: builder.query({
      providesTags: ['Activity'],
      query: (params?: { limit?: number }) => ({
        url: API_ROUTES.ACTIVITY.RECENT,
        params,
      }),
    }),
    getActivitiesByType: builder.query({
      providesTags: ['Activity'],
      query: ({ type, limit }: { type: string; limit?: number }) => ({
        url: API_ROUTES.ACTIVITY.BY_TYPE,
        params: { type, limit },
      }),
    }),
    getActivitiesByUser: builder.query({
      providesTags: ['Activity'],
      query: ({ userId, limit }: { userId: string; limit?: number }) => ({
        url: API_ROUTES.ACTIVITY.BY_USER,
        params: { userId, limit },
      }),
    }),

    // Products
    getProducts: builder.query({
      query: (params) => ({
        url: API_ROUTES.ITEMS.LIST,
        params,
      }),
      providesTags: ['Products'],
    }),

    getProductById: builder.query({
      query: (id) => API_ROUTES.ITEMS.BY_ID(id),
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),

    createProduct: builder.mutation({
      query: (product) => ({
        url: API_ROUTES.ITEMS.CREATE,
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Products'],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: API_ROUTES.ITEMS.UPDATE(id),
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Products', id },
        'Products',
      ],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ITEMS.DELETE(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),

    // Orders
    getOrders: builder.query({
      query: (params) => ({
        url: API_ROUTES.ORDERS.LIST,
        params,
      }),
      providesTags: ['Orders'],
    }),

    getOrderById: builder.query({
      query: (id) => API_ROUTES.ORDERS.BY_ID(id),
      providesTags: (result, error, id) => [{ type: 'Orders', id }],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: API_ROUTES.ORDERS.UPDATE_STATUS(id),
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Orders', id },
        'Orders',
      ],
    }),

    // Categories
    getCategories: builder.query({
      query: (params) => ({
        url: API_ROUTES.CATEGORIES.LIST,
        params,
      }),
      providesTags: ['Products'],
    }),

    // Flash Sales
    getFlashSales: builder.query({
      query: () => API_ROUTES.FLASH_SALES.LIST,
      providesTags: ['Products'],
    }),

    // Reviews
    getPendingReviews: builder.query({
      query: () => API_ROUTES.ITEMS.REVIEWS.PENDING,
      providesTags: ['Products'],
    }),

    approveReview: builder.mutation({
      query: ({ id, isApproved }) => ({
        url: API_ROUTES.ITEMS.REVIEWS.APPROVE(id),
        method: 'PUT',
        body: { isApproved },
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetDashboardChartsQuery,
  useGetRecentActivitiesQuery,
  useGetActivitiesByTypeQuery,
  useGetActivitiesByUserQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useGetCategoriesQuery,
  useGetFlashSalesQuery,
  useGetPendingReviewsQuery,
  useApproveReviewMutation,
} = adminApi;
