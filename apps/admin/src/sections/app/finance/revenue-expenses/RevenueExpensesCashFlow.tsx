import React, { useMemo } from 'react';
import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiCreditCard,
} from 'react-icons/fi';
import { DateRange } from '@/components/ui/date-range-picker';
import { AdminPaymentStatus } from '@/apis/services/orderApi';
import { useFinancialOrders } from '@/hooks/useFinancialOrders';

interface FinancialFilters {
  dateRange?: DateRange;
  userId: string;
  categoryId: string;
  productId: string;
  paymentStatus: string;
  orderStatus: string;
}

interface RevenueExpensesCashFlowProps {
  filters: FinancialFilters;
}

const RevenueExpensesCashFlow: React.FC<RevenueExpensesCashFlowProps> = ({
  filters,
}) => {
  const { orders, isLoading, error } = useFinancialOrders(filters);

  // Calculate expenses and cash flow from orders
  const data = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        netRevenue: 0,
        netIncome: 0,
        stripeFees: 0,
        platformFees: 0,
        shippingCosts: 0,
        totalExpenses: 0,
        dailyInflow: 0,
        dailyOutflow: 0,
        netCashFlow: 0,
        cumulativeBalance: 0,
      };
    }

    // Calculate revenue (net of refunds)
    const grossRevenue = orders.reduce(
      (sum, order) => sum + order.totals.total,
      0
    );

    // Calculate refund costs
    const refundCosts = orders
      .filter(
        (order) =>
          order.paymentStatus === AdminPaymentStatus.REFUNDED
      )
      .reduce((sum, order) => sum + order.totals.total, 0);

    // Net revenue = Gross revenue - refunds
    const netRevenue = grossRevenue - refundCosts;

    // Calculate expenses from orders
    const shippingCosts = orders.reduce(
      (sum, order) => sum + (order.totals.shippingCost || 0),
      0
    );

    // Estimate Stripe fees (typically 2.9% + $0.30 per transaction)
    const stripeFees = orders
      .filter((order) => order.paymentStatus === AdminPaymentStatus.PAID)
      .reduce((sum, order) => {
        const fee = order.totals.total * 0.029 + 0.3; // 2.9% + $0.30
        return sum + fee;
      }, 0);

    // Platform fees (if any) - placeholder
    const platformFees = 0;

    const totalExpenses = stripeFees + platformFees + shippingCosts;

    // Net income = Net revenue - expenses
    const netIncome = netRevenue - totalExpenses;

    // Calculate daily cash flow
    // Group orders by date
    const ordersByDate = orders.reduce(
      (acc, order) => {
        const date = new Date(order.timestamps.createdAt)
          .toISOString()
          .split('T')[0];
        if (!acc[date]) {
          acc[date] = { inflow: 0, outflow: 0 };
        }
        // Inflow: paid orders
        if (order.paymentStatus === AdminPaymentStatus.PAID) {
          acc[date].inflow += order.totals.total;
        }
        // Outflow: refunds, shipping, fees
        if (order.paymentStatus === AdminPaymentStatus.REFUNDED) {
          acc[date].outflow += order.totals.total;
        }
        acc[date].outflow += order.totals.shippingCost || 0;
        return acc;
      },
      {} as Record<string, { inflow: number; outflow: number }>
    );

    // Calculate average daily inflow/outflow
    const dates = Object.keys(ordersByDate);
    const totalDays = dates.length || 1;
    const dailyInflow =
      dates.reduce((sum, date) => sum + ordersByDate[date].inflow, 0) /
      totalDays;
    const dailyOutflow =
      dates.reduce((sum, date) => sum + ordersByDate[date].outflow, 0) /
      totalDays;

    const netCashFlow = dailyInflow - dailyOutflow;
    const cumulativeBalance = netRevenue - totalExpenses;

    return {
      netRevenue,
      netIncome,
      stripeFees,
      platformFees,
      shippingCosts,
      totalExpenses,
      dailyInflow,
      dailyOutflow,
      netCashFlow,
      cumulativeBalance,
    };
  }, [orders, filters]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 dark:bg-slate-700 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6">
        <p className="text-red-600 dark:text-red-400">
          Error loading revenue and expenses data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Expenses & Cash Flow
      </h3>

      {/* Revenue & Income Summary */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Revenue & Income
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <FiTrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Net Revenue
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${data.netRevenue.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <FiDollarSign className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Net Income
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${data.netIncome.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Section */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Expenses & Fees
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <FiCreditCard className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Stripe Fees
              </span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              ${data.stripeFees.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <FiDollarSign className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Platform Fees
              </span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              ${data.platformFees.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <FiDollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Shipping Costs
              </span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              ${data.shippingCosts.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2">
              <FiDollarSign className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-900 dark:text-red-300">
                Total Expenses
              </span>
            </div>
            <span className="text-xl font-bold text-red-900 dark:text-red-300">
              ${data.totalExpenses.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Cash Flow Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Cash Flow
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiTrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Daily Inflow
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${data.dailyInflow.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiTrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Daily Outflow
              </span>
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              ${data.dailyOutflow.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiDollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Net Cash Flow
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${data.netCashFlow.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiDollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Cumulative Balance
              </span>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ${data.cumulativeBalance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueExpensesCashFlow;
