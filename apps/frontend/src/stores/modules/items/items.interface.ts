export interface Price {
  id: string;
  itemId: string;
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
  itemId: string;
  quantity: number;
  reserved: number;
  minThreshold: number;
  maxThreshold?: number;
  isInStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ItemImage {
  id: string;
  itemId: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  itemId: string;
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
  itemId: string;
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
  itemId: string;
  userId: string;
  createdAt: string;
  item?: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface Item {
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
  prices?: Price[];
  stock?: Stock;
  images?: ItemImage[];
  reviews?: Review[];
  ratings?: Rating[];
  favorites?: Favorite[];
  
  // Computed fields
  averageRating?: number;
  totalReviews?: number;
  isFavorite?: boolean;
  currentPrice?: number;
  salePrice?: number;
  isOnSale?: boolean;
}

export interface ItemsResponse {
  items: Item[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ItemsState {
  items: Item[];
  featuredItems: Item[];
  bestSellingItems: Item[];
  loading: boolean;
  error: string | null;
  selectedItem: Item | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ItemQueryParams {
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
