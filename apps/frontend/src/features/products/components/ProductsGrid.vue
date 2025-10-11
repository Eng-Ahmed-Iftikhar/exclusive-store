<template>
  <div class="products-grid-section">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="mt-4">Loading products...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <v-icon icon="mdi-alert" size="64" color="error" />
      <p class="mt-4">{{ error }}</p>
      <v-btn @click="$emit('retry')" color="primary" variant="flat" class="mt-4">
        Try Again
      </v-btn>
    </div>

    <!-- Products Grid -->
    <div v-else-if="products.length > 0" class="products-content">
      <!-- Products Display -->
      <div class="products-grid">
        <ProductCard v-for="product in products" :key="product.id" :product="product" :show-sale-tag="true"
          class="product-card" />
      </div>

      <!-- Pagination -->
      <div class="pagination-section">
        <v-pagination v-model="currentPage" :length="paginationInfo.totalPages" :total-visible="7"
          @update:model-value="handlePageChange" class="pagination" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-content">
        <v-icon icon="mdi-package-variant" size="80" color="grey" />
        <h3 class="empty-title">No products found</h3>
        <p class="empty-message">Try adjusting your filters or search terms</p>
        <v-btn @click="$emit('clearFilters')" color="primary" variant="flat" class="mt-4">
          Clear All Filters
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import ProductCard from '../../../components/ProductCard.vue';


interface Product {
  id: string;
  name: string;
  [key: string]: any;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ProductsGridProps {
  products: Product[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
}

const props = withDefaults(defineProps<ProductsGridProps>(), {
  products: () => [],
  pagination: () => ({ total: 0, page: 1, limit: 10, totalPages: 0 }),
  loading: false,
  error: null
});

const emit = defineEmits<{
  pageChange: [page: number];
  retry: [];
  clearFilters: [];
}>();

// Local state
const currentPage = ref(props.pagination?.page || 1);

// Computed properties
const paginationInfo = computed(() => {
  const { page, limit, total } = props.pagination;
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total);

  return {
    startIndex,
    endIndex,
    total,
    totalPages: props.pagination.totalPages
  };
});

// Methods
const handlePageChange = (page: number) => {
  currentPage.value = page;
  emit('pageChange', page);
};

// Watch for pagination changes from parent
watch(() => props.pagination?.page, (newPage) => {
  currentPage.value = newPage;
});
</script>

<style scoped>
.products-grid-section {
  height: 100%;
  padding: 0;
  width: 100%;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  text-align: center;
  min-height: 160px;
  width: 100%;
}

.loading-state p,
.error-state p,
.empty-state p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.products-content {
  padding: 0;
  min-height: 300px;
  width: 100%;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  align-items: start;
}

.product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-bottom: 0;
  width: 100%;
  height: fit-content;
  min-width: 0;
  justify-self: center;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.pagination-section {
  display: flex;
  justify-content: center;
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
  margin-top: 12px;
  width: 100%;
  box-sizing: border-box;
}

.pagination {
  --v-pagination-item-margin: 0 4px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 12px 0 6px 0;
}

.empty-message {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
}

/* Responsive Design */
@media (max-width: 960px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    padding: 16px;
  }

  .pagination-section {
    padding: 12px;
    margin-top: 10px;
  }

  .loading-state,
  .error-state,
  .empty-state {
    padding: 24px 12px;
    min-height: 140px;
  }
}

@media (max-width: 600px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 12px;
  }

  .pagination-section {
    padding: 10px;
    margin-top: 8px;
  }

  .loading-state,
  .error-state,
  .empty-state {
    padding: 20px 10px;
    min-height: 120px;
  }
}
</style>
