import React from 'react';
import { Outlet } from 'react-router-dom';
import { ProductCreationProvider } from '@/contexts/ProductCreationContext';
import AdminLayout from './app/Layout';

/**
 * Layout wrapper that provides ProductCreationContext only for product creation pages
 * This prevents unnecessary context overhead on other pages
 */
const ProductCreationLayout: React.FC = () => {
  return (
    <AdminLayout>
      <ProductCreationProvider>
        <Outlet />
      </ProductCreationProvider>
    </AdminLayout>
  );
};

export default ProductCreationLayout;
