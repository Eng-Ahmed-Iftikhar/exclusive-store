import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/apis/services/productApi';
import { CURRENT_STEPS, useProductContext } from '@/contexts/ProductContext';
import ProductBasicInfoForm from '@/sections/app/contents/products/ProductBasicInfoForm';
import StepLayout from '@/sections/app/contents/products/StepLayout';

const BasicInfoView: React.FC = () => {
  const navigate = useNavigate();
  const { markStepComplete, navigateToStep, state, updateProductData } =
    useProductContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const handleSubmit = useCallback(
    async (data: {
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
        if (state.productData?.id) {
          const response = await updateProduct({
            id: state.productData.id,
            data,
          }).unwrap();
          await updateProductData(response);
        } else {
          // Create new draft product
          const response = await createProduct({
            ...data,
            isActive: false, // Save as draft
          }).unwrap();
          await updateProductData(response);
        }
        // Mark step as complete and navigate to next step
        await markStepComplete(CURRENT_STEPS.BASIC_INFO);
        navigateToStep(CURRENT_STEPS.VARIANTS);
      } catch (error) {
        console.error('Failed to save product:', error);
        alert('Failed to save product. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      createProduct,
      updateProduct,
      markStepComplete,
      navigateToStep,
      state,
      updateProductData,
    ]
  );

  const handleCancel = useCallback(() => {
    navigate('/content/products');
  }, [navigate]);

  return (
    <StepLayout
      currentStep={CURRENT_STEPS.BASIC_INFO}
      title="Product Basic Information"
      description="Enter the essential details about your product"
    >
      <ProductBasicInfoForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </StepLayout>
  );
};

export default BasicInfoView;
