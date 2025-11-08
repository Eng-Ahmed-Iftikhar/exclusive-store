export interface Notification {
  id: string;
  type:
    | 'order'
    | 'product'
    | 'payment'
    | 'user'
    | 'review'
    | 'system'
    | 'security';
  category: 'success' | 'error' | 'warning' | 'info';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  isRead: boolean;
  userId?: string;
  targetRole?: string;
  isBroadcast: boolean;
  metadata?: Record<string, unknown>;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount: number;
}

export interface CreateNotificationDto {
  type:
    | 'order'
    | 'product'
    | 'payment'
    | 'user'
    | 'review'
    | 'system'
    | 'security';
  category: 'success' | 'error' | 'warning' | 'info';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  userId?: string;
  targetRole?: string;
  isBroadcast?: boolean;
  metadata?: Record<string, unknown>;
  expiresAt?: string;
}
