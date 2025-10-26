import React from 'react';
import {
  FiShoppingCart,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
} from 'react-icons/fi';

const OrdersPaymentPerformance: React.FC = () => {
  // TODO: Fetch data from API
  const performance = {
    totalOrders: 0,
    paidOrders: 0,
    pendingOrders: 0,
    refundedOrders: 0,
    failedPayments: 0,
    paymentSuccessRate: 0,
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Orders & Payment Performance
      </h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Paid Orders
            </span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {performance.paidOrders}
          </p>
        </div>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FiShoppingCart className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Pending Orders
            </span>
          </div>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {performance.pendingOrders}
          </p>
        </div>
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FiRefreshCw className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Refunded Orders
            </span>
          </div>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {performance.refundedOrders}
          </p>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FiXCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Failed Payments
            </span>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {performance.failedPayments}
          </p>
        </div>
      </div>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Payment Success Rate
        </p>
        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {performance.paymentSuccessRate.toFixed(2)}%
        </p>
      </div>
    </div>
  );
};

export default OrdersPaymentPerformance;
