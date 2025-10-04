import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface EditProductViewProps {
  productId: string;
  onSuccess: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const EditProductView: React.FC<EditProductViewProps> = ({
  productId,
  onSuccess,
  onCancel,
  isSubmitting,
  setIsSubmitting,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the first step of the edit flow
    navigate(`/content/products/${productId}/edit/basic-info`, {
      replace: true,
    });
  }, [productId, navigate]);

  return null;
};

export default EditProductView;
