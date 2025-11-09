import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useGetRecentActivitiesQuery } from '../../../apis/services/adminApi';
import { useActivitySocket } from '../../../hooks/useActivitySocket';
import {
  FiShoppingCart,
  FiUser,
  FiPackage,
  FiCreditCard,
  FiTrendingUp,
  FiRefreshCw,
} from 'react-icons/fi';

interface ActivityItem {
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

const RecentActivity: React.FC = () => {
  const { theme } = useSelector((state: RootState) => state.ui);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Fetch initial activities
  const {
    data: initialActivities,
    isLoading,
    error,
    refetch: requestRecentActivities,
  } = useGetRecentActivitiesQuery({ limit: 10 });

  // Handle new activity from WebSocket
  const handleNewActivity = useCallback((activity: ActivityItem) => {
    setActivities((prev) => [activity, ...prev.slice(0, 9)]); // Keep only 10 most recent
  }, []);

  // Set up WebSocket connection
  const { isConnected, newActivity } = useActivitySocket();

  // Update activities when initial data loads
  React.useEffect(() => {
    if (initialActivities) {
      setActivities(initialActivities);
    }
  }, [initialActivities]);
  // Update activities when a new activity is received
  React.useEffect(() => {
    if (newActivity) {
      handleNewActivity(newActivity);
    }
  }, [newActivity, handleNewActivity]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getAmountFromMetadata = (
    metadata: Record<string, any>,
    type: string
  ) => {
    if (type === 'payment' && metadata?.amount) {
      return `$${metadata.amount}`;
    }
    if (type === 'revenue' && metadata?.amount) {
      return `$${metadata.amount}`;
    }
    if (type === 'order' && metadata?.total) {
      return `$${metadata.total}`;
    }
    return null;
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    const iconClass = 'w-5 h-5';
    const iconColor = theme === 'dark' ? 'text-white' : 'text-gray-600';

    switch (type) {
      case 'order':
        return <FiShoppingCart className={`${iconClass} ${iconColor}`} />;
      case 'user':
        return <FiUser className={`${iconClass} ${iconColor}`} />;
      case 'product':
        return <FiPackage className={`${iconClass} ${iconColor}`} />;
      case 'payment':
        return <FiCreditCard className={`${iconClass} ${iconColor}`} />;
      case 'revenue':
        return <FiTrendingUp className={`${iconClass} ${iconColor}`} />;
      case 'system':
        return <FiRefreshCw className={`${iconClass} ${iconColor}`} />;
      default:
        return <FiShoppingCart className={`${iconClass} ${iconColor}`} />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'order':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'user':
        return 'bg-green-100 dark:bg-green-900/30';
      case 'product':
        return 'bg-purple-100 dark:bg-purple-900/30';
      case 'payment':
        return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'revenue':
        return 'bg-emerald-100 dark:bg-emerald-900/30';
      case 'system':
        return 'bg-gray-100 dark:bg-gray-900/30';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <div
      className={`p-6 rounded-xl border ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3
            className={`text-lg font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Recent Activity
          </h3>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span
              className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>
        <button
          onClick={() => requestRecentActivities()}
          className={`text-sm font-medium transition-colors ${
            theme === 'dark'
              ? 'text-blue-400 hover:text-blue-300'
              : 'text-blue-600 hover:text-blue-500'
          }`}
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-lg">
              <div className="w-9 h-9 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">
            <svg
              className="w-8 h-8 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p
            className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Failed to load activities
          </p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8">
          <div className={`text-gray-400 mb-2`}>
            <FiRefreshCw className="w-8 h-8 mx-auto" />
          </div>
          <p
            className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            No recent activities
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.map((activity) => {
            const amount = getAmountFromMetadata(
              activity.metadata || {},
              activity.type
            );
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div
                  className={`p-2 rounded-lg ${getActivityColor(
                    activity.type
                  )}`}
                >
                  {getActivityIcon(activity.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {activity.title}
                    </h4>
                    {amount && (
                      <span
                        className={`text-sm font-semibold ${
                          theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}
                      >
                        {amount}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {activity.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p
                      className={`text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}
                    >
                      {formatTimeAgo(activity.createdAt)}
                    </p>
                    {activity.user && (
                      <p
                        className={`text-xs ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        }`}
                      >
                        by {activity.user.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
