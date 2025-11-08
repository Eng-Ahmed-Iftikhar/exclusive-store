import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';
import { API_ROUTES } from '../routes';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationDto {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export interface NotificationResponse {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount: number;
}

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Notification'],
  endpoints: (builder) => ({
    // Get all notifications with pagination
    getNotifications: builder.query<
      NotificationResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: API_ROUTES.NOTIFICATIONS.LIST,
        params: { page, limit },
      }),
      providesTags: ['Notification'],
    }),

    // Get unread notifications count
    getUnreadCount: builder.query<{ count: number }, void>({
      query: () => API_ROUTES.NOTIFICATIONS.UNREAD_COUNT,
      providesTags: ['Notification'],
    }),

    // Mark notification as read
    markAsRead: builder.mutation<void, string>({
      query: (id) => ({
        url: `${API_ROUTES.NOTIFICATIONS.BASE}/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),

    // Mark all notifications as read
    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: API_ROUTES.NOTIFICATIONS.MARK_ALL_READ,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),

    // Delete notification
    deleteNotification: builder.mutation<void, string>({
      query: (id) => ({
        url: `${API_ROUTES.NOTIFICATIONS.BASE}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),

    // Create notification (for admin use)
    createNotification: builder.mutation<Notification, CreateNotificationDto>({
      query: (notification) => ({
        url: API_ROUTES.NOTIFICATIONS.BASE,
        method: 'POST',
        body: notification,
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useCreateNotificationMutation,
} = notificationApi;
