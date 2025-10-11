import React from 'react';
import { useGetVariantsByProductQuery } from '@/apis/services/productApi';
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

interface ProductVariantsFormProps {
  productId?: string;
  onComplete: () => void;
  onBack: () => void;
}

const ProductVariantsForm: React.FC<ProductVariantsFormProps> = ({
  productId,
  onComplete,
  onBack,
}) => {
  const { data: variants } = useGetVariantsByProductQuery(productId || '');

  const handleContinue = () => {
    if (!variants || variants.length === 0) {
      alert('Please create at least one product variant before continuing');
      return;
    }
    onComplete();
  };

  return (
    <div className="space-y-6">
      {/* Variants List */}
      {variants && variants.length > 0 ? (
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {variants.length} variant(s) available
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {variants.map((variant) => (
              <div
                key={variant.id}
                className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-lg transition-shadow p-4"
              >
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {variant.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  SKU: {variant.sku}
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Price:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${Number(variant.prices?.[0]?.price || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Stock:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {variant.stock?.quantity || 0} units
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <Squares2X2Icon className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No variants created yet
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Please create variants for this product using the admin interface.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Basic Info
        </button>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!variants || variants.length === 0}
          className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Images
          <ArrowRightIcon className="h-5 w-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default ProductVariantsForm;
