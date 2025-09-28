import React from 'react';
import { Subcategory } from '@/apis/services/subcategoryApi';
import { useGetFileByIdQuery } from '@/apis/services/fileApi';
import { FileIcon, CalendarIcon, TagIcon } from 'lucide-react';

interface SubcategoryDetailSectionProps {
  subcategory: Subcategory;
}

const SubcategoryDetailSection: React.FC<SubcategoryDetailSectionProps> = ({
  subcategory,
}) => {
  // Fetch file data if iconFileId exists
  const {
    data: iconFile,
    isLoading: isLoadingIcon,
    isError: isIconError,
  } = useGetFileByIdQuery(subcategory.iconFileId || '', {
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
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
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
                      // Fallback to icon if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                )}
                {/* Fallback icon that shows if image fails to load */}
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

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
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

            {/* Category Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Category Information
              </h3>
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                {subcategory.category ? (
                  <div className="flex items-center space-x-3">
                    <TagIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {subcategory.category.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {subcategory.category.slug}
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Sort Order
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {subcategory.sortOrder}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Status
                  </span>
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
        </div>
      </div>
    </div>
  );
};

export default SubcategoryDetailSection;
