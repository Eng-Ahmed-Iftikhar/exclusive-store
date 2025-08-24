export interface FlashSale {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
  items?: FlashSaleItem[];
}

export interface FlashSaleItem {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder?: number;
  categoryId?: string;
  subcategoryId?: string;
  createdAt: Date;
  updatedAt: Date;
  category?: { id: string; name: string; slug: string };
  subcategory?: { id: string; name: string; slug: string };
  prices: Array<{
    id: string;
    itemId: string;
    price: number;
    salePrice: number;
    currency: string;
    isActive: boolean;
    validFrom: Date;
    validTo: Date;
    createdAt: Date;
    updatedAt: Date;
  }>;
  stock?: {
    id: string;
    itemId: string;
    quantity: number;
    reserved: number;
    minThreshold: number;
    maxThreshold: number;
    isInStock: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  images: Array<{
    id: string;
    itemId: string;
    url: string;
    altText?: string;
    isPrimary: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
  reviews: Array<{
    id: string;
    itemId: string;
    userId: string;
    title: string;
    content: string;
    rating: number;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
  ratings: Array<{
    id: string;
    itemId: string;
    userId: string;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
  favorites: Array<{
    id: string;
    itemId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  averageRating: number;
  totalReviews: number;
  isFavorite: boolean;
  currentPrice: number;
  salePrice: number;
  isOnSale: boolean;
  flashSaleId: string;
  flashSaleDiscount: number;
  timeRemaining: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export interface FlashSalesState {
  flashSales: FlashSale[];
  activeFlashSale: FlashSale | null;
  loading: boolean;
  error: string | null;
}
