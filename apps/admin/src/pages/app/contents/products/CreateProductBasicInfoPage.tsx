import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductCreation } from '@/contexts/ProductCreationContext';
import { useCreateProductMutation, useUpdateProductMutation } from '@/apis/services/productApi';
import ProductBasicInfoForm from '@/sections/app/contents/products/create-steps/ProductBasicInfoForm';
import StepLayout from '@/sections/app/contents/products/create-steps/StepLayout';

const CreateProductBasicInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { productId, setProductId, markStepComplete, navigateToStep } =
    useProductCreation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const handleSubmit = async (data: {
    name: string;
    description: string;
    sku: string;
    categoryId: string;
    subcategoryId: string;
    isFeatured: boolean;
    sortOrder: number;
  }) => {
    setIsSubmitting(true);
    try {
      if (productId) {
        // Update existing draft
        await updateProduct({ id: productId, data }).unwrap();
      } else {
        // Create new draft product
        const response = await createProduct({
          ...data,
          isActive: false, // Save as draft
        }).unwrap();
        setProductId(response.id);
      }

      // Mark step as complete and navigate to next step
      markStepComplete(1);
      navigateToStep(2);
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/content/products');
  };

  return (
    <StepLayout
      currentStep={1}
      title="Product Basic Information"
      description="Enter the essential details about your product"
    >
      <ProductBasicInfoForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        productId={productId}
      />
    </StepLayout>
  );
};

export default CreateProductBasicInfoPage;

