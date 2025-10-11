import { useUpdateProductMutation } from '@/apis/services/productApi';
import { useProductContext } from '@/contexts/ProductContext';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface ProductReviewFormProps {
  onPublish: () => void;
  onBack: () => void;
}

const ProductReviewForm: React.FC<ProductReviewFormProps> = ({
  onPublish,
  onBack,
}) => {
  const { state } = useProductContext();
  const product = state.productData;

  const [updateProduct] = useUpdateProductMutation();
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await updateProduct({
        id: product?.id || '',
        data: { isActive: true },
      }).unwrap();
      onPublish();
    } catch (error) {
      console.error('Failed to publish product:', error);
      alert('Failed to publish product. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsPublishing(true);
    try {
      await updateProduct({
        id: product?.id || '',
        data: { isActive: false },
      }).unwrap();
      onPublish();
    } catch (error) {
      console.error('Failed to save draft:', error);
      alert('Failed to save draft. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  if (!product) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  const totalVariants = product.variants?.length || 0;
  const totalImages =
    (product.images?.length || 0) +
    (product.variants?.reduce((sum, v) => sum + (v.images?.length || 0), 0) ||
      0);

  return (
    <div className="space-y-6">
      {/* Product Summary */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-indigo-100 dark:border-indigo-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <DocumentTextIcon className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
          Product Overview
        </h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-600 dark:text-gray-400 font-medium">
              Name
            </dt>
            <dd className="text-gray-900 dark:text-white text-lg font-semibold mt-1">
              {product.name}
            </dd>
          </div>
          <div>
            <dt className="text-gray-600 dark:text-gray-400 font-medium">
              SKU
            </dt>
            <dd className="text-gray-900 dark:text-white mt-1">
              {product.sku || 'N/A'}
            </dd>
          </div>
          {product.description && (
            <div className="md:col-span-2">
              <dt className="text-gray-600 dark:text-gray-400 font-medium">
                Description
              </dt>
              <dd className="text-gray-900 dark:text-white mt-1 leading-relaxed">
                {product.description}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-gray-600 dark:text-gray-400 font-medium">
              Category
            </dt>
            <dd className="text-gray-900 dark:text-white mt-1">
              {product.category?.name || 'N/A'}
            </dd>
          </div>
          <div>
            <dt className="text-gray-600 dark:text-gray-400 font-medium">
              Subcategory
            </dt>
            <dd className="text-gray-900 dark:text-white mt-1">
              {product.subcategory?.name || 'N/A'}
            </dd>
          </div>
        </dl>
      </div>

      {/* Variants Summary */}
      <div className="bg-white dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Variants ({totalVariants})
        </h3>
        {totalVariants > 0 ? (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {product.variants?.map((variant, idx) => (
              <div
                key={variant.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
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
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    SKU: {variant.sku}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    ${variant.prices?.[0]?.price || '0.00'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Stock: {variant.stock?.quantity || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No variants created
          </p>
        )}
      </div>

      {/* Images Summary */}
      <div className="bg-white dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Images ({totalImages})
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {product.images?.length || 0} product images,{' '}
          {product.variants?.reduce(
            (sum, v) => sum + (v.images?.length || 0),
            0
          ) || 0}{' '}
          variant images
        </p>
      </div>

      {/* Publishing Info */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
        <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
          Ready to Publish?
        </h3>
        <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
          Publishing will make this product visible to customers. You can also
          save it as a draft to review and publish later.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onBack}
          disabled={isPublishing}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Images
        </button>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isPublishing}
            className="inline-flex items-center px-6 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            {isPublishing ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            {isPublishing ? 'Publishing...' : 'Publish Product'}
            <CheckCircleIcon className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductReviewForm;
