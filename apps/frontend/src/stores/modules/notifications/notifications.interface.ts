export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timeout?: number;
  createdAt: Date;
}

export interface NotificationsState {
  notifications: Notification[];
}
