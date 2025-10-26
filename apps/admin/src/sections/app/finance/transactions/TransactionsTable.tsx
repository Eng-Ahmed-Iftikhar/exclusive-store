import React, { useState } from 'react';
import {
  useGetTransactionsQuery,
  TransactionStatus,
  PaymentMethod,
  TransactionQueryParams,
} from '@/apis/services/transactionApi';
import TransactionsHeader from './TransactionsHeader';
import TransactionsSearchAndFilters from './TransactionsSearchAndFilters';
import TransactionsTableContent from './TransactionsTableContent';
import TransactionsPagination from './TransactionsPagination';

interface TransactionsTableProps {
  onViewTransaction: (transactionId: string) => void;
  onRefundTransaction: (transactionId: string) => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  onViewTransaction,
  onRefundTransaction,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [limit, setLimit] = useState(10);

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
      />

      <TransactionsTableContent
        transactions={transactions}
        onViewTransaction={onViewTransaction}
        onRefundTransaction={onRefundTransaction}
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
