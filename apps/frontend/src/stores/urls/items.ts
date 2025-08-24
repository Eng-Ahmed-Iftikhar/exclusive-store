import { BaseUrls } from "./base";

const GET_ITEMS = BaseUrls.ITEMS_BASE_URL;
const GET_ITEM_BY_ID = (id: string) => `${BaseUrls.ITEMS_BASE_URL}/${id}`;
const GET_FEATURED_ITEMS = `${BaseUrls.ITEMS_BASE_URL}/featured`;
const GET_BEST_SELLING_ITEMS = `${BaseUrls.ITEMS_BASE_URL}/best-selling`;
const GET_TOP_RATED_ITEMS = `${BaseUrls.ITEMS_BASE_URL}/top-rated`;
const GET_NEW_ARRIVAL_ITEMS = `${BaseUrls.ITEMS_BASE_URL}/new-arrivals`;
const GET_ITEMS_BY_CATEGORY = (categoryId: string) => 
  `${BaseUrls.ITEMS_BASE_URL}/category/${categoryId}`;
const GET_ITEMS_BY_SUBCATEGORY = (subcategoryId: string) => 
  `${BaseUrls.ITEMS_BASE_URL}/subcategory/${subcategoryId}`;
const SEARCH_ITEMS = `${BaseUrls.ITEMS_BASE_URL}/search/search`;
const CREATE_ITEM = BaseUrls.ITEMS_BASE_URL;
const UPDATE_ITEM = (id: string) => `${BaseUrls.ITEMS_BASE_URL}/${id}`;
const DELETE_ITEM = (id: string) => `${BaseUrls.ITEMS_BASE_URL}/${id}`;

// Price management
const CREATE_PRICE = `${BaseUrls.ITEMS_BASE_URL}/prices`;
const UPDATE_PRICE = (id: string) => `${BaseUrls.ITEMS_BASE_URL}/prices/${id}`;
const DELETE_PRICE = (id: string) => `${BaseUrls.ITEMS_BASE_URL}/prices/${id}`;

// Stock management
const CREATE_STOCK = `${BaseUrls.ITEMS_BASE_URL}/stock`;
const UPDATE_STOCK = (id: string) => `${BaseUrls.ITEMS_BASE_URL}/stock/${id}`;
const DELETE_STOCK = (id: string) => `${BaseUrls.ITEMS_BASE_URL}/stock/${id}`;

// Image management
const CREATE_ITEM_IMAGE = `${BaseUrls.ITEMS_BASE_URL}/images`;
const UPDATE_ITEM_IMAGE = (id: string) => `${BaseUrls.ITEMS_BASE_URL}/images/${id}`;
const DELETE_ITEM_IMAGE = (id: string) => `${BaseUrls.ITEMS_BASE_URL}/images/${id}`;

// Review management
const CREATE_REVIEW = `${BaseUrls.ITEMS_BASE_URL}/reviews`;
const UPDATE_REVIEW = (id: string) => `${BaseUrls.ITEMS_BASE_URL}/reviews/${id}`;
const DELETE_REVIEW = (id: string) => `${BaseUrls.ITEMS_BASE_URL}/reviews/${id}`;

// Rating management
const CREATE_RATING = `${BaseUrls.ITEMS_BASE_URL}/ratings`;
const UPDATE_RATING = (id: string) => `${BaseUrls.ITEMS_BASE_URL}/ratings/${id}`;
const DELETE_RATING = (id: string) => `${BaseUrls.ITEMS_BASE_URL}/ratings/${id}`;

// Favorites management
const ADD_TO_FAVORITES = `${BaseUrls.ITEMS_BASE_URL}/favorites`;
const REMOVE_FROM_FAVORITES = (itemId: string) => 
  `${BaseUrls.ITEMS_BASE_URL}/favorites/${itemId}`;
const GET_USER_FAVORITES = `${BaseUrls.ITEMS_BASE_URL}/favorites/user`;

export const ItemsUrls = {
  GET_ITEMS,
  GET_ITEM_BY_ID,
  GET_FEATURED_ITEMS,
  GET_BEST_SELLING_ITEMS,
  GET_TOP_RATED_ITEMS,
  GET_NEW_ARRIVAL_ITEMS,
  GET_ITEMS_BY_CATEGORY,
  GET_ITEMS_BY_SUBCATEGORY,
  SEARCH_ITEMS,
  CREATE_ITEM,
  UPDATE_ITEM,
  DELETE_ITEM,
  CREATE_PRICE,
  UPDATE_PRICE,
  DELETE_PRICE,
  CREATE_STOCK,
  UPDATE_STOCK,
  DELETE_STOCK,
  CREATE_ITEM_IMAGE,
  UPDATE_ITEM_IMAGE,
  DELETE_ITEM_IMAGE,
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
