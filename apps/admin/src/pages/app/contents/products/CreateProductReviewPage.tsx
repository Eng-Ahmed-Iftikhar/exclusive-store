import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductCreation } from '@/contexts/ProductCreationContext';
import ProductReviewForm from '@/sections/app/contents/products/create-steps/ProductReviewForm';
import StepLayout from '@/sections/app/contents/products/create-steps/StepLayout';

const CreateProductReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { productId, canAccessStep, resetCreation, navigateToStep } =
    useProductCreation();

  React.useEffect(() => {
    if (!canAccessStep(4)) {
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

  const handlePublish = () => {
    resetCreation();
    navigate('/content/products');
  };

  const handleBack = () => {
    navigateToStep(3);
  };

  return (
    <StepLayout
      currentStep={4}
      title="Review & Publish"
      description="Review your product and publish it to make it live"
    >
      <ProductReviewForm
        productId={productId}
        onPublish={handlePublish}
        onBack={handleBack}
      />
    </StepLayout>
  );
};

export default CreateProductReviewPage;

