import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTransactionByIdQuery } from '@/apis/services/transactionApi';
import { ROUTES } from '@/routers/routes';
import { FiArrowLeft, FiLoader, FiFileText } from 'react-icons/fi';
import TransactionSummarySection from './TransactionSummarySection';
import RelatedOrderSection from './RelatedOrderSection';
import UserInfoSection from './UserInfoSection';

interface TransactionDetailSectionProps {
  transactionId: string;
  onBack: () => void;
}

const TransactionDetailSection: React.FC<TransactionDetailSectionProps> = ({
  transactionId,
  onBack,
}) => {
  const navigate = useNavigate();
  const {
    data: transaction,
    isLoading,
    error,
  } = useGetTransactionByIdQuery(transactionId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600 dark:text-red-400">
          Failed to load transaction details
        </p>
      </div>
    );
  }

  const handleGenerateInvoice = () => {
    navigate(`${ROUTES.ADMIN_FINANCE}/invoice/${transactionId}`);
  };

  // Extract customer info from order (guest or registered user)
  const getCustomerInfo = () => {
    if (!transaction.order) {
      return null;
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
        };
      }
    }

    // If registered user, use order.user
    if (transaction.order.user) {
      return {
        name: transaction.order.user.name,
        email: transaction.order.user.email,
      };
    }

    return null;
  };

  const customerInfo = getCustomerInfo();

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Transaction Details
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              TXN-{transaction.id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>
        <button
          onClick={handleGenerateInvoice}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <FiFileText className="w-4 h-4" />
          Generate Invoice
        </button>
      </div>

      {/* Summary and User Info - Side by Side */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column - Transaction Summary */}
        <div className="xl:col-span-8">
          <TransactionSummarySection transaction={transaction} />
        </div>

        {/* Right Column - User Info */}
        <div className="xl:col-span-4">
          {customerInfo && <UserInfoSection customerInfo={customerInfo} />}
        </div>
      </div>

      {/* Related Order - Full Width Below */}
      {transaction.order && (
        <div>
          <RelatedOrderSection order={transaction.order} />
        </div>
      )}
    </div>
  );
};

export default TransactionDetailSection;
