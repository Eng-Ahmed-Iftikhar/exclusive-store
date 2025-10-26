import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PermissionGuard } from '@/components/PermissionGuard';
import OrderDetailSection from '@/sections/app/finance/order-detail/OrderDetailSection';
import { ROUTES } from '@/routers/routes';

const OrderDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(ROUTES.ADMIN_LIVE_ORDERS);
  };

  if (!id) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
            Order ID Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Invalid order ID in URL.
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <PermissionGuard action="view" subject="orders">
      <div className="space-y-6">
        <OrderDetailSection orderId={id} onBack={handleBack} />
      </div>
    </PermissionGuard>
  );
};

export default OrderDetailView;
