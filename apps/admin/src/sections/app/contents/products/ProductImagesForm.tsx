import { useUploadFileMutation } from '@/apis/services/fileApi';
import {
  useCreateProductImageMutation,
  useUpdateProductImageMutation,
  useDeleteProductImageMutation,
  ProductImage,
} from '@/apis/services/productApi';
import { useProductContext } from '@/contexts/ProductContext';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PhotoIcon,
  XMarkIcon,
  StarIcon,
  ArrowsUpDownIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import React, { useState, useEffect } from 'react';

interface ProductImagesFormProps {
  onComplete: () => void;
  onBack: () => void;
}

const ProductImagesForm: React.FC<ProductImagesFormProps> = ({
  onComplete,
  onBack,
}) => {
  const { state, refreshProductData } = useProductContext();
  const productId = state.productData?.id;

  const [createProductImage] = useCreateProductImageMutation();
  const [updateProductImage] = useUpdateProductImageMutation();
  const [deleteProductImage] = useDeleteProductImageMutation();
  const [uploadFile] = useUploadFileMutation();

  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<
    Array<{ file: File; preview: string; altText: string }>
  >([]);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [savingChanges, setSavingChanges] = useState(false);

  // Initialize existing images from context
  useEffect(() => {
    if (state.productData?.images) {
      setExistingImages(
        [...state.productData.images].sort((a, b) => a.sortOrder - b.sortOrder)
      );
    }
  }, [state.productData?.images]);

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

  // Handle drag and drop for reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...existingImages];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);

    setExistingImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;

    // Update sortOrder for all images
    setSavingChanges(true);
    try {
      for (let i = 0; i < existingImages.length; i++) {
        if (existingImages[i].sortOrder !== i) {
          await updateProductImage({
            id: existingImages[i].id,
            sortOrder: i,
          }).unwrap();
        }
      }
      await refreshProductData();
    } catch (error) {
      console.error('Failed to update image order:', error);
      alert('Failed to update image order. Please try again.');
    } finally {
      setSavingChanges(false);
      setDraggedIndex(null);
    }
  };

  // Set image as primary
  const handleSetPrimary = async (imageId: string) => {
    setSavingChanges(true);
    try {
      // First, remove primary from all images
      const primaryImage = existingImages.find((img) => img.isPrimary);
      if (primaryImage && primaryImage.id !== imageId) {
        await updateProductImage({
          id: primaryImage.id,
          isPrimary: false,
        }).unwrap();
      }

      // Set new primary
      await updateProductImage({
        id: imageId,
        isPrimary: true,
      }).unwrap();

      await refreshProductData();
    } catch (error) {
      console.error('Failed to set primary image:', error);
      alert('Failed to set primary image. Please try again.');
    } finally {
      setSavingChanges(false);
    }
  };

  // Delete existing image
  const handleDeleteExistingImage = async (imageId: string) => {
    // Check if it's the last image
    if (existingImages.length === 1) {
      alert('Cannot delete the last image. At least one image is required.');
      return;
    }

    const imageToDelete = existingImages.find((img) => img.id === imageId);

    // If trying to delete primary image, prevent it
    if (imageToDelete?.isPrimary) {
      alert(
        'Cannot delete primary image. Please set another image as primary first.'
      );
      return;
    }

    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    setSavingChanges(true);
    try {
      await deleteProductImage(imageId).unwrap();
      await refreshProductData();
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Failed to delete image. Please try again.');
    } finally {
      setSavingChanges(false);
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
      const existingImagesCount = existingImages?.length || 0;

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

      await refreshProductData();
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

  return (
    <div className="space-y-6">
      {/* Existing Images */}
      {existingImages && existingImages.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Existing Images ({existingImages.length})
            </h3>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <ArrowsUpDownIcon className="h-4 w-4 mr-1" />
              <span>Drag to reorder</span>
            </div>
          </div>

          {savingChanges && (
            <div className="mb-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-lg">
              Saving changes...
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {existingImages.map((img, idx) => (
              <div
                key={img.id}
                draggable={!savingChanges}
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                className={`relative group bg-white dark:bg-gray-700 rounded-lg border-2 p-3 transition-all cursor-move ${
                  draggedIndex === idx
                    ? 'border-indigo-500 shadow-lg opacity-50'
                    : 'border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
                } ${savingChanges ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="relative">
                  <img
                    src={img.file?.secureUrl || img.file?.url}
                    alt={img.altText || `Product image ${idx + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />

                  {/* Primary Badge */}
                  {img.isPrimary ? (
                    <div className="absolute top-2 left-2 flex items-center px-2 py-1 bg-indigo-600 text-white text-xs font-medium rounded shadow-lg">
                      <StarIconSolid className="h-3 w-3 mr-1" />
                      Primary
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(img.id)}
                      disabled={savingChanges}
                      className="absolute top-2 left-2 px-2 py-1 bg-gray-800/70 hover:bg-indigo-600 text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      title="Set as primary"
                    >
                      <StarIcon className="h-3 w-3 inline mr-1" />
                      Set Primary
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteExistingImage(img.id)}
                    disabled={
                      savingChanges ||
                      img.isPrimary ||
                      existingImages.length === 1
                    }
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
                    title={
                      img.isPrimary
                        ? 'Set another image as primary first'
                        : existingImages.length === 1
                        ? 'Cannot delete last image'
                        : 'Delete image'
                    }
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Image Info */}
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  <p className="truncate">{img.altText || 'No description'}</p>
                  <p className="text-gray-400 dark:text-gray-500">
                    Order: {idx + 1}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {existingImages.length === 1 && (
            <div className="mt-3 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-sm rounded-lg">
              <span role="img" aria-label="warning">
                ⚠️
              </span>{' '}
              This is the only image. Upload more images before deleting this
              one.
            </div>
          )}

          {existingImages.some((img) => img.isPrimary) && (
            <div className="mt-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-lg">
              <span role="img" aria-label="tip">
                💡
              </span>{' '}
              To delete the primary image, first set another image as primary.
            </div>
          )}
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
          disabled={uploading || savingChanges}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Variants
        </button>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleSkip}
            disabled={uploading || savingChanges}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Skip for Now
          </button>
          <button
            type="button"
            onClick={handleSaveImages}
            disabled={uploading || savingChanges}
            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {uploading || savingChanges
              ? 'Processing...'
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
