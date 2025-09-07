import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {
  FiTrendingUp,
  FiUsers,
  FiShoppingCart,
  FiDollarSign,
} from 'react-icons/fi';
import { useGetDashboardStatsQuery } from '../../../apis/services/adminApi';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  color,
}) => {
  const { theme } = useSelector((state: RootState) => state.ui);

  const changeColor = {
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  };

  return (
    <div
      className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p
            className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {title}
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            {value}
          </p>
          <p className={`text-sm mt-1 ${changeColor[changeType]}`}>{change}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
    </div>
  );
};

const DashboardStats: React.FC = () => {
  const { theme } = useSelector((state: RootState) => state.ui);
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useGetDashboardStatsQuery(undefined);

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Helper function to format numbers with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(dashboardData?.totalRevenue || 0),
      change: 'Live data from backend',
      changeType: 'positive' as const,
      icon: <FiDollarSign className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-green-500 to-emerald-600',
    },
    {
      title: 'Total Orders',
      value: formatNumber(dashboardData?.totalOrders || 0),
      change: 'Completed orders only',
      changeType: 'positive' as const,
      icon: <FiShoppingCart className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-600',
    },
    {
      title: 'Total Users',
      value: formatNumber(dashboardData?.totalUsers || 0),
      change: 'Registered users',
      changeType: 'positive' as const,
      icon: <FiUsers className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-purple-500 to-pink-600',
    },
    {
      title: 'Active Products',
      value: formatNumber(dashboardData?.totalItems || 0),
      change: 'Available items',
      changeType: 'positive' as const,
      icon: <FiTrendingUp className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-orange-500 to-red-600',
    },
  ];

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2
          className={`text-xl font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border animate-pulse ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div
                    className={`h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2`}
                  ></div>
                  <div
                    className={`h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2`}
                  ></div>
                  <div
                    className={`h-3 bg-gray-300 dark:bg-gray-600 rounded`}
                  ></div>
                </div>
                <div
                  className={`w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2
          className={`text-xl font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Overview
        </h2>
        <div
          className={`p-6 rounded-xl border ${
            theme === 'dark'
              ? 'bg-red-900/20 border-red-700 text-red-300'
              : 'bg-red-50 border-red-200 text-red-600'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="text-red-500">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">
                Failed to load dashboard statistics
              </h3>
              <p className="text-sm mt-1">
                Please try refreshing the page or contact support if the problem
                persists.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2
        className={`text-xl font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
