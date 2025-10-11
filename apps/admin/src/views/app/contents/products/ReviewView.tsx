import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductContext } from '@/contexts/ProductContext';
import ProductReviewForm from '@/sections/app/contents/products/ProductReviewForm';
import StepLayout from '@/sections/app/contents/products/StepLayout';

const CreateProductReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { canAccessStep, resetCreation, navigateToStep } = useProductContext();

  React.useEffect(() => {
    if (!canAccessStep(4)) {
      navigate('/content/products/create/basic-info');
    }
  }, [canAccessStep, navigate]);

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
      <ProductReviewForm onPublish={handlePublish} onBack={handleBack} />
    </StepLayout>
  );
};

export default CreateProductReviewPage;
