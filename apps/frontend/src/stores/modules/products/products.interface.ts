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

export interface Price {
  id: string;
  variantId: string;
  price: number;
  salePrice?: number;
  currency: string;
  isActive: boolean;
  validFrom: string;
  validTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stock {
  id: string;
  variantId: string;
  quantity: number;
  reserved: number;
  minThreshold: number;
  maxThreshold?: number;
  isInStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId?: string;
  variantId?: string;
  fileId: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  product?: {
    id: string;
    name: string;
    description?: string;
  };
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
  
  // Relations
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
  
  // Computed fields
  averageRating?: number;
  totalReviews?: number;
  totalVariants?: number;
  isFavorite?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsState {
  products: Product[];
  featuredProducts: Product[];
  bestSellingProducts: Product[];
  newArrivalProducts: Product[];
  loading: boolean;
  error: string | null;
  selectedProduct: Product | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductQueryParams {
  search?: string;
  categoryId?: string;
  subcategoryId?: string;
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

