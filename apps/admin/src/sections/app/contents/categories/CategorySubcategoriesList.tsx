import React from 'react';
import { Button } from '@/components/ui/button';
import { PermissionGuard } from '@/components/PermissionGuard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FiPlus, FiEye, FiEdit, FiTag } from 'react-icons/fi';

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
}

interface CategorySubcategoriesListProps {
  subcategories: Subcategory[] | undefined;
  isLoading: boolean;
  error: any;
  onCreateSubcategory: () => void;
  onViewSubcategory: (id: string) => void;
  onEditSubcategory: (id: string) => void;
}

const CategorySubcategoriesList: React.FC<CategorySubcategoriesListProps> = ({
  subcategories,
  isLoading,
  error,
  onCreateSubcategory,
  onViewSubcategory,
  onEditSubcategory,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="md" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">
          Failed to load subcategories
        </p>
      </div>
    );
  }

  if (subcategories && subcategories.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subcategories.map((subcategory) => (
          <div
            key={subcategory.id}
            className="border border-gray-200 dark:border-slate-600 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {subcategory.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {subcategory.slug}
                </p>
                {subcategory.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {subcategory.description}
                  </p>
                )}
                <div className="flex items-center space-x-2 mt-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      subcategory.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}
                  >
                    {subcategory.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Order: {subcategory.sortOrder}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1 ml-2">
                <PermissionGuard action="view" subject="subcategories">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onViewSubcategory(subcategory.id)}
                  >
                    <FiEye className="w-4 h-4" />
                  </Button>
                </PermissionGuard>
                <PermissionGuard action="edit" subject="subcategories">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEditSubcategory(subcategory.id)}
                  >
                    <FiEdit className="w-4 h-4" />
                  </Button>
                </PermissionGuard>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <FiTag className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No Subcategories
      </h4>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        This category doesn't have any subcategories yet.
      </p>
      <PermissionGuard action="create" subject="subcategories">
        <Button onClick={onCreateSubcategory} variant="outline">
          <FiPlus className="w-4 h-4 mr-2" />
          Create First Subcategory
        </Button>
      </PermissionGuard>
    </div>
  );
};

export default CategorySubcategoriesList;
