import React from 'react';
import { Transaction } from '@/apis/services/transactionApi';

interface InvoiceHeaderProps {
  transaction: Transaction;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ transaction }) => {
  return (
    <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-blue-600 dark:border-blue-400">
      <div>
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
          EXCLUSIVE
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Your Trusted E-Commerce Partner
        </p>
      </div>
      <div className="text-right">
        <h2 className="text-5xl font-bold text-gray-900 dark:text-white">
          INVOICE
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          TXN-{transaction.id.slice(-8).toUpperCase()}
        </p>
      </div>
    </div>
  );
};

export default InvoiceHeader;
