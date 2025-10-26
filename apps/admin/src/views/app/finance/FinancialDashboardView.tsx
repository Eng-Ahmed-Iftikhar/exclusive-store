import React, { useState } from 'react';
import { PermissionGuard } from '@/components/PermissionGuard';
import { DateRange } from '@/components/ui/date-range-picker';
import FinancialFilters from '@/sections/app/finance/financial-filters/FinancialFilters';
import FinancialOverview from '@/sections/app/finance/financial-overview/FinancialOverview';
import RevenueExpensesCashFlow from '@/sections/app/finance/revenue-expenses/RevenueExpensesCashFlow';
import OrdersPaymentPerformance from '@/sections/app/finance/orders-payment/OrdersPaymentPerformance';
import CustomersRefunds from '@/sections/app/finance/customers-refunds/CustomersRefunds';
import InventoryProducts from '@/sections/app/finance/inventory-products/InventoryProducts';
import AnalyticsTaxActivity from '@/sections/app/finance/analytics-tax/AnalyticsTaxActivity';

const FinancialDashboardView: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [userId, setUserId] = useState<string>('all');
  const [categoryId, setCategoryId] = useState<string>('all');
  const [productId, setProductId] = useState<string>('all');
  const [paymentStatus, setPaymentStatus] = useState<string>('all');
  const [orderStatus, setOrderStatus] = useState<string>('all');

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
    console.log('Exporting financial report with filters:', {
      dateRange,
      userId,
      categoryId,
      productId,
      paymentStatus,
      orderStatus,
    });
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
        <FinancialOverview />

        {/* Revenue, Expenses & Cash Flow */}
        <RevenueExpensesCashFlow />

        {/* Orders & Payment Performance */}
        <OrdersPaymentPerformance />

        {/* Customers & Refunds */}
        <CustomersRefunds />

        {/* Inventory & Products */}
        <InventoryProducts />

        {/* Analytics, Tax & Activity */}
        <AnalyticsTaxActivity />
      </div>
    </PermissionGuard>
  );
};

export default FinancialDashboardView;
