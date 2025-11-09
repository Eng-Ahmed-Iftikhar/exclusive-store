import React from 'react';
import { FiCreditCard, FiUser, FiDollarSign, FiCalendar } from 'react-icons/fi';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Transaction, TransactionType } from '@/apis/services/transactionApi';

interface TransactionsTableContentProps {
  transactions: Transaction[];
  onViewTransaction: (transactionId: string) => void;
}

const TransactionsTableContent: React.FC<TransactionsTableContentProps> = ({
  transactions,
  onViewTransaction,
}) => {
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

  return (
    <div className="px-6 pb-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Gateway</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-12 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No transactions found
                </p>
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction: Transaction) => (
              <TableRow
                key={transaction.id}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                onClick={() => onViewTransaction(transaction.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <FiCreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        TXN-{transaction.id.slice(-8).toUpperCase()}
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {transaction.order?.orderNumber || 'N/A'}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {transaction.user?.name || 'Guest'}
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {transaction.user?.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
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
                      {transaction.processingFee &&
                        transaction.processingFee > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Fees:{' '}
                            {formatCurrency(
                              transaction.processingFee,
                              transaction.currency
                            )}
                          </p>
                        )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getPaymentMethodIcon(transaction.paymentMethod || 'card')}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {transaction.paymentMethod
                        ? transaction.paymentMethod
                            .replace('_', ' ')
                            .toUpperCase()
                        : 'N/A'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      transaction.status
                    )}`}
                  >
                    {transaction.status.toUpperCase()}
                  </span>
                  {transaction.type === TransactionType.REFUNDED && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Refunded
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Stripe
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {transaction.reference || 'N/A'}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(transaction.createdAt)}
                      </span>
                      {transaction.processedAt && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Processed: {formatDate(transaction.processedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTableContent;
