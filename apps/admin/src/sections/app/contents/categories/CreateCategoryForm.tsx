import React from 'react';
import { useCreateCategoryMutation } from '@/apis/services/categoryApi';
import CategoryForm from './CategoryForm';

interface CreateCategoryFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const CreateCategoryForm: React.FC<CreateCategoryFormProps> = ({
  onSuccess,
  onCancel,
  isSubmitting,
  setIsSubmitting,
}) => {
  const [createCategory] = useCreateCategoryMutation();

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      await createCategory({
        name: data.name,
        slug: data.slug,
        description: data.description,
        iconFileId: data.iconFileId,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      }).unwrap();
      onSuccess();
    } catch (error) {
      console.error('Failed to create category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CategoryForm
      mode="create"
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      title="Category Details"
      description="Fill in the details below to create a new category"
    />
  );
};

export default CreateCategoryForm;
