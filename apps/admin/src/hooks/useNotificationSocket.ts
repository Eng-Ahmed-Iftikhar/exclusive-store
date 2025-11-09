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

// Create audio element ID
const NOTIFICATION_AUDIO_ID = 'notification-sound-player';

// Helper function to get or create audio element in DOM
const getAudioElement = (): HTMLAudioElement => {
  let audioElement = document.getElementById(
    NOTIFICATION_AUDIO_ID
  ) as HTMLAudioElement;

  if (!audioElement) {
    audioElement = document.createElement('audio');
    audioElement.id = NOTIFICATION_AUDIO_ID;
    audioElement.preload = 'auto';
    audioElement.volume = 0.5;

    // Try to add notification sound source
    const source = document.createElement('source');
    source.src = '/notification-sound.mp3';
    source.type = 'audio/mpeg';
    audioElement.appendChild(source);

    // Add to body (hidden)
    audioElement.style.display = 'none';
    document.body.appendChild(audioElement);
  }

  return audioElement;
};

// Helper function to play notification sound
const playNotificationSound = () => {
  try {
    const audioElement = getAudioElement();

    // Reset audio to start
    audioElement.currentTime = 0;

    // Play the audio
    const playPromise = audioElement.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn('Failed to play notification sound:', error);
        // Silently fail - audio blocked by browser policy or file not found
      });
    }
  } catch (error) {
    console.warn('Failed to play notification sound:', error);
  }
};

// Store the original document title
const originalTitle = document.title || 'Admin';

// Helper function to update document title with notification count
const updateDocumentTitle = (count: number) => {
  if (count > 0) {
    document.title = `(${count}) ${originalTitle}`;
  } else {
    document.title = originalTitle;
  }
};

export const useNotificationSocket = (
  options: UseNotificationSocketOptions = {}
) => {
  const { onNotification, onUnreadCountUpdate, autoConnect = true } = options;
  const { auth } = useAuth();
  const token = auth?.token;
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Create audio element on mount
  useEffect(() => {
    // Initialize audio element in DOM
    getAudioElement();

    return () => {
      // Cleanup: Remove audio element on unmount
      const audioElement = document.getElementById(NOTIFICATION_AUDIO_ID);
      if (audioElement) {
        audioElement.remove();
      }
    };
  }, []);

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
      setUnreadCount((prev) => prev + 1);

      // Play notification sound
      playNotificationSound();

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
    socket.on('unread-count', (data: { unreadCount: number }) => {
      console.log('📊 Unread count updated:', data.unreadCount);
      setUnreadCount(data.unreadCount);

      if (onUnreadCountUpdate) {
        onUnreadCountUpdate(data.unreadCount);
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

  // Update document title when unread count changes
  useEffect(() => {
    updateDocumentTitle(unreadCount);

    // Cleanup: Reset title on unmount
    return () => {
      document.title = originalTitle;
    };
  }, [unreadCount]);

  return {
    isConnected,
    unreadCount,
    connect,
    disconnect,
    getNotifications,
  };
};
