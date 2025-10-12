export interface CartItem {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  variant: {
    id: string;
    name: string;
    sku: string;
    product: {
      id: string;
      name: string;
      description: string;
      category: { id: string; name: string };
      subcategory: { id: string; name: string };
    };
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
  variantId: string;
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
