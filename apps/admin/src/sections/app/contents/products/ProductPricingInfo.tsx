import { Price, Product } from '@/apis/services/productApi';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import React from 'react';
import { FiDollarSign, FiPlus } from 'react-icons/fi';

interface ProductPricingInfoProps {
  item: Product;
  onCreatePrice: () => void;
}

const ProductPricingInfo: React.FC<ProductPricingInfoProps> = ({
  item,
  onCreatePrice,
}) => {
  // Add null/undefined check for item
  if (!item) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pricing Information
          </h3>
        </div>
        <div className="text-center py-8">
          <FiDollarSign className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Loading...
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            Loading product information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Pricing Information
        </h3>
        <PermissionGuard action="create" subject="products">
          <Button onClick={onCreatePrice} size="sm">
            <FiPlus className="w-4 h-4 mr-2" />
            Add Price
          </Button>
        </PermissionGuard>
      </div>

      <div className="space-y-3">
        {item?.prices && item.prices.length > 0 ? (
          <div className="space-y-2">
            {item.prices.map((price: Price) => (
              <div
                key={price.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FiDollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(price.price)} {price.currency}
                    </p>
                    {price.salePrice && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Sale: {formatCurrency(price.salePrice)} {price.currency}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      price.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}
                  >
                    {price.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FiDollarSign className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Pricing Information
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This product doesn't have any pricing information yet.
            </p>
            <PermissionGuard action="create" subject="products">
              <Button onClick={onCreatePrice} variant="outline">
                <FiPlus className="w-4 h-4 mr-2" />
                Add First Price
              </Button>
            </PermissionGuard>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPricingInfo;
