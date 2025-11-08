import React, { useMemo } from 'react';
import {
  FiUsers,
  FiTrendingUp,
  FiRepeat,
  FiRefreshCw,
  FiDollarSign,
  FiAlertCircle,
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

interface CustomersRefundsProps {
  filters: FinancialFilters;
}

const CustomersRefunds: React.FC<CustomersRefundsProps> = ({ filters }) => {
  const { orders, isLoading, error } = useFinancialOrders(filters);

  // Calculate customer insights and refund metrics from filtered orders
  const data = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        topCustomersRevenue: 0,
        customerLifetimeValue: 0,
        averageSpendPerCustomer: 0,
        repeatPurchaseRate: 0,
        guestVsRegisteredRatio: 0,
        totalRefundAmount: 0,
        refundCount: 0,
        averageRefundValue: 0,
        refundRate: 0,
      };
    }

    // Calculate customer insights
    // Group orders by user (for registered users)
    const customerOrders = orders.filter((order) => order.userId);
    const guestOrders = orders.filter((order) => !order.userId);

    // Calculate revenue by customer
    const customerRevenueMap = new Map<string, number>();
    customerOrders.forEach((order) => {
      if (order.userId) {
        const currentRevenue = customerRevenueMap.get(order.userId) || 0;
        customerRevenueMap.set(
          order.userId,
          currentRevenue + order.totals.total
        );
      }
    });

    // Top customers revenue (sum of top 10 customers)
    const customerRevenues = Array.from(customerRevenueMap.values()).sort(
      (a, b) => b - a
    );
    const topCustomersRevenue = customerRevenues
      .slice(0, 10)
      .reduce((sum, revenue) => sum + revenue, 0);

    // Customer lifetime value (average revenue per registered customer)
    const uniqueCustomers = customerRevenueMap.size;
    const customerLifetimeValue =
      uniqueCustomers > 0
        ? customerRevenues.reduce((sum, rev) => sum + rev, 0) / uniqueCustomers
        : 0;

    // Average spend per customer (including guests)
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totals.total,
      0
    );
    const totalCustomers = uniqueCustomers + (guestOrders.length > 0 ? 1 : 0);
    const averageSpendPerCustomer =
      totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

    // Repeat purchase rate (customers with more than 1 order)
    // Count orders per customer
    const customerOrderCountMap = new Map<string, number>();
    customerOrders.forEach((order) => {
      if (order.userId) {
        const currentCount = customerOrderCountMap.get(order.userId) || 0;
        customerOrderCountMap.set(order.userId, currentCount + 1);
      }
    });

    const customersWithMultipleOrders = Array.from(
      customerOrderCountMap.values()
    ).filter((count) => count > 1).length;

    const repeatPurchaseRate =
      uniqueCustomers > 0
        ? (customersWithMultipleOrders / uniqueCustomers) * 100
        : 0;

    // Guest vs Registered ratio (percentage of guest orders)
    const totalOrderCount = orders.length;
    const guestOrderCount = guestOrders.length;
    const guestVsRegisteredRatio =
      totalOrderCount > 0 ? (guestOrderCount / totalOrderCount) * 100 : 0;

    // Calculate refund metrics
    const refundedOrders = orders.filter(
      (order) => order.paymentStatus === AdminPaymentStatus.REFUNDED
    );

    const totalRefundAmount = refundedOrders.reduce(
      (sum, order) => sum + order.totals.total,
      0
    );
    const refundCount = refundedOrders.length;
    const averageRefundValue =
      refundCount > 0 ? totalRefundAmount / refundCount : 0;

    // Refund rate (percentage of orders that were refunded)
    const refundRate =
      totalOrderCount > 0 ? (refundCount / totalOrderCount) * 100 : 0;

    return {
      topCustomersRevenue,
      customerLifetimeValue,
      averageSpendPerCustomer,
      repeatPurchaseRate,
      guestVsRegisteredRatio,
      totalRefundAmount,
      refundCount,
      averageRefundValue,
      refundRate,
    };
  }, [orders]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 dark:bg-slate-700 rounded-lg"
              ></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
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
          Error loading customers and refunds data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Customers & Refunds
      </h3>

      {/* Customer Insights Section */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Customer Insights
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiUsers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Top Customers Revenue
              </span>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ${data.topCustomersRevenue.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiTrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Customer LTV
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${data.customerLifetimeValue.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiTrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Avg Spend
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${data.averageSpendPerCustomer.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiRepeat className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Repeat Rate
              </span>
            </div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {data.repeatPurchaseRate.toFixed(2)}%
            </p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiUsers className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Guest Ratio
              </span>
            </div>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {data.guestVsRegisteredRatio.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Refunds Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Refunds & Adjustments
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiDollarSign className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total Refund Amount
              </span>
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              ${data.totalRefundAmount.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiRefreshCw className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Refund Count
              </span>
            </div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {data.refundCount}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiDollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Avg Refund Value
              </span>
            </div>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              ${data.averageRefundValue.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Refund Rate
              </span>
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {data.refundRate.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersRefunds;
