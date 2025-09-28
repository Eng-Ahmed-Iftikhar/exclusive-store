import React from 'react';
import { Product } from '@/apis/services/productApi';
import { Button } from '@/components/ui/button';
import { PermissionGuard } from '@/components/PermissionGuard';
import { FiPlus, FiImage, FiStar } from 'react-icons/fi';

interface ProductImagesListProps {
  product: Product;
  onCreateImage: () => void;
}

const ProductImagesList: React.FC<ProductImagesListProps> = ({
  product,
  onCreateImage,
}) => {
  return (
    <div className="space-y-4">
      {product.images && product.images.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {product.images.map((image) => (
            <div
              key={image.id}
              className="border border-gray-200 dark:border-slate-600 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="w-full h-32 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mb-3">
                    <FiImage className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {image.isPrimary && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          <FiStar className="w-3 h-3" />
                          Primary
                        </span>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Order: {image.sortOrder}
                      </span>
                    </div>
                    {image.altText && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {image.altText}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FiImage className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Images
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This product doesn't have any images yet.
          </p>
          <PermissionGuard action="create" subject="products">
            <Button onClick={onCreateImage} variant="outline">
              <FiPlus className="w-4 h-4 mr-2" />
              Add First Image
            </Button>
          </PermissionGuard>
        </div>
      )}
    </div>
  );
};

export default ProductImagesList;
