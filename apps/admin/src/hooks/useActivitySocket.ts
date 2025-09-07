import { useEffect, useRef } from 'react';
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

interface UseActivitySocketProps {
  onNewActivity: (activity: Activity) => void;
  onRecentActivities: (activities: Activity[]) => void;
}

export const useActivitySocket = ({
  onNewActivity,
  onRecentActivities,
}: UseActivitySocketProps) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socket = io(`${import.meta.env.VITE_APP_BACKEND_URL}/activity`, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socketRef.current = socket;

    // Join admin room for activity updates
    socket.emit('join-admin-room');

    // Listen for new activities
    socket.on('new-activity', (activity: Activity) => {
      onNewActivity(activity);
    });

    // Listen for recent activities
    socket.on('recent-activities', (activities: Activity[]) => {
      onRecentActivities(activities);
    });

    // Request recent activities on connection
    socket.emit('get-recent-activities', { limit: 10 });

    // Cleanup on unmount
    return () => {
      socket.emit('leave-admin-room');
      socket.disconnect();
    };
  }, [onNewActivity, onRecentActivities]);

  const requestRecentActivities = (limit = 10) => {
    if (socketRef.current) {
      socketRef.current.emit('get-recent-activities', { limit });
    }
  };

  return {
    requestRecentActivities,
  };
};
