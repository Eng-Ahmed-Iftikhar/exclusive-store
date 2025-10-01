import React from 'react';
import { useProductForm, Variant } from '@/contexts/ProductFormContext';

interface VariantCardProps {
  variant: Variant;
  onEdit: () => void;
}

const VariantCard: React.FC<VariantCardProps> = ({ variant, onEdit }) => {
  const { removeVariant, setDefaultVariant } = useProductForm();

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 hover:shadow-md transition-shadow">
      {variant.isDefault && (
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 mb-2">
          Default
        </span>
      )}
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
        {variant.name}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        SKU: {variant.sku}
      </p>

      <div className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-300">
        <div className="flex justify-between">
          <span>Price:</span>
          <span className="font-semibold">${variant.price.toFixed(2)}</span>
        </div>
        {variant.salePrice && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Sale Price:</span>
            <span className="font-semibold">
              ${variant.salePrice.toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Stock:</span>
          <span className="font-semibold">{variant.quantity} units</span>
        </div>
        <div className="flex justify-between">
          <span>Images:</span>
          <span className="font-semibold">{variant.images.length}</span>
        </div>
      </div>

      {/* Attributes */}
      {Object.keys(variant.attributes).length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-wrap gap-1">
            {Object.entries(variant.attributes).map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
              >
                {key}: {value}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex space-x-2">
        {!variant.isDefault && (
          <button
            type="button"
            onClick={() => setDefaultVariant(variant.tempId)}
            className="flex-1 text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Set Default
          </button>
        )}
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => removeVariant(variant.tempId)}
          className="flex-1 text-xs px-2 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default VariantCard;
