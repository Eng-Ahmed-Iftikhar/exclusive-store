import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PermissionGuard } from '@/components/PermissionGuard';
import LiveOrdersTable from '@/sections/app/finance/live-orders/LiveOrdersTable';
import { ROUTES } from '@/routers/routes';

const LiveOrdersView: React.FC = () => {
  const navigate = useNavigate();

  const handleViewOrder = (orderId: string) => {
    navigate(`${ROUTES.ADMIN_FINANCE}/orders/${orderId}`);
  };

  return (
    <PermissionGuard action="view" subject="order">
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

        <LiveOrdersTable onViewOrder={handleViewOrder} />
      </div>
    </PermissionGuard>
  );
};

export default LiveOrdersView;
