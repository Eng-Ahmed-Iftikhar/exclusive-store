import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CURRENT_STEPS, useProductContext } from '@/contexts/ProductContext';
import ProductReviewForm from '@/sections/app/contents/products/ProductReviewForm';
import StepLayout from '@/sections/app/contents/products/StepLayout';

const CreateProductReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { resetCreation, navigateToStep } = useProductContext();

  const handlePublish = () => {
    resetCreation();
    navigate('/content/products');
  };

  const handleBack = () => {
    navigateToStep(CURRENT_STEPS.IMAGES);
  };

  return (
    <StepLayout
      currentStep={CURRENT_STEPS.REVIEW}
      title="Review & Publish"
      description="Review your product and publish it to make it live"
    >
      <ProductReviewForm onPublish={handlePublish} onBack={handleBack} />
    </StepLayout>
  );
};

export default CreateProductReviewPage;
