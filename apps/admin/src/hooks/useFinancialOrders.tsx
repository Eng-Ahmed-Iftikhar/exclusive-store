import { useState, useEffect, useMemo } from 'react';
import {
  useLazyGetOrdersQuery,
  AdminOrderStatus,
  AdminPaymentStatus,
  AdminOrder,
} from '@/apis/services/orderApi';
import { DateRange } from '@/components/ui/date-range-picker';

interface FinancialFilters {
  dateRange?: DateRange;
  userId: string;
  categoryId: string;
  productId: string;
  paymentStatus: string;
  orderStatus: string;
}

export const useFinancialOrders = (filters: FinancialFilters) => {
  const [allOrders, setAllOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [getOrders] = useLazyGetOrdersQuery();

  // Build base query params from filters
  const baseQueryParams = useMemo(() => {
    const params: {
      limit: number;
      dateFrom?: string;
      dateTo?: string;
      status?: AdminOrderStatus;
      paymentStatus?: AdminPaymentStatus;
    } = {
      limit: 100, // Maximum allowed by backend
    };

    // Date range filter
    if (filters.dateRange?.from) {
      params.dateFrom = filters.dateRange.from.toISOString();
    }
    if (filters.dateRange?.to) {
      params.dateTo = filters.dateRange.to.toISOString();
    }

    // Status filters
    if (filters.orderStatus && filters.orderStatus !== 'all') {
      params.status = filters.orderStatus as AdminOrderStatus;
    }
    if (filters.paymentStatus && filters.paymentStatus !== 'all') {
      params.paymentStatus = filters.paymentStatus as AdminPaymentStatus;
    }

    return params;
  }, [filters]);

  // Fetch all orders by paginating through all pages
  useEffect(() => {
    const fetchAllOrders = async () => {
      setIsLoading(true);
      setError(null);
      const orders: AdminOrder[] = [];
      let currentPage = 1;
      let hasMore = true;

      try {
        while (hasMore) {
          const result = await getOrders({
            ...baseQueryParams,
            page: currentPage,
          }).unwrap();

          if (result.orders && result.orders.length > 0) {
            orders.push(...result.orders);

            // Check if there are more pages
            if (result.pagination) {
              if (
                currentPage >= result.pagination.totalPages ||
                result.orders.length < baseQueryParams.limit
              ) {
                hasMore = false;
              } else {
                currentPage++;
              }
            } else {
              if (result.orders.length < baseQueryParams.limit) {
                hasMore = false;
              } else {
                currentPage++;
              }
            }
          } else {
            hasMore = false;
          }

          // Safety limit
          if (currentPage > 1000) {
            console.warn(
              'Reached safety limit while fetching orders for financial dashboard.'
            );
            hasMore = false;
          }
        }

        setAllOrders(orders);
      } catch (err) {
        setError(err);
        console.error('Error fetching financial orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllOrders();
  }, [baseQueryParams, getOrders]);

  // Apply frontend filters that aren't supported by backend
  const filteredOrders = useMemo(() => {
    let orders = [...allOrders];

    // User filter
    if (filters.userId && filters.userId !== 'all') {
      orders = orders.filter((order) => {
        if (filters.userId === 'registered') {
          return !!order.userId;
        }
        if (filters.userId === 'guest') {
          return !order.userId;
        }
        return order.userId === filters.userId;
      });
    }

    // Category filter
    if (filters.categoryId && filters.categoryId !== 'all') {
      orders = orders.filter((order) =>
        order.items.some(
          (item) => item.variant.product.category?.id === filters.categoryId
        )
      );
    }

    // Product filter
    if (filters.productId && filters.productId !== 'all') {
      orders = orders.filter((order) =>
        order.items.some(
          (item) => item.variant.product.id === filters.productId
        )
      );
    }

    return orders;
  }, [allOrders, filters]);

  return {
    orders: filteredOrders,
    isLoading,
    error,
  };
};

