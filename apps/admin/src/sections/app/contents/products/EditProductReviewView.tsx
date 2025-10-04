import React from 'react';
import { useProductForm } from '@/contexts/ProductFormContext';
import { useUpdateProductMutation } from '@/apis/services/productApi';
import StepReview from './steps/StepReview';
import EditStepLayout from './edit-steps/EditStepLayout';

interface EditProductReviewViewProps {
  productId: string;
  onSuccess: () => void;
  onCancel: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const EditProductReviewView: React.FC<EditProductReviewViewProps> = ({
  productId,
  onSuccess,
  onCancel,
  onBack,
  isSubmitting,
  setIsSubmitting,
}) => {
  const { formData } = useProductForm();
  const [updateProduct] = useUpdateProductMutation();

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await updateProduct({
        id: productId,
        data: {
          name: formData.name,
          description: formData.description,
          sku: formData.sku,
          categoryId: formData.categoryId || undefined,
          subcategoryId: formData.subcategoryId || undefined,
          isFeatured: formData.isFeatured,
          sortOrder: formData.sortOrder,
          isActive: true,
        },
      }).unwrap();
      onSuccess();
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Failed to update product. Please check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EditStepLayout
      title="Edit Product - Review"
      description="Review and publish your product"
      step={4}
      totalSteps={4}
      onNext={() => handleSubmit()}
      onBack={onBack}
      onCancel={onCancel}
      canProceed={true}
      isSubmitting={isSubmitting}
      isFinalStep={true}
    >
      <StepReview />
    </EditStepLayout>
  );
};

export default EditProductReviewView;
