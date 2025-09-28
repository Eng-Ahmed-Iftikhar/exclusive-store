import React from 'react';
import { Button } from '@/components/ui/button';
import { FiArrowLeft } from 'react-icons/fi';

interface ProductNotFoundProps {
  onBack: () => void;
}

const ProductNotFound: React.FC<ProductNotFoundProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Product Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          The product you're looking for doesn't exist or has been deleted.
        </p>
      </div>
      <Button onClick={onBack} variant="outline">
        <FiArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>
    </div>
  );
};

export default ProductNotFound;
