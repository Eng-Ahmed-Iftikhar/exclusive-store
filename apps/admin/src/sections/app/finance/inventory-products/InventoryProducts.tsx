import React from 'react';
import {
  FiPackage,
  FiAlertCircle,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
} from 'react-icons/fi';

const InventoryProducts: React.FC = () => {
  // TODO: Fetch data from API
  const data = {
    // Inventory
    currentStockLevels: 0,
    lowStockAlerts: 0,
    totalInventoryValue: 0,
    outOfStockItems: 0,
    restockCost: 0,
    stockTurnoverRate: 0,
    // Products
    topSellingProducts: 0,
    leastProfitableProducts: 0,
    averageProfitMargin: 0,
    topCategoryRevenue: 0,
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Inventory & Products
      </h3>

      {/* Inventory Section */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Inventory & Stock
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiPackage className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Current Stock
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.currentStockLevels}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiAlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Low Stock Alerts
              </span>
            </div>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {data.lowStockAlerts}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiDollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Inventory Value
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${data.totalInventoryValue.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Out of Stock
              </span>
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {data.outOfStockItems}
            </p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiDollarSign className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Restock Cost
              </span>
            </div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              ${data.restockCost.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiPackage className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Turnover Rate
              </span>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {data.stockTurnoverRate.toFixed(2)}x
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Product Profitability
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiTrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Top Selling Products
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {data.topSellingProducts}
            </p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiTrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Least Profitable
              </span>
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {data.leastProfitableProducts}
            </p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiPackage className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Avg Profit Margin
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.averageProfitMargin.toFixed(2)}%
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiTrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Top Category Revenue
              </span>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ${data.topCategoryRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryProducts;
