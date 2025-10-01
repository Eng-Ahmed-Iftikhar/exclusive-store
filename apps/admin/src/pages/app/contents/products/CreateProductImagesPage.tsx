import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductCreation } from '@/contexts/ProductCreationContext';
import ProductImagesForm from '@/sections/app/contents/products/create-steps/ProductImagesForm';
import StepLayout from '@/sections/app/contents/products/create-steps/StepLayout';

const CreateProductImagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { productId, canAccessStep, markStepComplete, navigateToStep } =
    useProductCreation();

  React.useEffect(() => {
    if (!canAccessStep(3)) {
      navigate('/content/products/create/basic-info');
    }
  }, [canAccessStep, navigate]);

  if (!productId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Please complete the basic information step first
          </p>
          <button
            onClick={() => navigate('/content/products/create/basic-info')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Go to Basic Info
          </button>
        </div>
      </div>
    );
  }

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
      <ProductImagesForm
        productId={productId}
        onComplete={handleComplete}
        onBack={handleBack}
      />
    </StepLayout>
  );
};

export default CreateProductImagesPage;

