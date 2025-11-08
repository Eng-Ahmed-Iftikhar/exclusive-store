import React, { useEffect, useMemo } from 'react';
import { FiFilter, FiRefreshCw } from 'react-icons/fi';
import { DateRangePicker, DateRange } from '@/components/ui/date-range-picker';
import { useGetCustomersQuery } from '@/apis/services/userApi';
import { useGetCategoriesQuery } from '@/apis/services/categoryApi';
import { useGetProductsQuery } from '@/apis/services/productApi';
import { AdminOrderStatus, AdminPaymentStatus } from '@/apis/services/orderApi';
import { Autocomplete } from '@/components/ui/autocomplete';

// Local lightweight types for dynamic selects
interface ProductOption {
  id: string;
  name: string;
}

interface FinancialFiltersProps {
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
  userId?: string;
  onUserIdChange?: (userId: string) => void;
  categoryId?: string;
  onCategoryIdChange?: (categoryId: string) => void;
  productId?: string;
  onProductIdChange?: (productId: string) => void;
  paymentStatus?: string;
  onPaymentStatusChange?: (status: string) => void;
  orderStatus?: string;
  onOrderStatusChange?: (status: string) => void;
  onReset?: () => void;
  onExport?: () => void;
}

const FinancialFilters: React.FC<FinancialFiltersProps> = ({
  dateRange,
  onDateRangeChange,
  userId,
  onUserIdChange,
  categoryId,
  onCategoryIdChange,
  productId,
  onProductIdChange,
  paymentStatus,
  onPaymentStatusChange,
  orderStatus,
  onOrderStatusChange,
  onReset,
  onExport,
}) => {
  // Fetch users (customers) from new /auth/users endpoint
  const {
    data: customersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useGetCustomersQuery({ page: 1, limit: 100 });

  // Fetch categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategoriesQuery({ includeInactive: false });

  // Fetch products (optionally by category)
  const {
    data: productsResponse,
    isLoading: productsLoading,
    isError: productsError,
  } = useGetProductsQuery(
    useMemo(
      () => ({
        page: 1,
        limit: 100,
        ...(categoryId && categoryId !== 'all' ? { categoryId } : {}),
      }),
      [categoryId]
    )
  );

  // Reset product when category changes to avoid stale selection
  useEffect(() => {
    if (onProductIdChange) {
      onProductIdChange('all');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const usersOptions = useMemo(() => {
    const list: Array<{ id: string; label: string }> = [];
    const users =
      (
        customersData as {
          data?: Array<{ id: string; name: string; email: string }>;
        }
      )?.data || [];
    for (const u of users) {
      if (u.id) {
        list.push({
          id: u.id,
          label: u.name || u.email || u.id,
        });
      }
    }
    return list;
  }, [customersData]);

  const categoryOptions = useMemo(
    () =>
      (categories || [])
        .filter((c) => c.isActive !== false)
        .map((c) => ({ id: c.id, label: c.name })),
    [categories]
  );

  const productOptions = useMemo(() => {
    const products: ProductOption[] =
      (productsResponse as unknown as { products?: ProductOption[] })
        ?.products ||
      (productsResponse as unknown as { data?: ProductOption[] })?.data ||
      [];
    return products.map((p) => ({ id: p.id, label: p.name }));
  }, [productsResponse]);

  const paymentStatusOptions = useMemo(
    () => [
      { id: 'all', label: 'All Status' },
      { id: AdminPaymentStatus.PAID, label: 'Paid' },
      { id: AdminPaymentStatus.PENDING, label: 'Pending' },
      { id: AdminPaymentStatus.FAILED, label: 'Failed' },
      { id: AdminPaymentStatus.REFUNDED, label: 'Refunded' },
    ],
    []
  );

  const orderStatusOptions = useMemo(
    () => [
      { id: 'all', label: 'All Orders' },
      { id: AdminOrderStatus.PENDING, label: 'Pending' },
      { id: AdminOrderStatus.CONFIRMED, label: 'Confirmed' },
      { id: AdminOrderStatus.PROCESSING, label: 'Processing' },
      { id: AdminOrderStatus.SHIPPED, label: 'Shipped' },
      { id: AdminOrderStatus.DELIVERED, label: 'Delivered' },
      { id: AdminOrderStatus.CANCELLED, label: 'Cancelled' },
      { id: AdminOrderStatus.REFUNDED, label: 'Refunded' },
    ],
    []
  );

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <FiFilter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filters
        </h3>
      </div>

      {/* First Row - Primary Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date Range
          </label>
          <DateRangePicker
            value={dateRange}
            onChange={onDateRangeChange}
            placeholder="Select date range"
            className="w-full"
          />
        </div>

        {/* User Filter (dynamic autocomplete) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            User
          </label>
          <Autocomplete
            options={[
              { value: 'all', label: 'All Users' },
              ...usersOptions.map((u) => ({ value: u.id, label: u.label })),
            ]}
            value={userId || 'all'}
            onValueChange={(val) => onUserIdChange?.(val || 'all')}
            placeholder={
              usersLoading
                ? 'Loading users...'
                : usersError
                ? 'Failed to load users'
                : 'Select user'
            }
            searchPlaceholder="Search users..."
            emptyMessage={usersLoading ? 'Loading...' : 'No users found'}
            disabled={usersLoading || usersError}
          />
        </div>

        {/* Category Filter (dynamic autocomplete) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <Autocomplete
            options={[
              { value: 'all', label: 'All Categories' },
              ...categoryOptions.map((c) => ({ value: c.id, label: c.label })),
            ]}
            value={categoryId || 'all'}
            onValueChange={(val) => {
              const chosen = val || 'all';
              onCategoryIdChange?.(chosen);
              onProductIdChange?.('all');
            }}
            placeholder={
              categoriesLoading
                ? 'Loading categories...'
                : categoriesError
                ? 'Failed to load categories'
                : 'Select category'
            }
            searchPlaceholder="Search categories..."
            emptyMessage={
              categoriesLoading ? 'Loading...' : 'No categories found'
            }
            disabled={categoriesLoading || categoriesError}
          />
        </div>
      </div>

      {/* Second Row - Additional Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {/* Product Filter (dynamic autocomplete, dependent on category) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Product
          </label>
          <Autocomplete
            options={[
              { value: 'all', label: 'All Products' },
              ...productOptions.map((p) => ({ value: p.id, label: p.label })),
            ]}
            value={productId || 'all'}
            onValueChange={(val) => onProductIdChange?.(val || 'all')}
            placeholder={
              productsLoading
                ? 'Loading products...'
                : productsError
                ? 'Failed to load products'
                : 'Select product'
            }
            searchPlaceholder="Search products..."
            emptyMessage={productsLoading ? 'Loading...' : 'No products found'}
            disabled={productsLoading || productsError}
          />
        </div>

        {/* Payment Status Filter (autocomplete) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Payment Status
          </label>
          <Autocomplete
            options={paymentStatusOptions.map((opt) => ({
              value: opt.id,
              label: opt.label,
            }))}
            value={paymentStatus || 'all'}
            onValueChange={(val) => onPaymentStatusChange?.(val || 'all')}
            placeholder="Select payment status"
            searchPlaceholder="Search payment statuses..."
            emptyMessage="No status found"
          />
        </div>

        {/* Order Status Filter (autocomplete) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Order Status
          </label>
          <Autocomplete
            options={orderStatusOptions.map((opt) => ({
              value: opt.id,
              label: opt.label,
            }))}
            value={orderStatus || 'all'}
            onValueChange={(val) => onOrderStatusChange?.(val || 'all')}
            placeholder="Select order status"
            searchPlaceholder="Search order statuses..."
            emptyMessage="No status found"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <FiRefreshCw className="w-4 h-4" />
          Reset Filters
        </button>
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Export Report
          </button>
        )}
      </div>
    </div>
  );
};

export default FinancialFilters;
