import React from 'react';
import { Product } from '@/apis/services/productApi';
import { FiStar, FiUser, FiMessageSquare } from 'react-icons/fi';

interface ProductReviewsListProps {
  product: Product;
}

const ProductReviewsList: React.FC<ProductReviewsListProps> = ({ product }) => {
  return (
    <div className="space-y-4">
      {/* Rating Summary */}
      <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <FiStar className="w-5 h-5 text-yellow-400" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {product.averageRating
                  ? product.averageRating.toFixed(1)
                  : 'N/A'}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              ({product.totalReviews || 0} reviews)
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {product.reviews && product.reviews.length > 0 ? (
        <div className="space-y-4">
          {product.reviews.slice(0, 5).map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 dark:border-slate-600 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {review.user?.name || 'Anonymous'}
                    </p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    review.isApproved
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}
                >
                  {review.isApproved ? 'Approved' : 'Pending'}
                </span>
              </div>
              {review.title && (
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {review.title}
                </h4>
              )}
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {review.content}
              </p>
            </div>
          ))}
          {product.reviews.length > 5 && (
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing 5 of {product.reviews.length} reviews
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <FiMessageSquare className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Reviews Yet
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            This product doesn't have any reviews yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductReviewsList;
