import React from 'react';

const InvoiceFooter: React.FC = () => {
  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400">
      <p className="text-lg font-medium mb-2">Thank you for your business!</p>
      <p className="text-sm">This is a computer-generated invoice.</p>
    </div>
  );
};

export default InvoiceFooter;
