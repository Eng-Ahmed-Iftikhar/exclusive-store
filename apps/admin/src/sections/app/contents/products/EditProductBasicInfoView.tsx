import React, { useEffect } from 'react';
import {
  ProductFormProvider,
  useProductForm,
} from '@/contexts/ProductFormContext';
import { useGetProductByIdQuery } from '@/apis/services/productApi';
import StepProductInfo from './steps/StepProductInfo';
import EditStepLayout from './edit-steps/EditStepLayout';

interface EditProductBasicInfoViewProps {
  productId: string;
  onSuccess: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const EditProductBasicInfoViewContent: React.FC<{
  productId: string;
  onSuccess: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}> = ({ productId, onSuccess, onCancel, isSubmitting, setIsSubmitting }) => {
  const { updateFormData, nextStep } = useProductForm();

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(productId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  useEffect(() => {
    if (product) {
      updateFormData({
        name: product.name,
        description: product.description || '',
        sku: product.sku || '',
        categoryId: product.categoryId || '',
        subcategoryId: product.subcategoryId || '',
        isFeatured: product.isFeatured ?? false,
        sortOrder: product.sortOrder || 0,
        isActive: product.isActive ?? false,
      });
    }
  }, [product, updateFormData]);

  const handleNext = () => {
    nextStep();
    onSuccess();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-pulse">
            <div className="space-y-6">
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
              <div className="h-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="text-red-500">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-300">
                  Failed to load product
                </h3>
                <p className="text-sm mt-1 text-red-600 dark:text-red-400">
                  Please try refreshing the page or contact support if the
                  problem persists.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <EditStepLayout
      title="Edit Product - Basic Information"
      description="Update the basic product details"
      step={1}
      totalSteps={4}
      onNext={handleNext}
      onCancel={onCancel}
      canProceed={true}
      isSubmitting={isSubmitting}
    >
      <StepProductInfo />
    </EditStepLayout>
  );
};

const EditProductBasicInfoView: React.FC<EditProductBasicInfoViewProps> = ({
  productId,
  onSuccess,
  onCancel,
  isSubmitting,
  setIsSubmitting,
}) => {
  return (
    <ProductFormProvider>
      <EditProductBasicInfoViewContent
        productId={productId}
        onSuccess={onSuccess}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />
    </ProductFormProvider>
  );
};

export default EditProductBasicInfoView;
