import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';

// ===== TYPES =====

export interface AdminOrderItem {
  id: string;
  variantId: string;
  variant: {
    id: string;
    name: string;
    sku: string;
    product: {
      id: string;
      name: string;
      sku: string;
      category?: {
        id: string;
        name: string;
      };
      subcategory?: {
        id: string;
        name: string;
      };
    };
    images?: Array<{
      id: string;
      url: string;
      isPrimary: boolean;
    }>;
  };
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface OrderActivity {
  id: string;
  orderId: string;
  action: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  performedBy?: string;
  metadata?: any;
  createdAt: string;
  performedByUser?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface OrderActivityListResponse {
  activities: OrderActivity[];
  total: number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  userId?: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    isGuest: boolean;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  items: AdminOrderItem[];
  totals: {
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
  };
  status: AdminOrderStatus;
  paymentStatus: AdminPaymentStatus;
  priority: OrderPriority;
  tags: string[];
  notes?: string;
  internalNotes?: string;
  shipping?: {
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
  };
  payment?: {
    stripePaymentIntentId?: string;
    paymentMethod?: string;
    last4?: string;
    brand?: string;
  };
  timestamps: {
    createdAt: string;
    updatedAt: string;
  };
  totalItems: number;
}

export enum AdminOrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum AdminPaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum OrderPriority {
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface AdminOrderListResponse {
  orders: AdminOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    status?: AdminOrderStatus;
    paymentStatus?: AdminPaymentStatus;
    priority?: OrderPriority;
    search?: string;
    dateRange?: {
      from: string;
      to: string;
    };
  };
}

export interface AdminOrderQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: AdminOrderStatus;
  paymentStatus?: AdminPaymentStatus;
  priority?: OrderPriority;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'total' | 'orderNumber' | 'status';
  sortOrder?: 'asc' | 'desc';
  liveOnly?: boolean;
}

export interface UpdateOrderStatusRequest {
  status: AdminOrderStatus;
  notes?: string;
}

export interface UpdateOrderShippingRequest {
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
}

export interface UpdateOrderNotesRequest {
  notes?: string;
  internalNotes?: string;
}

export interface UpdateOrderPriorityRequest {
  priority: OrderPriority;
}

export interface UpdateOrderTagsRequest {
  tags: string[];
}

export interface OrderStats {
  totalOrders: number;
  byStatus: Record<AdminOrderStatus, number>;
  byPaymentStatus: Record<AdminPaymentStatus, number>;
  byPriority: Record<OrderPriority, number>;
  revenue: {
    total: number;
    average: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  recentActivity: Array<{
    id: string;
    orderNumber: string;
    action: string;
    timestamp: string;
    user?: string;
  }>;
}

// ===== API ENDPOINTS =====

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['AdminOrder'],
  endpoints: (builder) => ({
    // Get all orders with pagination and filters
    getOrders: builder.query<AdminOrderListResponse, AdminOrderQuery>({
      query: (params) => ({
        url: '/admin/orders',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ id }) => ({
                type: 'AdminOrder' as const,
                id,
              })),
              { type: 'AdminOrder', id: 'LIST' },
            ]
          : [{ type: 'AdminOrder', id: 'LIST' }],
    }),

    // Get live orders (not delivered)
    getLiveOrders: builder.query<AdminOrderListResponse, AdminOrderQuery>({
      query: (params) => ({
        url: '/admin/orders/live',
        method: 'GET',
        params: { ...params, liveOnly: true },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ id }) => ({
                type: 'AdminOrder' as const,
                id,
              })),
              { type: 'AdminOrder', id: 'LIVE_LIST' },
            ]
          : [{ type: 'AdminOrder', id: 'LIVE_LIST' }],
    }),

    // Get order by ID
    getOrderById: builder.query<AdminOrder, string>({
      query: (id) => `/admin/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'AdminOrder', id }],
    }),

    // Get order activities
    getOrderActivities: builder.query<OrderActivityListResponse, string>({
      query: (id) => `/admin/orders/${id}/activities`,
      providesTags: (result, error, id) => [
        { type: 'AdminOrder', id: `${id}-activities` },
      ],
    }),

    // Get order statistics
    getOrderStats: builder.query<OrderStats, void>({
      query: () => '/admin/orders/stats',
      providesTags: ['AdminOrder'],
    }),

    // Update order status
    updateOrderStatus: builder.mutation<
      AdminOrder,
      { id: string; data: UpdateOrderStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/orders/${id}/status`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminOrder', id },
        { type: 'AdminOrder', id: 'LIST' },
        { type: 'AdminOrder', id: 'LIVE_LIST' },
      ],
    }),

    // Update order shipping information
    updateOrderShipping: builder.mutation<
      AdminOrder,
      { id: string; data: UpdateOrderShippingRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/orders/${id}/shipping`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminOrder', id },
        { type: 'AdminOrder', id: 'LIST' },
        { type: 'AdminOrder', id: 'LIVE_LIST' },
      ],
    }),

    // Update order notes
    updateOrderNotes: builder.mutation<
      AdminOrder,
      { id: string; data: UpdateOrderNotesRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/orders/${id}/notes`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminOrder', id },
        { type: 'AdminOrder', id: 'LIST' },
        { type: 'AdminOrder', id: 'LIVE_LIST' },
      ],
    }),

    // Update order priority
    updateOrderPriority: builder.mutation<
      AdminOrder,
      { id: string; data: UpdateOrderPriorityRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/orders/${id}/priority`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminOrder', id },
        { type: 'AdminOrder', id: 'LIST' },
        { type: 'AdminOrder', id: 'LIVE_LIST' },
      ],
    }),

    // Update order tags
    updateOrderTags: builder.mutation<
      AdminOrder,
      { id: string; data: UpdateOrderTagsRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/orders/${id}/tags`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminOrder', id },
        { type: 'AdminOrder', id: 'LIST' },
        { type: 'AdminOrder', id: 'LIVE_LIST' },
      ],
    }),

    // Mark order as delivered
    markAsDelivered: builder.mutation<AdminOrder, string>({
      query: (id) => ({
        url: `/admin/orders/${id}/mark-delivered`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'AdminOrder', id },
        { type: 'AdminOrder', id: 'LIST' },
        { type: 'AdminOrder', id: 'LIVE_LIST' },
      ],
    }),

    // Cancel order and process refund
    cancelOrder: builder.mutation<
      AdminOrder,
      { id: string; data: { notes?: string } }
    >({
      query: ({ id, data }) => ({
        url: `/admin/orders/${id}/cancel`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminOrder', id },
        { type: 'AdminOrder', id: 'LIST' },
        { type: 'AdminOrder', id: 'LIVE_LIST' },
      ],
    }),

    // Delete order
    deleteOrder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'AdminOrder', id },
        { type: 'AdminOrder', id: 'LIST' },
        { type: 'AdminOrder', id: 'LIVE_LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetOrdersQuery,
  useGetLiveOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderActivitiesQuery,
  useGetOrderStatsQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderShippingMutation,
  useUpdateOrderNotesMutation,
  useUpdateOrderPriorityMutation,
  useUpdateOrderTagsMutation,
  useMarkAsDeliveredMutation,
  useCancelOrderMutation,
  useDeleteOrderMutation,
  useLazyGetOrdersQuery,
  useLazyGetLiveOrdersQuery,
  useLazyGetOrderByIdQuery,
  useLazyGetOrderStatsQuery,
} = orderApi;

// Export the service instance for direct usage
export const orderService = orderApi;
