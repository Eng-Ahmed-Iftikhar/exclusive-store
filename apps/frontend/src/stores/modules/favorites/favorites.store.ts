import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { IFavorites, FavoritesActions } from '.';
import { useAuthStore } from '../auth';

export const useFavoritesStore = defineStore('favorites', () => {
  // ****** State ******
  const favorites = ref<IFavorites.FavoriteItem[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const authStore = useAuthStore();

  // ****** Getters ******
  const favoritesCount = computed(() => favorites.value.length);
  const isEmpty = computed(() => favorites.value.length === 0);
  const isLoggedIn = computed(() => {
    return authStore.isAuthenticated;
  });

  // ****** Actions ******
  const fetchFavorites = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;
      favorites.value = await FavoritesActions.getUserFavorites();
    } catch (err) {
      error.value = 'Failed to fetch favorites';
    } finally {
      loading.value = false;
    }
  };

  const addToFavorites = async (itemId: string): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;
      const newFavorite = await FavoritesActions.addToFavorites(itemId);
      favorites.value.push(newFavorite);
    } catch (err) {
      error.value = 'Failed to add to favorites';
    } finally {
      loading.value = false;
    }
  };

  const removeFromFavorites = async (itemId: string): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;
      await FavoritesActions.removeFromFavorites(itemId);
      favorites.value = favorites.value.filter((fav) => fav.itemId !== itemId);
    } catch (err) {
      error.value = 'Failed to remove from favorites';
    } finally {
      loading.value = false;
    }
  };
  const checkFavoriteStatus = async (itemId: string): Promise<boolean> => {
    return await FavoritesActions.checkIfFavorite(itemId);
  };
  const toggleFavorite = async (itemId: string): Promise<void> => {
    const isFavorite = favorites.value.some((fav) => fav.itemId === itemId);

    if (isFavorite) {
      await removeFromFavorites(itemId);
    } else {
      await addToFavorites(itemId);
    }
  };

  const isItemFavorite = (itemId: string): boolean => {
    return favorites.value.some((fav) => fav.itemId === itemId);
  };

  const clearError = (): void => {
    error.value = null;
  };

  const reset = (): void => {
    favorites.value = [];
    loading.value = false;
    error.value = null;
  };

  return {
    // ****** State ******
    favorites,
    loading,
    error,

    // ****** Getters ******
    favoritesCount,
    isEmpty,
    isLoggedIn,

    // ****** Actions ******
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    checkFavoriteStatus,
    toggleFavorite,
    isItemFavorite,
    clearError,
    reset,
  };
});
