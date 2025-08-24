import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { IItems, ItemsActions } from '.';

export const useItemsStore = defineStore('items', () => {
  // ****** State ******
  const items = ref<IItems.Item[]>([]);
  const featuredItems = ref<IItems.Item[]>([]);
  const bestSellingItems = ref<IItems.Item[]>([]);
  const newArrivalItems = ref<IItems.Item[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const selectedItem = ref<IItems.Item | null>(null);
  const pagination = ref<IItems.ItemsResponse | null>(null);

  // ****** Getters ******
  const itemsCount = computed(() => items.value.length);
  const hasItems = computed(() => items.value.length > 0);
  const hasFeaturedItems = computed(() => featuredItems.value.length > 0);
  const hasBestSellingItems = computed(() => bestSellingItems.value.length > 0);
  const hasNewArrivalItems = computed(() => newArrivalItems.value.length > 0);

  // ****** Actions ******
  const fetchItems = async (
    params?: IItems.ItemQueryParams
  ): Promise<IItems.Item[]> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await ItemsActions.getItems(params);
      items.value = response.items;
      pagination.value = response;

      return response.items;
    } catch (err) {
      error.value = 'Failed to fetch items';
      // Handle error silently
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchFeaturedItems = async (): Promise<IItems.Item[]> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await ItemsActions.getFeaturedItems();
      featuredItems.value = response;

      return response;
    } catch (err) {
      error.value = 'Failed to fetch featured items';
      // Handle error silently
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchBestSellingItems = async (): Promise<IItems.Item[]> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await ItemsActions.getBestSellingItems();
      bestSellingItems.value = response;

      return response;
    } catch (err) {
      error.value = 'Failed to fetch best selling items';
      // Handle error silently
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchNewArrivalItems = async (): Promise<IItems.Item[]> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await ItemsActions.getNewArrivalItems();
      newArrivalItems.value = response;

      return response;
    } catch (err) {
      error.value = 'Failed to fetch new arrival items';
      // Handle error silently
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchItemById = async (id: string): Promise<IItems.Item> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await ItemsActions.getItemById(id);
      selectedItem.value = response;

      return response;
    } catch (err) {
      error.value = 'Failed to fetch item';
      // Handle error silently
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const searchItems = async (
    query: string,
    params?: IItems.ItemQueryParams
  ): Promise<IItems.Item[]> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await ItemsActions.searchItems(query, params);
      items.value = response.items;
      pagination.value = response;

      return response.items;
    } catch (err) {
      error.value = 'Failed to search items';
      // Handle error silently
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const clearError = (): void => {
    error.value = null;
  };

  const reset = (): void => {
    items.value = [];
    featuredItems.value = [];
    bestSellingItems.value = [];
    newArrivalItems.value = [];
    loading.value = false;
    error.value = null;
    selectedItem.value = null;
    pagination.value = null;
  };

  return {
    // ****** State ******
    items,
    featuredItems,
    bestSellingItems,
    newArrivalItems,
    loading,
    error,
    selectedItem,
    pagination,

    // ****** Getters ******
    itemsCount,
    hasItems,
    hasFeaturedItems,
    hasBestSellingItems,
    hasNewArrivalItems,

    // ****** Actions ******
    fetchItems,
    fetchFeaturedItems,
    fetchBestSellingItems,
    fetchNewArrivalItems,
    fetchItemById,
    searchItems,
    clearError,
    reset,
  };
});
