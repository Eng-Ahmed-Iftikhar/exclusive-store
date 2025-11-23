<template>
  <div class="search-input-container" ref="searchContainer">
    <div class="search-input-wrapper">
      <v-text-field
        v-model="searchQuery"
        placeholder="What are you looking for?"
        density="compact"
        variant="solo-filled"
        hide-details
        class="search-field"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
        @keydown.enter="handleEnter"
        @keydown.escape="handleEscape"
        ref="searchInput"
      >
        <template #prepend-inner>
          <v-icon icon="mdi-magnify" size="18" color="grey" />
        </template>

        <template #append-inner>
          <v-icon
            v-if="searchQuery"
            icon="mdi-close"
            size="18"
            color="grey"
            class="clear-icon"
            @click="clearSearch"
            style="cursor: pointer"
          />
        </template>
      </v-text-field>
    </div>

    <!-- Search Dropdown -->
    <SearchDropdown
      :show-dropdown="showDropdown"
      :loading="loading"
      :search-results="searchResults"
      :search-query="searchQuery"
      @category-selected="handleCategorySelected"
      @product-selected="handleProductSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { searchAPI, SearchResult } from '../../stores/apis/search.api';
import SearchDropdown from './SearchDropdown.vue';

const router = useRouter();

// Refs
const searchContainer = ref<HTMLElement>();
const searchInput = ref<HTMLElement>();
const searchQuery = ref('');
const showDropdown = ref(false);
const loading = ref(false);
const searchResults = ref<SearchResult>({
  categories: [],
  products: [],
  total: 0,
});

// Debounce timer
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_DELAY = 300; // 300ms delay

// Lifecycle
onMounted(() => {
  // Add click outside listener
  document.addEventListener('click', handleClickOutside);

  // Listen for close dropdown event
  window.addEventListener('close-search-dropdown', () => {
    showDropdown.value = false;
  });
});

// Method to clear search from external components
const clearSearchFromExternal = () => {
  clearSearch();
};

// Expose method for external use
defineExpose({
  clearSearchFromExternal,
});

onUnmounted(() => {
  // Clean up listeners
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('close-search-dropdown', () => {
    showDropdown.value = false;
  });
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});

// Event handlers
const handleFocus = () => {
  if (searchQuery.value.trim().length >= 2) {
    showDropdown.value = true;
  }
};

const handleBlur = () => {
  // Delay hiding dropdown to allow click events
  setTimeout(() => {
    if (!searchContainer.value?.contains(document.activeElement)) {
      showDropdown.value = false;
    }
  }, 150);
};

const handleInput = () => {
  const query = searchQuery.value.trim();

  // Clear previous timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Hide dropdown if query is too short
  if (query.length < 2) {
    showDropdown.value = false;
    searchResults.value = { categories: [], products: [], total: 0 };
    return;
  }

  // Show dropdown and start loading
  showDropdown.value = true;
  loading.value = true;

  // Set new debounce timer
  debounceTimer = setTimeout(async () => {
    try {
      const results = await searchAPI.search(query);
      console.log('Search results:', results);
      console.log('Products:', results.products);
      if (results.products.length > 0) {
        console.log('First product:', results.products[0]);
        console.log('First product ID:', results.products[0].id);
      }
      searchResults.value = results;
    } catch (error) {
      console.error('Search failed:', error);
      searchResults.value = { categories: [], products: [], total: 0 };
    } finally {
      loading.value = false;
    }
  }, DEBOUNCE_DELAY);
};

const handleEnter = () => {
  if (searchQuery.value.trim()) {
    router.push(
      `/products?search=${encodeURIComponent(searchQuery.value.trim())}`
    );
    showDropdown.value = false;
  }
};

const handleEscape = () => {
  showDropdown.value = false;
  searchInput.value?.blur();
};

const clearSearch = () => {
  searchQuery.value = '';
  showDropdown.value = false;
  searchResults.value = { categories: [], products: [], total: 0 };
  nextTick(() => {
    searchInput.value?.focus();
  });
};

const handleClickOutside = (event: Event) => {
  if (
    searchContainer.value &&
    !searchContainer.value.contains(event.target as Node)
  ) {
    showDropdown.value = false;
  }
};

const handleProductSelected = (product: any) => {
  // Clear search when a product is selected
  clearSearch();
};

const handleCategorySelected = (category: any) => {
  // Clear search when a category is selected
  clearSearch();
};
</script>

<style scoped>
.search-input-container {
  position: relative;
  width: 100%;
}

.search-input-wrapper {
  position: relative;
}

.search-field {
  width: 100%;
}

.search-field :deep(.v-field) {
  border-radius: 8px;
  background: #f5f5f5;
  min-height: 40px;
  box-shadow: none;
  height: 40px;
  transition: all 0.2s ease;
}

.search-field :deep(.v-field:hover) {
  background: #ebebeb;
}

.search-field :deep(.v-field--focused) {
  background: white;
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.2);
}

.search-field :deep(input) {
  font-size: 14px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 6px;
  padding-bottom: 6px;
}

.search-field :deep(.v-field__prepend-inner) {
  padding-left: 12px;
}

.search-field :deep(.v-field__append-inner) {
  padding-right: 12px;
}

.clear-icon {
  transition: all 0.2s ease;
}

.clear-icon:hover {
  color: #666 !important;
  transform: scale(1.1);
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .search-field :deep(.v-field) {
    min-height: 38px;
    height: 38px;
  }

  .search-field :deep(input) {
    font-size: 13px;
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .search-field :deep(.v-field__prepend-inner) {
    padding-left: 10px;
  }

  .search-field :deep(.v-field__append-inner) {
    padding-right: 10px;
  }
}

@media (max-width: 600px) {
  .search-field :deep(.v-field) {
    min-height: 36px;
    height: 36px;
  }

  .search-field :deep(input) {
    font-size: 12px;
    padding-top: 4px;
    padding-bottom: 4px;
  }

  .search-field :deep(.v-field__prepend-inner) {
    padding-left: 8px;
  }

  .search-field :deep(.v-field__append-inner) {
    padding-right: 8px;
  }
}
</style>
