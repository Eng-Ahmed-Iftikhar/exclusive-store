import React from 'react';
import { PermissionGuard } from '@/components/PermissionGuard';
import LiveOrdersTable from '@/sections/app/finance/LiveOrdersTable';

const LiveOrdersView: React.FC = () => {
  const handleViewOrder = (orderId: string) => {
    // Navigate to order detail page
    window.location.href = `/finance/orders/${orderId}`;
  };

  const handleUpdateStatus = (orderId: string, status: string) => {
    // Handle order status update
    console.log(`Updating order ${orderId} to status: ${status}`);
  };

  const handleMarkAsDelivered = (orderId: string) => {
    // Handle marking order as delivered
    console.log(`Marking order ${orderId} as delivered`);
  };

  return (
    <PermissionGuard action="view" subject="orders">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Live Orders
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage orders that are not yet delivered
            </p>
          </div>
        </div>

        <LiveOrdersTable
          onViewOrder={handleViewOrder}
          onUpdateStatus={handleUpdateStatus}
          onMarkAsDelivered={handleMarkAsDelivered}
        />
      </div>
    </PermissionGuard>
  );
};

export default LiveOrdersView;
