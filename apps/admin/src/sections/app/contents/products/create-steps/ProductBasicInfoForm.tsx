import React, { useState, useEffect } from 'react';
import { useGetCategoriesQuery } from '@/apis/services/categoryApi';
import { useGetProductByIdQuery } from '@/apis/services/productApi';
import { ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ProductBasicInfoFormProps {
  onSubmit: (data: {
    name: string;
    description: string;
    sku: string;
    categoryId: string;
    subcategoryId: string;
    isFeatured: boolean;
    sortOrder: number;
  }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  productId: string | null;
}

const ProductBasicInfoForm: React.FC<ProductBasicInfoFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting,
  productId,
}) => {
  const { data: categories } = useGetCategoriesQuery({});
  const { data: existingProduct } = useGetProductByIdQuery(productId || '', {
    skip: !productId,
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    categoryId: '',
    subcategoryId: '',
    isFeatured: false,
    sortOrder: 0,
  });

  // Load existing product data if editing
  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name || '',
        description: existingProduct.description || '',
        sku: existingProduct.sku || '',
        categoryId: existingProduct.categoryId || '',
        subcategoryId: existingProduct.subcategoryId || '',
        isFeatured: existingProduct.isFeatured || false,
        sortOrder: existingProduct.sortOrder || 0,
      });
    }
  }, [existingProduct]);

  const selectedCategory = categories?.find((c) => c.id === formData.categoryId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Product name is required');
      return;
    }
    await onSubmit(formData);
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="e.g., Premium Cotton T-Shirt"
          required
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Describe your product in detail..."
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow resize-none"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Provide a detailed description to help customers understand your product
        </p>
      </div>

      {/* SKU */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Base SKU (Stock Keeping Unit)
        </label>
        <input
          type="text"
          value={formData.sku}
          onChange={(e) => updateField('sku', e.target.value)}
          placeholder="e.g., TSHIRT-001"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          This is the base SKU. Each variant will have its own unique SKU
        </p>
      </div>

      {/* Category & Subcategory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => {
              updateField('categoryId', e.target.value);
              updateField('subcategoryId', '');
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
          >
            <option value="">Select Category</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subcategory
          </label>
          <select
            value={formData.subcategoryId}
            onChange={(e) => updateField('subcategoryId', e.target.value)}
            disabled={!formData.categoryId}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-shadow"
          >
            <option value="">Select Subcategory</option>
            {selectedCategory?.subcategories?.map((sub: any) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Additional Options */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Additional Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => updateField('isFeatured', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label
                htmlFor="isFeatured"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Featured Product
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Show this product in featured sections
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Display Sort Order
            </label>
            <input
              type="number"
              value={formData.sortOrder}
              onChange={(e) => updateField('sortOrder', parseInt(e.target.value) || 0)}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <XMarkIcon className="h-5 w-5 mr-2" />
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting || !formData.name.trim()}
          className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving...' : 'Save & Continue'}
          <ArrowRightIcon className="h-5 w-5 ml-2" />
        </button>
      </div>
    </form>
  );
};

export default ProductBasicInfoForm;

