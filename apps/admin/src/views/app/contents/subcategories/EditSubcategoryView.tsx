import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PermissionGuard } from '@/components/PermissionGuard';
import SubcategoryForm from '@/sections/app/contents/subcategories/SubcategoryForm';
import {
  useGetSubcategoryByIdQuery,
  useUpdateSubcategoryMutation,
} from '@/apis/services/subcategoryApi';
import { SubcategoryFormValues } from '@/types/categories';

function EditSubcategoryView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateSubcategory] = useUpdateSubcategoryMutation();

  const {
    data: subcategory,
    isLoading: loading,
    error,
  } = useGetSubcategoryByIdQuery(id!, {
    skip: !id,
  });

  const handleSuccess = () => {
    navigate('/content/subcategories');
  };

  const handleCancel = () => {
    navigate('/content/subcategories');
  };

  const handleSubmit = async (data: SubcategoryFormValues) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await updateSubcategory({ id, data }).unwrap();
      handleSuccess();
    } catch (error) {
      console.error('Error updating subcategory:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600 dark:text-red-400">
            Error Loading Subcategory
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Failed to load subcategory data
          </p>
        </div>
      </div>
    );
  }

  if (!subcategory) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">
            Subcategory Not Found
          </h3>
        </div>
      </div>
    );
  }

  return (
    <PermissionGuard action="edit" subject="subcategories">
      <div className="space-y-6">
        <SubcategoryForm
          mode="edit"
          initialData={subcategory}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          title={`Edit : ${subcategory.name}`}
          description="Update the subcategory details"
        />
      </div>
    </PermissionGuard>
  );
}

export default EditSubcategoryView;
