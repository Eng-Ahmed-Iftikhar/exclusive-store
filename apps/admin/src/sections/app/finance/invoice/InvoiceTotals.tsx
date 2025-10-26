import React from 'react';
import { Transaction } from '@/apis/services/transactionApi';

interface InvoiceTotalsProps {
  transaction: Transaction;
}

const InvoiceTotals: React.FC<InvoiceTotalsProps> = ({ transaction }) => {
  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const subtotal = transaction.order?.subtotal || transaction.amount;
  const shippingCost = transaction.order?.shippingCost || 0;
  const tax = transaction.order?.tax || 0;
  const processingFee = transaction.processingFee || 0;
  const total = transaction.netAmount;

  return (
    <div className="flex justify-end mb-8">
      <div className="w-full md:w-80">
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal, transaction.currency)}</span>
          </div>
          {shippingCost > 0 && (
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Shipping:</span>
              <span>{formatCurrency(shippingCost, transaction.currency)}</span>
            </div>
          )}
          {tax > 0 && (
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Tax:</span>
              <span>{formatCurrency(tax, transaction.currency)}</span>
            </div>
          )}
          {processingFee > 0 && (
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Processing Fee:</span>
              <span>{formatCurrency(processingFee, transaction.currency)}</span>
            </div>
          )}
          <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-3 mt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                TOTAL:
              </span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(total, transaction.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTotals;
