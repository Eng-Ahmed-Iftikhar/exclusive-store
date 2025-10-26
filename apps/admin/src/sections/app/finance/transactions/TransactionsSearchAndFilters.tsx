import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { DateRangePicker, DateRange } from '@/components/ui/date-range-picker';

interface TransactionsSearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  paymentMethodFilter: string;
  onPaymentMethodFilterChange: (value: string) => void;
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
}

const TransactionsSearchAndFilters: React.FC<
  TransactionsSearchAndFiltersProps
> = ({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  statusFilter,
  onStatusFilterChange,
  paymentMethodFilter,
  onPaymentMethodFilterChange,
  dateRange,
  onDateRangeChange,
}) => {
  return (
    <div className="px-6 pb-6">
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <form onSubmit={onSearchSubmit} className="flex-1">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions, orders, customers..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </form>
        <div className="flex flex-wrap gap-2">
          <DateRangePicker
            value={dateRange}
            onChange={onDateRangeChange}
            placeholder="Select date range"
            className="w-full lg:w-auto"
          />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
            <option value="cancelled">Cancelled</option>
            <option value="processing">Processing</option>
          </select>
          <select
            value={paymentMethodFilter}
            onChange={(e) => onPaymentMethodFilterChange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          >
            <option value="all">All Methods</option>
            <option value="card">Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="wallet">Wallet</option>
            <option value="cryptocurrency">Cryptocurrency</option>
            <option value="cash">Cash</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TransactionsSearchAndFilters;
