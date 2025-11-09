import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PermissionGuard } from '@/components/PermissionGuard';
import TransactionsTable from '@/sections/app/finance/transactions/TransactionsTable';
import { ROUTES } from '@/routers/routes';
import {
  useExportTransactionsCSVMutation,
  TransactionQueryParams,
} from '@/apis/services/transactionApi';

const TransactionsView: React.FC = () => {
  const navigate = useNavigate();
  const [exportFilters, setExportFilters] = useState<TransactionQueryParams>(
    {}
  );
  const [exportCSV] = useExportTransactionsCSVMutation();

  const handleViewTransaction = (transactionId: string) => {
    navigate(`${ROUTES.ADMIN_FINANCE}/transactions/${transactionId}`);
  };

  const handleExportTransactions = async () => {
    try {
      await exportCSV(exportFilters).unwrap();
    } catch (error) {
      console.error('Failed to export transactions as CSV:', error);
    }
  };

  return (
    <PermissionGuard action="view" subject="transaction">
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
          <button
            onClick={handleExportTransactions}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Export CSV
          </button>
        </div>

        <TransactionsTable
          onViewTransaction={handleViewTransaction}
          onFiltersChange={setExportFilters}
        />
      </div>
    </PermissionGuard>
  );
};

export default TransactionsView;
