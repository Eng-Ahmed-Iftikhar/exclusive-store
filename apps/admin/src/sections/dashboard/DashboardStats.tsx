import React from 'react';
import {
  FiDollarSign,
  FiShoppingCart,
  FiPackage,
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
} from 'react-icons/fi';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  change?: number;
  changeType?: 'increase' | 'decrease';
  theme: 'light' | 'dark';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  changeType,
  theme,
}) => (
  <div
    className={`rounded-2xl border p-6 hover:shadow-md transition-all duration-200 group ${
      theme === 'dark'
        ? 'bg-slate-800 border-slate-700'
        : 'bg-white border-slate-200'
    }`}
  >
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:transition-colors ${
            theme === 'dark'
              ? 'bg-slate-700 group-hover:bg-slate-600'
              : 'bg-slate-100 group-hover:bg-slate-200'
          }`}
        >
          <Icon
            className={`h-6 w-6 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}
          />
        </div>
      </div>
      <div className="ml-5 w-0 flex-1">
        <dl>
          <dt
            className={`text-sm font-medium truncate ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {title}
          </dt>
          <dd
            className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            {title === 'Total Revenue'
              ? `$${Number(value).toLocaleString()}`
              : value}
          </dd>
        </dl>
      </div>
    </div>
    {change && (
      <div className="mt-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${
            changeType === 'increase'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {changeType === 'increase' ? (
            <FiTrendingUp className="h-4 w-4 mr-1.5" />
          ) : (
            <FiTrendingDown className="h-4 w-4 mr-1.5" />
          )}
          {change}%
        </span>
      </div>
    )}
  </div>
);

interface DashboardStatsProps {
  data: any;
  theme: 'light' | 'dark';
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ data, theme }) => {
  const stats = [
    {
      title: 'Total Revenue',
      value: data.totalRevenue || 0,
      icon: FiDollarSign,
      change: data.revenueChange,
      changeType: data.revenueChange > 0 ? 'increase' : 'decrease',
    },
    {
      title: 'Total Orders',
      value: data.totalOrders || 0,
      icon: FiShoppingCart,
      change: data.ordersChange,
      changeType: data.ordersChange > 0 ? 'increase' : 'decrease',
    },
    {
      title: 'Total Products',
      value: data.totalProducts || 0,
      icon: FiPackage,
      change: data.productsChange,
      changeType: data.productsChange > 0 ? 'increase' : 'decrease',
    },
    {
      title: 'Total Users',
      value: data.totalUsers || 0,
      icon: FiUsers,
      change: data.usersChange,
      changeType: data.usersChange > 0 ? 'increase' : 'decrease',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          change={stat.change}
          changeType={stat.changeType}
          theme={theme}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
