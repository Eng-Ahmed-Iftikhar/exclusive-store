import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { CheckoutApis } from '../../apis/checkout.api';
import * as ICheckout from './checkout.interface';
import { useCartStore } from '../cart/cart.store';
import { useAuthStore } from '../auth/auth.store';

export const useCheckoutStore = defineStore('checkout', () => {
  const cartStore = useCartStore();
  const authStore = useAuthStore();

  // State
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentOrder = ref<ICheckout.OrderResponse | null>(null);
  const paymentIntent = ref<ICheckout.PaymentIntentResponse | null>(null);

  // Getters
  const isLoggedIn = computed(() => authStore.isAuthenticated);
  const userInfo = computed(() => authStore.user);

  // Actions
  const createPaymentIntent = async (
    orderData: ICheckout.CreateOrderRequest
  ) => {
    try {
      loading.value = true;
      error.value = null;

      // Create payment intent only (Step 1)
      const response = await CheckoutApis.createPaymentIntent(orderData);

      if (response?.paymentIntentId) {
        paymentIntent.value = response;
        return response;
      } else {
        throw new Error('Failed to create payment intent');
      }
    } catch (error: any) {
      error.value = error.message || 'Failed to create payment intent';
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const createOrder = async (
    orderData: ICheckout.CreateOrderRequest & {
      expMonth: string;
      expYear: string;
      cvc: string;
      cardholderName: string;
    }
  ) => {
    try {
      loading.value = true;
      error.value = null;

      // Send complete order data to backend for payment processing
      const response = await CheckoutApis.createOrder({
        ...orderData,
        expMonth: orderData.expMonth,
        expYear: orderData.expYear,
        cvc: orderData.cvc,
        cardholderName: orderData.cardholderName,
      });

      if (response?.order) {
        currentOrder.value = response;
        // Clear cart after successful order
        const cartStore = useCartStore();
        await cartStore.clearCart();
        return response;
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error: any) {
      error.value = error.message || 'Failed to create order';
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const createOrderFromPaymentIntent = async (data: {
    paymentIntentId: string;
    orderDetails: any;
  }) => {
    try {
      loading.value = true;
      error.value = null;

      // Create order using payment intent details
      const response = await CheckoutApis.createOrderFromPaymentIntent(data);

      if (response) {
        currentOrder.value = response as unknown as ICheckout.OrderResponse;
        // Clear cart after successful order
        await cartStore.clearCart();
        return response;
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error: any) {
      error.value = error.message || 'Failed to create order';
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const attachPaymentMethod = async (paymentData: {
    paymentIntentId: string;
    paymentMethodId: string;
  }) => {
    try {
      loading.value = true;
      error.value = null;

      // Attach payment method to payment intent (Step 3)
      const response = await CheckoutApis.attachPaymentMethod(paymentData);

      if (response?.success) {
        return response;
      } else {
        throw new Error('Failed to attach payment method');
      }
    } catch (error: any) {
      error.value = error.message || 'Failed to attach payment method';
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const confirmPayment = async (paymentData: {
    paymentIntentId: string;
    paymentMethodId: string;
  }) => {
    try {
      loading.value = true;
      error.value = null;

      // Confirm payment only (Step 4)
      const response = await CheckoutApis.confirmPayment(paymentData);

      if (response?.success) {
        return response;
      } else {
        throw new Error('Payment confirmation failed');
      }
    } catch (error: any) {
      error.value = error.message || 'Failed to confirm payment';
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const confirmOrderAfterPayment = async (
    paymentData: ICheckout.ConfirmOrderRequest
  ) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await CheckoutApis.confirmOrderAfterPayment(paymentData);
      currentOrder.value = response;

      // Clear cart after successful order
      if (response) {
        await cartStore.clearCart();
      }

      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to confirm order';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getOrderById = async (orderId: string) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await CheckoutApis.getOrderById(orderId);
      currentOrder.value = response;

      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to get order';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getPaymentHistory = async (orderId: string) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await CheckoutApis.getPaymentHistory(orderId);
      return response;
    } catch (err: any) {
      error.value =
        err.response?.data?.message || 'Failed to get payment history';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const resetOrder = () => {
    currentOrder.value = null;
    paymentIntent.value = null;
    error.value = null;
  };

  const confirmPaymentAndCreateOrder = async (data: {
    paymentIntentId: string;
    paymentMethodId: string;
    orderDetails: any;
  }) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await CheckoutApis.confirmPaymentAndCreateOrder(data);

      if (response?.order) {
        currentOrder.value = response;
        // Clear cart after successful order
        await cartStore.clearCart();
      }

      return response;
    } catch (error: any) {
      error.value =
        error.response?.data?.message || 'Failed to confirm payment';
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    loading,
    error,
    currentOrder,
    paymentIntent,

    // Getters
    isLoggedIn,
    userInfo,

    // Actions
    createPaymentIntent,
    createOrder,
    createOrderFromPaymentIntent,
    attachPaymentMethod,
    confirmPayment,
    confirmOrderAfterPayment,
    getOrderById,
    getPaymentHistory,
    clearError,
    resetOrder,
    confirmPaymentAndCreateOrder,
  };
});
