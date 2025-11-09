import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Activity {
  id: string;
  type: 'order' | 'user' | 'product' | 'payment' | 'revenue' | 'system';
  title: string;
  description: string;
  metadata?: Record<string, any>;
  userId?: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export const useActivitySocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [newActivity, setNewActivity] = useState<any>(null);

  useEffect(() => {
    // Initialize socket connection
    // Backend gateway namespace is '/activity', so connect directly to that path
    const baseUrl = import.meta.env.VITE_APP_BACKEND_URL;
    const socket = io(`${baseUrl}/api/activity`, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    // Join admin room for activity updates
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to Activity WebSocket');
    });

    // Listen for new activities
    socket.on('new-activity', (activity: Activity) => {
      setNewActivity(activity);
    });
    // Cleanup on unmount
    return () => {
      socket.emit('leave-admin-room');
      socket.disconnect();
    };
  }, []);

  return {
    isConnected,
    newActivity,
  };
};
