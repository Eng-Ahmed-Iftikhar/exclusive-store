import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditProductImagesView from '@/sections/app/contents/products/EditProductImagesView';

function EditProductImagesPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    navigate(`/content/products/${id}/edit/review`);
  };

  const handleCancel = () => {
    navigate('/content/products');
  };

  const handleBack = () => {
    navigate(`/content/products/${id}/edit/variants`);
  };

  if (!id) {
    navigate('/content/products');
    return null;
  }

  return (
    <EditProductImagesView
      productId={id}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
      onBack={handleBack}
      isSubmitting={isSubmitting}
      setIsSubmitting={setIsSubmitting}
    />
  );
}

export default EditProductImagesPage;
