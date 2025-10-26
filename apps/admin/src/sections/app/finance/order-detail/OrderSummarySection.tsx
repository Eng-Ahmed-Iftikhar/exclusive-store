import React from 'react';
import { FiDollarSign } from 'react-icons/fi';

interface OrderSummarySectionProps {
  totals: {
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
  };
}

const OrderSummarySection: React.FC<OrderSummarySectionProps> = ({
  totals,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiDollarSign className="w-5 h-5" />
          Order Summary
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Subtotal</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Shipping</span>
            <span>{formatCurrency(totals.shippingCost)}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Tax</span>
            <span>{formatCurrency(totals.tax)}</span>
          </div>
          <div className="border-t border-gray-200 dark:border-slate-700 pt-3">
            <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
              <span>Total</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummarySection;
