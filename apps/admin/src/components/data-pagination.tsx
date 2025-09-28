import React, { useMemo } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

interface DataPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (limit: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

const DataPagination: React.FC<DataPaginationProps> = React.memo(
  ({
    currentPage = 1,
    totalPages = 0,
    onPageChange,
    onItemsPerPageChange,
    totalItems = 0,
    itemsPerPage = 10,
  }) => {
    const { startItem, endItem } = useMemo(
      () => ({
        startItem: (currentPage - 1) * itemsPerPage + 1,
        endItem: Math.min(currentPage * itemsPerPage, totalItems),
      }),
      [currentPage, itemsPerPage, totalItems]
    );

    const visiblePages = useMemo(() => {
      if (totalPages <= 1) return [1];

      const delta = 2;
      const pages: (number | string)[] = [];

      // Always show first page
      pages.push(1);

      // Calculate the range around current page
      const start = Math.max(2, currentPage - delta);
      const end = Math.min(totalPages - 1, currentPage + delta);

      // Add ellipsis before range if needed
      if (start > 2) {
        pages.push('...');
      }

      // Add pages in range (excluding first and last page)
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      // Add ellipsis after range if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page (if more than 1 page)
      if (totalPages > 1) {
        pages.push(totalPages);
      }

      return pages;
    }, [currentPage, totalPages]);

    return (
      <div className="w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
          {/* Left side - Results info and items per page */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Showing {startItem} to {endItem} of {totalItems} results
            </div>

            {onItemsPerPageChange && (
              <div className="flex items-center gap-2">
                <label
                  htmlFor="items-per-page"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Show:
                </label>
                <select
                  id="items-per-page"
                  value={itemsPerPage}
                  onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                  className="px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors hover:bg-gray-50 dark:hover:bg-slate-600"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  per page
                </span>
              </div>
            )}
          </div>

          {/* Right side - Pagination */}
          <div className="flex items-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(currentPage - 1)}
                    className={`transition-colors ${
                      currentPage <= 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  />
                </PaginationItem>

                {visiblePages.map((page, index) => (
                  <PaginationItem key={index}>
                    {page === '...' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => onPageChange(page as number)}
                        isActive={currentPage === page}
                        className={`transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
                            : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => onPageChange(currentPage + 1)}
                    className={`transition-colors ${
                      currentPage >= totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    );
  }
);

DataPagination.displayName = 'DataPagination';

export default DataPagination;
