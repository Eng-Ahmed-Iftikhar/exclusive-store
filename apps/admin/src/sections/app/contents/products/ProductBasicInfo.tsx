import React from 'react';
import { Product } from '@/apis/services/productApi';

interface ProductBasicInfoProps {
  product: Product;
}

const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({ product }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Basic Information
      </h3>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <p className="text-gray-900 dark:text-white font-medium">
            {product.name}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            SKU
          </label>
          <p className="text-gray-900 dark:text-white font-mono text-sm">
            {product.sku || 'N/A'}
          </p>
        </div>

        {product.description && (
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <p className="text-gray-900 dark:text-white">
              {product.description}
            </p>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                product.isActive
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}
            >
              {product.isActive ? 'Active' : 'Inactive'}
            </span>
            {product.isFeatured && (
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                Featured
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort Order
          </label>
          <p className="text-gray-900 dark:text-white">{product.sortOrder}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductBasicInfo;
