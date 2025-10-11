import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CURRENT_STEPS, useProductContext } from '@/contexts/ProductContext';
import ProductVariantsForm from '@/sections/app/contents/products/ProductVariantsForm';
import StepLayout from '@/sections/app/contents/products/StepLayout';

const CreateProductVariantsPage: React.FC = () => {
  const navigate = useNavigate();
  const { canAccessStep, markStepComplete, navigateToStep, state } =
    useProductContext();

  // Redirect if step not accessible
  React.useEffect(() => {
    console.log('VariantsView', canAccessStep(CURRENT_STEPS.VARIANTS));
    if (!canAccessStep(CURRENT_STEPS.VARIANTS)) {
      navigate(`/content/products/edit/${state.productData?.id}/basic-info`);
    }
  }, [canAccessStep, navigate, state]);

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
