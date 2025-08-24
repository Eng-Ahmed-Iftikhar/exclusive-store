import { BaseUrls } from "./base";

const GET_ACTIVE_FLASH_SALES = `${BaseUrls.FLASH_SALES_BASE_URL}/active`;
const GET_FLASH_SALE_BY_ID = (id: string) => `${BaseUrls.FLASH_SALES_BASE_URL}/${id}`;
const GET_FLASH_SALE_ITEMS = (id: string) => `${BaseUrls.FLASH_SALES_BASE_URL}/${id}/items`;
const CREATE_FLASH_SALE = BaseUrls.FLASH_SALES_BASE_URL;
const UPDATE_FLASH_SALE = (id: string) => `${BaseUrls.FLASH_SALES_BASE_URL}/${id}`;
const DELETE_FLASH_SALE = (id: string) => `${BaseUrls.FLASH_SALES_BASE_URL}/${id}`;

// Flash sale items
const ADD_ITEM_TO_FLASH_SALE = (flashSaleId: string) => 
  `${BaseUrls.FLASH_SALES_BASE_URL}/${flashSaleId}/items`;
const UPDATE_FLASH_SALE_ITEM = (flashSaleId: string, itemId: string) => 
  `${BaseUrls.FLASH_SALES_BASE_URL}/${flashSaleId}/items/${itemId}`;
const REMOVE_ITEM_FROM_FLASH_SALE = (flashSaleId: string, itemId: string) => 
  `${BaseUrls.FLASH_SALES_BASE_URL}/${flashSaleId}/items/${itemId}`;

export const FlashSalesUrls = {
  GET_ACTIVE_FLASH_SALES,
  GET_FLASH_SALE_BY_ID,
  GET_FLASH_SALE_ITEMS,
  CREATE_FLASH_SALE,
  UPDATE_FLASH_SALE,
  DELETE_FLASH_SALE,
  ADD_ITEM_TO_FLASH_SALE,
  UPDATE_FLASH_SALE_ITEM,
  REMOVE_ITEM_FROM_FLASH_SALE,
};
