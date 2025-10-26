import React from 'react';
import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiCreditCard,
  FiAlertCircle,
} from 'react-icons/fi';

const RevenueExpensesCashFlow: React.FC = () => {
  // TODO: Fetch data from API
  const data = {
    // Revenue
    grossRevenue: 0,
    netRevenue: 0,
    netIncome: 0,
    // Expenses
    stripeFees: 0,
    platformFees: 0,
    refundCosts: 0,
    shippingCosts: 0,
    taxLiabilities: 0,
    totalExpenses: 0,
    // Cash Flow
    dailyInflow: 0,
    dailyOutflow: 0,
    netCashFlow: 0,
    cumulativeBalance: 0,
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Revenue, Expenses & Cash Flow
      </h3>

      {/* Revenue Section */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Revenue
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <FiDollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gross Revenue
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${data.grossRevenue.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <FiTrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Net Revenue
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${data.netRevenue.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <FiDollarSign className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Net Income
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${data.netIncome.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Section */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Expenses & Fees
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <FiCreditCard className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Stripe Fees
              </span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              ${data.stripeFees.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <FiDollarSign className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Platform Fees
              </span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              ${data.platformFees.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <FiAlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Refund Costs
              </span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              ${data.refundCosts.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <FiDollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Shipping Costs
              </span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              ${data.shippingCosts.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <FiDollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Tax Liabilities
              </span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              ${data.taxLiabilities.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2">
              <FiDollarSign className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-900 dark:text-red-300">
                Total Expenses
              </span>
            </div>
            <span className="text-xl font-bold text-red-900 dark:text-red-300">
              ${data.totalExpenses.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Cash Flow Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Cash Flow
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiTrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Daily Inflow
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${data.dailyInflow.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiTrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Daily Outflow
              </span>
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              ${data.dailyOutflow.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiDollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Net Cash Flow
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${data.netCashFlow.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiDollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Cumulative Balance
              </span>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ${data.cumulativeBalance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueExpensesCashFlow;
