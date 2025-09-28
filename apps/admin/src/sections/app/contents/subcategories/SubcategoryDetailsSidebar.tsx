import React from 'react';
import { useGetFileByIdQuery } from '@/apis/services/fileApi';
import { CalendarIcon } from 'lucide-react';

interface SubcategoryDetailsSidebarProps {
  subcategory: {
    id: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    iconFileId?: string;
  };
}

const SubcategoryDetailsSidebar: React.FC<SubcategoryDetailsSidebarProps> = ({
  subcategory,
}) => {
  const { data: iconFile } = useGetFileByIdQuery(subcategory.iconFileId || '', {
    skip: !subcategory.iconFileId,
  });

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
    <div className="space-y-6">
      {/* Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Details
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Sort Order</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {subcategory.sortOrder}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Status</span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                subcategory.isActive
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {subcategory.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Timestamps */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Timestamps
        </h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <CalendarIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Created
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {formatDate(subcategory.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CalendarIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Updated
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {formatDate(subcategory.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ID Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          ID Information
        </h3>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Subcategory ID
            </p>
            <p className="text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
              {subcategory.id}
            </p>
          </div>
          {subcategory.iconFileId && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Icon File ID
              </p>
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
                {subcategory.iconFileId}
              </p>
              {iconFile && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      File Name:
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {iconFile.originalName}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      Size:
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {(iconFile.bytes / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  {iconFile.width && iconFile.height && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        Dimensions:
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {iconFile.width} × {iconFile.height}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubcategoryDetailsSidebar;
