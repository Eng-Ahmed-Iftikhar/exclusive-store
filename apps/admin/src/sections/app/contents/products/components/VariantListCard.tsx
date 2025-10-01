import React from 'react';
import { ProductVariant } from '@/apis/services/productApi';

interface VariantListCardProps {
  variant: ProductVariant;
}

const VariantListCard: React.FC<VariantListCardProps> = ({ variant }) => {
  const price = variant.prices?.[0];
  const stock = variant.stock;
  const primaryImage = variant.images?.find((img) => img.isPrimary);

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      {primaryImage && (
        <div className="relative h-40 bg-gray-100 dark:bg-gray-600">
          <img
            src={primaryImage.file?.secureUrl || primaryImage.file?.url}
            alt={primaryImage.altText || variant.name}
            className="w-full h-full object-cover"
          />
          {variant.isDefault && (
            <span className="absolute top-2 left-2 px-2 py-1 bg-indigo-500 text-white text-xs font-medium rounded shadow-sm">
              Default
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
          {variant.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          SKU: {variant.sku}
        </p>

        {/* Attributes */}
        {variant.attributes && Object.keys(variant.attributes).length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {Object.entries(variant.attributes as Record<string, any>).map(
              ([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                >
                  {key}: {value}
                </span>
              )
            )}
          </div>
        )}

        {/* Stats */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Price:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              ${Number(price?.price || 0).toFixed(2)}
            </span>
          </div>
          {price?.salePrice && Number(price.salePrice) > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Sale Price:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                ${Number(price.salePrice).toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Stock:</span>
            <span
              className={`font-semibold ${
                (stock?.quantity || 0) > (stock?.minThreshold || 5)
                  ? 'text-green-600 dark:text-green-400'
                  : (stock?.quantity || 0) > 0
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {stock?.quantity || 0} units
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Images:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {variant.images?.length || 0}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              variant.isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
            }`}
          >
            {variant.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VariantListCard;

