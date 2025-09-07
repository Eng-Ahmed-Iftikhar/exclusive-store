import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useGetDashboardChartsQuery } from '../../../apis/services/adminApi';

interface ChartData {
  monthlyRevenue: Array<{ name: string; revenue: number }>;
  monthlyOrders: Array<{ name: string; orders: number }>;
  categoryDistribution: Array<{ name: string; value: number; color: string }>;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number; color: string }>;
  label?: string;
}

const DashboardCharts: React.FC = () => {
  const { theme } = useSelector((state: RootState) => state.ui);
  const {
    data: chartData,
    isLoading,
    error,
  } = useGetDashboardChartsQuery(undefined) as {
    data: ChartData | undefined;
    isLoading: boolean;
    error: unknown;
  };

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-3 rounded-lg shadow-lg border ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700 text-white'
              : 'bg-white border-gray-200 text-gray-900'
          }`}
        >
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === 'revenue'
                ? `Revenue: ${formatCurrency(entry.value)}`
                : `${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="mb-8">
        <h2
          className={`text-xl font-semibold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Analytics
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border animate-pulse ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div
                className={`h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4`}
              ></div>
              <div
                className={`h-64 bg-gray-300 dark:bg-gray-600 rounded`}
              ></div>
            </div>
          ))}
        </div>
        <div
          className={`p-6 rounded-xl border animate-pulse ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div
            className={`h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4`}
          ></div>
          <div className={`h-64 bg-gray-300 dark:bg-gray-600 rounded`}></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mb-8">
        <h2
          className={`text-xl font-semibold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Analytics
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
              <h3 className="font-medium">Failed to load chart data</h3>
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

  // No data state
  if (!chartData) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2
        className={`text-xl font-semibold mb-6 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div
          className={`p-6 rounded-xl border ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <h3
            className={`text-lg font-medium mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.monthlyRevenue}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
              />
              <XAxis
                dataKey="name"
                stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                fontSize={12}
              />
              <YAxis
                stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div
          className={`p-6 rounded-xl border ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <h3
            className={`text-lg font-medium mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Orders Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.monthlyOrders}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
              />
              <XAxis
                dataKey="name"
                stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                fontSize={12}
              />
              <YAxis
                stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution */}
      <div
        className={`p-6 rounded-xl border ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <h3
          className={`text-lg font-medium mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Category Distribution
        </h3>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.categoryDistribution.map(
                    (
                      entry: { name: string; value: number; color: string },
                      index: number
                    ) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    )
                  )}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="space-y-3">
              {chartData.categoryDistribution.map(
                (
                  item: { name: string; value: number; color: string },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span
                        className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>
                    <span
                      className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
