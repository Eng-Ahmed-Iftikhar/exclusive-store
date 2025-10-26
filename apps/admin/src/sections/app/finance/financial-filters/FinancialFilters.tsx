import React from 'react';
import { FiFilter, FiRefreshCw } from 'react-icons/fi';
import { DateRangePicker, DateRange } from '@/components/ui/date-range-picker';

interface FinancialFiltersProps {
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
  userId?: string;
  onUserIdChange?: (userId: string) => void;
  categoryId?: string;
  onCategoryIdChange?: (categoryId: string) => void;
  productId?: string;
  onProductIdChange?: (productId: string) => void;
  paymentStatus?: string;
  onPaymentStatusChange?: (status: string) => void;
  orderStatus?: string;
  onOrderStatusChange?: (status: string) => void;
  onReset?: () => void;
  onExport?: () => void;
}

const FinancialFilters: React.FC<FinancialFiltersProps> = ({
  dateRange,
  onDateRangeChange,
  userId,
  onUserIdChange,
  categoryId,
  onCategoryIdChange,
  productId,
  onProductIdChange,
  paymentStatus,
  onPaymentStatusChange,
  orderStatus,
  onOrderStatusChange,
  onReset,
  onExport,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <FiFilter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filters
        </h3>
      </div>

      {/* First Row - Primary Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date Range
          </label>
          <DateRangePicker
            value={dateRange}
            onChange={onDateRangeChange}
            placeholder="Select date range"
            className="w-full"
          />
        </div>

        {/* User Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            User
          </label>
          <select
            value={userId || 'all'}
            onChange={(e) => onUserIdChange?.(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          >
            <option value="all">All Users</option>
            <option value="registered">Registered Users</option>
            <option value="guest">Guest Users</option>
            {/* TODO: Add specific user options from API */}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={categoryId || 'all'}
            onChange={(e) => onCategoryIdChange?.(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {/* TODO: Add category options from API */}
          </select>
        </div>
      </div>

      {/* Second Row - Additional Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {/* Product Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Product
          </label>
          <select
            value={productId || 'all'}
            onChange={(e) => onProductIdChange?.(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          >
            <option value="all">All Products</option>
            {/* TODO: Add product options from API */}
          </select>
        </div>

        {/* Payment Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Payment Status
          </label>
          <select
            value={paymentStatus || 'all'}
            onChange={(e) => onPaymentStatusChange?.(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Order Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Order Status
          </label>
          <select
            value={orderStatus || 'all'}
            onChange={(e) => onOrderStatusChange?.(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <FiRefreshCw className="w-4 h-4" />
          Reset Filters
        </button>
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Export Report
          </button>
        )}
      </div>
    </div>
  );
};

export default FinancialFilters;
