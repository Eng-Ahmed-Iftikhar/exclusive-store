import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductCreation } from '@/contexts/ProductCreationContext';
import ProductVariantsForm from '@/sections/app/contents/products/create-steps/ProductVariantsForm';
import StepLayout from '@/sections/app/contents/products/create-steps/StepLayout';

const CreateProductVariantsPage: React.FC = () => {
  const navigate = useNavigate();
  const { productId, canAccessStep, markStepComplete, navigateToStep } =
    useProductCreation();

  // Redirect if step not accessible
  React.useEffect(() => {
    if (!canAccessStep(2)) {
      navigate('/content/products/create/basic-info');
    }
  }, [canAccessStep, navigate]);

  if (!productId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            No product in progress
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please start from the basic information step
          </p>
          <button
            onClick={() => navigate('/content/products/create/basic-info')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go to Basic Info
          </button>
        </div>
      </div>
    );
  }

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
      <ProductVariantsForm
        productId={productId}
        onComplete={handleComplete}
        onBack={handleBack}
      />
    </StepLayout>
  );
};

export default CreateProductVariantsPage;

