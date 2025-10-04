import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery } from '@/apis/services/productApi';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FiPlus, FiEdit, FiArrowLeft } from 'react-icons/fi';
import ProductDetailHeader from '@/sections/app/contents/products/ProductDetailHeader';
import ProductBasicInfo from '@/sections/app/contents/products/ProductBasicInfo';
import ProductPricingInfo from '@/sections/app/contents/products/ProductPricingInfo';
import ProductStockInfo from '@/sections/app/contents/products/ProductStockInfo';
import ProductImagesList from '@/sections/app/contents/products/ProductImagesList';
import ProductReviewsList from '@/sections/app/contents/products/ProductReviewsList';
import ProductNotFound from '@/sections/app/contents/products/ProductNotFound';

const ProductDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useGetProductByIdQuery(id || '', {
    skip: !id,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const handleEdit = () => {
    navigate(`/content/products/${id}/edit`);
  };

  const handleBack = () => {
    navigate('/content/products');
  };

  const handleCreatePrice = () => {
    navigate(`/content/products/${id}/prices/create`);
  };

  const handleCreateStock = () => {
    navigate(`/content/products/${id}/stock/create`);
  };

  const handleCreateImage = () => {
    navigate(`/content/products/${id}/images/create`);
  };

  if (productLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" color="primary" />
      </div>
    );
  }

  if (productError || !product) {
    return <ProductNotFound onBack={handleBack} />;
  }

  return (
    <PermissionGuard action="view" subject="products">
      <div className="space-y-6">
        <ProductDetailHeader
          productName={product.name}
          onBack={handleBack}
          onEdit={handleEdit}
        />

        {/* Product Information */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProductBasicInfo product={product} />
              <ProductPricingInfo
                item={product}
                onCreatePrice={handleCreatePrice}
              />
            </div>
          </div>
        </div>

        {/* Stock Information */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Stock Information
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage inventory levels and thresholds
                </p>
              </div>
              <PermissionGuard action="create" subject="products">
                <Button onClick={handleCreateStock}>
                  <FiPlus className="w-4 h-4 mr-2" />
                  Add Stock
                </Button>
              </PermissionGuard>
            </div>

            <ProductStockInfo
              product={product}
              onCreateStock={handleCreateStock}
            />
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Product Images
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage product images and galleries
                </p>
              </div>
              <PermissionGuard action="create" subject="products">
                <Button onClick={handleCreateImage}>
                  <FiPlus className="w-4 h-4 mr-2" />
                  Add Image
                </Button>
              </PermissionGuard>
            </div>

            <ProductImagesList
              product={product}
              onCreateImage={handleCreateImage}
            />
          </div>
        </div>

        {/* Product Reviews */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Product Reviews
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customer reviews and ratings
                </p>
              </div>
            </div>

            <ProductReviewsList product={product} />
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
};

export default ProductDetailView;
