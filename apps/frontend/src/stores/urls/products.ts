import { BaseUrls } from './base';

const GET_PRODUCTS = BaseUrls.PRODUCTS_BASE_URL;
const GET_PRODUCT_BY_ID = (id: string) => `${BaseUrls.PRODUCTS_BASE_URL}/${id}`;
const GET_FEATURED_PRODUCTS = `${BaseUrls.PRODUCTS_BASE_URL}/featured`;
const GET_BEST_SELLING_PRODUCTS = `${BaseUrls.PRODUCTS_BASE_URL}/best-selling`;
const GET_HERO_SLIDER_PRODUCTS = `${BaseUrls.PRODUCTS_BASE_URL}/hero-slider`;
const GET_TOP_RATED_PRODUCTS = `${BaseUrls.PRODUCTS_BASE_URL}/top-rated`;
const GET_NEW_ARRIVAL_PRODUCTS = `${BaseUrls.PRODUCTS_BASE_URL}/new-arrivals`;
const GET_PRODUCTS_BY_CATEGORY = (categoryId: string) =>
  `${BaseUrls.PRODUCTS_BASE_URL}/category/${categoryId}`;
const GET_PRODUCTS_BY_SUBCATEGORY = (subcategoryId: string) =>
  `${BaseUrls.PRODUCTS_BASE_URL}/subcategory/${subcategoryId}`;
const SEARCH_PRODUCTS = `${BaseUrls.PRODUCTS_BASE_URL}/search`;
const CREATE_PRODUCT = BaseUrls.PRODUCTS_BASE_URL;
const UPDATE_PRODUCT = (id: string) => `${BaseUrls.PRODUCTS_BASE_URL}/${id}`;
const DELETE_PRODUCT = (id: string) => `${BaseUrls.PRODUCTS_BASE_URL}/${id}`;

// Variant management
const CREATE_VARIANT = `${BaseUrls.PRODUCTS_BASE_URL}/variants`;
const UPDATE_VARIANT = (id: string) =>
  `${BaseUrls.PRODUCTS_BASE_URL}/variants/${id}`;
const DELETE_VARIANT = (id: string) =>
  `${BaseUrls.PRODUCTS_BASE_URL}/variants/${id}`;

// Price management
const CREATE_PRICE = `${BaseUrls.PRODUCTS_BASE_URL}/prices`;
const UPDATE_PRICE = (id: string) =>
  `${BaseUrls.PRODUCTS_BASE_URL}/prices/${id}`;
const DELETE_PRICE = (id: string) =>
  `${BaseUrls.PRODUCTS_BASE_URL}/prices/${id}`;

// Stock management
const CREATE_STOCK = `${BaseUrls.PRODUCTS_BASE_URL}/stock`;
const UPDATE_STOCK = (id: string) =>
  `${BaseUrls.PRODUCTS_BASE_URL}/stock/${id}`;
const DELETE_STOCK = (id: string) =>
  `${BaseUrls.PRODUCTS_BASE_URL}/stock/${id}`;

// Image management
const CREATE_PRODUCT_IMAGE = `${BaseUrls.PRODUCTS_BASE_URL}/images`;
const UPDATE_PRODUCT_IMAGE = (id: string) =>
  `${BaseUrls.PRODUCTS_BASE_URL}/images/${id}`;
const DELETE_PRODUCT_IMAGE = (id: string) =>
  `${BaseUrls.PRODUCTS_BASE_URL}/images/${id}`;

// Review management
const CREATE_REVIEW = `${BaseUrls.PRODUCTS_BASE_URL}/reviews`;
const UPDATE_REVIEW = (id: string) =>
  `${BaseUrls.PRODUCTS_BASE_URL}/reviews/${id}`;
const DELETE_REVIEW = (id: string) =>
  `${BaseUrls.PRODUCTS_BASE_URL}/reviews/${id}`;

// Rating management
const CREATE_RATING = `${BaseUrls.PRODUCTS_BASE_URL}/ratings`;
const UPDATE_RATING = (id: string) =>
  `${BaseUrls.PRODUCTS_BASE_URL}/ratings/${id}`;
const DELETE_RATING = (id: string) =>
  `${BaseUrls.PRODUCTS_BASE_URL}/ratings/${id}`;

// Favorites management
const ADD_TO_FAVORITES = `${BaseUrls.PRODUCTS_BASE_URL}/favorites`;
const REMOVE_FROM_FAVORITES = (productId: string) =>
  `${BaseUrls.PRODUCTS_BASE_URL}/favorites/${productId}`;
const GET_USER_FAVORITES = `${BaseUrls.PRODUCTS_BASE_URL}/favorites`;

export const ProductsUrls = {
  GET_PRODUCTS,
  GET_PRODUCT_BY_ID,
  GET_FEATURED_PRODUCTS,
  GET_BEST_SELLING_PRODUCTS,
  GET_HERO_SLIDER_PRODUCTS,
  GET_TOP_RATED_PRODUCTS,
  GET_NEW_ARRIVAL_PRODUCTS,
  GET_PRODUCTS_BY_CATEGORY,
  GET_PRODUCTS_BY_SUBCATEGORY,
  SEARCH_PRODUCTS,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  CREATE_VARIANT,
  UPDATE_VARIANT,
  DELETE_VARIANT,
  CREATE_PRICE,
  UPDATE_PRICE,
  DELETE_PRICE,
  CREATE_STOCK,
  UPDATE_STOCK,
  DELETE_STOCK,
  CREATE_PRODUCT_IMAGE,
  UPDATE_PRODUCT_IMAGE,
  DELETE_PRODUCT_IMAGE,
  CREATE_REVIEW,
  UPDATE_REVIEW,
  DELETE_REVIEW,
  CREATE_RATING,
  UPDATE_RATING,
  DELETE_RATING,
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,
  GET_USER_FAVORITES,
};
