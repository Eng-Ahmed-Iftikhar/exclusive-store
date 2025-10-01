import React from 'react';
import { useProductForm } from '@/contexts/ProductFormContext';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

const StepReview: React.FC = () => {
  const { formData, updateFormData } = useProductForm();

  const totalImages =
    formData.productImages.length +
    formData.variants.reduce((sum, v) => sum + v.images.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Review & Publish
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Review your product details before publishing
        </p>
      </div>

      {/* Product Summary */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Product Information
          </h3>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Name</dt>
              <dd className="text-gray-900 dark:text-white font-medium">
                {formData.name}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">SKU</dt>
              <dd className="text-gray-900 dark:text-white font-medium">
                {formData.sku || 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Featured</dt>
              <dd className="text-gray-900 dark:text-white font-medium">
                {formData.isFeatured ? 'Yes' : 'No'}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Sort Order</dt>
              <dd className="text-gray-900 dark:text-white font-medium">
                {formData.sortOrder}
              </dd>
            </div>
          </dl>
        </div>

        {formData.description && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
            <dt className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Description
            </dt>
            <dd className="text-sm text-gray-900 dark:text-white">
              {formData.description}
            </dd>
          </div>
        )}

        {/* Variants Summary */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Variants ({formData.variants.length})
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {formData.variants.map((variant) => (
              <div
                key={variant.tempId}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border dark:border-gray-600"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {variant.name}
                    </span>
                    {variant.isDefault && (
                      <span className="px-2 py-0.5 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap gap-2">
                    {Object.entries(variant.attributes).map(([key, value]) => (
                      <span
                        key={key}
                        className="bg-gray-100 dark:bg-gray-600 px-2 py-0.5 rounded"
                      >
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    ${variant.price.toFixed(2)}
                    {variant.salePrice && (
                      <span className="ml-2 text-green-600 dark:text-green-400">
                        ${variant.salePrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Stock: {variant.quantity} • Images: {variant.images.length}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Images Summary */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Total Images: {totalImages}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formData.productImages.length} product images,{' '}
            {formData.variants.reduce((sum, v) => sum + v.images.length, 0)}{' '}
            variant images
          </p>
        </div>
      </div>

      {/* Publishing Options */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Publishing Options
        </h3>

        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => updateFormData({ isActive: e.target.checked })}
            className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <div>
            <label
              htmlFor="isActive"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Activate product immediately
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Make this product visible to customers right away
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-indigo-100 dark:border-indigo-800">
          <DocumentTextIcon className="h-5 w-5" />
          <span>
            You can save as draft to review later, or publish to make it live
          </span>
        </div>
      </div>
    </div>
  );
};

export default StepReview;
