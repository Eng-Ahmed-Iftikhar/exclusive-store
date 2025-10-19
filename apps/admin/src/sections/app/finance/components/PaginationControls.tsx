import React from 'react';
import DataPagination from '@/components/data-pagination';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (limit: number) => void;
  className?: string;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  className = '',
}) => {
  if (totalItems === 0) return null;

  return (
    <div className={className}>
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

export default PaginationControls;
