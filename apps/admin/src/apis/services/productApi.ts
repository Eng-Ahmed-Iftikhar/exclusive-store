import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';

// ===== TYPES =====

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  attributes?: Record<string, any>;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  prices?: Price[];
  stock?: Stock;
  images?: ProductImage[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  categoryId?: string;
  subcategoryId?: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  subcategory?: {
    id: string;
    name: string;
    slug: string;
  };
  variants?: ProductVariant[];
  images?: ProductImage[];
  reviews?: Review[];
  ratings?: Rating[];
  favorites?: Favorite[];
  averageRating?: number;
  totalReviews?: number;
  totalVariants?: number;
}

export interface Price {
  id: string;
  variantId: string;
  price: number;
  salePrice?: number;
  currency: string;
  isActive: boolean;
  validFrom: Date;
  validTo?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stock {
  id: string;
  variantId: string;
  quantity: number;
  reserved: number;
  minThreshold: number;
  maxThreshold?: number;
  isInStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: string;
  productId?: string;
  variantId?: string;
  fileId: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  file?: {
    id: string;
    url: string;
    secureUrl: string;
    originalName: string;
  };
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  title?: string;
  content: string;
  rating: number;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Rating {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Favorite {
  id: string;
  productId: string;
  userId: string;
  createdAt: Date;
  product?: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface CreateProductDto {
  name: string;
  description?: string;
  sku?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
  categoryId?: string;
  subcategoryId?: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  sku?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
  categoryId?: string;
  subcategoryId?: string;
}

export interface ProductQueryDto {
  search?: string;
  categoryId?: string;
  category?: string;
  subcategoryId?: string;
  subcategory?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ===== API ENDPOINTS =====

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    // Get all products with pagination and filters
    getProducts: builder.query<ProductListResponse, ProductQueryDto>({
      query: (params) => ({
        url: '/products',
        method: 'GET',
        params,
      }),
      providesTags: ['Product'],
    }),

    // Get product by ID
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    // Get featured products
    getFeaturedProducts: builder.query<Product[], void>({
      query: () => '/products/featured',
      providesTags: ['Product'],
    }),

    // Get best selling products
    getBestSellingProducts: builder.query<Product[], void>({
      query: () => '/products/best-selling',
      providesTags: ['Product'],
    }),

    // Get product images by product ID
    getImagesByProduct: builder.query<ProductImage[], string>({
      query: (productId) => `/products/${productId}/images`,
      providesTags: (result, error, productId) => [
        { type: 'Product', id: productId },
      ],
    }),

    // Get top rated products
    getTopRatedProducts: builder.query<
      Product[],
      { minRating?: number; limit?: number }
    >({
      query: (params) => ({
        url: '/products/top-rated',
        method: 'GET',
        params,
      }),
      providesTags: ['Product'],
    }),

    // Get new arrival products
    getNewArrivalProducts: builder.query<Product[], { limit?: number }>({
      query: (params) => ({
        url: '/products/new-arrivals',
        method: 'GET',
        params,
      }),
      providesTags: ['Product'],
    }),

    // Get products by category
    getProductsByCategory: builder.query<
      ProductListResponse,
      { categoryId: string; query?: Omit<ProductQueryDto, 'categoryId'> }
    >({
      query: ({ categoryId, query }) => ({
        url: `/products/category/${categoryId}`,
        method: 'GET',
        params: query,
      }),
      providesTags: ['Product'],
    }),

    // Get products by subcategory
    getProductsBySubcategory: builder.query<
      ProductListResponse,
      { subcategoryId: string; query?: Omit<ProductQueryDto, 'subcategoryId'> }
    >({
      query: ({ subcategoryId, query }) => ({
        url: `/products/subcategory/${subcategoryId}`,
        method: 'GET',
        params: query,
      }),
      providesTags: ['Product'],
    }),

    // Search products
    searchProducts: builder.query<ProductListResponse, ProductQueryDto>({
      query: (params) => ({
        url: '/products/search',
        method: 'GET',
        params,
      }),
      providesTags: ['Product'],
    }),

    // Create product
    createProduct: builder.mutation<Product, CreateProductDto>({
      query: (data) => ({
        url: '/products',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    // Update product
    updateProduct: builder.mutation<
      Product,
      { id: string; data: UpdateProductDto }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        'Product',
      ],
    }),

    // Delete product
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    // Variant endpoints
    createVariant: builder.mutation<
      ProductVariant,
      {
        productId: string;
        sku: string;
        name: string;
        attributes?: Record<string, any>;
        isDefault?: boolean;
        isActive?: boolean;
        sortOrder?: number;
      }
    >({
      query: (data) => ({
        url: '/products/variants',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    getVariantsByProduct: builder.query<ProductVariant[], string>({
      query: (productId) => `/products/${productId}/variants`,
      providesTags: ['Product'],
    }),

    updateVariant: builder.mutation<
      ProductVariant,
      {
        id: string;
        sku?: string;
        name?: string;
        attributes?: Record<string, any>;
        isDefault?: boolean;
        isActive?: boolean;
        sortOrder?: number;
      }
    >({
      query: ({ id, ...data }) => ({
        url: `/products/variants/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    deleteVariant: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/variants/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    // Create price
    createPrice: builder.mutation<
      Price,
      {
        variantId: string;
        price: number;
        salePrice?: number;
        currency?: string;
        isActive?: boolean;
        validFrom?: Date;
        validTo?: Date;
      }
    >({
      query: (data) => ({
        url: '/products/prices',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    // Update price
    updatePrice: builder.mutation<
      Price,
      {
        id: string;
        price?: number;
        salePrice?: number;
        currency?: string;
        isActive?: boolean;
        validFrom?: Date;
        validTo?: Date;
      }
    >({
      query: ({ id, ...data }) => ({
        url: `/products/prices/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    // Delete price
    deletePrice: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/prices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    // Create stock
    createStock: builder.mutation<
      Stock,
      {
        variantId: string;
        quantity: number;
        reserved?: number;
        minThreshold?: number;
        maxThreshold?: number;
        isInStock?: boolean;
      }
    >({
      query: (data) => ({
        url: '/products/stock',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    // Update stock
    updateStock: builder.mutation<
      Stock,
      {
        id: string;
        quantity?: number;
        reserved?: number;
        minThreshold?: number;
        maxThreshold?: number;
        isInStock?: boolean;
      }
    >({
      query: ({ id, ...data }) => ({
        url: `/products/stock/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    // Delete stock
    deleteStock: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/stock/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    // Create product image
    createProductImage: builder.mutation<
      ProductImage,
      {
        productId?: string;
        variantId?: string;
        fileId: string;
        altText?: string;
        isPrimary?: boolean;
        sortOrder?: number;
      }
    >({
      query: (data) => ({
        url: '/products/images',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Product', id: arg.productId },
        { type: 'Product', id: arg.variantId },
      ],
    }),

    // Update product image
    updateProductImage: builder.mutation<
      ProductImage,
      {
        id: string;
        fileId?: string;
        altText?: string;
        isPrimary?: boolean;
        sortOrder?: number;
      }
    >({
      query: ({ id, ...data }) => ({
        url: `/products/images/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    // Delete product image
    deleteProductImage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/images/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    // Create review
    createReview: builder.mutation<
      Review,
      { productId: string; title?: string; content: string; rating: number }
    >({
      query: (data) => ({
        url: '/products/reviews',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    // Update review
    updateReview: builder.mutation<
      Review,
      { id: string; title?: string; content?: string; rating?: number }
    >({
      query: ({ id, ...data }) => ({
        url: `/products/reviews/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    // Admin update review
    adminUpdateReview: builder.mutation<
      Review,
      {
        id: string;
        title?: string;
        content?: string;
        rating?: number;
        isApproved?: boolean;
      }
    >({
      query: ({ id, ...data }) => ({
        url: `/products/reviews/${id}/admin`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    // Delete review
    deleteReview: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    // Create rating
    createRating: builder.mutation<
      Rating,
      { productId: string; rating: number }
    >({
      query: (data) => ({
        url: '/products/ratings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    // Update rating
    updateRating: builder.mutation<Rating, { id: string; rating: number }>({
      query: ({ id, rating }) => ({
        url: `/products/ratings/${id}`,
        method: 'PATCH',
        body: { rating },
      }),
      invalidatesTags: ['Product'],
    }),

    // Delete rating
    deleteRating: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/ratings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    // Add to favorites
    addToFavorites: builder.mutation<Favorite, { productId: string }>({
      query: (data) => ({
        url: '/products/favorites',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    // Remove from favorites
    removeFromFavorites: builder.mutation<void, string>({
      query: (productId) => ({
        url: `/products/favorites/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    // Get user favorites
    getUserFavorites: builder.query<Favorite[], void>({
      query: () => '/products/favorites',
      providesTags: ['Product'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useLazyGetProductByIdQuery,
  useGetFeaturedProductsQuery,
  useGetBestSellingProductsQuery,
  useGetTopRatedProductsQuery,
  useGetNewArrivalProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductsBySubcategoryQuery,
  useSearchProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateVariantMutation,
  useGetVariantsByProductQuery,
  useUpdateVariantMutation,
  useDeleteVariantMutation,
  useCreatePriceMutation,
  useUpdatePriceMutation,
  useDeletePriceMutation,
  useCreateStockMutation,
  useUpdateStockMutation,
  useDeleteStockMutation,
  useCreateProductImageMutation,
  useUpdateProductImageMutation,
  useDeleteProductImageMutation,
  useGetImagesByProductQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useAdminUpdateReviewMutation,
  useDeleteReviewMutation,
  useCreateRatingMutation,
  useUpdateRatingMutation,
  useDeleteRatingMutation,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
  useGetUserFavoritesQuery,
} = productApi;
