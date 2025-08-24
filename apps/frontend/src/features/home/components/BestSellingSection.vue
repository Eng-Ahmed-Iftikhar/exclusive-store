<template>
  <section class="best-selling-section">
    <v-container>
      <!-- Section Header -->
      <div class="section-header">
        <div class="header-content">
          <div class="red-bar"></div>
          <h2 class="section-title">This Month Best Selling Products</h2>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p>Loading products...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <v-icon icon="mdi-alert-circle" size="64" color="error" />
        <p>{{ error }}</p>
        <v-btn @click="itemsStore.fetchBestSellingItems()" color="primary" variant="outlined">
          Retry
        </v-btn>
      </div>

      <!-- Products Carousel -->
      <div v-else-if="bestSellingProducts.length > 0" class="products-carousel">
        <v-btn icon="mdi-chevron-left" variant="outlined" class="carousel-nav-btn prev-btn" size="large" />

        <div class="products-container">
          <ItemCard v-for="product in bestSellingProducts" :key="product.id" :item="product" :show-sale-tag="true" />
        </div>

        <v-btn icon="mdi-chevron-right" variant="outlined" class="carousel-nav-btn next-btn" size="large" />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <v-icon icon="mdi-package-variant" size="64" color="grey" />
        <p>No products available</p>
      </div>

      <!-- View All Button -->
      <div class="view-all-container">
        <v-btn color="error" variant="flat" size="large" class="view-all-btn" to="/products">
          View All Products
        </v-btn>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useItemsStore } from '../../../stores/modules/items';
import { ItemCard } from '../../shared/components';

const itemsStore = useItemsStore();

// Fetch best selling items on component mount
onMounted(async () => {
  try {
    await itemsStore.fetchBestSellingItems();
  } catch (error) {
    // Failed to fetch best selling items
  }
});

// Get best selling products from store
const bestSellingProducts = computed(() => itemsStore.bestSellingItems);

// Loading state
const loading = computed(() => itemsStore.loading);

// Error state
const error = computed(() => itemsStore.error);


</script>

<style scoped>
.best-selling-section {
  background: #fff;
  padding: 60px 0;
}

.section-header {
  margin-bottom: 40px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.red-bar {
  width: 4px;
  height: 40px;
  background: #DB4444;
  border-radius: 2px;
}

.section-title {
  font-size: 32px;
  font-weight: 600;
  color: #000;
  margin: 0;
}

.products-carousel {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
}

.carousel-nav-btn {
  border-color: #ddd;
  color: #666;
  flex-shrink: 0;
  border-radius: 8px;
}

.carousel-nav-btn:hover {
  background: #f0f0f0;
  transform: scale(1.05);
}

.products-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  flex-grow: 1;
}

.product-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 0px;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 280px !important;
  min-width: 200px !important;
  cursor: pointer;
}

.product-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.product-image {
  height: 200px;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.product-info {
  padding: 20px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stars {
  display: flex;
  gap: 2px;
}

.rating-count {
  font-size: 12px;
  color: #666;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 12px;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #DB4444;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.view-all-container {
  text-align: center;
}

.view-all-btn {
  padding: 14px 32px;
  font-weight: 600;
  text-transform: none;
  border-radius: 6px !important;
}

/* Loading, Error, and Empty States */
.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  gap: 16px;
}

.loading-state p,
.error-state p,
.empty-state p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.error-state .v-btn {
  margin-top: 8px;
}

/* Responsive Design */
@media (max-width: 960px) {
  .products-container {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}

@media (max-width: 600px) {
  .best-selling-section {
    padding: 40px 0;
  }

  .section-title {
    font-size: 24px;
  }

  .products-container {
    grid-template-columns: 1fr;
  }

  .carousel-nav-btn {
    display: none;
  }
}
</style>
