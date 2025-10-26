import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useGetTransactionsQuery,
  TransactionStatus,
  PaymentMethod,
  TransactionQueryParams,
} from '@/apis/services/transactionApi';
import { DateRange } from '@/components/ui/date-range-picker';
import TransactionsHeader from './TransactionsHeader';
import TransactionsSearchAndFilters from './TransactionsSearchAndFilters';
import TransactionsTableContent from './TransactionsTableContent';
import TransactionsPagination from './TransactionsPagination';

interface TransactionsTableProps {
  onViewTransaction: (transactionId: string) => void;
  onFiltersChange?: (filters: TransactionQueryParams) => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  onViewTransaction,
  onFiltersChange,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL params
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page, 10) : 1;
  });

  const [searchTerm, setSearchTerm] = useState(() => {
    return searchParams.get('search') || '';
  });

  const [statusFilter, setStatusFilter] = useState(() => {
    return searchParams.get('status') || 'all';
  });

  const [paymentMethodFilter, setPaymentMethodFilter] = useState(() => {
    return searchParams.get('paymentMethod') || 'all';
  });

  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    return {
      from: dateFrom ? new Date(dateFrom) : null,
      to: dateTo ? new Date(dateTo) : null,
    };
  });

  const [limit, setLimit] = useState(() => {
    const limitParam = searchParams.get('limit');
    return limitParam ? parseInt(limitParam, 10) : 10;
  });

  // RTK Query hook for transactions
  const queryParams: TransactionQueryParams = {
    page: currentPage,
    limit,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  };

  if (searchTerm) {
    queryParams.search = searchTerm;
  }

  if (statusFilter !== 'all') {
    queryParams.status = statusFilter as TransactionStatus;
  }

  if (paymentMethodFilter !== 'all') {
    queryParams.paymentMethod = paymentMethodFilter as PaymentMethod;
  }

  if (dateRange.from) {
    queryParams.dateFrom = dateRange.from.toISOString();
  }

  if (dateRange.to) {
    queryParams.dateTo = dateRange.to.toISOString();
  }

  const {
    data: transactionsResponse,
    isLoading,
    error,
    refetch,
  } = useGetTransactionsQuery(queryParams);

  // Extract data from response
  const transactions = transactionsResponse?.transactions || [];
  const totalPages = transactionsResponse?.pagination?.totalPages || 0;
  const totalItems = transactionsResponse?.pagination?.total || 0;

  // Update URL search params whenever filters or pagination change
  useEffect(() => {
    const newSearchParams = new URLSearchParams();

    // Add pagination params (only if not default)
    if (currentPage > 1) {
      newSearchParams.set('page', currentPage.toString());
    }
    if (limit !== 10) {
      newSearchParams.set('limit', limit.toString());
    }

    // Add filter params (only if not default/empty)
    if (searchTerm) {
      newSearchParams.set('search', searchTerm);
    }
    if (statusFilter !== 'all') {
      newSearchParams.set('status', statusFilter);
    }
    if (paymentMethodFilter !== 'all') {
      newSearchParams.set('paymentMethod', paymentMethodFilter);
    }
    if (dateRange.from) {
      newSearchParams.set('dateFrom', dateRange.from.toISOString());
    }
    if (dateRange.to) {
      newSearchParams.set('dateTo', dateRange.to.toISOString());
    }

    // Only update if params have changed
    const currentParams = searchParams.toString();
    const newParams = newSearchParams.toString();

    if (currentParams !== newParams) {
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [
    currentPage,
    limit,
    searchTerm,
    statusFilter,
    paymentMethodFilter,
    dateRange,
    searchParams,
    setSearchParams,
  ]);

  // Update filters whenever they change (for export functionality)
  useEffect(() => {
    if (onFiltersChange) {
      const exportFilters: TransactionQueryParams = {};
      if (searchTerm) exportFilters.search = searchTerm;
      if (statusFilter !== 'all')
        exportFilters.status = statusFilter as TransactionStatus;
      if (paymentMethodFilter !== 'all')
        exportFilters.paymentMethod = paymentMethodFilter as PaymentMethod;
      if (dateRange.from) exportFilters.dateFrom = dateRange.from.toISOString();
      if (dateRange.to) exportFilters.dateTo = dateRange.to.toISOString();
      onFiltersChange(exportFilters);
    }
  }, [
    searchTerm,
    statusFilter,
    paymentMethodFilter,
    dateRange,
    onFiltersChange,
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePaymentMethodFilterChange = (value: string) => {
    setPaymentMethodFilter(value);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/20">
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/20">
        <div className="p-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
              Error Loading Transactions
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Failed to load transactions. Please try again.
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/20">
      <TransactionsHeader />

      <TransactionsSearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        paymentMethodFilter={paymentMethodFilter}
        onPaymentMethodFilterChange={handlePaymentMethodFilterChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
      />

      <TransactionsTableContent
        transactions={transactions}
        onViewTransaction={onViewTransaction}
      />

      <TransactionsPagination
        transactions={transactions}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        limit={limit}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
};

export default TransactionsTable;
