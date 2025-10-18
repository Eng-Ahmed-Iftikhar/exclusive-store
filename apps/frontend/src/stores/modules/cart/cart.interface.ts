export interface CartItem {
  id: string;
  cartId?: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: string | number;
  createdAt: string | Date;
  updatedAt: string | Date;
  product: {
    id: string;
    name: string;
    description: string;
    sku: string;
    price: string;
    salePrice: string;
    currency: string;
    isActive: boolean;
    isFeatured: boolean;
    sortOrder: number;
    categoryId: string;
    subcategoryId: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    category: {
      id: string;
      name: string;
      slug: string;
      description: string;
      iconFileId: string;
      isActive: boolean;
      sortOrder: number;
      createdAt: string | Date;
      updatedAt: string | Date;
    };
    subcategory: {
      id: string;
      name: string;
      slug: string;
      description: string;
      iconFileId: string;
      isActive: boolean;
      sortOrder: number;
      categoryId: string;
      createdAt: string | Date;
      updatedAt: string | Date;
    };
    images: Array<{
      id: string;
      productId: string;
      variantId: string | null;
      fileId: string;
      altText: string;
      isPrimary: boolean;
      sortOrder: number;
      createdAt: string | Date;
      updatedAt: string | Date;
      file: {
        id: string;
        originalName: string;
        publicId: string;
        url: string;
        secureUrl: string;
        format: string;
        bytes: number;
        width: number;
        height: number;
        type: string;
        status: string;
        folder: string | null;
        tags: string[];
        metadata: any;
        createdAt: string | Date;
        updatedAt: string | Date;
      };
    }>;
  };
  variant?: {
    id: string;
    productId: string;
    sku: string;
    name: string;
    attributes: Record<string, any>;
    isDefault: boolean;
    isActive: boolean;
    sortOrder: number;
    createdAt: string | Date;
    updatedAt: string | Date;
    images: Array<{
      id: string;
      productId: string | null;
      variantId: string;
      fileId: string;
      altText: string;
      isPrimary: boolean;
      sortOrder: number;
      createdAt: string | Date;
      updatedAt: string | Date;
      file: {
        id: string;
        originalName: string;
        publicId: string;
        url: string;
        secureUrl: string;
        format: string;
        bytes: number;
        width: number;
        height: number;
        type: string;
        status: string;
        folder: string | null;
        tags: string[];
        metadata: any;
        createdAt: string | Date;
        updatedAt: string | Date;
      };
    }>;
    prices: Array<{
      id: string;
      variantId: string;
      price: number;
      salePrice?: number;
      currency: string;
      isActive: boolean;
      validFrom: string | Date;
      validTo?: string | Date;
      createdAt: string | Date;
      updatedAt: string | Date;
    }>;
  };
}

export interface Cart {
  id: string;
  userId?: string;
  totalItems: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  items: CartItem[];
}

export interface AddToCartRequest {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  cartId: string | null;
}
