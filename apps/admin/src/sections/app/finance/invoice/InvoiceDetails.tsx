import React from 'react';
import { Transaction } from '@/apis/services/transactionApi';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiShoppingBag,
  FiCheckCircle,
} from 'react-icons/fi';

interface InvoiceDetailsProps {
  transaction: Transaction;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ transaction }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Extract customer info from order (guest or registered user)
  const getCustomerInfo = () => {
    if (!transaction.order) {
      return {
        name: transaction.user?.name || 'Guest',
        email: transaction.user?.email || 'N/A',
        phone: undefined,
      };
    }

    // If guest order, parse guestUserInfo
    if (transaction.order.isGuestOrder && transaction.order.guestUserInfo) {
      try {
        const guestInfo = JSON.parse(transaction.order.guestUserInfo);
        return {
          name: guestInfo.name || 'Guest',
          email: guestInfo.email || 'N/A',
          phone: guestInfo.phone,
        };
      } catch {
        return {
          name: 'Guest',
          email: 'N/A',
          phone: undefined,
        };
      }
    }

    // If registered user, use order.user
    if (transaction.order.user) {
      return {
        name: transaction.order.user.name,
        email: transaction.order.user.email,
        phone: undefined,
      };
    }

    return {
      name: 'Guest',
      email: 'N/A',
      phone: undefined,
    };
  };

  const customerInfo = getCustomerInfo();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      {/* Bill To Section */}
      <div>
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-wide">
          Bill To
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FiUser className="w-4 h-4 text-gray-500" />
            <p className="text-gray-900 dark:text-white font-medium">
              {customerInfo.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FiMail className="w-4 h-4 text-gray-500" />
            <p className="text-gray-600 dark:text-gray-400">
              {customerInfo.email}
            </p>
          </div>
          {customerInfo.phone && (
            <div className="flex items-center gap-2">
              <FiPhone className="w-4 h-4 text-gray-500" />
              <p className="text-gray-600 dark:text-gray-400">
                {customerInfo.phone}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Details Section */}
      <div className="text-right">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-wide">
          Transaction Details
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-end gap-2">
            <FiCalendar className="w-4 h-4 text-gray-500" />
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-white">
                Date:
              </span>{' '}
              {formatDate(transaction.createdAt)}
            </p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <FiShoppingBag className="w-4 h-4 text-gray-500" />
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-white">
                Order:
              </span>{' '}
              {transaction.order?.orderNumber || 'N/A'}
            </p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <FiCheckCircle className="w-4 h-4 text-gray-500" />
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
    </div>
  );
};

export default InvoiceDetails;
