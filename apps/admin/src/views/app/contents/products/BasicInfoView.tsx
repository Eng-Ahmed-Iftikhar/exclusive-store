import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCreateProductMutation } from '@/apis/services/productApi';
import { useProductContext } from '@/contexts/ProductContext';
import ProductBasicInfoForm from '@/sections/app/contents/products/ProductBasicInfoForm';

const BasicInfoView: React.FC = () => {
  const navigate = useNavigate();
  const { markStepComplete, navigateToStep, setProductId } =
    useProductContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createProduct] = useCreateProductMutation();

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
      // Create new draft product
      const response = await createProduct({
        ...data,
        isActive: false, // Save as draft
      }).unwrap();
      setProductId(response.id);

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
    <ProductBasicInfoForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
};

export default BasicInfoView;
