import React, { useState } from 'react';
import { useCreateSubcategoryMutation } from '@/apis/services/subcategoryApi';
import { SubcategoryFormValues } from '@/types/categories';
import SubcategoryForm from './SubcategoryForm';

interface CreateSubcategoryFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateSubcategoryForm: React.FC<CreateSubcategoryFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createSubcategory] = useCreateSubcategoryMutation();

  const handleSubmit = async (data: SubcategoryFormValues) => {
    try {
      setIsSubmitting(true);
      await createSubcategory(data).unwrap();
      onSuccess();
    } catch (error) {
      console.error('Failed to create subcategory:', error);
      // Handle error (you might want to show a toast notification)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SubcategoryForm
      mode="create"
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      title="Create New Subcategory"
      description="Add a new subcategory to organize your products"
    />
  );
};

export default CreateSubcategoryForm;
