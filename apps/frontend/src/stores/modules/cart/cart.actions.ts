import { ICart } from '.';
import { cartApi } from '../../apis/cart.api';

const CART_ID_KEY = 'exclusive_cart_id';

export async function getUserCart(): Promise<ICart.Cart> {
  try {
    return await cartApi.getUserCart();
  } catch (err) {
    throw new Error('Failed to fetch user cart');
  }
}

export async function getCartById(id: string): Promise<ICart.Cart> {
  try {
    return await cartApi.getCartById(id);
  } catch (err) {
    throw new Error('Failed to fetch cart');
  }
}

export async function createCart(): Promise<ICart.Cart> {
  try {
    return await cartApi.createCart();
  } catch (err) {
    throw new Error('Failed to create cart');
  }
}

export async function addToCart(
  cartId: string,
  payload: ICart.AddToCartRequest
): Promise<ICart.Cart> {
  try {
    console.log({ payload });
    const response = await cartApi.addToCart(cartId, payload);
    return response.cart as unknown as ICart.Cart;
  } catch (err) {
    throw new Error('Failed to add item to cart');
  }
}

export async function updateCartItem(
  cartId: string,
  itemId: string,
  payload: ICart.UpdateCartItemRequest
): Promise<ICart.Cart> {
  try {
    const response = await cartApi.updateCartItem(cartId, itemId, payload);
    return response.cart as unknown as ICart.Cart;
  } catch (err) {
    throw new Error('Failed to update cart item');
  }
}

export async function removeFromCart(
  cartId: string,
  itemId: string
): Promise<ICart.Cart> {
  try {
    const response = await cartApi.removeFromCart(cartId, itemId);
    return response.cart as unknown as ICart.Cart;
  } catch (err) {
    throw new Error('Failed to remove item from cart');
  }
}

export async function clearCart(cartId: string): Promise<void> {
  try {
    await cartApi.clearCart(cartId);
  } catch (err) {
    throw new Error('Failed to clear cart');
  }
}

export async function recalculateCartPrices(
  cartId: string
): Promise<ICart.Cart> {
  try {
    const response = await cartApi.recalculateCartPrices(cartId);
    return response.cart;
  } catch (err) {
    throw new Error('Failed to recalculate cart prices');
  }
}

export function getStoredCartId(): string | null {
  return localStorage.getItem(CART_ID_KEY);
}

export function storeCartId(cartId: string): void {
  localStorage.setItem(CART_ID_KEY, cartId);
}

export function removeStoredCartId(): void {
  localStorage.removeItem(CART_ID_KEY);
}
