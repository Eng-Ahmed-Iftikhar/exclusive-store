import React from 'react';
import {
  useGetTransactionByIdQuery,
  useDownloadInvoiceMutation,
} from '@/apis/services/transactionApi';
import { FiArrowLeft, FiLoader, FiDownload } from 'react-icons/fi';
import InvoiceHeader from './InvoiceHeader';
import InvoiceDetails from './InvoiceDetails';
import InvoiceItems from './InvoiceItems';
import InvoiceTotals from './InvoiceTotals';
import InvoiceFooter from './InvoiceFooter';

interface InvoiceSectionProps {
  transactionId: string;
  onBack: () => void;
}

const InvoiceSection: React.FC<InvoiceSectionProps> = ({
  transactionId,
  onBack,
}) => {
  const {
    data: transaction,
    isLoading,
    error,
  } = useGetTransactionByIdQuery(transactionId);

  const [downloadInvoice, { isLoading: isDownloading }] =
    useDownloadInvoiceMutation();

  const handleDownloadPDF = async () => {
    try {
      await downloadInvoice(transactionId).unwrap();
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Failed to download invoice. Please try again.');
    }
  };

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

  return (
    <div className="space-y-6 print:space-y-0">
      {/* Action Bar - Hidden on Print */}
      <div className="print:hidden flex items-center justify-between p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Transaction
        </button>
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiDownload className="w-4 h-4" />
          {isDownloading ? 'Downloading...' : 'Download PDF'}
        </button>
      </div>

      {/* Invoice Container */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-lg print:shadow-none print:border-0">
        <div className="p-8 print:p-12">
          {/* Header */}
          <InvoiceHeader transaction={transaction} />

          {/* Details Section */}
          <InvoiceDetails transaction={transaction} />

          {/* Items Table */}
          <InvoiceItems transaction={transaction} />

          {/* Totals Section */}
          <InvoiceTotals transaction={transaction} />

          {/* Footer */}
          <InvoiceFooter />
        </div>
      </div>
    </div>
  );
};

export default InvoiceSection;
