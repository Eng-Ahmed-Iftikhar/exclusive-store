import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiBell, FiCheck, FiCheckCircle, FiX } from 'react-icons/fi';
import { useNotificationSocket } from '../hooks/useNotificationSocket';
import { Notification } from '../types/notification';
import { formatDistanceToNow } from 'date-fns';
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from '../apis/services/notificationApi';

import Badge from './ui/badge';

interface NotificationBellProps {
  theme?: 'light' | 'dark';
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  theme = 'light',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: notificationsData, refetch } = useGetNotificationsQuery({
    page: 1,
    limit: 20,
  });

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const onNotification = useCallback(
    (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      refetch();
    },
    [refetch]
  );

  const { unreadCount } = useNotificationSocket({
    onNotification,
  });

  useEffect(() => {
    if (notificationsData?.data) {
      setNotifications(notificationsData.data as unknown as Notification[]);
    }
  }, [notificationsData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // Optimistically update UI
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );

      // Update via REST API
      await markAsRead(notificationId).unwrap();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Revert optimistic update on error
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: false } : n))
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Optimistically update UI
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

      // Update via REST API
      await markAllAsRead().unwrap();

      // Refetch to sync with backend
      refetch();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      // Refetch to restore correct state on error
      refetch();
    }
  };

  const getNotificationIcon = (notification: Notification) => {
    const iconClass = 'w-5 h-5';

    switch (notification.category) {
      case 'success':
        return <FiCheckCircle className={`${iconClass} text-green-500`} />;
      case 'error':
        return <FiX className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <FiBell className={`${iconClass} text-yellow-500`} />;
      case 'info':
      default:
        return <FiBell className={`${iconClass} text-blue-500`} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'low':
      default:
        return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl transition-all duration-200 ${
          theme === 'dark'
            ? 'text-slate-400 hover:text-white hover:bg-slate-700'
            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
        }`}
      >
        <FiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 animate-pulse">
            <Badge count={unreadCount} />
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-96 rounded-xl shadow-2xl border overflow-hidden z-50 ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
          }`}
        >
          {/* Header */}
          <div
            className={`px-4 py-3 border-b flex items-center justify-between ${
              theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <h3
                className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                Notifications
              </h3>
              {unreadCount > 0 && (
                <Badge
                  count={unreadCount}
                  className="px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full"
                />
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className={`text-xs font-medium transition-colors ${
                  theme === 'dark'
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[500px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <FiBell
                  className={`w-12 h-12 mx-auto mb-3 ${
                    theme === 'dark' ? 'text-slate-600' : 'text-slate-300'
                  }`}
                />
                <p
                  className={`text-sm ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  No notifications yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer ${
                      !notification.isRead
                        ? 'bg-blue-50/50 dark:bg-blue-900/10'
                        : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4
                            className={`text-sm font-semibold ${
                              theme === 'dark' ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className={`flex-shrink-0 p-1 rounded-lg transition-colors ${
                                theme === 'dark'
                                  ? 'text-slate-400 hover:text-white hover:bg-slate-600'
                                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                              }`}
                              title="Mark as read"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <p
                          className={`text-sm mb-2 ${
                            theme === 'dark'
                              ? 'text-slate-300'
                              : 'text-slate-600'
                          }`}
                        >
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs ${
                              theme === 'dark'
                                ? 'text-slate-400'
                                : 'text-slate-500'
                            }`}
                          >
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              {
                                addSuffix: true,
                              }
                            )}
                          </span>
                          {notification.priority !== 'low' && (
                            <span
                              className={`text-xs capitalize px-2 py-0.5 rounded-full border ${getPriorityColor(
                                notification.priority
                              )}`}
                            >
                              {notification.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div
              className={`px-4 py-3 border-t text-center ${
                theme === 'dark'
                  ? 'border-slate-700 bg-slate-900/50'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <button
                className={`text-sm font-medium transition-colors ${
                  theme === 'dark'
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
