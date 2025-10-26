import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routers/routes';
import InvoiceSection from '@/sections/app/finance/invoice/InvoiceSection';

interface InvoiceViewProps {
  transactionId: string;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ transactionId }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`${ROUTES.ADMIN_FINANCE}/transactions/${transactionId}`);
  };

  return <InvoiceSection transactionId={transactionId} onBack={handleBack} />;
};

export default InvoiceView;
