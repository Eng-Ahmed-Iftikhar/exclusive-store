import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductContext } from '@/contexts/ProductContext';
import ProductImagesForm from '@/sections/app/contents/products/ProductImagesForm';
import StepLayout from '@/sections/app/contents/products/StepLayout';

const ImagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { canAccessStep, markStepComplete, navigateToStep } =
    useProductContext();

  React.useEffect(() => {
    if (!canAccessStep(3)) {
      navigate('/content/products/create/basic-info');
    }
  }, [canAccessStep, navigate]);

  const handleComplete = () => {
    markStepComplete(3);
    navigateToStep(4);
  };

  const handleBack = () => {
    navigateToStep(2);
  };

  return (
    <StepLayout
      currentStep={3}
      title="Product Images"
      description="Upload product-level images (optional if variants have images)"
    >
      <ProductImagesForm onComplete={handleComplete} onBack={handleBack} />
    </StepLayout>
  );
};

export default ImagesPage;
