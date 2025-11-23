<template>
  <div v-if="showDropdown" class="search-dropdown">
    <!-- Loading State -->
    <div v-if="loading" class="dropdown-loading">
      <v-progress-circular indeterminate color="primary" size="24" />
      <span class="loading-text">Searching...</span>
    </div>

    <!-- Results -->
    <div v-else-if="hasResults" class="dropdown-content">
      <!-- Categories Section -->
      <div v-if="searchResults.categories.length > 0" class="results-section">
        <div class="section-header">
          <v-icon icon="mdi-folder" size="16" color="primary" />
          <span class="section-title">Categories</span>
        </div>
        <div class="categories-list">
          <div v-for="category in searchResults.categories" :key="category.id" class="category-wrapper">
            <div class="category-item" @click="handleCategoryClick(category)">
              <div class="category-icon">
                <v-icon :icon="category.icon || 'mdi-folder'" size="20" color="primary" />
              </div>
              <div class="category-info">
                <div class="category-name">{{ category.name }}</div>
                <div v-if="category.subcategories.length > 0" class="subcategories">
                  {{ category.subcategories.length }} subcategories
                </div>
              </div>
              <v-icon icon="mdi-chevron-right" size="16" color="grey" />
            </div>
            
            <!-- Subcategories List -->
            <div v-if="category.subcategories.length > 0" class="subcategories-list">
              <div 
                v-for="subcategory in category.subcategories" 
                :key="subcategory.id" 
                class="subcategory-item"
                @click.stop="handleSubcategoryClick(category, subcategory)"
              >
                <v-icon icon="mdi-subdirectory-arrow-right" size="16" color="grey" />
                <span class="subcategory-name">{{ subcategory.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Section -->
      <div v-if="searchResults.products.length > 0" class="results-section">
        <div class="section-header">
          <v-icon icon="mdi-package-variant" size="16" color="primary" />
          <span class="section-title">Products</span>
        </div>
        <div class="products-list">
          <button v-for="product in searchResults.products" :key="product.id" class="product-item"
            @click="handleProductClick(product)" type="button">
            <div class="product-image">
              <img :src="product.primaryImage || PLACEHOLDER_IMAGE" :alt="product.name"
                @error="handleImageError" />
            </div>
            <div class="product-info">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-category">{{ product.category.name }}</div>
              <div class="product-rating">
                <div class="stars">
                  <v-icon v-for="star in 5" :key="star" icon="mdi-star" size="12"
                    :color="star <= product.averageRating ? '#FFD700' : '#E0E0E0'" />
                </div>
                <span class="rating-count">({{ product.totalReviews }})</span>
              </div>
            </div>
            <div class="product-price">
              <span v-if="product.isOnSale" class="sale-price">${{ product.salePrice }}</span>
              <span class="current-price">${{ product.currentPrice }}</span>
            </div>
          </button>
        </div>
      </div>

      <!-- View All Results -->
      <div class="view-all-section">
        <v-btn variant="text" color="primary" size="small" @click="handleViewAllResults" class="view-all-btn">
          View all {{ searchResults.total }} results
          <v-icon icon="mdi-arrow-right" size="16" class="ml-1" />
        </v-btn>
      </div>
    </div>

    <!-- No Results -->
    <div v-else-if="!loading && searchQuery" class="no-results">
      <v-icon icon="mdi-magnify" size="24" color="grey" />
      <span class="no-results-text">No results found for "{{ searchQuery }}"</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { SearchResult, CategoryResult, ProductResult } from '../../stores/apis/search.api';

interface SearchDropdownProps {
  showDropdown: boolean;
  loading: boolean;
  searchResults: SearchResult;
  searchQuery: string;
}

const props = defineProps<SearchDropdownProps>();
const router = useRouter();

// Computed properties
const hasResults = computed(() => {
  return props.searchResults.categories.length > 0 || props.searchResults.products.length > 0;
});

const PLACEHOLDER_IMAGE= import.meta.env.VITE_APP_PRODUCT_PLACEHOLDER_IMAGE;

// Event handlers
const handleCategoryClick = (category: CategoryResult) => {
  // Close the dropdown first
  const event = new CustomEvent('close-search-dropdown');
  window.dispatchEvent(event);
  
  // Navigate to products page with category slug as query parameter
  router.push({
    name: 'products',
    query: {
      category: category.slug || category.name.toLowerCase().replace(/\s+/g, '-')
    }
  });

  emit('categorySelected', category);
};

const handleSubcategoryClick = (category: CategoryResult, subcategory: { id: string; name: string; slug: string; icon?: string }) => {
  // Close the dropdown first
  const event = new CustomEvent('close-search-dropdown');
  window.dispatchEvent(event);
  
  // Navigate to products page with both category and subcategory slugs as query parameters
  router.push({
    name: 'products',
    query: {
      category: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
      subcategory: subcategory.slug || subcategory.name.toLowerCase().replace(/\s+/g, '-')
    }
  });
  emit('categorySelected', category);

};

const emit = defineEmits<{
  productSelected: [product: ProductResult],
  categorySelected: [category: CategoryResult]
}>();

const handleProductClick = (product: ProductResult) => {
  // Use product ID since products don't have slugs
  console.log('Product clicked:', product);
  console.log('Product ID:', product.id);
  console.log('Product type:', typeof product.id);
  console.log('Navigating to:', `/products/${product.id}`);

  if (!product.id) {
    console.error('Product ID is missing or undefined:', product);
    return;
  }

  try {
    // Emit event to parent component
    emit('productSelected', product);

    // Close the dropdown first
    const event = new CustomEvent('close-search-dropdown');
    window.dispatchEvent(event);

    // Navigate to the product
    router.push(`/products/${product.id}`);
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

const handleViewAllResults = () => {
  router.push(`/products?search=${encodeURIComponent(props.searchQuery)}`);
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = '/placeholder-product.jpg';
};
</script>

<style scoped>
.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.08);
  z-index: 1000;
  max-height: 500px;
  overflow-y: auto;
  margin-top: 4px;
}

.dropdown-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  gap: 12px;
}

.loading-text {
  color: #666;
  font-size: 14px;
}

.dropdown-content {
  padding: 16px 0;
}

.results-section {
  margin-bottom: 20px;
}

.results-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px 12px 20px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}



.category-wrapper {
  margin-bottom: 8px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 48px;
}

.category-item:hover {
  background: #f8f9fa;
}

.category-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(var(--v-theme-primary), 0.1);
  border-radius: 8px;
}

.category-info {
  flex: 1;
}

.category-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}

.subcategories {
  font-size: 11px;
  color: #666;
}

.subcategories-list {
  margin-left: 32px;
  margin-top: 4px;
  padding-left: 16px;
  border-left: 2px solid #f0f0f0;
}

.subcategory-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2px;
}

.subcategory-item:hover {
  background: #f8f9fa;
  padding-left: 16px;
}

.subcategory-name {
  font-size: 13px;
  color: #555;
  font-weight: 400;
}



.product-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 4px;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  outline: none;
  height: 48px;
  margin-top: 20px;
}

.product-item:hover {
  background: #f8f9fa;
}

.product-image {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-category {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stars {
  display: flex;
  gap: 1px;
}

.rating-count {
  font-size: 11px;
  color: #888;
}

.product-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
}

.sale-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

.current-price {
  font-size: 14px;
  font-weight: 600;
  color: #DB4444;
}

/* View All Section */
.view-all-section {
  padding: 16px 20px 0 20px;
  border-top: 1px solid #f0f0f0;
  margin-top: 16px;
}

.view-all-btn {
  width: 100%;
  justify-content: center;
  font-weight: 500;
}

/* No Results */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  gap: 12px;
}

.no-results-text {
  color: #666;
  font-size: 14px;
  text-align: center;
}

/* Scrollbar Styling */
.search-dropdown::-webkit-scrollbar {
  width: 6px;
}

.search-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.search-dropdown::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.search-dropdown::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
