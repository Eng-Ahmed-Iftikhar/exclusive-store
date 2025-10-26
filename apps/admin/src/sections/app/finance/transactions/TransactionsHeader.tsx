import React from 'react';

const TransactionsHeader: React.FC = () => {
  return (
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
  );
};

export default TransactionsHeader;
