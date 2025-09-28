import React from 'react';
import { useCreateProductMutation } from '@/apis/services/productApi';
import ProductForm from './ProductForm';

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
  const [createProduct] = useCreateProductMutation();

  const handleSubmit = async (data: {
    name: string;
    description: string;
    sku: string;
    isActive: boolean;
    isFeatured: boolean;
    sortOrder: number;
    categoryId: string;
    subcategoryId: string;
  }) => {
    setIsSubmitting(true);

    try {
      await createProduct({
        name: data.name,
        description: data.description,
        sku: data.sku,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder,
        categoryId: data.categoryId || undefined,
        subcategoryId: data.subcategoryId || undefined,
      }).unwrap();
      onSuccess();
    } catch (error) {
      console.error('Failed to create product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProductForm
      mode="create"
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      title="Create Product"
      description="Fill in the details below to create a new product"
    />
  );
};

export default CreateProductView;
