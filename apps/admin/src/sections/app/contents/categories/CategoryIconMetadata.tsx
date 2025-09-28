import React from 'react';
import { FiTag } from 'react-icons/fi';

interface CategoryIconMetadataProps {
  category: {
    createdAt: string;
    updatedAt: string;
  };
  iconFile?: {
    secureUrl: string;
    originalName: string;
    format: string;
    bytes: number;
  };
}

const CategoryIconMetadata: React.FC<CategoryIconMetadataProps> = ({
  category,
  iconFile,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Icon & Metadata
      </h3>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Icon
          </label>
          <div className="mt-2">
            {iconFile ? (
              <div className="flex items-center space-x-3">
                <img
                  src={iconFile.secureUrl}
                  alt={iconFile.originalName}
                  className="w-12 h-12 object-cover rounded-lg border border-gray-200 dark:border-slate-600"
                />
                <div>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    {iconFile.originalName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {iconFile.format} • {(iconFile.bytes / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center border border-gray-200 dark:border-slate-600">
                <FiTag className="w-6 h-6 text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Created At
          </label>
          <p className="text-gray-900 dark:text-white text-sm">
            {formatDate(category.createdAt)}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Updated At
          </label>
          <p className="text-gray-900 dark:text-white text-sm">
            {formatDate(category.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryIconMetadata;
