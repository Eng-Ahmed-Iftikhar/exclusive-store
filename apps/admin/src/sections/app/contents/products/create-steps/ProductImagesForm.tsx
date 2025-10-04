import React, { useEffect, useState } from 'react';
import {
  useCreateProductImageMutation,
  useGetProductByIdQuery,
  useGetImagesByProductQuery,
} from '@/apis/services/productApi';
import { useUploadFileMutation } from '@/apis/services/fileApi';
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface ProductImagesFormProps {
  productId: string;
  onComplete: () => void;
  onBack: () => void;
}

const ProductImagesForm: React.FC<ProductImagesFormProps> = ({
  productId,
  onComplete,
  onBack,
}) => {
  const { refetch } = useGetProductByIdQuery(productId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });
  const { data: productImages, refetch: refetchImages } =
    useGetImagesByProductQuery(productId, {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    });
  const [createProductImage] = useCreateProductImageMutation();

  const [uploadFile] = useUploadFileMutation();
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<
    Array<{ file: File; preview: string; altText: string }>
  >([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        altText: file.name,
      }));
      setSelectedImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleSaveImages = async () => {
    if (selectedImages.length === 0) {
      // Skip if no images
      onComplete();
      return;
    }

    setUploading(true);
    try {
      const existingImagesCount = productImages?.length || 0;

      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i];
        const formData = new FormData();
        formData.append('file', image.file);
        const uploadResponse = await uploadFile(formData).unwrap();

        await createProductImage({
          productId,
          fileId: uploadResponse.file.id,
          altText: image.altText,
          isPrimary: existingImagesCount === 0 && i === 0,
          sortOrder: existingImagesCount + i,
        }).unwrap();
      }

      await refetch();
      await refetchImages();
      setSelectedImages([]);
      onComplete();
    } catch (error) {
      console.error('Failed to upload images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSkip = () => {
    onComplete();
  };

  // Auto-refresh images when productId changes
  useEffect(() => {
    if (productId) {
      refetchImages();
    }
  }, [productId, refetchImages]);

  return (
    <div className="space-y-6">
      {/* Existing Images */}
      {productImages && productImages.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Existing Images ({productImages.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {productImages.map((img, idx) => (
              <div
                key={img.id}
                className="relative bg-gray-100 dark:bg-gray-700 rounded-lg p-2"
              >
                <img
                  src={img.file?.secureUrl || img.file?.url}
                  alt={img.altText || `Product image ${idx + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
                {img.isPrimary && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-indigo-500 text-white text-xs font-medium rounded">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload New Images */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Add More Images
        </h3>
        <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors cursor-pointer">
          <div className="space-y-2 text-center">
            <PhotoIcon className="mx-auto h-14 w-14 text-gray-400" />
            <div className="flex text-sm text-gray-600 dark:text-gray-400">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span className="px-2">Upload files</span>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, GIF up to 10MB each
            </p>
          </div>
        </div>
      </div>

      {/* Selected Images Preview */}
      {selectedImages.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Selected Images ({selectedImages.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedImages.map((img, idx) => (
              <div
                key={idx}
                className="relative group bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-3 hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img
                    src={img.preview}
                    alt={img.altText}
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={img.altText}
                  onChange={(e) => {
                    const newImages = [...selectedImages];
                    newImages[idx].altText = e.target.value;
                    setSelectedImages(newImages);
                  }}
                  placeholder="Image description"
                  className="mt-2 w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onBack}
          disabled={uploading}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Variants
        </button>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleSkip}
            disabled={uploading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Skip for Now
          </button>
          <button
            type="button"
            onClick={handleSaveImages}
            disabled={uploading}
            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {uploading
              ? 'Uploading...'
              : selectedImages.length > 0
              ? 'Save & Continue'
              : 'Continue'}
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductImagesForm;
