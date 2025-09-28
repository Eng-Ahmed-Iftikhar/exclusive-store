import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from '@/apis/services/productApi';
import ProductForm from './ProductForm';

interface EditProductViewProps {
  productId: string;
  onSuccess: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const EditProductView: React.FC<EditProductViewProps> = ({
  productId,
  onSuccess,
  onCancel,
  isSubmitting,
  setIsSubmitting,
}) => {
  const { theme } = useSelector((state: RootState) => state.ui);
  const [productData, setProductData] = useState<{
    name: string;
    description: string;
    sku: string;
    isActive: boolean;
    isFeatured: boolean;
    sortOrder: number;
    categoryId: string;
    subcategoryId: string;
  } | null>(null);

  const { data: product, isLoading, error } = useGetProductByIdQuery(productId);

  const [updateProduct] = useUpdateProductMutation();

  useEffect(() => {
    if (product) {
      setProductData({
        name: product.name,
        description: product.description || '',
        sku: product.sku || '',
        isActive: product.isActive ?? true,
        isFeatured: product.isFeatured ?? false,
        sortOrder: product.sortOrder || 0,
        categoryId: product.categoryId || '',
        subcategoryId: product.subcategoryId || '',
      });
    }
  }, [product]);

  const handleSubmit = async (data: {
    name: string;
    description: string;
    sku: string;
    isActive: boolean;
    isFeatured: boolean;
    sortOrder: number;
    categoryId: string;
    subcategoryId: string;
  }) => {
    setIsSubmitting(true);

    try {
      await updateProduct({
        id: productId,
        data: {
          name: data.name,
          description: data.description,
          sku: data.sku,
          isActive: data.isActive,
          isFeatured: data.isFeatured,
          sortOrder: data.sortOrder,
          categoryId: data.categoryId || undefined,
          subcategoryId: data.subcategoryId || undefined,
        },
      }).unwrap();
      onSuccess();
    } catch (error) {
      console.error('Failed to update product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className={`w-full mx-auto rounded-xl border ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <div className="p-6 animate-pulse">
          <div className="space-y-6">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            <div className="h-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`w-full mx-auto rounded-xl border ${
          theme === 'dark'
            ? 'bg-red-900/20 border-red-700 text-red-300'
            : 'bg-red-50 border-red-200 text-red-600'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="text-red-500">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Failed to load product</h3>
              <p className="text-sm mt-1">
                Please try refreshing the page or contact support if the problem
                persists.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!productData) {
    return null;
  }

  return (
    <ProductForm
      mode="edit"
      initialData={productData}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      title={`Edit: ${productData.name}`}
      description="Update the product details"
    />
  );
};

export default EditProductView;
