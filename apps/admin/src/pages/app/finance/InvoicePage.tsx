import React from 'react';
import { useParams } from 'react-router-dom';
import InvoiceView from '@/views/app/finance/InvoiceView';

const InvoicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600 dark:text-red-400">Invalid transaction ID</p>
      </div>
    );
  }

  return <InvoiceView transactionId={id} />;
};

export default InvoicePage;
