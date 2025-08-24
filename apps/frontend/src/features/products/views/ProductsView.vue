<template>
  <div class="products-page">
    <!-- Main Content -->
    <div class="main-content">
      <v-container>
        <!-- Filters Section (Top) -->
        <div class="filters-section">
          <div class="filters-container">
            <div class="filters-header">
              <h3 class="filters-title">
                <v-icon icon="mdi-tune" class="mr-2" />
                Filters
              </h3>
              <v-btn icon="mdi-refresh" variant="text" size="small" @click="handleClearFilters" color="primary" />
            </div>

            <ProductsFilters :categories="categories" @filters-changed="handleFiltersChanged"
              @clear-filters="handleClearFilters" ref="filtersRef" />
          </div>
        </div>

        <!-- Products Section (Bottom) -->
        <div class="products-section">
          <div class="products-content">
            <ProductsGrid :products="products" :pagination="pagination" :loading="loading" :error="error"
              @page-change="handlePageChange" @retry="fetchProducts" @clear-filters="handleClearFilters" />
          </div>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { IItems, useItemsStore, ICategories, useCategoriesStore, useFavoritesStore } from '../../../stores';
import ProductsFilters from '../components/ProductsFilters.vue';
import ProductsGrid from '../components/ProductsGrid.vue';
import { usePageTitle } from '../../../composables/usePageTitle';

// Stores
const itemsStore = useItemsStore();
const categoriesStore = useCategoriesStore();
const favoritesStore = useFavoritesStore();

// Page title management
const { setPageTitle } = usePageTitle();

// Refs
const filtersRef = ref();

// Reactive state
const loading = ref(false);
const error = ref<string | null>(null);

// Computed properties
const products = computed(() => {
  return itemsStore.items as unknown as IItems.IItems.Item[] || [];
});

const categories = computed(() => {
  return categoriesStore.categories as unknown as ICategories.ICategories.Category[] || [];
});

const pagination = computed(() => {
  const paginationData = itemsStore.pagination as unknown as IItems.IItems.ItemsResponse;
  if (!paginationData) {
    return {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    };
  }
  return {
    total: paginationData.total || 0,
    page: paginationData.page || 1,
    limit: paginationData.limit || 10,
    totalPages: paginationData.totalPages || 0
  };
});

// Methods
const fetchProducts = async (filters?: any) => {
  try {
    loading.value = true;
    error.value = null;

    let queryParams: any = {};

    if (filters) {
      queryParams = { ...filters };

      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined || key === 'priceRange') {
          delete queryParams[key];
        }
      });
    }

    const result = await itemsStore.fetchItems(queryParams);
    if (result && result.length > 0) {
      // Products loaded successfully
    } else {
      // No products found
    }
  } catch (err) {
    // Error fetching products
  } finally {
    loading.value = false;
  }
};

const handleFiltersChanged = (filters: any) => {
  fetchProducts(filters);
};

const handleClearFilters = () => {
  if (filtersRef.value) {
    filtersRef.value.clearFilters();
  }
  fetchProducts();
};

const handlePageChange = (page: number) => {
  if (filtersRef.value) {
    filtersRef.value.filters.page = page;
    const newFilters = { ...filtersRef.value.filters };
    filtersRef.value.updateQueryParams(newFilters);
    fetchProducts(newFilters);
  }
};

// Watch for products changes to check favorite status
watch(products, async (newProducts) => {
  if (newProducts && newProducts.length > 0 && favoritesStore.isLoggedIn) {
    const itemIds = newProducts.map(product => product.id).filter(Boolean);
    if (itemIds.length > 0) {
      for (const itemId of itemIds) {
        await favoritesStore.checkFavoriteStatus(itemId);
      }
    }
  }
}, { immediate: false });

// Lifecycle
onMounted(async () => {
  try {
    setPageTitle('Products');
    await categoriesStore.fetchCategories();
    await fetchProducts();
  } catch (err) {
    // Error in ProductsPage onMounted
  }
});
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding-top: 12px;
}

/* Main Content */
.main-content {
  padding: 12px 0 24px 0;
}

/* Filters Section (Top) */
.filters-section {
  margin-bottom: 20px;
}

.filters-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  width: 100%;
}

.filters-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filters-title {
  font-size: 16px;
  font-weight: 600;
  color: #495057;
  margin: 0;
}

/* Products Section (Bottom) */
.products-section {
  width: 100%;
}

.products-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  min-height: 300px;
  width: 100%;
}

/* Responsive Design */
@media (max-width: 960px) {
  .main-content {
    padding: 8px 0 20px 0;
  }

  .filters-section {
    margin-bottom: 16px;
  }

  .filters-header {
    padding: 14px 16px;
  }
}

@media (max-width: 600px) {
  .products-page {
    padding-top: 8px;
  }

  .main-content {
    padding: 8px 0 16px 0;
  }

  .filters-section {
    margin-bottom: 12px;
  }

  .filters-container,
  .products-content {
    border-radius: 8px;
  }

  .filters-header {
    padding: 12px 16px;
  }
}
</style>