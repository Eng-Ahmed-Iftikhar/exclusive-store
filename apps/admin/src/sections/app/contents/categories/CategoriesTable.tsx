import React, { useState } from 'react';
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
  Category,
} from '@/apis/services/categoryApi';
import { useGetFileByIdQuery } from '@/apis/services/fileApi';
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiFilter,
  FiEye,
} from 'react-icons/fi';
import DataPagination from '@/components/data-pagination';
import { PermissionGuard } from '@/components/PermissionGuard';

interface CategoriesTableProps {
  onEdit: (category: Category) => void;
  onCreate: () => void;
  onView: (category: Category) => void;
}

// Component to display category icon
const CategoryIcon: React.FC<{ iconFileId: string }> = ({ iconFileId }) => {
  const { data: iconFile, isLoading } = useGetFileByIdQuery(iconFileId, {
    skip: !iconFileId,
  });

  if (isLoading) {
    return (
      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!iconFile) {
    return (
      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center">
        <span className="text-xs text-gray-400">?</span>
      </div>
    );
  }

  return (
    <img
      src={iconFile.secureUrl}
      alt={iconFile.originalName}
      className="w-8 h-8 object-cover rounded-lg"
    />
  );
};

const CategoriesTable: React.FC<CategoriesTableProps> = ({
  onEdit,
  onCreate,
  onView,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(10);
  const [includeInactive, setIncludeInactive] = useState(false);

  const queryParams = {
    includeInactive,
  };

  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useGetCategoriesQuery(queryParams, {
    refetchOnMountOrArgChange: true,
    skip: false,
  });

  const [deleteCategory] = useDeleteCategoryMutation();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id).unwrap();
        refetch();
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  // Filter categories based on search term
  const filteredCategories =
    categories?.filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description &&
          category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];

  // Paginate filtered results
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredCategories.length / limit);

  const renderPagination = () => {
    if (filteredCategories.length === 0) return null;

    return (
      <DataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        totalItems={filteredCategories.length}
        itemsPerPage={limit}
      />
    );
  };

  if (isLoading) {
    return (
      <div
        className={`p-6 rounded-xl border bg-white border-gray-200 dark:bg-slate-800 dark:border-slate-700`}
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="h-12 bg-gray-300 dark:bg-gray-600 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`p-6 rounded-xl border bg-red-900/20 border-red-700 text-red-300`}
      >
        <div className="flex items-center gap-3">
          <div className="text-red-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-medium">Failed to load categories</h3>
            <p className="text-sm mt-1">
              Please try refreshing the page or contact support if the problem
              persists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/20">
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Categories
            </h2>
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
              Manage categories and subcategories
            </p>
          </div>
          <PermissionGuard action="create" subject="category">
            <button
              onClick={onCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white shadow-sm dark:shadow-slate-900/20"
            >
              <FiPlus className="w-4 h-4" />
              Create
            </button>
          </PermissionGuard>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
            </div>
          </form>
          <div className="flex gap-2">
            <button
              onClick={() => setIncludeInactive(!includeInactive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                includeInactive
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600'
              }`}
            >
              <FiFilter className="w-4 h-4" />
              {includeInactive ? 'Hide Inactive' : 'Show Inactive'}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-6 pb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-600">
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Slug
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Subcategories
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Sort Order
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.map((category: Category) => (
                <tr className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {category.iconFileId && (
                        <CategoryIcon iconFileId={category.iconFileId} />
                      )}
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </span>
                        {category.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                      {category.slug}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {category.subcategoryCount} subcategor
                      {category.subcategoryCount === 1 ? 'y' : 'ies'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        category.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}
                    >
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {category.sortOrder}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <PermissionGuard action="view" subject="category">
                        <button
                          onClick={() => onView(category)}
                          className="p-2 rounded-lg transition-colors text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30"
                          title="View"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                      </PermissionGuard>
                      <PermissionGuard action="edit" subject="category">
                        <button
                          onClick={() => onEdit(category)}
                          className="p-2 rounded-lg transition-colors text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
                          title="Edit"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                      </PermissionGuard>
                      <PermissionGuard action="delete" subject="category">
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-2 rounded-lg transition-colors text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </PermissionGuard>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-6 pb-6">{renderPagination()}</div>
    </div>
  );
};

export default CategoriesTable;
