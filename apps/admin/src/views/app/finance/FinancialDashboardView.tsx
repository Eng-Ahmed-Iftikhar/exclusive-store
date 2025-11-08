import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PermissionGuard } from '@/components/PermissionGuard';
import { DateRange } from '@/components/ui/date-range-picker';
import FinancialFilters from '@/sections/app/finance/financial-filters/FinancialFilters';
import FinancialOverview from '@/sections/app/finance/financial-overview/FinancialOverview';
import RevenueExpensesCashFlow from '@/sections/app/finance/revenue-expenses/RevenueExpensesCashFlow';
import OrdersPaymentPerformance from '@/sections/app/finance/orders-payment/OrdersPaymentPerformance';
import CustomersRefunds from '@/sections/app/finance/customers-refunds/CustomersRefunds';
import InventoryProducts from '@/sections/app/finance/inventory-products/InventoryProducts';
import AnalyticsTaxActivity from '@/sections/app/finance/analytics-tax/AnalyticsTaxActivity';

interface FinancialFiltersData {
  dateRange?: DateRange;
  userId: string;
  categoryId: string;
  productId: string;
  paymentStatus: string;
  orderStatus: string;
}

const FinancialDashboardView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL params
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
  const [userId, setUserId] = useState<string>(() => {
    return searchParams.get('userId') || 'all';
  });
  const [categoryId, setCategoryId] = useState<string>(() => {
    return searchParams.get('categoryId') || 'all';
  });
  const [productId, setProductId] = useState<string>(() => {
    return searchParams.get('productId') || 'all';
  });
  const [paymentStatus, setPaymentStatus] = useState<string>(() => {
    return searchParams.get('paymentStatus') || 'all';
  });
  const [orderStatus, setOrderStatus] = useState<string>(() => {
    return searchParams.get('orderStatus') || 'all';
  });

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (dateRange?.from) {
      params.set('dateFrom', dateRange.from.toISOString());
    }
    if (dateRange?.to) {
      params.set('dateTo', dateRange.to.toISOString());
    }
    if (userId && userId !== 'all') {
      params.set('userId', userId);
    }
    if (categoryId && categoryId !== 'all') {
      params.set('categoryId', categoryId);
    }
    if (productId && productId !== 'all') {
      params.set('productId', productId);
    }
    if (paymentStatus && paymentStatus !== 'all') {
      params.set('paymentStatus', paymentStatus);
    }
    if (orderStatus && orderStatus !== 'all') {
      params.set('orderStatus', orderStatus);
    }

    setSearchParams(params, { replace: true });
  }, [
    dateRange,
    userId,
    categoryId,
    productId,
    paymentStatus,
    orderStatus,
    setSearchParams,
  ]);

  // Build filters object for components
  const filters = useMemo<FinancialFiltersData>(
    () => ({
      dateRange,
      userId,
      categoryId,
      productId,
      paymentStatus,
      orderStatus,
    }),
    [dateRange, userId, categoryId, productId, paymentStatus, orderStatus]
  );

  const handleResetFilters = () => {
    setDateRange(undefined);
    setUserId('all');
    setCategoryId('all');
    setProductId('all');
    setPaymentStatus('all');
    setOrderStatus('all');
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting financial report with filters:', filters);
  };

  return (
    <PermissionGuard action="view" subject="finance">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Financial Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive financial analytics and business insights
            </p>
          </div>
        </div>

        {/* Financial Filters */}
        <FinancialFilters
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          userId={userId}
          onUserIdChange={setUserId}
          categoryId={categoryId}
          onCategoryIdChange={setCategoryId}
          productId={productId}
          onProductIdChange={setProductId}
          paymentStatus={paymentStatus}
          onPaymentStatusChange={setPaymentStatus}
          orderStatus={orderStatus}
          onOrderStatusChange={setOrderStatus}
          onReset={handleResetFilters}
          onExport={handleExport}
        />

        {/* Financial Overview Cards */}
        <FinancialOverview filters={filters} />

        {/* Revenue, Expenses & Cash Flow */}
        <RevenueExpensesCashFlow filters={filters} />

        {/* Orders & Payment Performance */}
        <OrdersPaymentPerformance filters={filters} />

        {/* Customers & Refunds */}
        <CustomersRefunds filters={filters} />

        {/* Inventory & Products */}
        <InventoryProducts filters={filters} />

        {/* Analytics, Tax & Activity */}
        <AnalyticsTaxActivity filters={filters} />
      </div>
    </PermissionGuard>
  );
};

export default FinancialDashboardView;
