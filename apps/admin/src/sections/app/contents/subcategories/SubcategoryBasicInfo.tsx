import React from 'react';
import { useGetFileByIdQuery } from '@/apis/services/fileApi';
import { FileIcon } from 'lucide-react';

interface SubcategoryBasicInfoProps {
  subcategory: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    iconFileId?: string;
    isActive: boolean;
    sortOrder: number;
  };
}

const SubcategoryBasicInfo: React.FC<SubcategoryBasicInfoProps> = ({
  subcategory,
}) => {
  const {
    data: iconFile,
    isLoading: isLoadingIcon,
    isError: isIconError,
  } = useGetFileByIdQuery(subcategory.iconFileId || '', {
    skip: !subcategory.iconFileId,
  });

  return (
    <div className="space-y-6">
      {/* Header with Icon and Name */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          {subcategory.iconFileId && (
            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
              {isLoadingIcon ? (
                <div className="w-8 h-8 bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
              ) : isIconError || !iconFile ? (
                <FileIcon className="w-8 h-8 text-gray-600 dark:text-gray-300" />
              ) : (
                <img
                  src={iconFile.secureUrl || iconFile.url}
                  alt={iconFile.originalName || subcategory.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              )}
              <FileIcon className="w-8 h-8 text-gray-600 dark:text-gray-300 hidden" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {subcategory.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Slug: {subcategory.slug}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              subcategory.isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {subcategory.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Description */}
      {subcategory.description && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Description
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {subcategory.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default SubcategoryBasicInfo;
