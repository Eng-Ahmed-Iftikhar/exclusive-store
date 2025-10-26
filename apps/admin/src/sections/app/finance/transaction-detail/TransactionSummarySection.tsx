import React from 'react';
import {
  Transaction,
  TransactionType,
  TransactionStatus,
} from '@/apis/services/transactionApi';
import {
  FiDollarSign,
  FiCalendar,
  FiCreditCard,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from 'react-icons/fi';

interface TransactionSummarySectionProps {
  transaction: Transaction;
}

const TransactionSummarySection: React.FC<TransactionSummarySectionProps> = ({
  transaction,
}) => {
  const formatCurrency = (amount: number, currency = 'USD') => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
        );
      case 'pending':
        return (
          <FiClock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        );
      case 'failed':
        return <FiXCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      default:
        return <FiClock className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
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

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiDollarSign className="w-5 h-5" />
          Transaction Summary
        </h2>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
              {formatCurrency(transaction.amount, transaction.currency)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
            <div className="flex items-center gap-2 mt-1">
              {getStatusIcon(transaction.status)}
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                  transaction.status
                )}`}
              >
                {transaction.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
              {transaction.type.replace('_', ' ').toUpperCase()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Payment Method
            </p>
            <div className="flex items-center gap-2 mt-1">
              <FiCreditCard className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {transaction.paymentMethod
                  ? transaction.paymentMethod.replace('_', ' ').toUpperCase()
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {transaction.processingFee && transaction.processingFee > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Processing Fee
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                {formatCurrency(
                  transaction.processingFee,
                  transaction.currency
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Net Amount
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                {formatCurrency(transaction.netAmount, transaction.currency)}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Created At
            </p>
            <div className="flex items-center gap-2 mt-1">
              <FiCalendar className="w-4 h-4 text-gray-500" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDate(transaction.createdAt)}
              </p>
            </div>
          </div>
          {transaction.processedAt && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Processed At
              </p>
              <div className="flex items-center gap-2 mt-1">
                <FiCalendar className="w-4 h-4 text-gray-500" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(transaction.processedAt)}
                </p>
              </div>
            </div>
          )}
        </div>

        {transaction.description && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Description
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
              {transaction.description}
            </p>
          </div>
        )}

        {transaction.reference && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Reference
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
              {transaction.reference}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionSummarySection;
