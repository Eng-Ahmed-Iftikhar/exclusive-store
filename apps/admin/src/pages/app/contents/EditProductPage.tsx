import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditProductView from '@/sections/app/contents/products/EditProductView';

function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    navigate('/content/products');
  };

  const handleCancel = () => {
    navigate('/content/products');
  };

  if (!id) {
    navigate('/content/products');
    return null;
  }

  return (
    <EditProductView
      productId={id}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
      setIsSubmitting={setIsSubmitting}
    />
  );
}

export default EditProductPage;
