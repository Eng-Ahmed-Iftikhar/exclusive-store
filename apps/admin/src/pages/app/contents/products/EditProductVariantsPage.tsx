import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditProductVariantsView from '@/sections/app/contents/products/EditProductVariantsView';

function EditProductVariantsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    navigate(`/content/products/${id}/edit/images`);
  };

  const handleCancel = () => {
    navigate('/content/products');
  };

  const handleBack = () => {
    navigate(`/content/products/${id}/edit/basic-info`);
  };

  if (!id) {
    navigate('/content/products');
    return null;
  }

  return (
    <EditProductVariantsView
      productId={id}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
      onBack={handleBack}
      isSubmitting={isSubmitting}
      setIsSubmitting={setIsSubmitting}
    />
  );
}

export default EditProductVariantsPage;
