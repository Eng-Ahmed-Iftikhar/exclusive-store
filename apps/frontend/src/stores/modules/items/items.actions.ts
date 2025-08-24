import { IItems } from ".";
import { itemsApi } from "../../apis/items.api";

export async function getItems(params?: IItems.ItemQueryParams): Promise<IItems.ItemsResponse> {
  try {
    return await itemsApi.getItems(params);
  } catch (err) {
    throw new Error('Failed to fetch items');
  }
}

export async function getFeaturedItems(): Promise<IItems.Item[]> {
  try {
    return await itemsApi.getFeaturedItems();
  } catch (err) {
    throw new Error('Failed to fetch featured items');
  }
}

export async function getBestSellingItems(): Promise<IItems.Item[]> {
  try {
    const response = await itemsApi.getBestSellingItems();
    return response.slice(0, 4); // Get top 4
  } catch (err) {
    throw new Error('Failed to fetch best selling items');
  }
}

export async function getTopRatedItems(minRating: number = 4, limit: number = 10): Promise<IItems.Item[]> {
  try {
    return await itemsApi.getTopRatedItems(minRating, limit);
  } catch (err) {
    throw new Error('Failed to fetch top rated items');
  }
}

export async function getNewArrivalItems(limit: number = 8): Promise<IItems.Item[]> {
  try {
    return await itemsApi.getNewArrivalItems(limit);
  } catch (err) {
    throw new Error('Failed to fetch new arrival items');
  }
}

export async function getItemById(id: string): Promise<IItems.Item> {
  try {
    return await itemsApi.getItemById(id);
  } catch (err) {
    throw new Error('Failed to fetch item');
  }
}

export async function getItemsByCategory(
  categoryId: string, 
  params?: Omit<IItems.ItemQueryParams, 'categoryId'>
): Promise<IItems.ItemsResponse> {
  try {
    return await itemsApi.getItemsByCategory(categoryId, params);
  } catch (err) {
    throw new Error('Failed to fetch items by category');
  }
}

export async function getItemsBySubcategory(
  subcategoryId: string, 
  params?: Omit<IItems.ItemQueryParams, 'subcategoryId'>
): Promise<IItems.ItemsResponse> {
  try {
    return await itemsApi.getItemsBySubcategory(subcategoryId, params);
  } catch (err) {
    throw new Error('Failed to fetch items by subcategory');
  }
}

export async function searchItems(
  query: string, 
  params?: Omit<IItems.ItemQueryParams, 'search'>
): Promise<IItems.ItemsResponse> {
  try {
    return await itemsApi.searchItems({
      ...params,
      search: query,
    });
  } catch (err) {
    throw new Error('Failed to fetch search items');
  }
}
