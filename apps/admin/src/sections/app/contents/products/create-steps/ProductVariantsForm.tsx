import React, { useState } from 'react';
import {
  useGetVariantsByProductQuery,
  useCreateVariantMutation,
  useCreatePriceMutation,
  useCreateStockMutation,
  useCreateProductImageMutation,
} from '@/apis/services/productApi';
import { useUploadFileMutation } from '@/apis/services/fileApi';
import { ArrowRightIcon, ArrowLeftIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import VariantFormModal from '../components/VariantFormModal';
import VariantListCard from '../components/VariantListCard';

interface ProductVariantsFormProps {
  productId: string;
  onComplete: () => void;
  onBack: () => void;
}

interface VariantFormData {
  sku: string;
  name: string;
  attributes: Record<string, string>;
  price: number;
  salePrice?: number;
  quantity: number;
  minThreshold: number;
  images: Array<{ file: File; preview: string; altText: string }>;
  isDefault: boolean;
}

const ProductVariantsForm: React.FC<ProductVariantsFormProps> = ({
  productId,
  onComplete,
  onBack,
}) => {
  const { data: variants, refetch } = useGetVariantsByProductQuery(productId);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createVariant] = useCreateVariantMutation();
  const [createPrice] = useCreatePriceMutation();
  const [createStock] = useCreateStockMutation();
  const [createProductImage] = useCreateProductImageMutation();
  const [uploadFile] = useUploadFileMutation();

  const handleSaveVariant = async (variantData: VariantFormData) => {
    setIsSubmitting(true);
    try {
      // Create variant
      const variantResponse = await createVariant({
        productId,
        sku: variantData.sku,
        name: variantData.name,
        attributes: variantData.attributes,
        isDefault: variantData.isDefault,
        isActive: true,
      }).unwrap();

      const variantId = variantResponse.id;

      // Create price
      await createPrice({
        variantId,
        price: variantData.price,
        salePrice: variantData.salePrice,
        currency: 'USD',
        isActive: true,
      }).unwrap();

      // Create stock
      await createStock({
        variantId,
        quantity: variantData.quantity,
        minThreshold: variantData.minThreshold,
        isInStock: variantData.quantity > 0,
      }).unwrap();

      // Upload and link images
      for (let i = 0; i < variantData.images.length; i++) {
        const image = variantData.images[i];
        const formData = new FormData();
        formData.append('file', image.file);
        const uploadResponse = await uploadFile(formData).unwrap();

        await createProductImage({
          variantId,
          fileId: uploadResponse.file.id,
          altText: image.altText,
          isPrimary: i === 0,
          sortOrder: i,
        }).unwrap();
      }

      await refetch();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to create variant:', error);
      alert('Failed to create variant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (!variants || variants.length === 0) {
      alert('Please create at least one product variant before continuing');
      return;
    }
    onComplete();
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {variants?.length || 0} variant(s) created
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          + Add Variant
        </button>
      </div>

      {/* Variants List */}
      {variants && variants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {variants.map((variant) => (
            <VariantListCard key={variant.id} variant={variant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <Squares2X2Icon className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No variants created yet
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Start by creating your first product variant with specific attributes,
            pricing, and inventory
          </p>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            + Create First Variant
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Basic Info
        </button>

        <button
          type="button"
          onClick={handleContinue}
          disabled={isSubmitting || !variants || variants.length === 0}
          className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Images
          <ArrowRightIcon className="h-5 w-5 ml-2" />
        </button>
      </div>

      {/* Variant Modal */}
      {showModal && (
        <VariantFormModal
          variant={null}
          onSave={handleSaveVariant}
          onClose={() => setShowModal(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default ProductVariantsForm;

