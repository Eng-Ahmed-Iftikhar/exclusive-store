export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  product: {
    id: string;
    name: string;
    description: string;
    price?: number;
    salePrice?: number;
    images: Array<{ url: string }>;
    category: { id: string; name: string };
    subcategory: { id: string; name: string };
  };
  variant?: {
    id: string;
    name: string;
    sku: string;
    prices: Array<{ price: number; salePrice?: number }>;
    images: Array<{ url: string; file: { url: string; secureUrl: string } }>;
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
  createdAt: Date;
  updatedAt: Date;
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
