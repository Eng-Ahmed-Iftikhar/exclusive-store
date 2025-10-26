import React from 'react';
import {
  FiDollarSign,
  FiShoppingCart,
  FiTrendingUp,
  FiActivity,
} from 'react-icons/fi';

const FinancialOverview: React.FC = () => {
  // TODO: Fetch data from API
  const stats = {
    totalRevenue: 0,
    netProfit: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    outstandingPayments: 0,
  };

  const cards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: FiDollarSign,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Net Profit',
      value: `$${stats.netProfit.toLocaleString()}`,
      icon: FiTrendingUp,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: FiShoppingCart,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Average Order Value',
      value: `$${stats.averageOrderValue.toFixed(2)}`,
      icon: FiActivity,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      title: 'Outstanding Payments',
      value: `$${stats.outstandingPayments.toLocaleString()}`,
      icon: FiDollarSign,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {card.value}
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.bgColor}`}
            >
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FinancialOverview;
