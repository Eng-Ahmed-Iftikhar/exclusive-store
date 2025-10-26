import React from 'react';
import {
  FiTrendingUp,
  FiBarChart2,
  FiCalendar,
  FiFileText,
  FiDollarSign,
  FiAlertCircle,
  FiActivity,
  FiCheckCircle,
} from 'react-icons/fi';

const AnalyticsTaxActivity: React.FC = () => {
  // TODO: Fetch data from API
  const data = {
    // Analytics & Trends
    monthlyRevenueGrowth: 0,
    profitGrowthRate: 0,
    categorySeasonality: 0,
    stockTurnoverTrend: 0,
    predictiveSales: 0,
    // Tax & Compliance
    totalTaxCollected: 0,
    taxPaid: 0,
    taxOwed: 0,
    taxStatus: 'compliant',
  };

  // Mock activity data
  const activities = [
    {
      id: '1',
      description: 'Order payment completed',
      amount: 150.0,
      timestamp: new Date().toISOString(),
      user: 'John Doe',
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Analytics, Tax & Activity
      </h3>

      {/* Analytics & Trends Section */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Analytics & Trends
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiTrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Revenue Growth
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {data.monthlyRevenueGrowth > 0 ? '+' : ''}
              {data.monthlyRevenueGrowth.toFixed(2)}%
            </p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiBarChart2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Profit Growth
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.profitGrowthRate > 0 ? '+' : ''}
              {data.profitGrowthRate.toFixed(2)}%
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiCalendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Seasonality
              </span>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {data.categorySeasonality.toFixed(2)}%
            </p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiTrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Stock Turnover
              </span>
            </div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {data.stockTurnoverTrend.toFixed(2)}x
            </p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiBarChart2 className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Predictive Sales
              </span>
            </div>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              ${data.predictiveSales.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tax & Compliance Section */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Tax & Compliance
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiDollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Tax Collected
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${data.totalTaxCollected.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiDollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Tax Paid
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${data.taxPaid.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiAlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Tax Owed
              </span>
            </div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              ${data.taxOwed.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiFileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Status
              </span>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 capitalize">
              {data.taxStatus}
            </p>
          </div>
        </div>
      </div>

      {/* Activity Log Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Recent Financial Activity
        </h4>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FiActivity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No recent activities</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <FiCheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {activity.user} •{' '}
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">
                    +${activity.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTaxActivity;
