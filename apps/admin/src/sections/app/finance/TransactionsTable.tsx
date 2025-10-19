import React, { useState } from 'react';
import { PermissionGuard } from '@/components/PermissionGuard';
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiRefreshCw,
  FiCreditCard,
  FiUser,
  FiDollarSign,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertCircle,
} from 'react-icons/fi';
import DataPagination from '@/components/data-pagination';

// Mock data interface
interface Transaction {
  id: string;
  transactionId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  paymentMethod:
    | 'credit_card'
    | 'debit_card'
    | 'paypal'
    | 'stripe'
    | 'bank_transfer';
  status: 'completed' | 'pending' | 'failed' | 'refunded' | 'cancelled';
  gateway: string;
  gatewayTransactionId: string;
  transactionDate: string;
  processedDate?: string;
  refundAmount?: number;
  refundDate?: string;
  fees: number;
  netAmount: number;
}

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
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [limit, setLimit] = useState(10);

  // Mock data - replace with actual API call
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      transactionId: 'TXN-2024-001',
      orderNumber: 'ORD-2024-001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      amount: 299.99,
      currency: 'USD',
      paymentMethod: 'credit_card',
      status: 'completed',
      gateway: 'Stripe',
      gatewayTransactionId: 'pi_1234567890',
      transactionDate: '2024-01-15T10:30:00Z',
      processedDate: '2024-01-15T10:31:00Z',
      fees: 8.7,
      netAmount: 291.29,
    },
    {
      id: '2',
      transactionId: 'TXN-2024-002',
      orderNumber: 'ORD-2024-002',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      amount: 149.5,
      currency: 'USD',
      paymentMethod: 'paypal',
      status: 'completed',
      gateway: 'PayPal',
      gatewayTransactionId: 'PAYID-1234567890',
      transactionDate: '2024-01-14T14:20:00Z',
      processedDate: '2024-01-14T14:21:00Z',
      fees: 4.34,
      netAmount: 145.16,
    },
    {
      id: '3',
      transactionId: 'TXN-2024-003',
      orderNumber: 'ORD-2024-003',
      customerName: 'Bob Johnson',
      customerEmail: 'bob@example.com',
      amount: 89.99,
      currency: 'USD',
      paymentMethod: 'debit_card',
      status: 'failed',
      gateway: 'Stripe',
      gatewayTransactionId: 'pi_0987654321',
      transactionDate: '2024-01-13T09:15:00Z',
      fees: 0,
      netAmount: 0,
    },
    {
      id: '4',
      transactionId: 'TXN-2024-004',
      orderNumber: 'ORD-2024-004',
      customerName: 'Alice Brown',
      customerEmail: 'alice@example.com',
      amount: 199.99,
      currency: 'USD',
      paymentMethod: 'credit_card',
      status: 'refunded',
      gateway: 'Stripe',
      gatewayTransactionId: 'pi_1122334455',
      transactionDate: '2024-01-12T16:45:00Z',
      processedDate: '2024-01-12T16:46:00Z',
      refundAmount: 199.99,
      refundDate: '2024-01-16T10:00:00Z',
      fees: 5.8,
      netAmount: -199.99,
    },
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'refunded':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
      case 'debit_card':
        return <FiCreditCard className="w-4 h-4" />;
      case 'paypal':
        return <FiCreditCard className="w-4 h-4" />;
      case 'stripe':
        return <FiCreditCard className="w-4 h-4" />;
      case 'bank_transfer':
        return <FiCreditCard className="w-4 h-4" />;
      default:
        return <FiCreditCard className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDateRangeFilter = (transactionDate: string) => {
    const transaction = new Date(transactionDate);
    const now = new Date();
    const daysDiff = Math.floor(
      (now.getTime() - transaction.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff <= 7) return 'last_week';
    if (daysDiff <= 30) return 'last_month';
    if (daysDiff <= 90) return 'last_quarter';
    return 'older';
  };

  // Filter transactions based on search and filters
  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.transactionId
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.orderNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.customerEmail
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.gatewayTransactionId
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || transaction.status === statusFilter;
    const matchesPaymentMethod =
      paymentMethodFilter === 'all' ||
      transaction.paymentMethod === paymentMethodFilter;
    const matchesDateRange =
      dateRange === 'all' ||
      getDateRangeFilter(transaction.transactionDate) === dateRange;

    return (
      matchesSearch && matchesStatus && matchesPaymentMethod && matchesDateRange
    );
  });

  // Paginate filtered results
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    endIndex
  );
  const totalPages = Math.ceil(filteredTransactions.length / limit);

  const renderPagination = () => {
    if (filteredTransactions.length === 0) return null;

    return (
      <DataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        totalItems={filteredTransactions.length}
        itemsPerPage={limit}
      />
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/20">
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Transactions
            </h2>
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
              All payment transactions from order placements
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 pb-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions, orders, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
            </div>
          </form>
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              <option value="all">All Methods</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="stripe">Stripe</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="last_week">Last Week</option>
              <option value="last_month">Last Month</option>
              <option value="last_quarter">Last Quarter</option>
              <option value="older">Older</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-6 pb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-600">
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Transaction
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Customer
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Amount
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Payment Method
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Gateway
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((transaction: Transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-gray-100 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <FiCreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {transaction.transactionId}
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {transaction.orderNumber}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FiUser className="w-4 h-4 text-gray-500" />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {transaction.customerName}
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {transaction.customerEmail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="w-4 h-4 text-gray-500" />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(
                            transaction.amount,
                            transaction.currency
                          )}
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Net:{' '}
                          {formatCurrency(
                            transaction.netAmount,
                            transaction.currency
                          )}
                        </p>
                        {transaction.fees > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Fees:{' '}
                            {formatCurrency(
                              transaction.fees,
                              transaction.currency
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(transaction.paymentMethod)}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {transaction.paymentMethod
                          .replace('_', ' ')
                          .toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {transaction.status.toUpperCase()}
                    </span>
                    {transaction.refundAmount && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        Refunded:{' '}
                        {formatCurrency(
                          transaction.refundAmount,
                          transaction.currency
                        )}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.gateway}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {transaction.gatewayTransactionId}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(transaction.transactionDate)}
                        </span>
                        {transaction.processedDate && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Processed: {formatDate(transaction.processedDate)}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <PermissionGuard action="view" subject="transactions">
                        <button
                          onClick={() => onViewTransaction(transaction.id)}
                          className="p-2 rounded-lg transition-colors text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30"
                          title="View Transaction"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                      </PermissionGuard>
                      {transaction.status === 'completed' &&
                        !transaction.refundAmount && (
                          <PermissionGuard action="edit" subject="transactions">
                            <button
                              onClick={() =>
                                onRefundTransaction(transaction.id)
                              }
                              className="p-2 rounded-lg transition-colors text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/30"
                              title="Process Refund"
                            >
                              <FiRefreshCw className="w-4 h-4" />
                            </button>
                          </PermissionGuard>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-6 pb-6">{renderPagination()}</div>
    </div>
  );
};

export default TransactionsTable;
