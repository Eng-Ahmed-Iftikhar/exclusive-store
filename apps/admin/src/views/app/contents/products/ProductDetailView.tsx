import {
  useGetProductByIdQuery,
  ProductVariant,
} from '@/apis/services/productApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Button } from '@/components/ui/button';
import ProductBasicInfo from '@/sections/app/contents/products/ProductBasicInfo';
import ProductDetailHeader from '@/sections/app/contents/products/ProductDetailHeader';
import ProductNotFound from '@/sections/app/contents/products/ProductNotFound';
import ProductReviewsList from '@/sections/app/contents/products/ProductReviewsList';
import React from 'react';
import { FiPackage, FiDollarSign, FiImage, FiStar } from 'react-icons/fi';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useNavigate, useParams } from 'react-router-dom';

const ProductDetailView: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useGetProductByIdQuery(productId || '', {
    skip: !productId,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const handleEdit = () => {
    navigate(`/content/products/${productId}/edit/basic-info`);
  };

  const handleBack = () => {
    navigate('/content/products');
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

        {/* Product Basic Information */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="p-6">
            <ProductBasicInfo product={product} />
          </div>
        </div>

        {/* Product Variants */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Product Variants
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {product.variants?.length || 0} variant(s) available
                </p>
              </div>
            </div>

            {product.variants && product.variants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.variants.map((variant: ProductVariant) => (
                  <div
                    key={variant.id}
                    className="border border-gray-200 dark:border-slate-600 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {variant.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          SKU: {variant.sku}
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              variant.isActive
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                            }`}
                          >
                            {variant.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {variant.isDefault && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                              Default
                            </span>
                          )}
                        </div>

                        {/* Pricing Info */}
                        {variant.prices && variant.prices.length > 0 && (
                          <div className="flex items-center gap-2 mb-2">
                            <FiDollarSign className="w-4 h-4 text-gray-500" />
                            <div>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                ${variant.prices[0].price}
                              </span>
                              {variant.prices[0].salePrice && (
                                <span className="ml-2 text-sm text-red-600 dark:text-red-400">
                                  Sale: ${variant.prices[0].salePrice}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Stock Info */}
                        {variant.stock && (
                          <div className="flex items-center gap-2 mb-3">
                            <FiPackage className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Stock: {variant.stock.quantity} units
                              {variant.stock.quantity <=
                                variant.stock.minThreshold && (
                                <span className="ml-2 text-red-600 dark:text-red-400">
                                  (Low Stock)
                                </span>
                              )}
                            </span>
                          </div>
                        )}

                        {/* Variant Images */}
                        {variant.images && variant.images.length > 0 && (
                          <div className="border-t border-gray-200 dark:border-slate-600 pt-3 mt-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                              <FiImage className="w-3 h-3" />
                              Images ({variant.images.length})
                            </p>
                            <div className="flex gap-2 overflow-x-auto">
                              {variant.images.slice(0, 4).map((img) => (
                                <div
                                  key={img.id}
                                  className="relative flex-shrink-0"
                                >
                                  <img
                                    src={img.file?.secureUrl || img.file?.url}
                                    alt={img.altText || 'Variant image'}
                                    className="w-16 h-16 object-cover rounded border border-gray-200 dark:border-gray-600"
                                  />
                                  {img.isPrimary && (
                                    <div className="absolute -top-1 -right-1 bg-indigo-600 rounded-full p-0.5">
                                      <StarIconSolid className="h-3 w-3 text-white" />
                                    </div>
                                  )}
                                </div>
                              ))}
                              {variant.images.length > 4 && (
                                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-xs text-gray-500">
                                  +{variant.images.length - 4}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiPackage className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Variants
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This product doesn't have any variants yet.
                </p>
                <PermissionGuard action="create" subject="products">
                  <Button onClick={handleEdit} variant="outline">
                    Add Variants
                  </Button>
                </PermissionGuard>
              </div>
            )}
          </div>
        </div>

        {/* Product Images (Product-level) */}
        {product.images && product.images.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Product Images
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {product.images.length} image(s)
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {product.images.map((image) => (
                  <div
                    key={image.id}
                    className="relative group border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <img
                      src={image.file?.secureUrl || image.file?.url}
                      alt={image.altText || 'Product image'}
                      className="w-full h-32 object-cover"
                    />
                    {image.isPrimary && (
                      <div className="absolute top-2 left-2 bg-indigo-600 text-white px-2 py-1 text-xs font-medium rounded flex items-center gap-1">
                        <FiStar className="w-3 h-3" />
                        Primary
                      </div>
                    )}
                    {image.altText && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {image.altText}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Product Reviews */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Customer Reviews
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {product.totalReviews || 0} review(s)
                </p>
              </div>

              <ProductReviewsList product={product} />
            </div>
          </div>
        )}
      </div>
    </PermissionGuard>
  );
};

export default ProductDetailView;
