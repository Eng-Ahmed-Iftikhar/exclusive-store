import React from 'react';
import { FiUser } from 'react-icons/fi';

interface CustomerInfoSectionProps {
  customer: {
    name: string;
    email: string;
    phone?: string;
    isGuest: boolean;
  };
}

const CustomerInfoSection: React.FC<CustomerInfoSectionProps> = ({
  customer,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiUser className="w-5 h-5" />
          Customer Information
        </h2>
      </div>
      <div className="p-6 space-y-3">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {customer.name}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {customer.email}
          </p>
        </div>
        {customer.phone && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {customer.phone}
            </p>
          </div>
        )}
        <div>
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              customer.isGuest
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            }`}
          >
            {customer.isGuest ? 'Guest' : 'Registered'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoSection;
