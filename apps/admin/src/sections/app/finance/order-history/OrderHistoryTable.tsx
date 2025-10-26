import React, { useState, useEffect, useMemo } from 'react';
import {
  useGetOrdersQuery,
  AdminOrderQuery,
  AdminOrderStatus,
  AdminPaymentStatus,
} from '@/apis/services/orderApi';
import { useSearchParams } from 'react-router-dom';
import { DateRange } from '@/components/ui/date-range-picker';
import OrderHistoryHeader from '@/sections/app/finance/order-history/OrderHistoryHeader';
import OrderHistorySearchAndFilters from '@/sections/app/finance/order-history/OrderHistorySearchAndFilters';
import OrderHistoryTableContent from '@/sections/app/finance/order-history/OrderHistoryTableContent';
import OrderHistoryPagination from '@/sections/app/finance/order-history/OrderHistoryPagination';

interface OrderHistoryTableProps {
  onViewOrder: (orderId: string) => void;
  onFiltersChange?: (filters: AdminOrderQuery) => void;
}

const OrderHistoryTable: React.FC<OrderHistoryTableProps> = ({
  onViewOrder,
  onFiltersChange,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(() => {
    return parseInt(searchParams.get('page') || '1', 10);
  });
  const [searchTerm, setSearchTerm] = useState(() => {
    return searchParams.get('search') || '';
  });
  const [statusFilter, setStatusFilter] = useState<string>(() => {
    return searchParams.get('status') || 'all';
  });
  const [paymentFilter, setPaymentFilter] = useState<string>(() => {
    return searchParams.get('paymentStatus') || 'all';
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    if (dateFrom && dateTo) {
      return {
        from: new Date(dateFrom),
        to: new Date(dateTo),
      };
    }
    return undefined;
  });
  const [limit, setLimit] = useState(() => {
    return parseInt(searchParams.get('limit') || '10', 10);
  });

  // Build query params for API
  const queryParams: AdminOrderQuery = useMemo(
    () => ({
      page: currentPage,
      limit,
      search: searchTerm || undefined,
      status:
        statusFilter !== 'all' ? (statusFilter as AdminOrderStatus) : undefined,
      paymentStatus:
        paymentFilter !== 'all'
          ? (paymentFilter as AdminPaymentStatus)
          : undefined,
      dateFrom: dateRange?.from?.toISOString(),
      dateTo: dateRange?.to?.toISOString(),
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }),
    [currentPage, limit, searchTerm, statusFilter, paymentFilter, dateRange]
  );

  const { data, isLoading, error } = useGetOrdersQuery(queryParams);

  // Notify parent component of filter changes
  useEffect(() => {
    onFiltersChange?.(queryParams);
  }, [queryParams, onFiltersChange]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (searchTerm) params.set('search', searchTerm);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (paymentFilter !== 'all') params.set('paymentStatus', paymentFilter);
    if (dateRange?.from) params.set('dateFrom', dateRange.from.toISOString());
    if (dateRange?.to) params.set('dateTo', dateRange.to.toISOString());
    if (limit !== 10) params.set('limit', limit.toString());
    setSearchParams(params, { replace: true });
  }, [
    currentPage,
    searchTerm,
    statusFilter,
    paymentFilter,
    dateRange,
    limit,
    setSearchParams,
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePaymentFilterChange = (value: string) => {
    setPaymentFilter(value);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  // Filter orders to show only delivered, cancelled, refunded, or returned
  const filteredOrders =
    data?.orders.filter((order) => {
      return ['delivered', 'cancelled', 'refunded'].includes(order.status);
    }) || [];

  const orders = filteredOrders;

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/20">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/20">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-600 dark:text-red-400">
            Failed to load order history
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/20">
      <OrderHistoryHeader />
      <OrderHistorySearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        paymentFilter={paymentFilter}
        onPaymentFilterChange={handlePaymentFilterChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
      />
      <OrderHistoryTableContent orders={orders} onViewOrder={onViewOrder} />
      <OrderHistoryPagination
        currentPage={currentPage}
        totalPages={data?.pagination.totalPages || 1}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        totalItems={data?.pagination.total || 0}
        itemsPerPage={limit}
      />
    </div>
  );
};

export default OrderHistoryTable;
