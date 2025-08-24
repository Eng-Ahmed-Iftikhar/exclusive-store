const BASE_URL =
  ((import.meta.env.VITE_APP_BACKEND_URL as string) ??
    'http://localhost:3000') + '/api';

const AUTH_BASE_URL = BASE_URL + '/auth';
const CART_BASE_URL = BASE_URL + '/cart';
const ITEMS_BASE_URL = BASE_URL + '/items';
const CATEGORIES_BASE_URL = BASE_URL + '/categories';
const FAVORITES_BASE_URL = BASE_URL + '/favorites';
const FLASH_SALES_BASE_URL = BASE_URL + '/flash-sales';
const ORDERS_BASE_URL = BASE_URL + '/orders';
const USER_BASE_URL = BASE_URL + '/user';
const SEARCH_BASE_URL = BASE_URL + '/search';

export const BaseUrls = {
  BASE_URL,
  AUTH_BASE_URL,
  CART_BASE_URL,
  ITEMS_BASE_URL,
  CATEGORIES_BASE_URL,
  FAVORITES_BASE_URL,
  FLASH_SALES_BASE_URL,
  ORDERS_BASE_URL,
  USER_BASE_URL,
  SEARCH_BASE_URL,
};
