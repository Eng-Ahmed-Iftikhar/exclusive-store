import React from 'react';
import DataPagination from '@/components/data-pagination';

interface TransactionsPaginationProps {
  transactions: any[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (newLimit: number) => void;
}

const TransactionsPagination: React.FC<TransactionsPaginationProps> = ({
  transactions,
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  onItemsPerPageChange,
}) => {
  if (transactions.length === 0) return null;

  return (
    <div className="px-6 pb-6">
      <DataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
        totalItems={totalItems}
        itemsPerPage={limit}
      />
    </div>
  );
};

export default TransactionsPagination;
