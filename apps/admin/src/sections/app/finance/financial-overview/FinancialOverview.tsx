import React, { useMemo } from 'react';
import { FiDollarSign, FiTrendingUp, FiActivity } from 'react-icons/fi';
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

interface FinancialOverviewProps {
  filters: FinancialFilters;
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({ filters }) => {
  const { orders, isLoading, error } = useFinancialOrders(filters);

  // Calculate stats from filtered orders
  const stats = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        totalRevenue: 0,
        netProfit: 0,
        averageOrderValue: 0,
        outstandingPayments: 0,
      };
    }

    // Calculate statistics
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totals.total,
      0
    );
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate outstanding payments (orders with pending payment status)
    const outstandingPayments = orders
      .filter((order) => order.paymentStatus === AdminPaymentStatus.PENDING)
      .reduce((sum, order) => sum + order.totals.total, 0);

    // For net profit, we'd need cost data which isn't available
    // Using revenue minus estimated costs (assuming 30% cost for now)
    const estimatedCosts = totalRevenue * 0.3;
    const netProfit = totalRevenue - estimatedCosts;

    return {
      totalRevenue,
      netProfit,
      averageOrderValue,
      outstandingPayments,
    };
  }, [orders]);

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6"
          >
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-32"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6">
        <p className="text-red-600 dark:text-red-400">
          Error loading financial overview. Please try again.
        </p>
      </div>
    );
  }

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
