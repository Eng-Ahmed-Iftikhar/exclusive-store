import React from 'react';
import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiPercent,
  FiBarChart2,
} from 'react-icons/fi';

const ProfitLossAnalysis: React.FC = () => {
  // Mock data for profit/loss analysis
  const profitLossData = {
    revenue: {
      total: 125430.5,
      change: 12.5,
      changeType: 'positive' as const,
    },
    costs: {
      cogs: 45230.75, // Cost of Goods Sold
      operating: 15680.25, // Operating Expenses
      marketing: 8920.5, // Marketing Costs
      total: 69831.5,
      change: 8.3,
      changeType: 'positive' as const,
    },
    profit: {
      gross: 80199.75, // Revenue - COGS
      operating: 64519.5, // Gross Profit - Operating Expenses
      net: 55599.0, // Operating Profit - Marketing
      change: 15.2,
      changeType: 'positive' as const,
    },
    margins: {
      gross: 63.9, // Gross Profit / Revenue * 100
      operating: 51.4, // Operating Profit / Revenue * 100
      net: 44.3, // Net Profit / Revenue * 100
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-slate-900/20">
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Profit & Loss Analysis
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Detailed financial breakdown and margins
          </p>
        </div>

        {/* Revenue Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FiDollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h4 className="font-medium text-gray-900 dark:text-white">
                Revenue
              </h4>
            </div>
            <div className="flex items-center gap-2">
              {profitLossData.revenue.changeType === 'positive' ? (
                <FiTrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <FiTrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
              )}
              <span
                className={`text-sm font-medium ${
                  profitLossData.revenue.changeType === 'positive'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                +{profitLossData.revenue.change}%
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(profitLossData.revenue.total)}
          </div>
        </div>

        {/* Costs Breakdown */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FiMinus className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h4 className="font-medium text-gray-900 dark:text-white">
                Costs
              </h4>
            </div>
            <div className="flex items-center gap-2">
              {profitLossData.costs.changeType === 'positive' ? (
                <FiTrendingUp className="w-4 h-4 text-red-600 dark:text-red-400" />
              ) : (
                <FiTrendingDown className="w-4 h-4 text-green-600 dark:text-green-400" />
              )}
              <span
                className={`text-sm font-medium ${
                  profitLossData.costs.changeType === 'positive'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-green-600 dark:text-green-400'
                }`}
              >
                +{profitLossData.costs.change}%
              </span>
            </div>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Cost of Goods Sold
              </span>
              <span className="text-gray-900 dark:text-white">
                {formatCurrency(profitLossData.costs.cogs)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Operating Expenses
              </span>
              <span className="text-gray-900 dark:text-white">
                {formatCurrency(profitLossData.costs.operating)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Marketing Costs
              </span>
              <span className="text-gray-900 dark:text-white">
                {formatCurrency(profitLossData.costs.marketing)}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-slate-600 pt-2">
            <div className="flex justify-between">
              <span className="font-medium text-gray-900 dark:text-white">
                Total Costs
              </span>
              <span className="font-bold text-gray-900 dark:text-white">
                {formatCurrency(profitLossData.costs.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Profit Breakdown */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FiBarChart2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h4 className="font-medium text-gray-900 dark:text-white">
                Profit
              </h4>
            </div>
            <div className="flex items-center gap-2">
              {profitLossData.profit.changeType === 'positive' ? (
                <FiTrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <FiTrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
              )}
              <span
                className={`text-sm font-medium ${
                  profitLossData.profit.changeType === 'positive'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                +{profitLossData.profit.change}%
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Gross Profit
              </span>
              <span className="text-gray-900 dark:text-white">
                {formatCurrency(profitLossData.profit.gross)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Operating Profit
              </span>
              <span className="text-gray-900 dark:text-white">
                {formatCurrency(profitLossData.profit.operating)}
              </span>
            </div>
            <div className="border-t border-gray-200 dark:border-slate-600 pt-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-900 dark:text-white">
                  Net Profit
                </span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(profitLossData.profit.net)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profit Margins */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiPercent className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h4 className="font-medium text-gray-900 dark:text-white">
              Profit Margins
            </h4>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Gross Margin
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatPercentage(profitLossData.margins.gross)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${profitLossData.margins.gross}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Operating Margin
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatPercentage(profitLossData.margins.operating)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${profitLossData.margins.operating}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Net Margin
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatPercentage(profitLossData.margins.net)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${profitLossData.margins.net}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitLossAnalysis;
