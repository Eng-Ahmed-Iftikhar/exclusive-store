import { useGetCategoriesQuery } from '@/apis/services/categoryApi';
import { useGetSubcategoriesQuery } from '@/apis/services/subcategoryApi';
import { formatSlug } from '@/lib/utils';
import { RootState } from '@/store';
import React, { useEffect, useState } from 'react';
import { FiSave, FiShoppingCart, FiX } from 'react-icons/fi';
import { useSelector } from 'react-redux';

interface ProductFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    name?: string;
    description?: string;
    sku?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    sortOrder?: number;
    categoryId?: string;
    subcategoryId?: string;
  };
  onSubmit: (data: {
    name: string;
    description: string;
    sku: string;
    isActive: boolean;
    isFeatured: boolean;
    sortOrder: number;
    categoryId: string;
    subcategoryId: string;
  }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  title: string;
  description: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  title,
  description,
}) => {
  const { theme } = useSelector((state: RootState) => state.ui);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    isActive: true,
    isFeatured: false,
    sortOrder: 0,
    categoryId: '',
    subcategoryId: '',
  });

  const { data: categories } = useGetCategoriesQuery({ includeInactive: true });
  const { data: { subcategories } = {} } = useGetSubcategoriesQuery(
    { categoryId: formData.categoryId, includeInactive: true },
    { skip: !formData.categoryId }
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        sku: initialData.sku || '',
        isActive: initialData.isActive ?? true,
        isFeatured: initialData.isFeatured ?? false,
        sortOrder: initialData.sortOrder || 0,
        categoryId: initialData.categoryId || '',
        subcategoryId: initialData.subcategoryId || '',
      });
    }
  }, [initialData]);

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Reset subcategory when category changes
      ...(field === 'categoryId' && { subcategoryId: '' }),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      sku: prev.sku || formatSlug(value).toUpperCase(),
    }));
  };

  return (
    <div
      className={`w-full mx-auto rounded-xl border ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-gray-200'
      } shadow-xl`}
    >
      {/* Header */}
      <div
        className={`px-8 py-6 border-b ${
          theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-blue-900/30 text-blue-400'
                : 'bg-blue-100 text-blue-600'
            }`}
          >
            <FiShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter product description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) =>
                    handleInputChange('sku', e.target.value.toUpperCase())
                  }
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter SKU"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    handleInputChange(
                      'sortOrder',
                      parseInt(e.target.value) || 0
                    )
                  }
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter sort order"
                />
              </div>
            </div>
          </div>

          {/* Category and Subcategory */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    handleInputChange('categoryId', e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Select a category</option>
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
                  onChange={(e) =>
                    handleInputChange('subcategoryId', e.target.value)
                  }
                  disabled={!formData.categoryId}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } ${
                    !formData.categoryId ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">Select a subcategory</option>
                  {subcategories?.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Status Options */}
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    handleInputChange('isActive', e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    handleInputChange('isFeatured', e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Featured
                </span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onCancel}
              className={`group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-slate-700 text-gray-300 hover:bg-slate-600 hover:text-white border border-slate-600 hover:border-slate-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-200 hover:border-gray-300'
              }`}
            >
              <FiX className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                isSubmitting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              <FiSave
                className={`w-4 h-4 ${
                  isSubmitting
                    ? 'animate-spin'
                    : 'group-hover:scale-110 transition-transform duration-200'
                }`}
              />
              {isSubmitting
                ? mode === 'create'
                  ? 'Creating...'
                  : 'Updating...'
                : mode === 'create'
                ? 'Create'
                : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
