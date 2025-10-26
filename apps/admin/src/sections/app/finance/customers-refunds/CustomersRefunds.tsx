import React from 'react';
import {
  FiUsers,
  FiTrendingUp,
  FiRepeat,
  FiRefreshCw,
  FiDollarSign,
  FiAlertCircle,
} from 'react-icons/fi';

const CustomersRefunds: React.FC = () => {
  // TODO: Fetch data from API
  const data = {
    // Customer Insights
    topCustomersRevenue: 0,
    customerLifetimeValue: 0,
    averageSpendPerCustomer: 0,
    repeatPurchaseRate: 0,
    guestVsRegisteredRatio: 0,
    // Refunds
    totalRefundAmount: 0,
    refundCount: 0,
    averageRefundValue: 0,
    refundRate: 0,
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Customers & Refunds
      </h3>

      {/* Customer Insights Section */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Customer Insights
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiUsers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Top Customers Revenue
              </span>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ${data.topCustomersRevenue.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiTrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Customer LTV
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${data.customerLifetimeValue.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiTrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Avg Spend
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${data.averageSpendPerCustomer.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiRepeat className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Repeat Rate
              </span>
            </div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {data.repeatPurchaseRate.toFixed(2)}%
            </p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiUsers className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Guest Ratio
              </span>
            </div>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {data.guestVsRegisteredRatio.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Refunds Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Refunds & Adjustments
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiDollarSign className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total Refund Amount
              </span>
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              ${data.totalRefundAmount.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiRefreshCw className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Refund Count
              </span>
            </div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {data.refundCount}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiDollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Avg Refund Value
              </span>
            </div>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              ${data.averageRefundValue.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Refund Rate
              </span>
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {data.refundRate.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersRefunds;
