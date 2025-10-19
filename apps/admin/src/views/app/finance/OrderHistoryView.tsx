import React from 'react';
import { PermissionGuard } from '@/components/PermissionGuard';
import OrderHistoryTable from '@/sections/app/finance/OrderHistoryTable';

const OrderHistoryView: React.FC = () => {
  const handleViewOrder = (orderId: string) => {
    // Navigate to order detail page
    window.location.href = `/finance/orders/${orderId}`;
  };

  const handleExportOrders = (format: 'csv' | 'excel') => {
    // Handle order export
    console.log(`Exporting orders in ${format} format`);
  };

  const handleRefundOrder = (orderId: string) => {
    // Handle order refund
    console.log(`Processing refund for order ${orderId}`);
  };

  return (
    <PermissionGuard action="view" subject="orders">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Order History
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete history of all orders with advanced filtering
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleExportOrders('csv')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExportOrders('excel')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Export Excel
            </button>
          </div>
        </div>

        <OrderHistoryTable
          onViewOrder={handleViewOrder}
          onRefundOrder={handleRefundOrder}
        />
      </div>
    </PermissionGuard>
  );
};

export default OrderHistoryView;
