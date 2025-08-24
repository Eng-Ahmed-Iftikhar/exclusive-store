import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '../auth';
import { useNotificationsStore } from '../notifications';
import { ICart, CartActions } from '.';

export const useCartStore = defineStore('cart', () => {
  // ****** State ******
  const cart = ref<ICart.Cart | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const cartId = ref<string | null>(null);

  const authStore = useAuthStore();
  const notificationsStore = useNotificationsStore();

  // ****** Getters ******
  const cartItems = computed(() => cart.value?.items || []);
  const cartItemsCount = computed(() => cart.value?.totalItems || 0);
  const cartSubtotal = computed(() => cart.value?.subtotal || 0);
  const cartTotal = computed(() => cart.value?.total || 0);
  const isEmpty = computed(() => cartItemsCount.value === 0);

  // Shipping cost from backend cart API
  const shippingCost = computed(() => cart.value?.shippingCost || 0);

  // Tax from backend cart API
  const tax = computed(() => cart.value?.tax || 0);

  // Total with shipping and tax from backend cart API
  const totalWithShipping = computed(() => cart.value?.total || 0);

  const isItemInCart = (itemId: string): boolean => {
    return cartItems.value.some((item) => item.itemId === itemId);
  };

  const getItemQuantity = (itemId: string): number => {
    const cartItem = cartItems.value.find((item) => item.itemId === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const getCartItem = (itemId: string) => {
    return cartItems.value.find((item) => item.itemId === itemId);
  };

  const updateCartItemQuantity = async (
    cartItemId: string,
    quantity: number
  ): Promise<void> => {
    if (!cartId.value) {
      error.value = 'Cart not initialized';
      return;
    }

    try {
      loading.value = true;
      error.value = null;

      const updatedCart = await CartActions.updateCartItem(
        cartId.value,
        cartItemId,
        { quantity }
      );

      cart.value = updatedCart;

      notificationsStore.showNotification('Cart updated', 'success');
    } catch (err) {
      error.value = 'Failed to update cart item';
      notificationsStore.showNotification(
        'Failed to update cart item',
        'error'
      );
    } finally {
      loading.value = false;
    }
  };

  const recalculateCartPrices = async (): Promise<void> => {
    if (!cartId.value) {
      error.value = 'Cart not initialized';
      return;
    }

    try {
      loading.value = true;
      error.value = null;

      const updatedCart = await CartActions.recalculateCartPrices(cartId.value);
      cart.value = updatedCart;

      notificationsStore.showNotification('Cart prices updated', 'success');
    } catch (err) {
      error.value = 'Failed to recalculate cart prices';
      notificationsStore.showNotification(
        'Failed to recalculate cart prices',
        'error'
      );
    } finally {
      loading.value = false;
    }
  };

  // ****** Actions ******
  const initializeCart = async (): Promise<void> => {
    // Try to get cart ID from localStorage first
    const storedCartId = CartActions.getStoredCartId();
    if (storedCartId) {
      cartId.value = storedCartId;
    }

    if (authStore.isAuthenticated) {
      // User is logged in, get their cart
      await fetchUserCart();
    } else if (cartId.value) {
      // Guest user with existing cart ID, fetch that cart
      await fetchGuestCart(cartId.value);
    } else {
      // No cart exists, create a new one for guest
      await createNewCart();
    }
  };

  const fetchUserCart = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;
      const userCart = await CartActions.getUserCart();
      cart.value = userCart;

      // Update localStorage with the user's cart ID
      if (userCart.id) {
        CartActions.storeCartId(userCart.id);
        cartId.value = userCart.id;
      }
    } catch (err) {
      error.value = 'Failed to fetch cart';
    } finally {
      loading.value = false;
    }
  };

  const fetchGuestCart = async (id: string): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;
      const guestCart = await CartActions.getCartById(id);
      cart.value = guestCart;
      cartId.value = id;
    } catch (err) {
      error.value = 'Failed to fetch cart';
      // If guest cart not found, create a new one
      await createNewCart();
    } finally {
      loading.value = false;
    }
  };

  const createNewCart = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;
      const newCart = await CartActions.createCart();
      cart.value = newCart;
      cartId.value = newCart.id;

      // Store cart ID in localStorage
      CartActions.storeCartId(newCart.id);
    } catch (err) {
      error.value = 'Failed to create cart';
    } finally {
      loading.value = false;
    }
  };

  const addToCart = async (itemId: string, quantity = 1): Promise<void> => {
    if (!cartId.value) {
      await initializeCart();
    }

    if (!cartId.value) {
      error.value = 'Failed to initialize cart';
      return;
    }

    try {
      loading.value = true;
      error.value = null;

      const updatedCart = await CartActions.addToCart(cartId.value, {
        itemId,
        quantity,
      });
      cart.value = updatedCart;

      // Show success notification
      notificationsStore.showNotification('Item added to cart', 'success');
    } catch (err) {
      error.value = 'Failed to add item to cart';
      notificationsStore.showNotification(
        'Failed to add item to cart',
        'error'
      );
    } finally {
      loading.value = false;
    }
  };

  const updateCartItem = async (
    itemId: string,
    quantity: number
  ): Promise<void> => {
    if (!cartId.value) {
      error.value = 'Cart not initialized';
      return;
    }

    try {
      loading.value = true;
      error.value = null;

      const updatedCart = await CartActions.updateCartItem(
        cartId.value,
        itemId,
        { quantity }
      );
      cart.value = updatedCart;

      notificationsStore.showNotification('Cart updated', 'success');
    } catch (err) {
      error.value = 'Failed to update cart item';
      notificationsStore.showNotification(
        'Failed to update cart item',
        'error'
      );
    } finally {
      loading.value = false;
    }
  };

  const removeFromCart = async (itemId: string): Promise<void> => {
    if (!cartId.value) {
      error.value = 'Cart not initialized';
      return;
    }

    try {
      loading.value = true;
      error.value = null;

      const updatedCart = await CartActions.removeFromCart(
        cartId.value,
        itemId
      );
      cart.value = updatedCart;

      notificationsStore.showNotification('Item removed from cart', 'success');
    } catch (err) {
      error.value = 'Failed to remove item from cart';
      notificationsStore.showNotification(
        'Failed to remove item from cart',
        'error'
      );
    } finally {
      loading.value = false;
    }
  };

  const clearCart = async (): Promise<void> => {
    if (!cartId.value) {
      error.value = 'Cart not initialized';
      return;
    }

    try {
      loading.value = true;
      error.value = null;

      await CartActions.clearCart(cartId.value);
      cart.value = null;
      cartId.value = null;
      CartActions.removeStoredCartId();

      notificationsStore.showNotification('Cart cleared', 'success');
    } catch (err) {
      error.value = 'Failed to clear cart';
      notificationsStore.showNotification('Failed to clear cart', 'error');
    } finally {
      loading.value = false;
    }
  };

  const clearError = (): void => {
    error.value = null;
  };

  // Watch for authentication changes
  watch(
    () => authStore.isAuthenticated,
    async (isAuthenticated) => {
      if (isAuthenticated) {
        // User logged in, fetch their cart
        await fetchUserCart();
      } else {
        // User logged out, clear cart and create guest cart
        cart.value = null;
        cartId.value = null;
        CartActions.removeStoredCartId();
        await createNewCart();
      }
    }
  );

  return {
    // ****** State ******
    cart,
    loading,
    error,
    cartId,

    // ****** Getters ******
    cartItems,
    cartItemsCount,
    cartSubtotal,
    cartTotal,
    isEmpty,
    shippingCost,
    tax,
    totalWithShipping,
    isItemInCart,
    getItemQuantity,
    getCartItem,
    updateCartItemQuantity,
    recalculateCartPrices,

    // ****** Actions ******
    initializeCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    clearError,
    fetchCartById: fetchGuestCart,
  };
});
