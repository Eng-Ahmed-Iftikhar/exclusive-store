import { Product } from '@/apis/services/productApi';
import { PermissionGuard } from '@/components/PermissionGuard';
import ProductsTable from '@/sections/app/contents/products/ProductsTable';
import React from 'react';

const ProductView: React.FC = () => {
  const handleView = (product: Product) => {
    // Navigate to product detail page
    window.location.href = `/content/products/${product.id}`;
  };
  const handleEdit = (product: Product) => {
    // Navigate to product edit page
    window.location.href = `/content/products/${product.id}/edit`;
  };
  const handleCreate = () => {
    // Navigate to product create page
    window.location.href = `/content/products/create`;
  };

  return (
    <PermissionGuard action="view" subject="product">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Products
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your product catalog and inventory
            </p>
          </div>
        </div>

        <ProductsTable
          onEdit={handleEdit}
          onCreate={handleCreate}
          onView={handleView}
        />
      </div>
    </PermissionGuard>
  );
};

export default ProductView;
