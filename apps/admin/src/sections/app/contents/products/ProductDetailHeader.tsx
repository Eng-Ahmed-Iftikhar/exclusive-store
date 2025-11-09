import React from 'react';
import { Button } from '@/components/ui/button';
import { PermissionGuard } from '@/components/PermissionGuard';
import { FiArrowLeft, FiEdit } from 'react-icons/fi';

interface ProductDetailHeaderProps {
  productName: string;
  onBack: () => void;
  onEdit: () => void;
}

const ProductDetailHeader: React.FC<ProductDetailHeaderProps> = ({
  productName,
  onBack,
  onEdit,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button onClick={onBack} variant="outline" size="sm">
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {productName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Product Details</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {/* Corrected action/subject to match CASL definitions */}
        <PermissionGuard action="edit" subject="product">
          <Button onClick={onEdit} variant="outline">
            <FiEdit className="w-4 h-4 mr-2" />
            Edit Product
          </Button>
        </PermissionGuard>
      </div>
    </div>
  );
};

export default ProductDetailHeader;
