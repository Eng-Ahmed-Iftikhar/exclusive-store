import { BaseUrls } from './base';

const CREATE_ORDER = BaseUrls.ORDERS_BASE_URL;
const GET_ORDER_BY_ID = (id: string) => `${BaseUrls.ORDERS_BASE_URL}/${id}`;
const GET_USER_ORDERS = `${BaseUrls.ORDERS_BASE_URL}/user`;
const GET_ORDER_STATUS = (id: string) =>
  `${BaseUrls.ORDERS_BASE_URL}/${id}/status`;
const UPDATE_ORDER_STATUS = (id: string) =>
  `${BaseUrls.ORDERS_BASE_URL}/${id}/status`;
const CONFIRM_ORDER_AFTER_PAYMENT = `${BaseUrls.ORDERS_BASE_URL}/confirm-after-payment`;
const CONFIRM_PAYMENT_ONLY = `${BaseUrls.ORDERS_BASE_URL}/confirm-payment-only`;
const CANCEL_ORDER = (id: string) => `${BaseUrls.ORDERS_BASE_URL}/${id}/cancel`;
const GET_ORDER_HISTORY = `${BaseUrls.ORDERS_BASE_URL}/history`;

// Payment endpoints
const CREATE_PAYMENT_INTENT = `${BaseUrls.ORDERS_BASE_URL}/create-payment-intent`;
const ATTACH_PAYMENT_METHOD = `${BaseUrls.ORDERS_BASE_URL}/attach-payment-method`;
const CREATE_ORDER_FROM_PAYMENT_INTENT = `${BaseUrls.ORDERS_BASE_URL}/create-order-from-payment-intent`;
const GET_PAYMENT_HISTORY = (orderId: string) =>
  `${BaseUrls.ORDERS_BASE_URL}/${orderId}/payment-history`;

// Guest orders
const CREATE_GUEST_ORDER = `${BaseUrls.ORDERS_BASE_URL}/guest`;
const GET_GUEST_ORDER = (orderId: string, email: string) =>
  `${BaseUrls.ORDERS_BASE_URL}/guest/${orderId}?email=${email}`;

export const OrdersUrls = {
  CREATE_ORDER,
  GET_ORDER_BY_ID,
  GET_USER_ORDERS,
  GET_ORDER_STATUS,
  UPDATE_ORDER_STATUS,
  CONFIRM_ORDER_AFTER_PAYMENT,
  CONFIRM_PAYMENT_ONLY,
  CANCEL_ORDER,
  GET_ORDER_HISTORY,
  CREATE_PAYMENT_INTENT,
  ATTACH_PAYMENT_METHOD,
  CREATE_ORDER_FROM_PAYMENT_INTENT,
  GET_PAYMENT_HISTORY,
  CREATE_GUEST_ORDER,
  GET_GUEST_ORDER,
};
