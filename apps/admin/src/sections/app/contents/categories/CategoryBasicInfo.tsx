import React from 'react';

interface CategoryBasicInfoProps {
  category: {
    name: string;
    slug: string;
    description?: string;
    isActive: boolean;
    sortOrder: number;
  };
}

const CategoryBasicInfo: React.FC<CategoryBasicInfoProps> = ({ category }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Basic Information
      </h3>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <p className="text-gray-900 dark:text-white font-medium">
            {category.name}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Slug
          </label>
          <p className="text-gray-900 dark:text-white font-mono text-sm">
            {category.slug}
          </p>
        </div>

        {category.description && (
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <p className="text-gray-900 dark:text-white">
              {category.description}
            </p>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              category.isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}
          >
            {category.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort Order
          </label>
          <p className="text-gray-900 dark:text-white">{category.sortOrder}</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryBasicInfo;
