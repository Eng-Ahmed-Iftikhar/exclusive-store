import React, { useState } from 'react';
import { PermissionGuard } from '@/components/PermissionGuard';
import OrderHistoryTable from '@/sections/app/finance/order-history/OrderHistoryTable';
import {
  useExportOrdersCSVMutation,
  AdminOrderQuery,
} from '@/apis/services/orderApi';

const OrderHistoryView: React.FC = () => {
  const [exportFilters, setExportFilters] = useState<AdminOrderQuery>({});
  const [exportCSV] = useExportOrdersCSVMutation();

  const handleViewOrder = (orderId: string) => {
    // Navigate to order detail page
    window.location.href = `/finance/orders/${orderId}`;
  };

  const handleExportOrders = async () => {
    try {
      await exportCSV(exportFilters).unwrap();
    } catch (error) {
      console.error('Failed to export orders as CSV:', error);
    }
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
          <button
            onClick={handleExportOrders}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Export CSV
          </button>
        </div>

        <OrderHistoryTable
          onViewOrder={handleViewOrder}
          onFiltersChange={setExportFilters}
        />
      </div>
    </PermissionGuard>
  );
};

export default OrderHistoryView;
