export interface GuestUserInfo {
  name: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
}

export interface CreateOrderRequest {
  cartId: string;
  userId?: string;
  guestUserInfo?: GuestUserInfo;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  notes?: string;
  isGuestOrder?: boolean;
  paymentMethodId?: string;
}

export interface OrderDto {
  id: string;
  total: number;
  status: string;
}

export interface OrderResponse {
  order: OrderDto;
  message: string;
  clientSecret?: string;
  paymentIntentId?: string;
  orderDetails?: {
    cartId: string;
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
    isGuestOrder: boolean;
    guestUserInfo?: GuestUserInfo;
    shippingAddress: ShippingAddress;
    billingAddress: ShippingAddress;
    notes?: string;
    userId?: string;
  };
}

export interface ConfirmOrderRequest {
  paymentIntentId: string;
  orderDetails: any;
}

export interface CheckoutState {
  isLoading: boolean;
  error: string | null;
  currentOrder: any | null;
  paymentIntent: any | null;
  stripe: any | null;
  elements: any | null;
  cardElement: any | null;
  isStripeInitialized: boolean;
  countries: any[];
  states: any[];
  cities: any[];
}

export interface PaymentIntentResponse {
  paymentIntentId: string;
  clientSecret: string;
  orderDetails: any;
}
