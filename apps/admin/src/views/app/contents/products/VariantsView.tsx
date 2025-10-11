import { CURRENT_STEPS, useProductContext } from '@/contexts/ProductContext';
import ProductVariantsForm from '@/sections/app/contents/products/ProductVariantsForm';
import StepLayout from '@/sections/app/contents/products/StepLayout';
import React from 'react';

const CreateProductVariantsPage: React.FC = () => {
  const { markStepComplete, navigateToStep } = useProductContext();

  const handleComplete = () => {
    markStepComplete(CURRENT_STEPS.VARIANTS);
    navigateToStep(CURRENT_STEPS.IMAGES);
  };

  const handleBack = () => {
    navigateToStep(CURRENT_STEPS.BASIC_INFO);
  };

  return (
    <StepLayout
      currentStep={CURRENT_STEPS.VARIANTS}
      title="Product Variants"
      description="Create different versions of your product with unique SKUs, pricing, and stock"
    >
      <ProductVariantsForm onComplete={handleComplete} onBack={handleBack} />
    </StepLayout>
  );
};

export default CreateProductVariantsPage;
