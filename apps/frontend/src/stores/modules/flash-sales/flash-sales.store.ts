import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { IFlashSales, FlashSalesActions } from '.';

export const useFlashSalesStore = defineStore('flash-sales', () => {
  // ****** State ******
  const flashSales = ref<IFlashSales.FlashSale[]>([]);
  const activeFlashSale = ref<IFlashSales.FlashSale | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // ****** Getters ******
  const hasActiveFlashSale = computed(() => activeFlashSale.value !== null);
  const activeFlashSaleItems = computed(
    () => activeFlashSale.value?.items || []
  );

  // ****** Actions ******
  const fetchActiveFlashSales = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;
      flashSales.value = await FlashSalesActions.getActiveFlashSales();

      // Set the first active flash sale as current
      if (flashSales.value.length > 0) {
        activeFlashSale.value = flashSales.value[0];
      }
    } catch (err) {
      // Error fetching flash sales
      error.value = 'Failed to fetch flash sales';
    } finally {
      loading.value = false;
    }
  };

  const setActiveFlashSale = (flashSale: IFlashSales.FlashSale): void => {
    activeFlashSale.value = flashSale;
  };

  const clearError = (): void => {
    error.value = null;
  };

  const reset = (): void => {
    flashSales.value = [];
    activeFlashSale.value = null;
    loading.value = false;
    error.value = null;
  };

  return {
    // ****** State ******
    flashSales,
    activeFlashSale,
    loading,
    error,

    // ****** Getters ******
    hasActiveFlashSale,
    activeFlashSaleItems,

    // ****** Actions ******
    fetchActiveFlashSales,
    setActiveFlashSale,
    clearError,
    reset,
  };
});
