import React from 'react';
import { TagIcon } from 'lucide-react';

interface SubcategoryCategoryInfoProps {
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

const SubcategoryCategoryInfo: React.FC<SubcategoryCategoryInfoProps> = ({
  category,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Category Information
      </h3>
      <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
        {category ? (
          <div className="flex items-center space-x-3">
            <TagIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {category.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {category.slug}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">
            No category assigned
          </p>
        )}
      </div>
    </div>
  );
};

export default SubcategoryCategoryInfo;
