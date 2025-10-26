import React from 'react';
import { FiClock, FiEdit, FiTruck, FiFileText, FiX } from 'react-icons/fi';
import { OrderActivity } from '@/apis/services/orderApi';

interface OrderActivitySectionProps {
  activities: OrderActivity[];
}

const OrderActivitySection: React.FC<OrderActivitySectionProps> = ({
  activities,
}) => {
  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'status_change':
        return <FiEdit className="w-4 h-4" />;
      case 'shipping_update':
        return <FiTruck className="w-4 h-4" />;
      case 'notes_update':
        return <FiFileText className="w-4 h-4" />;
      case 'order_cancelled':
        return <FiX className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

  const getActivityTitle = (activity: OrderActivity) => {
    switch (activity.action) {
      case 'status_change':
        return (
          <span>
            Status changed from{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {activity.oldValue?.replace('_', ' ').toUpperCase()}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {activity.newValue?.replace('_', ' ').toUpperCase()}
            </span>
          </span>
        );
      case 'shipping_update':
        return (
          <span>
            {activity.field === 'trackingNumber' && 'Tracking number'}
            {activity.field === 'carrier' && 'Carrier'}
            {activity.field === 'estimatedDelivery' && 'Estimated delivery'}
            {activity.field === 'actualDelivery' && 'Actual delivery'} updated
            {activity.newValue && (
              <span className="font-semibold text-gray-700 dark:text-gray-300 ml-1">
                {activity.newValue}
              </span>
            )}
          </span>
        );
      case 'notes_update':
        return (
          <span>
            {activity.field === 'notes' ? 'Customer notes' : 'Internal notes'}{' '}
            updated
          </span>
        );
      default:
        return activity.action.replace('_', ' ');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiClock className="w-5 h-5" />
          Order Activity ({activities.length})
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-slate-700 last:border-0 last:pb-0"
            >
              <div className="mt-1">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {getActivityIcon(activity.action)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white">
                  {getActivityTitle(activity)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(activity.createdAt)}
                  </span>
                  {activity.performedByUser && (
                    <>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        by {activity.performedByUser.name}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderActivitySection;
