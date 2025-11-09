import React, { useState } from 'react';
import {
  useUpdateSubcategoryMutation,
  useGetSubcategoryByIdQuery,
} from '@/apis/services/subcategoryApi';
import { SubcategoryFormValues } from '@/types/categories';
import SubcategoryForm from './SubcategoryForm';

interface EditSubcategoryFormProps {
  subcategoryId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditSubcategoryForm: React.FC<EditSubcategoryFormProps> = ({
  subcategoryId,
  onSuccess,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateSubcategory] = useUpdateSubcategoryMutation();

  const {
    data: subcategory,
    isLoading,
    error,
  } = useGetSubcategoryByIdQuery(subcategoryId);

  const handleSubmit = async (data: SubcategoryFormValues) => {
    try {
      setIsSubmitting(true);
      await updateSubcategory({
        id: subcategoryId,
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          iconFileId: data.iconFileId,
          isActive: data.isActive,
          sortOrder: data.sortOrder,
        },
      }).unwrap();
      onSuccess();
    } catch (error) {
      console.error('Failed to update subcategory:', error);
      // Handle error (you might want to show a toast notification)
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full mx-auto space-y-8">
        <div className="rounded-2xl border bg-white border-gray-200 shadow-xl">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
          <div className="p-8">
            <div className="animate-pulse space-y-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !subcategory) {
    return (
      <div className="w-full mx-auto space-y-8">
        <div className="rounded-2xl border bg-red-50 border-red-200 shadow-xl">
          <div className="px-8 py-6 border-b border-red-200">
            <h2 className="text-xl font-semibold text-red-900">
              Error Loading Subcategory
            </h2>
            <p className="text-sm mt-1 text-red-600">
              Failed to load subcategory data. Please try again.
            </p>
          </div>
          <div className="p-8">
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SubcategoryForm
      mode="edit"
      initialData={{
        name: subcategory.name,
        slug: subcategory.slug,
        description: subcategory.description,
        iconFileId: subcategory.iconFileId,
        isActive: subcategory.isActive,
        sortOrder: subcategory.sortOrder,
        categoryId: subcategory.categoryId,
      }}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      title={`Edit: ${subcategory.name}`}
      description="Update the subcategory details"
    />
  );
};

export default EditSubcategoryForm;
