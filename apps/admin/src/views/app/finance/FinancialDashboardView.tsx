import React from 'react';
import { PermissionGuard } from '@/components/PermissionGuard';
import FinancialOverview from '@/sections/app/finance/FinancialOverview';
import SalesAnalytics from '@/sections/app/finance/SalesAnalytics';
import ProfitLossAnalysis from '@/sections/app/finance/ProfitLossAnalysis';
import RevenueCharts from '@/sections/app/finance/RevenueCharts';
import TopProducts from '@/sections/app/finance/TopProducts';
import PaymentMethodsBreakdown from '@/sections/app/finance/PaymentMethodsBreakdown';

const FinancialDashboardView: React.FC = () => {
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

        {/* Financial Overview Cards */}
        <FinancialOverview />

        {/* Revenue Charts */}
        <RevenueCharts />

        {/* Sales Analytics and Profit/Loss */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesAnalytics />
          <ProfitLossAnalysis />
        </div>

        {/* Top Products and Payment Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopProducts />
          <PaymentMethodsBreakdown />
        </div>
      </div>
    </PermissionGuard>
  );
};

export default FinancialDashboardView;
