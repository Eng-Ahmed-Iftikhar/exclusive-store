import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routers/routes';
import { FiPackage, FiDollarSign, FiArrowRight } from 'react-icons/fi';

interface RelatedOrderSectionProps {
  order: {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
  };
}

const RelatedOrderSection: React.FC<RelatedOrderSectionProps> = ({ order }) => {
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleViewOrder = () => {
    navigate(`${ROUTES.ADMIN_FINANCE}/orders/${order.id}`);
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiPackage className="w-5 h-5" />
          Related Order
        </h2>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Order Number
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
            {order.orderNumber}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Amount
            </p>
            <div className="flex items-center gap-2 mt-1">
              <FiDollarSign className="w-4 h-4 text-gray-500" />
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(order.total)}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
            <span
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.toUpperCase()}
            </span>
          </div>
        </div>

        <button
          onClick={handleViewOrder}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          View Order Details
          <FiArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default RelatedOrderSection;
