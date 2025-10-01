import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProductMutation } from '@/apis/services/productApi';
import MultiStepProductForm from './MultiStepProductForm';

interface CreateProductViewProps {
  onSuccess: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const CreateProductView: React.FC<CreateProductViewProps> = ({
  onSuccess,
  onCancel,
  isSubmitting,
  setIsSubmitting,
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MultiStepProductForm
          onSuccess={onSuccess}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      </div>
    </div>
  );
};

export default CreateProductView;
