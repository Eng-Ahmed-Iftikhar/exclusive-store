import React from 'react';
import { Button } from '@/components/ui/button';
import { PermissionGuard } from '@/components/PermissionGuard';
import { FiArrowLeft, FiEdit } from 'react-icons/fi';

interface CategoryDetailHeaderProps {
  categoryName: string;
  onBack: () => void;
  onEdit: () => void;
}

const CategoryDetailHeader: React.FC<CategoryDetailHeaderProps> = ({
  categoryName,
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
            {categoryName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Category Details</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <PermissionGuard action="edit" subject="category">
          <Button onClick={onEdit} variant="outline">
            <FiEdit className="w-4 h-4 mr-2" />
            Edit Category
          </Button>
        </PermissionGuard>
      </div>
    </div>
  );
};

export default CategoryDetailHeader;
