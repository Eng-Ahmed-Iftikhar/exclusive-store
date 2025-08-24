import { BaseUrls } from "./base";

const GET_USER_FAVORITES = BaseUrls.FAVORITES_BASE_URL;
const ADD_TO_FAVORITES = (itemId: string) => `${BaseUrls.FAVORITES_BASE_URL}/${itemId}`;
const REMOVE_FROM_FAVORITES = (itemId: string) => `${BaseUrls.FAVORITES_BASE_URL}/${itemId}`;
const CHECK_FAVORITE_STATUS = (itemId: string) => `${BaseUrls.FAVORITES_BASE_URL}/check/${itemId}`;
const GET_FAVORITE_BY_ID = (id: string) => `${BaseUrls.FAVORITES_BASE_URL}/favorite/${id}`;
const CLEAR_FAVORITES = `${BaseUrls.FAVORITES_BASE_URL}/clear`;

export const FavoritesUrls = {
  GET_USER_FAVORITES,
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,
  CHECK_FAVORITE_STATUS,
  GET_FAVORITE_BY_ID,
  CLEAR_FAVORITES,
};
