import { BaseUrls } from "./base";

const GET_USER_CART = BaseUrls.CART_BASE_URL;
const GET_CART_BY_ID = (cartId: string) => `${BaseUrls.CART_BASE_URL}/${cartId}`;
const CREATE_CART = BaseUrls.CART_BASE_URL;
const ADD_TO_CART = (cartId: string) => `${BaseUrls.CART_BASE_URL}/items?cartId=${cartId}`;
const UPDATE_CART_ITEM = (cartId: string, itemId: string) => 
  `${BaseUrls.CART_BASE_URL}/items/${itemId}?cartId=${cartId}`;
const REMOVE_FROM_CART = (cartId: string, itemId: string) => 
  `${BaseUrls.CART_BASE_URL}/items/${itemId}?cartId=${cartId}`;
const CLEAR_CART = (cartId: string) => `${BaseUrls.CART_BASE_URL}?cartId=${cartId}`;
const CLEANUP_CARTS = `${BaseUrls.CART_BASE_URL}/cleanup`;
const VALIDATE_CART = (cartId: string) => `${BaseUrls.CART_BASE_URL}/validate/${cartId}`;
const RECOVER_CART = (cartId: string) => `${BaseUrls.CART_BASE_URL}/recover?cartId=${cartId}`;
const RECALCULATE_PRICES = (cartId: string) => `${BaseUrls.CART_BASE_URL}/recalculate-prices?cartId=${cartId}`;

export const CartUrls = {
  GET_USER_CART,
  GET_CART_BY_ID,
  CREATE_CART,
  ADD_TO_CART,
  UPDATE_CART_ITEM,
  REMOVE_FROM_CART,
  CLEAR_CART,
  CLEANUP_CARTS,
  VALIDATE_CART,
  RECOVER_CART,
  RECALCULATE_PRICES,
};
