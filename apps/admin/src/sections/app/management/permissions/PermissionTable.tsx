import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  useGetPermissionsQuery,
  useDeletePermissionMutation,
  Permission,
} from '@/apis/services/permissionApi';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import DataPagination from '@/components/data-pagination';
import { PermissionGuard } from '@/components/PermissionGuard';
import { PERMISSIONS } from '@/lib/abilities';

interface PermissionTableProps {
  onEdit: (permission: Permission) => void;
  onCreate: () => void;
}

const PermissionTable: React.FC<PermissionTableProps> = ({
  onEdit,
  onCreate,
}) => {
  const { theme } = useSelector((state: RootState) => state.ui);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(10);

  const queryParams = {
    page: currentPage,
    limit,
    search: searchTerm,
  };

  const {
    data: permissionsData,
    isLoading,
    error,
    refetch,
  } = useGetPermissionsQuery(queryParams, {
    // Ensure the query refetches when parameters change
    refetchOnMountOrArgChange: true,
    // Skip the query if we don't have valid parameters
    skip: false,
  });

  const [deletePermission] = useDeletePermissionMutation();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this permission?')) {
      try {
        await deletePermission(id).unwrap();

        refetch();
      } catch (error) {
        console.error('Failed to delete permission:', error);
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
    console.log('Changing limit from', limit, 'to', newLimit);
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  const renderPagination = () => {
    if (!permissionsData) return null;

    const { totalPages, page, total } = permissionsData;

    return (
      <DataPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        totalItems={total}
        itemsPerPage={limit}
      />
    );
  };

  if (isLoading) {
    return (
      <div
        className={`p-6 rounded-xl border ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-gray-200'
        }`}
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
        className={`p-6 rounded-xl border ${
          theme === 'dark'
            ? 'bg-red-900/20 border-red-700 text-red-300'
            : 'bg-red-50 border-red-200 text-red-600'
        }`}
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
            <h3 className="font-medium">Failed to load permissions</h3>
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
    <div
      className={`rounded-xl border ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2
              className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Permissions
            </h2>
            <p
              className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Manage system permissions and access controls
            </p>
          </div>
          <PermissionGuard action="create" subject="permission">
            <button
              onClick={onCreate}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
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
              <FiSearch
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}
              />
              <input
                type="text"
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
          </form>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            } transition-colors`}
          >
            <FiFilter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="px-6 pb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`border-b ${
                  theme === 'dark' ? 'border-slate-600' : 'border-gray-200'
                }`}
              >
                <th
                  className={`text-left py-3 px-4 font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Name
                </th>
                <th
                  className={`text-left py-3 px-4 font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Display Name
                </th>
                <th
                  className={`text-left py-3 px-4 font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Description
                </th>
                <th
                  className={`text-left py-3 px-4 font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Status
                </th>
                <th
                  className={`text-left py-3 px-4 font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {permissionsData?.permissions.map((permission: Permission) => (
                <tr
                  key={permission.id}
                  className={`border-b ${
                    theme === 'dark'
                      ? 'border-slate-700 hover:bg-slate-700/50'
                      : 'border-gray-100 hover:bg-gray-50'
                  } transition-colors`}
                >
                  <td className="py-3 px-4">
                    <span
                      className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {permission.name}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {permission.displayName}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {permission.description || 'No description'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        permission.isActive
                          ? theme === 'dark'
                            ? 'bg-green-900/30 text-green-300'
                            : 'bg-green-100 text-green-800'
                          : theme === 'dark'
                          ? 'bg-red-900/30 text-red-300'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {permission.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <PermissionGuard action="edit" subject="permission">
                        <button
                          onClick={() => onEdit(permission)}
                          className={`p-2 rounded-lg transition-colors ${
                            theme === 'dark'
                              ? 'text-blue-400 hover:bg-blue-900/30'
                              : 'text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                      </PermissionGuard>
                      <PermissionGuard action="delete" subject="permission">
                        <button
                          onClick={() => handleDelete(permission.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            theme === 'dark'
                              ? 'text-red-400 hover:bg-red-900/30'
                              : 'text-red-600 hover:bg-red-50'
                          }`}
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

export default PermissionTable;
