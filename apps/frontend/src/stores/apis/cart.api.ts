import { CartUrls } from '../urls';
import axiosInstance from './axios-instance';

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  product: any;
  variant?: any;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartResponse {
  cart: Cart;
  message?: string;
}

export const cartApi = {
  // Get user's cart
  getUserCart: async (): Promise<Cart> => {
    const response = await axiosInstance.get(CartUrls.GET_USER_CART);
    return response.data;
  },

  // Add item to cart
  addToCart: async (
    cartId: string,
    data: AddToCartRequest
  ): Promise<CartResponse> => {
    const response = await axiosInstance.post(CartUrls.ADD_TO_CART(cartId), {
      productId: data.productId,
      variantId: data.variantId,
      quantity: data.quantity,
    });
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (
    cartId: string,
    cartItemId: string,
    data: UpdateCartItemRequest
  ): Promise<CartResponse> => {
    const response = await axiosInstance.put(
      CartUrls.UPDATE_CART_ITEM(cartId, cartItemId),
      {
        quantity: data.quantity,
      }
    );
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (
    cartId: string,
    cartItemId: string
  ): Promise<CartResponse> => {
    const response = await axiosInstance.delete(
      CartUrls.REMOVE_FROM_CART(cartId, cartItemId)
    );
    return response.data;
  },

  // Clear entire cart
  clearCart: async (cartId: string): Promise<CartResponse> => {
    const response = await axiosInstance.delete(CartUrls.CLEAR_CART(cartId));
    return response.data;
  },

  // Get cart by ID (for guest users)
  getCartById: async (cartId: string): Promise<Cart> => {
    const response = await axiosInstance.get(CartUrls.GET_CART_BY_ID(cartId));
    return response.data;
  },

  // Create new cart (for guest users)
  createCart: async (): Promise<Cart> => {
    const response = await axiosInstance.post(CartUrls.CREATE_CART);
    return response.data;
  },

  // Recalculate cart prices (useful when sale prices change)
  recalculateCartPrices: async (cartId: string): Promise<CartResponse> => {
    const response = await axiosInstance.post(
      CartUrls.RECALCULATE_PRICES(cartId)
    );
    return response.data;
  },
};
