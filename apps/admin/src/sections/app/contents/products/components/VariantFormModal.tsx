import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface VariantData {
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

interface VariantFormModalProps {
  variant: VariantData | null;
  onSave: (variant: VariantData) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

const VariantFormModal: React.FC<VariantFormModalProps> = ({
  variant,
  onSave,
  onClose,
  isSubmitting,
}) => {
  const [formState, setFormState] = useState<VariantData>(
    variant || {
      sku: '',
      name: '',
      attributes: {},
      price: 0,
      salePrice: undefined,
      quantity: 0,
      minThreshold: 5,
      images: [],
      isDefault: false,
    }
  );

  const [attributeKey, setAttributeKey] = useState('');
  const [attributeValue, setAttributeValue] = useState('');

  const handleAddAttribute = () => {
    if (attributeKey && attributeValue) {
      setFormState({
        ...formState,
        attributes: { ...formState.attributes, [attributeKey]: attributeValue },
      });
      setAttributeKey('');
      setAttributeValue('');
    }
  };

  const handleRemoveAttribute = (key: string) => {
    const newAttributes = { ...formState.attributes };
    delete newAttributes[key];
    setFormState({ ...formState, attributes: newAttributes });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        altText: file.name,
      }));
      setFormState({
        ...formState,
        images: [...formState.images, ...newImages],
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormState({
      ...formState,
      images: formState.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    if (!formState.sku || !formState.name || formState.price <= 0) {
      alert('Please fill in SKU, Name, and Price (must be greater than 0)');
      return;
    }

    await onSave(formState);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-opacity-90"
          onClick={onClose}
        />

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {variant ? 'Edit Variant' : 'Add New Variant'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6">
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Variant Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    placeholder="e.g., Red - Large"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formState.sku}
                    onChange={(e) =>
                      setFormState({ ...formState, sku: e.target.value })
                    }
                    placeholder="e.g., TSHIRT-001-RED-L"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Attributes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Attributes (Color, Size, Material, etc.)
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={attributeKey}
                    onChange={(e) => setAttributeKey(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === 'Enter' && handleAddAttribute()
                    }
                    placeholder="Key (e.g., color)"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={attributeValue}
                    onChange={(e) => setAttributeValue(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === 'Enter' && handleAddAttribute()
                    }
                    placeholder="Value (e.g., Red)"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddAttribute}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(formState.attributes).map(([key, value]) => (
                    <span
                      key={key}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
                    >
                      {key}: {value}
                      <button
                        type="button"
                        onClick={() => handleRemoveAttribute(key)}
                        className="ml-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">
                      $
                    </span>
                    <input
                      type="number"
                      value={formState.price}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      min="0"
                      step="0.01"
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sale Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">
                      $
                    </span>
                    <input
                      type="number"
                      value={formState.salePrice || ''}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          salePrice: e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        })
                      }
                      min="0"
                      step="0.01"
                      placeholder="Optional"
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formState.quantity}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={formState.minThreshold}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        minThreshold: parseInt(e.target.value) || 5,
                      })
                    }
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Alert when stock falls below this number
                  </p>
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Variant Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-400"
                />

                {formState.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {formState.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img.preview}
                          alt={img.altText}
                          className="w-full h-20 object-cover rounded border dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-indigo-500 text-white text-[10px] font-medium rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : variant ? 'Update Variant' : 'Add Variant'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantFormModal;
