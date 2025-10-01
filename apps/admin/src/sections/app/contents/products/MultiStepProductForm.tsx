import React from 'react';
import {
  ProductFormProvider,
  useProductForm,
} from '@/contexts/ProductFormContext';
import {
  useCreateProductMutation,
  useCreateVariantMutation,
  useCreatePriceMutation,
  useCreateStockMutation,
  useCreateProductImageMutation,
} from '@/apis/services/productApi';
import { useUploadFileMutation } from '@/apis/services/fileApi';
import ProgressSteps from './components/ProgressSteps';
import FormNavigation from './components/FormNavigation';
import StepProductInfo from './steps/StepProductInfo';
import StepVariants from './steps/StepVariants';
import StepImages from './steps/StepImages';
import StepReview from './steps/StepReview';

interface MultiStepProductFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const MultiStepProductFormContent: React.FC<{
  onSuccess: () => void;
  onCancel: () => void;
  externalSetIsSubmitting: (value: boolean) => void;
}> = ({ onSuccess, onCancel, externalSetIsSubmitting }) => {
  const { formData, currentStep, setIsSubmitting } = useProductForm();

  const [createProduct] = useCreateProductMutation();
  const [createVariant] = useCreateVariantMutation();
  const [createPrice] = useCreatePriceMutation();
  const [createStock] = useCreateStockMutation();
  const [createProductImage] = useCreateProductImageMutation();
  const [uploadFile] = useUploadFileMutation();

  const handleSubmit = async (publishNow: boolean) => {
    setIsSubmitting(true);
    externalSetIsSubmitting(true);

    try {
      const productResponse = await createProduct({
        name: formData.name,
        description: formData.description,
        sku: formData.sku || undefined,
        categoryId: formData.categoryId || undefined,
        subcategoryId: formData.subcategoryId || undefined,
        isFeatured: formData.isFeatured,
        sortOrder: formData.sortOrder,
        isActive: publishNow ? formData.isActive : false,
      }).unwrap();

      const productId = productResponse.id;

      for (const variant of formData.variants) {
        const variantResponse = await createVariant({
          productId,
          sku: variant.sku,
          name: variant.name,
          attributes: variant.attributes,
          isDefault: variant.isDefault,
          isActive: true,
        }).unwrap();

        const variantId = variantResponse.id;

        await createPrice({
          variantId,
          price: variant.price,
          salePrice: variant.salePrice || undefined,
          currency: 'USD',
          isActive: true,
        }).unwrap();

        await createStock({
          variantId,
          quantity: variant.quantity,
          minThreshold: variant.minThreshold,
          isInStock: variant.quantity > 0,
        }).unwrap();

        for (let i = 0; i < variant.images.length; i++) {
          const image = variant.images[i];
          const imageFormData = new FormData();
          imageFormData.append('file', image.file);
          const uploadResponse = await uploadFile(imageFormData).unwrap();

          await createProductImage({
            variantId,
            fileId: uploadResponse.file.id,
            altText: image.altText,
            isPrimary: i === 0,
            sortOrder: i,
          }).unwrap();
        }
      }

      for (let i = 0; i < formData.productImages.length; i++) {
        const image = formData.productImages[i];
        const imageFormData = new FormData();
        imageFormData.append('file', image.file);
        const uploadResponse = await uploadFile(imageFormData).unwrap();

        await createProductImage({
          productId,
          fileId: uploadResponse.file.id,
          altText: image.altText,
          isPrimary: i === 0 && formData.variants.length === 0,
          sortOrder: i,
        }).unwrap();
      }

      onSuccess();
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Failed to create product. Please check the console for details.');
    } finally {
      setIsSubmitting(false);
      externalSetIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create New Product
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Follow the steps below to create a professional product listing with
          variants
        </p>
      </div>

      <ProgressSteps />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 min-h-[500px]">
        {currentStep === 1 && <StepProductInfo />}
        {currentStep === 2 && <StepVariants />}
        {currentStep === 3 && <StepImages />}
        {currentStep === 4 && <StepReview />}
      </div>

      <FormNavigation onCancel={onCancel} onSubmit={handleSubmit} />
    </div>
  );
};

const MultiStepProductForm: React.FC<MultiStepProductFormProps> = ({
  onSuccess,
  onCancel,
  isSubmitting,
  setIsSubmitting,
}) => {
  return (
    <ProductFormProvider>
      <MultiStepProductFormContent
        onSuccess={onSuccess}
        onCancel={onCancel}
        externalSetIsSubmitting={setIsSubmitting}
      />
    </ProductFormProvider>
  );
};

export default MultiStepProductForm;
