import React from 'react';
import { FiCreditCard } from 'react-icons/fi';

interface PaymentInfoSectionProps {
  payment: {
    paymentMethod?: string;
    last4?: string;
    brand?: string;
  };
}

const PaymentInfoSection: React.FC<PaymentInfoSectionProps> = ({ payment }) => {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiCreditCard className="w-5 h-5" />
          Payment Information
        </h2>
      </div>
      <div className="p-6 space-y-3">
        {payment.paymentMethod && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Method</p>
            <p className="font-medium text-gray-900 dark:text-white capitalize">
              {payment.paymentMethod}
            </p>
          </div>
        )}
        {payment.last4 && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Card</p>
            <p className="font-medium text-gray-900 dark:text-white">
              •••• {payment.last4}
            </p>
          </div>
        )}
        {payment.brand && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Brand</p>
            <p className="font-medium text-gray-900 dark:text-white capitalize">
              {payment.brand}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentInfoSection;
