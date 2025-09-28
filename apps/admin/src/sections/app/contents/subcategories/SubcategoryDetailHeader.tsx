import React from 'react';
import { Button } from '@/components/ui/button';
import { PermissionGuard } from '@/components/PermissionGuard';
import { ArrowLeftIcon, EditIcon } from 'lucide-react';

interface SubcategoryDetailHeaderProps {
  subcategoryName: string;
  onBack: () => void;
  onEdit: () => void;
}

const SubcategoryDetailHeader: React.FC<SubcategoryDetailHeaderProps> = ({
  subcategoryName,
  onBack,
  onEdit,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {subcategoryName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Subcategory Details
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <PermissionGuard action="edit" subject="subcategories">
          <Button onClick={onEdit} className="flex items-center space-x-2">
            <EditIcon className="w-4 h-4" />
            <span>Edit</span>
          </Button>
        </PermissionGuard>
      </div>
    </div>
  );
};

export default SubcategoryDetailHeader;
