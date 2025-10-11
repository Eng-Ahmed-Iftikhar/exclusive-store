import { CURRENT_STEPS, useProductContext } from '@/contexts/ProductContext';
import ProductImagesForm from '@/sections/app/contents/products/ProductImagesForm';
import StepLayout from '@/sections/app/contents/products/StepLayout';
import React from 'react';

const ImagesPage: React.FC = () => {
  const { markStepComplete, navigateToStep } = useProductContext();

  const handleComplete = () => {
    markStepComplete(CURRENT_STEPS.IMAGES);
    navigateToStep(CURRENT_STEPS.REVIEW);
  };

  const handleBack = () => {
    navigateToStep(CURRENT_STEPS.VARIANTS);
  };

  return (
    <StepLayout
      currentStep={CURRENT_STEPS.IMAGES}
      title="Product Images"
      description="Upload product-level images (optional if variants have images)"
    >
      <ProductImagesForm onComplete={handleComplete} onBack={handleBack} />
    </StepLayout>
  );
};

export default ImagesPage;
