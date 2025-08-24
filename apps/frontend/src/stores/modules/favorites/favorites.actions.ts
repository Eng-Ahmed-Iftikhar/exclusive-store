import { IFavorites } from ".";
import { favoritesApi } from "../../apis/favorites.api";

export async function getUserFavorites(): Promise<IFavorites.FavoriteItem[]> {
  try {
    const response = await favoritesApi.getUserFavorites();
    return response.map(item => ({
      ...item,
      userId: '', // API doesn't provide userId
      itemId: item.item?.id || '',
      createdAt: new Date(item.createdAt)
    }));
  } catch (err) {
    throw new Error('Failed to fetch favorites');
  }
}

export async function addToFavorites(itemId: string): Promise<IFavorites.FavoriteItem> {
  try {
    const response = await favoritesApi.addToFavorites(itemId);
    return {
      ...response,
      userId: '', // API doesn't provide userId
      itemId: itemId,
      createdAt: new Date(response.createdAt)
    };
  } catch (err) {
    throw new Error('Failed to add to favorites');
  }
}

export async function removeFromFavorites(itemId: string): Promise<void> {
  try {
    await favoritesApi.removeFromFavorites(itemId);
  } catch (err) {
    throw new Error('Failed to remove from favorites');
  }
}

export async function checkIfFavorite(itemId: string): Promise<boolean> {
  try {
    const response = await favoritesApi.checkFavoriteStatus(itemId);
    return response.isFavorited;
  } catch (err) {
    throw new Error('Failed to check favorite status');
  }
}
