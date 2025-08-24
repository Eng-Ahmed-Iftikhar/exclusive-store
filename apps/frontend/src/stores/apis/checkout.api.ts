import axiosInstance from './axios-instance';
import { OrdersUrls } from '../urls/orders';
import * as ICheckout from '../modules/checkout/checkout.interface';

export const CheckoutApis = {
  // Create payment intent only (Step 1)
  async createPaymentIntent(
    orderData: ICheckout.CreateOrderRequest
  ): Promise<ICheckout.PaymentIntentResponse> {
    const response = await axiosInstance.post(
      OrdersUrls.CREATE_PAYMENT_INTENT,
      orderData
    );
    return response.data;
  },

  // Attach payment method to payment intent (Step 3)
  async attachPaymentMethod(paymentData: {
    paymentIntentId: string;
    paymentMethodId: string;
  }): Promise<{ success: boolean; message?: string }> {
    const response = await axiosInstance.post(
      OrdersUrls.ATTACH_PAYMENT_METHOD,
      paymentData
    );
    return response.data;
  },

  // Confirm payment only (Step 4)
  async confirmPayment(paymentData: {
    paymentIntentId: string;
    paymentMethodId: string;
  }): Promise<{ success: boolean; message?: string }> {
    const response = await axiosInstance.post(
      OrdersUrls.CONFIRM_PAYMENT_ONLY,
      paymentData
    );
    return response.data;
  },

  // Create order with payment processing
  async createOrder(
    orderData: ICheckout.CreateOrderRequest & {
      expMonth: string;
      expYear: string;
      cvc: string;
      cardholderName: string;
    }
  ): Promise<ICheckout.OrderResponse> {
    const response = await axiosInstance.post(
      OrdersUrls.CREATE_ORDER,
      orderData
    );
    return response.data;
  },

  // Create order from payment intent
  async createOrderFromPaymentIntent(data: {
    paymentIntentId: string;
    orderDetails: any;
  }): Promise<ICheckout.OrderDto> {
    const response = await axiosInstance.post(
      OrdersUrls.CREATE_ORDER_FROM_PAYMENT_INTENT,
      data
    );
    return response.data;
  },

  // Confirm order after payment
  async confirmOrderAfterPayment(paymentData: {
    paymentIntentId: string;
    orderDetails: any;
  }): Promise<ICheckout.OrderResponse> {
    const response = await axiosInstance.post(
      OrdersUrls.CONFIRM_ORDER_AFTER_PAYMENT,
      paymentData
    );
    return response.data;
  },

  // Get order by ID
  async getOrderById(orderId: string): Promise<ICheckout.OrderResponse> {
    const response = await axiosInstance.get(
      OrdersUrls.GET_ORDER_BY_ID(orderId)
    );
    return response.data;
  },

  // Get payment history for an order
  async getPaymentHistory(orderId: string): Promise<any[]> {
    const response = await axiosInstance.get(
      OrdersUrls.GET_PAYMENT_HISTORY(orderId)
    );
    return response.data;
  },

  // Get user orders
  async getUserOrders(): Promise<ICheckout.OrderResponse[]> {
    const response = await axiosInstance.get(OrdersUrls.GET_USER_ORDERS);
    return response.data;
  },

  // Confirm payment and create order
  async confirmPaymentAndCreateOrder(data: {
    paymentIntentId: string;
    paymentMethodId: string;
    orderDetails: any;
  }) {
    const response = await axiosInstance.post(
      '/api/orders/confirm-payment',
      data
    );
    return response.data;
  },
};
