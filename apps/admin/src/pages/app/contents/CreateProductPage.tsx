import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateProductView from '@/sections/app/contents/products/CreateProductView';

function CreateProductPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    navigate('/content/products');
  };

  const handleCancel = () => {
    navigate('/content/products');
  };

  return (
    <CreateProductView
      onSuccess={handleSuccess}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
      setIsSubmitting={setIsSubmitting}
    />
  );
}

export default CreateProductPage;
