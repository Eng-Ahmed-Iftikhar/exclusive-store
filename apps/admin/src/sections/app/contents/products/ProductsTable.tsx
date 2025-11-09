import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  Product,
} from '@/apis/services/productApi';
import { PermissionGuard } from '@/components/PermissionGuard';
import DataPagination from '@/components/data-pagination';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiTrash2,
  FiStar,
  FiShoppingCart,
  FiTag,
} from 'react-icons/fi';
import { formatCurrency } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

interface ProductsTableProps {
  onEdit: (product: Product) => void;
  onCreate: () => void;
  onView: (product: Product) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  onEdit,
  onCreate,
  onView,
}) => {
  const { theme } = useSelector((state: RootState) => state.ui);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [sortBy, setSortBy] = useState<
    'name' | 'price' | 'rating' | 'createdAt'
  >('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const {
    data: productsData,
    isLoading,
    error,
  } = useGetProductsQuery({
    search: searchTerm || undefined,
    isActive: includeInactive ? undefined : true,
    sortBy,
    sortOrder,
    page: currentPage,
    limit,
  });

  const [deleteProduct] = useDeleteProductMutation();

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

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId).unwrap();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleSort = (field: 'name' | 'price' | 'rating' | 'createdAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const totalProducts = productsData?.total || 0;
  const totalPages = productsData?.totalPages || 0;
  const products = productsData?.products || [];

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <DataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        totalItems={totalProducts}
        itemsPerPage={limit}
      />
    );
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (isLoading) {
    return (
      <div
        className={`rounded-xl border ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-gray-200'
        } shadow-sm`}
      >
        <div className="p-6 animate-pulse">
          <div className="space-y-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`rounded-xl border ${
          theme === 'dark'
            ? 'bg-red-900/20 border-red-700 text-red-300'
            : 'bg-red-50 border-red-200 text-red-600'
        } shadow-sm`}
      >
        <div className="p-6">
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
              <h3 className="font-medium">Failed to load products</h3>
              <p className="text-sm mt-1">
                Please try refreshing the page or contact support if the problem
                persists.
              </p>
            </div>
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
      } shadow-sm`}
    >
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Products
            </h2>
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
              Manage products and inventory
            </p>
          </div>
          <PermissionGuard action="create" subject="product">
            <button
              onClick={onCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white shadow-sm dark:shadow-slate-900/20"
            >
              <FiPlus className="w-4 h-4" />
              Create Product
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
                placeholder="Search products..."
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
                <th
                  className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                  onClick={() => handleSort('name')}
                >
                  Name {getSortIcon('name')}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  SKU
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Category
                </th>
                <th
                  className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                  onClick={() => handleSort('price')}
                >
                  Price {getSortIcon('price')}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Stock
                </th>
                <th
                  className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                  onClick={() => handleSort('rating')}
                >
                  Rating {getSortIcon('rating')}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th
                  className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                  onClick={() => handleSort('createdAt')}
                >
                  Created {getSortIcon('createdAt')}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: Product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        <FiShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </span>
                        {product.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {product.description.length > 50
                              ? `${product.description.substring(0, 50)}...`
                              : product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                      {product.sku || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {product.category && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                          <FiTag className="w-3 h-3" />
                          {product.category.name}
                        </span>
                      )}
                      {product.subcategory && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {product.subcategory.name}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      {product.prices && product.prices.length > 0 ? (
                        <div>
                          {(() => {
                            const activePrice =
                              product.prices.find((p) => p.isActive) ||
                              product.prices[0];
                            return (
                              <>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {formatCurrency(activePrice.price)}
                                </span>
                                {activePrice.salePrice &&
                                  activePrice.salePrice < activePrice.price && (
                                    <div className="text-xs text-red-600 dark:text-red-400">
                                      Sale:{' '}
                                      {formatCurrency(activePrice.salePrice)}
                                    </div>
                                  )}
                                {product.prices.length > 1 && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {product.prices.length} prices
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">
                          No price
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      {product.stock && product.stock.length > 0 ? (
                        <div>
                          {(() => {
                            const productStock = product.stock[0]; // Get the first stock entry for the product
                            return (
                              <>
                                <span
                                  className={`font-medium ${
                                    productStock.isInStock
                                      ? 'text-green-600 dark:text-green-400'
                                      : 'text-red-600 dark:text-red-400'
                                  }`}
                                >
                                  {productStock.quantity}
                                </span>
                                {productStock.reserved > 0 && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Reserved: {productStock.reserved}
                                  </div>
                                )}
                                {productStock.quantity <=
                                  productStock.minThreshold && (
                                  <div className="text-xs text-orange-600 dark:text-orange-400">
                                    Low stock
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">
                          No stock
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <FiStar
                        className={`w-4 h-4 ${
                          product.averageRating
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {product.averageRating
                          ? product.averageRating.toFixed(1)
                          : 'N/A'}
                      </span>
                      {product.totalReviews && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({product.totalReviews})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          product.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {product.isFeatured && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(product.createdAt)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <PermissionGuard action="view" subject="product">
                        <button
                          onClick={() => onView(product)}
                          className="p-2 rounded-lg transition-colors text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                      </PermissionGuard>
                      <PermissionGuard action="edit" subject="product">
                        <button
                          onClick={() => onEdit(product)}
                          className="p-2 rounded-lg transition-colors text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
                          title="Edit Product"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                      </PermissionGuard>
                      <PermissionGuard action="delete" subject="product">
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-lg transition-colors text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                          title="Delete Product"
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

export default ProductsTable;
