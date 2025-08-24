import { ItemsUrls } from "../urls";
import axiosInstance from './axios-instance';
import type { IItems } from '../modules/items';

export const itemsApi = {
  // Get all items with pagination and filters
  async getItems(params?: IItems.ItemQueryParams): Promise<{
    items: IItems.Item[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await axiosInstance.get(ItemsUrls.GET_ITEMS, { params });
    return response.data;
  },

  // Get item by ID
  async getItemById(id: string): Promise<IItems.Item> {
    const response = await axiosInstance.get(ItemsUrls.GET_ITEM_BY_ID(id));
    return response.data;
  },

  // Get featured items
  async getFeaturedItems(): Promise<IItems.Item[]> {
    const response = await axiosInstance.get(ItemsUrls.GET_FEATURED_ITEMS);
    return response.data;
  },

  // Get best selling items
  async getBestSellingItems(): Promise<IItems.Item[]> {
    const response = await axiosInstance.get(ItemsUrls.GET_BEST_SELLING_ITEMS);
    return response.data;
  },

  // Get top rated items
  async getTopRatedItems(minRating?: number, limit?: number): Promise<IItems.Item[]> {
    const params: any = {};
    if (minRating) params.minRating = minRating;
    if (limit) params.limit = limit;
    
    const response = await axiosInstance.get(ItemsUrls.GET_TOP_RATED_ITEMS, { params });
    return response.data;
  },

  // Get new arrival items
  async getNewArrivalItems(limit?: number): Promise<IItems.Item[]> {
    const params: any = {};
    if (limit) params.limit = limit;
    
    const response = await axiosInstance.get(ItemsUrls.GET_NEW_ARRIVAL_ITEMS, { params });
    return response.data;
  },

  // Get items by category
  async getItemsByCategory(categoryId: string, params?: Omit<IItems.ItemQueryParams, 'categoryId'>): Promise<{
    items: IItems.Item[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await axiosInstance.get(ItemsUrls.GET_ITEMS_BY_CATEGORY(categoryId), { params });
    return response.data;
  },

  // Get items by subcategory
  async getItemsBySubcategory(subcategoryId: string, params?: Omit<IItems.ItemQueryParams, 'subcategoryId'>): Promise<{
    items: IItems.Item[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await axiosInstance.get(ItemsUrls.GET_ITEMS_BY_SUBCATEGORY(subcategoryId), { params });
    return response.data;
  },

  // Search items
  async searchItems(params: IItems.ItemQueryParams): Promise<{
    items: IItems.Item[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await axiosInstance.get(ItemsUrls.SEARCH_ITEMS, { params });
    return response.data;
  },

  // Create item (admin only)
  async createItem(data: Partial<IItems.Item>): Promise<IItems.Item> {
    const response = await axiosInstance.post(ItemsUrls.CREATE_ITEM, data);
    return response.data;
  },

  // Update item (admin only)
  async updateItem(id: string, data: Partial<IItems.Item>): Promise<IItems.Item> {
    const response = await axiosInstance.put(ItemsUrls.UPDATE_ITEM(id), data);
    return response.data;
  },

  // Delete item (admin only)
  async deleteItem(id: string): Promise<void> {
    await axiosInstance.delete(ItemsUrls.DELETE_ITEM(id));
  },

  // Price management (admin only)
  async createPrice(data: any): Promise<any> {
    const response = await axiosInstance.post(ItemsUrls.CREATE_PRICE, data);
    return response.data;
  },

  async updatePrice(id: string, data: any): Promise<any> {
    const response = await axiosInstance.put(ItemsUrls.UPDATE_PRICE(id), data);
    return response.data;
  },

  async deletePrice(id: string): Promise<void> {
    await axiosInstance.delete(ItemsUrls.DELETE_PRICE(id));
  },

  // Stock management (admin only)
  async createStock(data: any): Promise<any> {
    const response = await axiosInstance.post(ItemsUrls.CREATE_STOCK, data);
    return response.data;
  },

  async updateStock(id: string, data: any): Promise<any> {
    const response = await axiosInstance.put(ItemsUrls.UPDATE_STOCK(id), data);
    return response.data;
  },

  async deleteStock(id: string): Promise<void> {
    await axiosInstance.delete(ItemsUrls.DELETE_STOCK(id));
  },

  // Image management (admin only)
  async createItemImage(data: any): Promise<any> {
    const response = await axiosInstance.post(ItemsUrls.CREATE_ITEM_IMAGE, data);
    return response.data;
  },

  async updateItemImage(id: string, data: any): Promise<any> {
    const response = await axiosInstance.put(ItemsUrls.UPDATE_ITEM_IMAGE(id), data);
    return response.data;
  },

  async deleteItemImage(id: string): Promise<void> {
    await axiosInstance.delete(ItemsUrls.DELETE_ITEM_IMAGE(id));
  },

  // Review management
  async createReview(data: any): Promise<any> {
    const response = await axiosInstance.post(ItemsUrls.CREATE_REVIEW, data);
    return response.data;
  },

  async updateReview(id: string, data: any): Promise<any> {
    const response = await axiosInstance.put(ItemsUrls.UPDATE_REVIEW(id), data);
    return response.data;
  },

  async deleteReview(id: string): Promise<void> {
    await axiosInstance.delete(ItemsUrls.DELETE_REVIEW(id));
  },

  // Rating management
  async createRating(data: any): Promise<any> {
    const response = await axiosInstance.post(ItemsUrls.CREATE_RATING, data);
    return response.data;
  },

  async updateRating(id: string, data: any): Promise<any> {
    const response = await axiosInstance.put(ItemsUrls.UPDATE_RATING(id), data);
    return response.data;
  },

  async deleteRating(id: string): Promise<void> {
    await axiosInstance.delete(ItemsUrls.DELETE_RATING(id));
  },

  // Favorites management
  async addToFavorites(itemId: string): Promise<any> {
    const response = await axiosInstance.post(ItemsUrls.ADD_TO_FAVORITES, { itemId });
    return response.data;
  },

  async removeFromFavorites(itemId: string): Promise<void> {
    await axiosInstance.delete(ItemsUrls.REMOVE_FROM_FAVORITES(itemId));
  },

  async getUserFavorites(): Promise<any[]> {
    const response = await axiosInstance.get(ItemsUrls.GET_USER_FAVORITES);
    return response.data;
  },
};
