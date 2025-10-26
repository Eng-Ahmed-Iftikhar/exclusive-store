import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routers/routes';
import TransactionDetailSection from '@/sections/app/finance/transaction-detail/TransactionDetailSection';

const TransactionDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(ROUTES.ADMIN_TRANSACTIONS);
  };

  if (!id) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600 dark:text-gray-400">
          Transaction ID is required
        </p>
      </div>
    );
  }

  return <TransactionDetailSection transactionId={id} onBack={handleBack} />;
};

export default TransactionDetailView;
