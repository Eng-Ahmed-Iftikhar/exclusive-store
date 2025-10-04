import React from 'react';
import { useProductForm } from '@/contexts/ProductFormContext';
import StepImages from './steps/StepImages';
import EditStepLayout from './edit-steps/EditStepLayout';

interface EditProductImagesViewProps {
  productId: string;
  onSuccess: () => void;
  onCancel: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const EditProductImagesView: React.FC<EditProductImagesViewProps> = ({
  productId,
  onSuccess,
  onCancel,
  onBack,
  isSubmitting,
  setIsSubmitting,
}) => {
  const { nextStep } = useProductForm();

  const handleNext = () => {
    nextStep();
    onSuccess();
  };

  return (
    <EditStepLayout
      title="Edit Product - Images"
      description="Upload and manage product images"
      step={3}
      totalSteps={4}
      onNext={handleNext}
      onBack={onBack}
      onCancel={onCancel}
      canProceed={true}
      isSubmitting={isSubmitting}
    >
      <StepImages />
    </EditStepLayout>
  );
};

export default EditProductImagesView;
