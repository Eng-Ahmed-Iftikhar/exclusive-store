import React from 'react';
import { useProductForm } from '@/contexts/ProductFormContext';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

const StepImages: React.FC = () => {
  const {
    formData,
    addProductImage,
    removeProductImage,
    updateProductImageAltText,
  } = useProductForm();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        addProductImage({
          file,
          preview: URL.createObjectURL(file),
          altText: file.name,
        });
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Product-Level Images
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Upload images that represent the overall product (optional if you've
          added variant images)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Upload Images
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
          <div className="space-y-1 text-center">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600 dark:text-gray-400">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span>Upload files</span>
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
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>
      </div>

      {formData.productImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {formData.productImages.map((img, idx) => (
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
                  onClick={() => removeProductImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
                {idx === 0 && (
                  <span className="absolute top-1 left-1 px-2 py-0.5 bg-indigo-500 text-white text-xs font-medium rounded shadow-sm">
                    Primary
                  </span>
                )}
              </div>
              <input
                type="text"
                value={img.altText}
                onChange={(e) => updateProductImageAltText(idx, e.target.value)}
                placeholder="Alt text"
                className="mt-2 w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>
      )}

      {formData.productImages.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No product images
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload product-level images or skip if you've added variant images
          </p>
        </div>
      )}
    </div>
  );
};

export default StepImages;
