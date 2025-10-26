import React from 'react';
import {
  FiPackage,
  FiTrendingUp,
  FiDollarSign,
  FiShoppingCart,
  FiStar,
} from 'react-icons/fi';

const TopProducts: React.FC = () => {
  // Mock data for top products
  const topProducts = [
    {
      id: '1',
      name: 'Wireless Bluetooth Headphones',
      category: 'Electronics',
      sales: 1250,
      revenue: 18750.0,
      profit: 5625.0,
      rating: 4.8,
      image: '/api/placeholder/60/60',
    },
    {
      id: '2',
      name: 'Smart Fitness Watch',
      category: 'Electronics',
      sales: 980,
      revenue: 19600.0,
      profit: 5880.0,
      rating: 4.6,
      image: '/api/placeholder/60/60',
    },
    {
      id: '3',
      name: 'Organic Cotton T-Shirt',
      category: 'Clothing',
      sales: 2100,
      revenue: 10500.0,
      profit: 4200.0,
      rating: 4.7,
      image: '/api/placeholder/60/60',
    },
    {
      id: '4',
      name: 'Stainless Steel Water Bottle',
      category: 'Home & Garden',
      sales: 1850,
      revenue: 9250.0,
      profit: 3700.0,
      rating: 4.9,
      image: '/api/placeholder/60/60',
    },
    {
      id: '5',
      name: 'Yoga Mat Premium',
      category: 'Sports',
      sales: 1200,
      revenue: 7200.0,
      profit: 2880.0,
      image: '/api/placeholder/60/60',
      rating: 4.5,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-slate-900/20">
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Performing Products
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Best selling products by revenue and profit
          </p>
        </div>

        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              {/* Rank */}
              <div className="flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : index === 1
                      ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      : index === 2
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}
                >
                  {index + 1}
                </div>
              </div>

              {/* Product Image */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                  <FiPackage className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {product.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {product.category}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <FiStar className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {product.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sales Stats */}
              <div className="flex-shrink-0 text-right">
                <div className="flex items-center gap-1 mb-1">
                  <FiShoppingCart className="w-3 h-3 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatNumber(product.sales)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <FiDollarSign className="w-3 h-3 text-green-500" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(product.revenue)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Profit: {formatCurrency(product.profit)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-600">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <FiTrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatNumber(
                    topProducts.reduce((sum, p) => sum + p.sales, 0)
                  )}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total Sales
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <FiDollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(
                    topProducts.reduce((sum, p) => sum + p.revenue, 0)
                  )}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total Revenue
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <FiPackage className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(
                    topProducts.reduce((sum, p) => sum + p.profit, 0)
                  )}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total Profit
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
