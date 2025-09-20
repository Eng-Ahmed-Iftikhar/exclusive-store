import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from '@/apis/services/categoryApi';
import CategoryForm from './CategoryForm';

interface EditCategoryFormProps {
  categoryId: string;
  onSuccess: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const EditCategoryForm: React.FC<EditCategoryFormProps> = ({
  categoryId,
  onSuccess,
  onCancel,
  isSubmitting,
  setIsSubmitting,
}) => {
  const { theme } = useSelector((state: RootState) => state.ui);
  const [categoryData, setCategoryData] = useState<any>(null);

  const {
    data: category,
    isLoading,
    error,
  } = useGetCategoryByIdQuery(categoryId);

  const [updateCategory] = useUpdateCategoryMutation();

  useEffect(() => {
    if (category) {
      setCategoryData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image: category.image || '',
        icon: category.icon || '',
        isActive: category.isActive ?? true,
        sortOrder: category.sortOrder || 0,
      });
    }
  }, [category]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      await updateCategory({
        id: categoryId,
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          image: data.image,
          icon: data.icon,
          isActive: data.isActive,
          sortOrder: data.sortOrder,
        },
      }).unwrap();
      onSuccess();
    } catch (error) {
      console.error('Failed to update category:', error);
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
              <h3 className="font-medium">Failed to load category</h3>
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

  if (!categoryData) {
    return null;
  }

  return (
    <CategoryForm
      mode="edit"
      initialData={categoryData}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      title={`Edit Category: ${categoryData.name}`}
      description="Update the category details below"
    />
  );
};

export default EditCategoryForm;
