import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { IProducts, ProductsActions } from '.';

export const useProductsStore = defineStore('products', () => {
  // ****** State ******
  const products = ref<IProducts.Product[]>([]);
  const featuredProducts = ref<IProducts.Product[]>([]);
  const bestSellingProducts = ref<IProducts.Product[]>([]);
  const newArrivalProducts = ref<IProducts.Product[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const selectedProduct = ref<IProducts.Product | null>(null);
  const pagination = ref<IProducts.ProductsResponse | null>(null);

  // ****** Getters ******
  const productsCount = computed(() => products.value.length);
  const hasProducts = computed(() => products.value.length > 0);
  const hasFeaturedProducts = computed(() => featuredProducts.value.length > 0);
  const hasBestSellingProducts = computed(() => bestSellingProducts.value.length > 0);
  const hasNewArrivalProducts = computed(() => newArrivalProducts.value.length > 0);

  // ****** Actions ******
  const fetchProducts = async (
    params?: IProducts.ProductQueryParams
  ): Promise<IProducts.Product[]> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await ProductsActions.getProducts(params);
      products.value = response.products;
      pagination.value = response;

      return response.products;
    } catch (err) {
      error.value = 'Failed to fetch products';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchFeaturedProducts = async (): Promise<IProducts.Product[]> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await ProductsActions.getFeaturedProducts();
      featuredProducts.value = response;

      return response;
    } catch (err) {
      error.value = 'Failed to fetch featured products';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchBestSellingProducts = async (): Promise<IProducts.Product[]> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await ProductsActions.getBestSellingProducts();
      bestSellingProducts.value = response;

      return response;
    } catch (err) {
      error.value = 'Failed to fetch best selling products';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchNewArrivalProducts = async (): Promise<IProducts.Product[]> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await ProductsActions.getNewArrivalProducts();
      newArrivalProducts.value = response;

      return response;
    } catch (err) {
      error.value = 'Failed to fetch new arrival products';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchProductById = async (id: string): Promise<IProducts.Product> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await ProductsActions.getProductById(id);
      selectedProduct.value = response;

      return response;
    } catch (err) {
      error.value = 'Failed to fetch product';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const searchProducts = async (
    query: string,
    params?: IProducts.ProductQueryParams
  ): Promise<IProducts.Product[]> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await ProductsActions.searchProducts(query, params);
      products.value = response.products;
      pagination.value = response;

      return response.products;
    } catch (err) {
      error.value = 'Failed to search products';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const clearError = (): void => {
    error.value = null;
  };

  const reset = (): void => {
    products.value = [];
    featuredProducts.value = [];
    bestSellingProducts.value = [];
    newArrivalProducts.value = [];
    loading.value = false;
    error.value = null;
    selectedProduct.value = null;
    pagination.value = null;
  };

  return {
    // ****** State ******
    products,
    featuredProducts,
    bestSellingProducts,
    newArrivalProducts,
    loading,
    error,
    selectedProduct,
    pagination,

    // ****** Getters ******
    productsCount,
    hasProducts,
    hasFeaturedProducts,
    hasBestSellingProducts,
    hasNewArrivalProducts,

    // ****** Actions ******
    fetchProducts,
    fetchFeaturedProducts,
    fetchBestSellingProducts,
    fetchNewArrivalProducts,
    fetchProductById,
    searchProducts,
    clearError,
    reset,
  };
});

