export interface CartItem {
  id: string;
  cartId: string;
  itemId: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: Array<{ url: string }>;
    category: { id: string; name: string };
    subcategory: { id: string; name: string };
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
  itemId: string;
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
