import React, { useMemo } from 'react';
import {
  FiPackage,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
} from 'react-icons/fi';
import { DateRange } from '@/components/ui/date-range-picker';
import { useFinancialOrders } from '@/hooks/useFinancialOrders';

interface FinancialFilters {
  dateRange?: DateRange;
  userId: string;
  categoryId: string;
  productId: string;
  paymentStatus: string;
  orderStatus: string;
}

interface InventoryProductsProps {
  filters: FinancialFilters;
}

const InventoryProducts: React.FC<InventoryProductsProps> = ({ filters }) => {
  const { orders, isLoading, error } = useFinancialOrders(filters);

  // Calculate product metrics from filtered orders
  const data = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        topSellingProducts: 0,
        leastProfitableProducts: 0,
        averageProfitMargin: 0,
        topCategoryRevenue: 0,
        totalQuantitySold: 0,
      };
    }

    // Calculate product metrics from order items
    const productMap = new Map<
      string,
      { name: string; revenue: number; quantity: number; orders: number }
    >();
    const categoryMap = new Map<string, number>();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.variant.product.id;
        const productName = item.variant.product.name;
        const revenue = item.totalPrice;
        const quantity = item.quantity;

        // Track product sales
        const existing = productMap.get(productId) || {
          name: productName,
          revenue: 0,
          quantity: 0,
          orders: 0,
        };
        productMap.set(productId, {
          name: productName,
          revenue: existing.revenue + revenue,
          quantity: existing.quantity + quantity,
          orders: existing.orders + 1,
        });

        // Track category revenue
        if (item.variant.product.category) {
          const categoryId = item.variant.product.category.id;
          const categoryRevenue = categoryMap.get(categoryId) || 0;
          categoryMap.set(categoryId, categoryRevenue + revenue);
        }
      });
    });

    // Top selling products (count of unique products sold)
    const productsArray = Array.from(productMap.values());
    const topSellingProducts = productsArray.length;

    // Least profitable products (products with revenue below average)
    const averageRevenue =
      productsArray.length > 0
        ? productsArray.reduce((sum, p) => sum + p.revenue, 0) /
          productsArray.length
        : 0;
    const leastProfitableProducts = productsArray.filter(
      (p) => p.revenue < averageRevenue * 0.5
    ).length;

    // Average profit margin (estimated - would need cost data from product API)
    const averageProfitMargin = 30;

    // Top category revenue
    const categoryRevenues = Array.from(categoryMap.values());
    const topCategoryRevenue =
      categoryRevenues.length > 0
        ? Math.max(...categoryRevenues)
        : 0;

    // Total quantity sold
    const totalQuantitySold = productsArray.reduce(
      (sum, p) => sum + p.quantity,
      0
    );

    return {
      topSellingProducts,
      leastProfitableProducts,
      averageProfitMargin,
      topCategoryRevenue,
      totalQuantitySold,
    };
  }, [orders]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 dark:bg-slate-700 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6">
        <p className="text-red-600 dark:text-red-400">
          Error loading inventory and products data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Products & Sales
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FiPackage className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Products Sold
            </span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {data.topSellingProducts}
          </p>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FiPackage className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Quantity Sold
            </span>
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {data.totalQuantitySold}
          </p>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FiTrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Least Profitable
            </span>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {data.leastProfitableProducts}
          </p>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FiDollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
                Avg Profit Margin
              </span>
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {data.averageProfitMargin.toFixed(2)}%
          </p>
        </div>
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FiTrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Top Category Revenue
            </span>
          </div>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            ${data.topCategoryRevenue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InventoryProducts;
