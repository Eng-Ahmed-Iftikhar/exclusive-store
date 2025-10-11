import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductContext } from '@/contexts/ProductContext';
import ProductVariantsForm from '@/sections/app/contents/products/ProductVariantsForm';
import StepLayout from '@/sections/app/contents/products/StepLayout';

const VariantsPage: React.FC = () => {
  const navigate = useNavigate();
  const { canAccessStep, markStepComplete, navigateToStep } =
    useProductContext();

  // Redirect if step not accessible
  React.useEffect(() => {
    if (!canAccessStep(2)) {
      navigate('/content/products/create/basic-info');
    }
  }, [canAccessStep, navigate]);

  const handleComplete = () => {
    markStepComplete(2);
    navigateToStep(3);
  };

  const handleBack = () => {
    navigateToStep(1);
  };

  return (
    <StepLayout
      currentStep={2}
      title="Product Variants"
      description="Create different versions of your product with unique SKUs, pricing, and stock"
    >
      <ProductVariantsForm onComplete={handleComplete} onBack={handleBack} />
    </StepLayout>
  );
};

export default VariantsPage;
