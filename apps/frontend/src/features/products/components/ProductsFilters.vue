<template>
  <div class="products-filters">
    <div class="filters-container">
      <div class="filters-content">
        <!-- Search Filter -->
        <div class="filter-group">
          <label class="filter-label">Search Products</label>
          <v-text-field
            v-model="filters.search"
            placeholder="Search product..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            clearable
            hide-details
            @update:model-value="handleFilterChange"
          />
        </div>

        <!-- Category Filter -->
        <div class="filter-group">
          <label class="filter-label">Category</label>
          <v-autocomplete
            v-model="filters.category"
            :items="categories"
            item-title="name"
            item-value="slug"
            placeholder="Select Category"
            variant="outlined"
            density="compact"
            clearable
            hide-details
            @update:model-value="handleCategoryChange"
          />
        </div>

        <!-- Subcategory Filter -->
        <div class="filter-group">
          <label class="filter-label">Subcategory</label>
          <v-autocomplete
            v-model="filters.subcategory"
            :items="availableSubcategories"
            placeholder="Select Subcategory"
            item-title="name"
            item-value="slug"
            variant="outlined"
            density="compact"
            clearable
            :disabled="!filters.category"
            hide-details
            @update:model-value="handleFilterChange"
          />
        </div>

        <!-- Price Range Filter -->
        <div class="filter-group">
          <label class="filter-label">Price Range</label>
          <v-autocomplete
            v-model="filters.priceRange"
            :items="priceRanges"
            item-title="label"
            item-value="value"
            placeholder="Select Price Range"
            variant="outlined"
            density="compact"
            clearable
            hide-details
            @update:model-value="handleFilterChange"
          />
        </div>

        <!-- Rating Filter -->
        <div class="filter-group">
          <label class="filter-label">Minimum Rating</label>
          <v-autocomplete
            v-model="filters.minRating"
            :items="ratingOptions"
            item-title="label"
            item-value="value"
            placeholder="Select Minimum Rating"
            variant="outlined"
            density="compact"
            clearable
            hide-details
            @update:model-value="handleFilterChange"
          />
        </div>

        <!-- Sort By -->
        <div class="filter-group">
          <label class="filter-label">Sort By</label>
          <v-autocomplete
            v-model="filters.sortBy"
            :items="sortOptions"
            item-title="label"
            item-value="value"
            variant="outlined"
            placeholder="Select Sort By"
            density="compact"
            hide-details
            @update:model-value="handleFilterChange"
          />
        </div>

        <!-- Sort Order -->
        <div class="filter-group">
          <label class="filter-label">Sort Order</label>
          <v-autocomplete
            v-model="filters.sortOrder"
            :items="sortOrderOptions"
            item-title="label"
            item-value="value"
            placeholder="Select Sort Order"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="handleFilterChange"
          />
        </div>

        <!-- Items Per Page -->
        <div class="filter-group">
          <label class="filter-label">Items Per Page</label>
          <v-autocomplete
            v-model="filters.limit"
            :items="itemsPerPageOptions"
            item-title="label"
            item-value="value"
            placeholder="Select Items Per Page"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="handleFilterChange"
          />
        </div>

        <!-- Clear Filters -->
        <div class="filter-group">
          <v-btn
            color="secondary"
            variant="outlined"
            @click="clearFilters"
            class="clear-filters-btn"
            block
          >
            <v-icon icon="mdi-refresh" class="mr-2" />
            Clear All Filters
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

interface ProductsFiltersProps {
  categories: Category[];
}

const props = defineProps<ProductsFiltersProps>();

const emit = defineEmits<{
  filtersChanged: [filters: any];
  clearFilters: [];
}>();

// Router
const route = useRoute();
const router = useRouter();

// Computed properties
const availableSubcategories = computed(() => {
  if (!filters.value.category) return [];
  const selectedCategory = props.categories.find(
    (cat) => cat.slug === filters.value.category
  );
  return selectedCategory?.subcategories || [];
});

// Filters
const filters = ref({
  search: undefined as string | undefined,
  category: undefined as string | undefined,
  subcategory: undefined,
  priceRange: undefined,
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  minRating: undefined as number | undefined,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 12,
});

// Initialize filters from URL query parameters
const initializeFiltersFromQuery = () => {
  const query = route.query;

  if (query.search) filters.value.search = query.search as string;
  if (query.category) filters.value.category = query.category as string;
  if (query.subcategory)
    filters.value.subcategory = query.subcategory as string;
  if (query.priceRange) filters.value.priceRange = query.priceRange as string;
  if (query.minRating) filters.value.minRating = Number(query.minRating as string);
  if (query.sortBy) filters.value.sortBy = query.sortBy as string;
  if (query.sortOrder) filters.value.sortOrder = query.sortOrder as string;
  if (query.page) filters.value.page = parseInt(query.page as string) || 1;
  if (query.limit) filters.value.limit = parseInt(query.limit as string) || 12;
};

// Update URL query parameters
const updateQueryParams = (newFilters: any) => {
  const query: any = {};

  Object.keys(newFilters).forEach((key) => {
    if (
      newFilters[key] !== '' &&
      newFilters[key] !== null &&
      newFilters[key] !== undefined
    ) {
      query[key] = newFilters[key];
    }
  });

  // Remove page from URL if it's 1 (default)
  if (query.page === 1) {
    delete query.page;
  }

  // Remove limit from URL if it's 12 (default)
  if (query.limit === 12) {
    delete query.limit;
  }

  router.replace({ query });
};

// Filter options
const priceRanges = [
  { label: 'Under $50', value: '0-50' },
  { label: '$50 - $100', value: '50-100' },
  { label: '$100 - $200', value: '100-200' },
  { label: '$200 - $500', value: '200-500' },
  { label: 'Over $500', value: '500+' },
];

const ratingOptions = [
  { label: '4+ Stars', value: 4 },
  { label: '3+ Stars', value: 3 },
  { label: '2+ Stars', value: 2 },
];

const sortOptions = [
  { label: 'Newest First', value: 'createdAt' },
  { label: 'Name A-Z', value: 'name' },
  { label: 'Price Low to High', value: 'price' },
  { label: 'Price High to Low', value: 'price' },
  { label: 'Highest Rated', value: 'rating' },
];

const sortOrderOptions = [
  { label: 'Descending', value: 'desc' },
  { label: 'Ascending', value: 'asc' },
];

const itemsPerPageOptions = [
  { label: '12 per page', value: 12 },
  { label: '24 per page', value: 24 },
  { label: '48 per page', value: 48 },
];

// Methods
const applyFilters = (resetPage = true) => {
  if (resetPage) {
    filters.value.page = 1; // Reset to first page when filters change
  }
  const newFilters = { ...filters.value };

  // Process price range before sending to backend
  if (newFilters.priceRange) {
    const [min, max] = newFilters.priceRange.split('-');
    if (max === '+') {
      newFilters.minPrice = parseInt(min);
    } else {
      newFilters.minPrice = parseInt(min);
      newFilters.maxPrice = parseInt(max);
    }
    // Set priceRange to empty string as it's not a valid backend parameter
    newFilters.priceRange = '';
  }

  updateQueryParams(newFilters);
  emit('filtersChanged', newFilters);
};

const handleFilterChange = () => {
  applyFilters(true);
};

const handleCategoryChange = () => {
  // When category changes, reset subcategory to empty
  filters.value.subcategory = '';
  applyFilters(); // Apply filters to update URL and emit
};

const clearFilters = () => {
  filters.value = {
    search: '',
    category: '',
    subcategory: '',
    priceRange: '',
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 12,
  };
  // Clear URL query parameters
  router.replace({ query: {} });
  emit('clearFilters');
};

// Method to update page without resetting other filters
const updatePage = (page: number) => {
  filters.value.page = page;
  applyFilters(false); // Don't reset page
};

// Watch for filter changes (excluding page changes)
watch(
  () => ({
    search: filters.value.search,
    category: filters.value.category,
    subcategory: filters.value.subcategory,
    priceRange: filters.value.priceRange,
    minPrice: filters.value.minPrice,
    maxPrice: filters.value.maxPrice,
    minRating: filters.value.minRating,
    sortBy: filters.value.sortBy,
    sortOrder: filters.value.sortOrder,
    limit: filters.value.limit,
  }),
  () => {
    // Debounce filter changes to avoid too many API calls
    clearTimeout((window as any).filterTimeout);
    (window as any).filterTimeout = setTimeout(() => {
      applyFilters();
    }, 300);
  },
  { deep: true }
);

// Watch for route query changes (when user navigates back/forward)
watch(
  () => route.query,
  () => {
    initializeFiltersFromQuery();
  },
  { deep: true }
);

// Lifecycle
onMounted(() => {
  initializeFiltersFromQuery();
});

// Expose filters for external access
defineExpose({
  filters,
  applyFilters,
  clearFilters,
  updateQueryParams,
  updatePage,
});
</script>

<style scoped>
.products-filters {
  padding: 0;
}

.filters-container {
  background-color: transparent;
  border-radius: 0;
  box-shadow: none;
  overflow: visible;
}

.filters-content {
  padding: 16px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: end;
}

.filter-group {
  margin-bottom: 0;
}

.filter-label {
  font-size: 13px;
  font-weight: 500;
  color: #555;
  margin-bottom: 6px;
  display: block;
}

.clear-filters-btn {
  margin-top: 0;
  width: 100%;
  height: 40px;
}

.placeholder-text {
  color: #9e9e9e;
  font-size: 14px;
  pointer-events: none;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .filters-content {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
    padding: 12px 16px;
  }
}

@media (max-width: 600px) {
  .filters-content {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 12px 16px;
  }

  .filter-group {
    margin-bottom: 0;
  }
}
</style>
