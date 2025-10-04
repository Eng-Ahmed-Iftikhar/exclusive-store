import React from 'react';
import { useProductForm } from '@/contexts/ProductFormContext';
import StepVariants from './steps/StepVariants';
import EditStepLayout from './edit-steps/EditStepLayout';

interface EditProductVariantsViewProps {
  productId: string;
  onSuccess: () => void;
  onCancel: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const EditProductVariantsView: React.FC<EditProductVariantsViewProps> = ({
  productId,
  onSuccess,
  onCancel,
  onBack,
  isSubmitting,
  setIsSubmitting,
}) => {
  const { formData, nextStep } = useProductForm();

  const handleNext = () => {
    nextStep();
    onSuccess();
  };

  const canProceed = formData.variants.length > 0;

  return (
    <EditStepLayout
      title="Edit Product - Variants"
      description="Manage product variants and pricing"
      step={2}
      totalSteps={4}
      onNext={handleNext}
      onBack={onBack}
      onCancel={onCancel}
      canProceed={canProceed}
      isSubmitting={isSubmitting}
    >
      <StepVariants />
    </EditStepLayout>
  );
};

export default EditProductVariantsView;
