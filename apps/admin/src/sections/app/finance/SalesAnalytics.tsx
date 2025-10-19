import React from 'react';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiShoppingCart,
  FiUsers,
  FiPackage,
  FiDollarSign,
} from 'react-icons/fi';

const SalesAnalytics: React.FC = () => {
  // Mock data for sales analytics
  const salesMetrics = [
    {
      title: 'Sales Growth',
      value: '+23.5%',
      change: '+5.2%',
      changeType: 'positive' as const,
      icon: FiTrendingUp,
      color: 'green',
      description: 'vs last quarter',
    },
    {
      title: 'Customer Acquisition',
      value: '156',
      change: '+12.3%',
      changeType: 'positive' as const,
      icon: FiUsers,
      color: 'blue',
      description: 'new customers this month',
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+0.8%',
      changeType: 'positive' as const,
      icon: FiShoppingCart,
      color: 'purple',
      description: 'visitor to customer',
    },
    {
      title: 'Cart Abandonment',
      value: '68.5%',
      change: '-2.1%',
      changeType: 'positive' as const,
      icon: FiPackage,
      color: 'orange',
      description: 'reduced from last month',
    },
  ];

  const topSellingCategories = [
    {
      name: 'Electronics',
      sales: 45230,
      percentage: 35.2,
      color: 'bg-blue-500',
    },
    { name: 'Clothing', sales: 32150, percentage: 25.0, color: 'bg-green-500' },
    {
      name: 'Home & Garden',
      sales: 28900,
      percentage: 22.5,
      color: 'bg-purple-500',
    },
    { name: 'Sports', sales: 15680, percentage: 12.2, color: 'bg-orange-500' },
    { name: 'Books', sales: 6040, percentage: 4.7, color: 'bg-pink-500' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-slate-900/20">
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sales Analytics
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Key sales performance metrics
          </p>
        </div>

        {/* Sales Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {salesMetrics.map((metric, index) => {
            const Icon = metric.icon;
            const colorClasses = {
              green:
                'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
              blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
              purple:
                'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
              orange:
                'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
            };

            return (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 ${
                      colorClasses[metric.color as keyof typeof colorClasses]
                    } rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      metric.changeType === 'positive'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {metric.change}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {metric.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Top Selling Categories */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Top Selling Categories
          </h4>
          <div className="space-y-3">
            {topSellingCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-3 h-3 ${category.color} rounded-full`}
                  ></div>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                    <div
                      className={`h-2 ${category.color} rounded-full`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-16 text-right">
                    {formatCurrency(category.sales)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
                    {category.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
