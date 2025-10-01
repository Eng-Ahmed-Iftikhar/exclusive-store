import React, { useState } from 'react';
import { useProductForm, Variant } from '@/contexts/ProductFormContext';
import { Squares2X2Icon } from '@heroicons/react/24/outline';
import VariantCard from '../components/VariantCard';
import VariantFormModal from '../components/VariantFormModal';

const StepVariants: React.FC = () => {
  const { formData } = useProductForm();
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [showVariantForm, setShowVariantForm] = useState(false);

  const handleCloseModal = () => {
    setShowVariantForm(false);
    setEditingVariant(null);
  };

  const handleEditVariant = (variant: Variant) => {
    setEditingVariant(variant);
    setShowVariantForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Product Variants
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Create different versions of your product (e.g., colors, sizes)
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowVariantForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          + Add Variant
        </button>
      </div>

      {/* Variants List */}
      {formData.variants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formData.variants.map((variant) => (
            <VariantCard
              key={variant.tempId}
              variant={variant}
              onEdit={() => handleEditVariant(variant)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <Squares2X2Icon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No variants yet
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating your first product variant
          </p>
          <button
            type="button"
            onClick={() => setShowVariantForm(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            + Add Variant
          </button>
        </div>
      )}

      {/* Variant Form Modal */}
      {showVariantForm && (
        <VariantFormModal variant={editingVariant} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default StepVariants;
