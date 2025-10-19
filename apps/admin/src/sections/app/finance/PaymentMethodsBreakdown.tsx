import React from 'react';
import {
  FiCreditCard,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiPercent,
} from 'react-icons/fi';

const PaymentMethodsBreakdown: React.FC = () => {
  // Mock data for payment methods breakdown
  const paymentMethods = [
    {
      name: 'Credit Card',
      icon: FiCreditCard,
      transactions: 1250,
      amount: 89450.5,
      percentage: 71.3,
      change: 12.5,
      changeType: 'positive' as const,
      color: 'blue',
      fees: 2683.52,
    },
    {
      name: 'PayPal',
      icon: FiCreditCard,
      transactions: 320,
      amount: 23450.25,
      percentage: 18.7,
      change: 8.3,
      changeType: 'positive' as const,
      color: 'yellow',
      fees: 703.51,
    },
    {
      name: 'Debit Card',
      icon: FiCreditCard,
      transactions: 180,
      amount: 12890.75,
      percentage: 10.3,
      change: -2.1,
      changeType: 'negative' as const,
      color: 'green',
      fees: 386.72,
    },
    {
      name: 'Bank Transfer',
      icon: FiCreditCard,
      transactions: 45,
      amount: 5639.0,
      percentage: 4.5,
      change: 5.2,
      changeType: 'positive' as const,
      color: 'purple',
      fees: 56.39,
    },
  ];

  const totalAmount = paymentMethods.reduce(
    (sum, method) => sum + method.amount,
    0
  );
  const totalTransactions = paymentMethods.reduce(
    (sum, method) => sum + method.transactions,
    0
  );
  const totalFees = paymentMethods.reduce(
    (sum, method) => sum + method.fees,
    0
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-500';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-slate-900/20">
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Payment Methods Breakdown
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Transaction volume and revenue by payment method
          </p>
        </div>

        {/* Payment Methods List */}
        <div className="space-y-4 mb-6">
          {paymentMethods.map((method, index) => {
            const Icon = method.icon;

            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Payment Method Icon */}
                  <div
                    className={`w-10 h-10 ${getColorClasses(
                      method.color
                    )} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Payment Method Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {method.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        {method.changeType === 'positive' ? (
                          <FiTrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                        ) : (
                          <FiTrendingDown className="w-3 h-3 text-red-600 dark:text-red-400" />
                        )}
                        <span
                          className={`text-xs font-medium ${
                            method.changeType === 'positive'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {method.change > 0 ? '+' : ''}
                          {method.change}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 ${getColorClasses(
                          method.color
                        )} rounded-full`}
                        style={{ width: `${method.percentage}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        {formatNumber(method.transactions)} transactions
                      </span>
                      <span>{method.percentage}% of total</span>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(method.amount)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Fees: {formatCurrency(method.fees)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="pt-6 border-t border-gray-200 dark:border-slate-600">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <FiCreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatNumber(totalTransactions)}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total Transactions
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <FiDollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total Volume
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <FiPercent className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalFees)}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Processing Fees
            </p>
          </div>
        </div>

        {/* Payment Method Distribution Chart */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Distribution
          </h4>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              {/* Simple pie chart representation */}
              <div className="absolute inset-0 rounded-full border-8 border-gray-200 dark:border-slate-600"></div>
              <div
                className="absolute inset-0 rounded-full border-8 border-blue-500"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${
                    50 + 50 * Math.cos(0)
                  }% ${50 + 50 * Math.sin(0)}%)`,
                  transform: 'rotate(-90deg)',
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatNumber(totalTransactions)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Total
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsBreakdown;
