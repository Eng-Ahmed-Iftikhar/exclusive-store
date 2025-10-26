import React from 'react';
import DataPagination from '@/components/data-pagination';

interface OrderHistoryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (limit: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

const OrderHistoryPagination: React.FC<OrderHistoryPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onItemsPerPageChange,
  totalItems,
  itemsPerPage,
}) => {
  if (totalItems === 0) return null;

  return (
    <div className="px-6 pb-6">
      <DataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default OrderHistoryPagination;
