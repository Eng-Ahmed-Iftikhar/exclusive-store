import React from 'react';
import { PermissionGuard } from '@/components/PermissionGuard';
import TransactionsTable from '@/sections/app/finance/TransactionsTable';

const TransactionsView: React.FC = () => {
  const handleViewTransaction = (transactionId: string) => {
    // Navigate to transaction detail page
    window.location.href = `/finance/transactions/${transactionId}`;
  };

  const handleRefundTransaction = (transactionId: string) => {
    // Handle transaction refund
    console.log(`Processing refund for transaction ${transactionId}`);
  };

  const handleExportTransactions = (format: 'csv' | 'excel') => {
    // Handle transaction export
    console.log(`Exporting transactions in ${format} format`);
  };

  return (
    <PermissionGuard action="view" subject="transactions">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Transactions
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              All payment transactions made by users during order placement
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleExportTransactions('csv')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExportTransactions('excel')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Export Excel
            </button>
          </div>
        </div>

        <TransactionsTable
          onViewTransaction={handleViewTransaction}
          onRefundTransaction={handleRefundTransaction}
        />
      </div>
    </PermissionGuard>
  );
};

export default TransactionsView;
