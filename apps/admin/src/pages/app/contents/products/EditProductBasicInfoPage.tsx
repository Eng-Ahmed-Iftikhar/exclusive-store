import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditProductBasicInfoView from '@/sections/app/contents/products/EditProductBasicInfoView';

function EditProductBasicInfoPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    navigate(`/content/products/${id}/edit/variants`);
  };

  const handleCancel = () => {
    navigate('/content/products');
  };

  if (!id) {
    navigate('/content/products');
    return null;
  }

  return (
    <EditProductBasicInfoView
      productId={id}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
      setIsSubmitting={setIsSubmitting}
    />
  );
}

export default EditProductBasicInfoPage;
