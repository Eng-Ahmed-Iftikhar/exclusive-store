import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { Notification } from '../types/notification';
import { useAuth } from './useAuth';

const SOCKET_URL = import.meta.env.VITE_APP_BACKEND_URL + '/api/notifications';

interface UseNotificationSocketOptions {
  onNotification?: (notification: Notification) => void;
  onUnreadCountUpdate?: (count: number) => void;
  autoConnect?: boolean;
}

export const useNotificationSocket = (
  options: UseNotificationSocketOptions = {}
) => {
  const { onNotification, onUnreadCountUpdate, autoConnect = true } = options;
  const { auth } = useAuth();
  const token = auth?.token;
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      return;
    }
    if (!token) {
      console.warn(
        'No access token found, cannot connect to notification socket'
      );
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('✅ Connected to notification socket');
      setIsConnected(true);

      // Authenticate after connection
      socket.emit('authenticate', { token });
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from notification socket');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Handle new notifications
    socket.on('notification', (notification: Notification) => {
      console.log('📩 New notification received:', notification);

      // Update unread count
      setUnreadCount((prev) => prev + 1);

      // Call custom handler
      if (onNotification) {
        onNotification(notification);
      }

      // Show toast notification
      const toastOptions = {
        description: notification.message,
        duration: 5000,
      };

      switch (notification.category) {
        case 'success':
          toast.success(notification.title, toastOptions);
          break;
        case 'error':
          toast.error(notification.title, toastOptions);
          break;
        case 'warning':
          toast.warning(notification.title, toastOptions);
          break;
        case 'info':
        default:
          toast.info(notification.title, toastOptions);
          break;
      }
    });

    // Handle unread count updates
    socket.on('unread-count', (data: { count: number }) => {
      console.log('📊 Unread count updated:', data.count);
      setUnreadCount(data.count);

      if (onUnreadCountUpdate) {
        onUnreadCountUpdate(data.count);
      }
    });

    socketRef.current = socket;
  }, [onNotification, onUnreadCountUpdate, token]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('mark-as-read', { notificationId });
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  }, []);

  const markAllAsRead = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('mark-all-as-read');
      setUnreadCount(0);
    }
  }, []);

  const getNotifications = useCallback((page = 1, limit = 10) => {
    return new Promise<Notification[]>((resolve) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit(
          'get-notifications',
          { page, limit },
          (response: Notification[]) => {
            resolve(response);
          }
        );
      } else {
        resolve([]);
      }
    });
  }, []);

  useEffect(() => {
    if (!autoConnect) return;
    if (token) {
      connect();
    } else {
      // If no token, ensure we are disconnected
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, token, connect, disconnect]);

  return {
    isConnected,
    unreadCount,
    connect,
    disconnect,
    markAsRead,
    markAllAsRead,
    getNotifications,
  };
};
