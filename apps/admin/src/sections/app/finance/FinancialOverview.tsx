import React from 'react';
import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiShoppingCart,
  FiUsers,
  FiPackage,
  FiCreditCard,
  FiRefreshCw,
} from 'react-icons/fi';

const FinancialOverview: React.FC = () => {
  // Mock data - replace with actual API calls
  const overviewData = [
    {
      title: 'Total Revenue',
      value: '$125,430.50',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: FiDollarSign,
      color: 'green',
      description: 'vs last month',
    },
    {
      title: 'Gross Profit',
      value: '$89,250.75',
      change: '+8.3%',
      changeType: 'positive' as const,
      icon: FiTrendingUp,
      color: 'blue',
      description: 'vs last month',
    },
    {
      title: 'Net Profit',
      value: '$67,890.25',
      change: '+15.2%',
      changeType: 'positive' as const,
      icon: FiTrendingUp,
      color: 'emerald',
      description: 'vs last month',
    },
    {
      title: 'Total Orders',
      value: '1,247',
      change: '+23.1%',
      changeType: 'positive' as const,
      icon: FiShoppingCart,
      color: 'purple',
      description: 'vs last month',
    },
    {
      title: 'Average Order Value',
      value: '$100.65',
      change: '-2.1%',
      changeType: 'negative' as const,
      icon: FiPackage,
      color: 'orange',
      description: 'vs last month',
    },
    {
      title: 'Active Customers',
      value: '892',
      change: '+18.7%',
      changeType: 'positive' as const,
      icon: FiUsers,
      color: 'indigo',
      description: 'vs last month',
    },
    {
      title: 'Transaction Volume',
      value: '1,156',
      change: '+19.4%',
      changeType: 'positive' as const,
      icon: FiCreditCard,
      color: 'pink',
      description: 'vs last month',
    },
    {
      title: 'Refund Rate',
      value: '2.3%',
      change: '-0.5%',
      changeType: 'positive' as const,
      icon: FiRefreshCw,
      color: 'red',
      description: 'vs last month',
    },
  ];

  const getColorClasses = (
    color: string,
    changeType: 'positive' | 'negative'
  ) => {
    const colorMap = {
      green: {
        bg: 'bg-green-100 dark:bg-green-900/20',
        icon: 'text-green-600 dark:text-green-400',
        change:
          changeType === 'positive'
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400',
      },
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/20',
        icon: 'text-blue-600 dark:text-blue-400',
        change:
          changeType === 'positive'
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400',
      },
      emerald: {
        bg: 'bg-emerald-100 dark:bg-emerald-900/20',
        icon: 'text-emerald-600 dark:text-emerald-400',
        change:
          changeType === 'positive'
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400',
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/20',
        icon: 'text-purple-600 dark:text-purple-400',
        change:
          changeType === 'positive'
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400',
      },
      orange: {
        bg: 'bg-orange-100 dark:bg-orange-900/20',
        icon: 'text-orange-600 dark:text-orange-400',
        change:
          changeType === 'positive'
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400',
      },
      indigo: {
        bg: 'bg-indigo-100 dark:bg-indigo-900/20',
        icon: 'text-indigo-600 dark:text-indigo-400',
        change:
          changeType === 'positive'
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400',
      },
      pink: {
        bg: 'bg-pink-100 dark:bg-pink-900/20',
        icon: 'text-pink-600 dark:text-pink-400',
        change:
          changeType === 'positive'
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400',
      },
      red: {
        bg: 'bg-red-100 dark:bg-red-900/20',
        icon: 'text-red-600 dark:text-red-400',
        change:
          changeType === 'positive'
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400',
      },
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.green;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {overviewData.map((item, index) => {
        const Icon = item.icon;
        const colors = getColorClasses(item.color, item.changeType);

        return (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm dark:shadow-slate-900/20"
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}
              >
                <Icon className={`w-6 h-6 ${colors.icon}`} />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${colors.change}`}
              >
                {item.changeType === 'positive' ? (
                  <FiTrendingUp className="w-4 h-4" />
                ) : (
                  <FiTrendingDown className="w-4 h-4" />
                )}
                {item.change}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {item.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {item.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FinancialOverview;
