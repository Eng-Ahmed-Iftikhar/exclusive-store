import { BaseUrls } from "./base";

const GET_CATEGORIES = BaseUrls.CATEGORIES_BASE_URL;
const GET_CATEGORY_BY_ID = (id: string) => `${BaseUrls.CATEGORIES_BASE_URL}/${id}`;
const GET_CATEGORY_BY_SLUG = (slug: string) => `${BaseUrls.CATEGORIES_BASE_URL}/slug/${slug}`;
const CREATE_CATEGORY = BaseUrls.CATEGORIES_BASE_URL;
const UPDATE_CATEGORY = (id: string) => `${BaseUrls.CATEGORIES_BASE_URL}/${id}`;
const DELETE_CATEGORY = (id: string) => `${BaseUrls.CATEGORIES_BASE_URL}/${id}`;

// Subcategories
const GET_SUBCATEGORIES = (categoryId: string) => 
  `${BaseUrls.CATEGORIES_BASE_URL}/${categoryId}/subcategories`;
const GET_SUBCATEGORY_BY_ID = (categoryId: string, subcategoryId: string) => 
  `${BaseUrls.CATEGORIES_BASE_URL}/${categoryId}/subcategories/${subcategoryId}`;
const CREATE_SUBCATEGORY = (categoryId: string) => 
  `${BaseUrls.CATEGORIES_BASE_URL}/${categoryId}/subcategories`;
const UPDATE_SUBCATEGORY = (categoryId: string, subcategoryId: string) => 
  `${BaseUrls.CATEGORIES_BASE_URL}/${categoryId}/subcategories/${subcategoryId}`;
const DELETE_SUBCATEGORY = (categoryId: string, subcategoryId: string) => 
  `${BaseUrls.CATEGORIES_BASE_URL}/${categoryId}/subcategories/${subcategoryId}`;

export const CategoriesUrls = {
  GET_CATEGORIES,
  GET_CATEGORY_BY_ID,
  GET_CATEGORY_BY_SLUG,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  GET_SUBCATEGORIES,
  GET_SUBCATEGORY_BY_ID,
  CREATE_SUBCATEGORY,
  UPDATE_SUBCATEGORY,
  DELETE_SUBCATEGORY,
};
