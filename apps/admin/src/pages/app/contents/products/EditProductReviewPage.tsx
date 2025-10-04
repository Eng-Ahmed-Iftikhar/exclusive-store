import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditProductReviewView from '@/sections/app/contents/products/EditProductReviewView';

function EditProductReviewPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    navigate('/content/products');
  };

  const handleCancel = () => {
    navigate('/content/products');
  };

  const handleBack = () => {
    navigate(`/content/products/${id}/edit/images`);
  };

  if (!id) {
    navigate('/content/products');
    return null;
  }

  return (
    <EditProductReviewView
      productId={id}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
      onBack={handleBack}
      isSubmitting={isSubmitting}
      setIsSubmitting={setIsSubmitting}
    />
  );
}

export default EditProductReviewPage;
