import { useCreateProductMutation } from '@/apis/services/productApi';
import ProductBasicInfoForm from '@/sections/app/contents/products/ProductBasicInfoForm';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';

function CreateProductView() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createProduct] = useCreateProductMutation();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: {
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
        await createProduct({
          ...data,
          isActive: false, // Save as draft
        }).unwrap();
        navigate(`/content/products`);
      } catch (error) {
        console.error('Failed to save product:', error);
        alert('Failed to save product. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [createProduct, navigate]
  );

  const handleCancel = useCallback(() => {
    navigate('/content/products');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <PlusIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create New Product
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ml-14">
            Add a new product to your catalog with all the essential details
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <ProductBasicInfoForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

export default CreateProductView;
