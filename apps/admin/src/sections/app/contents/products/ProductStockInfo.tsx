import React from 'react';
import { Product } from '@/apis/services/productApi';
import { Button } from '@/components/ui/button';
import { PermissionGuard } from '@/components/PermissionGuard';
import { FiPlus, FiPackage, FiAlertTriangle } from 'react-icons/fi';

interface ProductStockInfoProps {
  product: Product;
  onCreateStock: () => void;
}

const ProductStockInfo: React.FC<ProductStockInfoProps> = ({
  product,
  onCreateStock,
}) => {
  return (
    <div className="space-y-4">
      {product.stock ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FiPackage className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Stock
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {product.stock.quantity}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FiAlertTriangle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Reserved
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {product.stock.reserved}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FiAlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Min Threshold
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {product.stock.minThreshold}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FiPackage className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Status
                </p>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    product.stock.isInStock
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}
                >
                  {product.stock.isInStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <FiPackage className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Stock Information
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This product doesn't have any stock information yet.
          </p>
          <PermissionGuard action="create" subject="products">
            <Button onClick={onCreateStock} variant="outline">
              <FiPlus className="w-4 h-4 mr-2" />
              Add Stock Information
            </Button>
          </PermissionGuard>
        </div>
      )}
    </div>
  );
};

export default ProductStockInfo;
