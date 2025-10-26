import React, { useState } from 'react';
import {
  FiBarChart2,
  FiTrendingUp,
  FiCalendar,
  FiDownload,
} from 'react-icons/fi';

const RevenueCharts: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  // Mock data for revenue chart
  const revenueData = [
    { month: 'Jan', revenue: 45000, orders: 320 },
    { month: 'Feb', revenue: 52000, orders: 380 },
    { month: 'Mar', revenue: 48000, orders: 350 },
    { month: 'Apr', revenue: 61000, orders: 420 },
    { month: 'May', revenue: 55000, orders: 390 },
    { month: 'Jun', revenue: 68000, orders: 480 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));
  const maxOrders = Math.max(...revenueData.map((d) => d.orders));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-slate-900/20">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue & Orders Trend
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Monthly revenue and order volume comparison
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
            </select>
            <button className="p-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
              <FiDownload className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-80 relative">
          {/* Y-axis labels for revenue */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 pr-2">
            <span>{formatCurrency(maxRevenue)}</span>
            <span>{formatCurrency(maxRevenue * 0.75)}</span>
            <span>{formatCurrency(maxRevenue * 0.5)}</span>
            <span>{formatCurrency(maxRevenue * 0.25)}</span>
            <span>$0</span>
          </div>

          {/* Chart Area */}
          <div className="ml-12 mr-4 h-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0">
              {[0, 25, 50, 75, 100].map((percent) => (
                <div
                  key={percent}
                  className="absolute w-full border-t border-gray-200 dark:border-slate-600"
                  style={{ top: `${percent}%` }}
                />
              ))}
            </div>

            {/* Revenue bars */}
            <div className="absolute inset-0 flex items-end justify-between px-2">
              {revenueData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="relative w-full max-w-16">
                    {/* Revenue bar */}
                    <div
                      className="bg-blue-500 rounded-t-sm w-full"
                      style={{
                        height: `${(data.revenue / maxRevenue) * 100}%`,
                        minHeight: '4px',
                      }}
                    />
                    {/* Orders indicator */}
                    <div
                      className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500 rounded-full w-3 h-3"
                      style={{
                        top: `-${(data.orders / maxOrders) * 20}px`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-12 right-4 flex justify-between px-2">
            {revenueData.map((data, index) => (
              <span
                key={index}
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                {data.month}
              </span>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Revenue
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Orders
            </span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-slate-600">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <FiTrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(revenueData[revenueData.length - 1].revenue)}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Current Month
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <FiBarChart2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(
                  revenueData.reduce((sum, d) => sum + d.revenue, 0) /
                    revenueData.length
                )}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Average Monthly
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <FiCalendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {revenueData.reduce((sum, d) => sum + d.orders, 0)}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Orders
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueCharts;
