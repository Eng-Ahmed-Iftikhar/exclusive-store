<template>
  <section class="new-arrival-section">
    <v-container>
      <!-- Section Header -->
      <div class="section-header">
        <div class="header-content">
          <div class="red-bar"></div>
          <h2 class="section-title">Featured New Arrival</h2>
        </div>
      </div>

      <!-- New Arrival Items -->
      <div v-if="loading" class="loading-state">
        <v-progress-circular indeterminate color="primary" />
        <p>Loading new arrivals...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <v-icon icon="mdi-alert" size="64" color="error" />
        <p>{{ error }}</p>
        <v-btn @click="fetchNewArrivals" color="primary" variant="flat">
          Try Again
        </v-btn>
      </div>

      <!-- Products Carousel -->
      <div v-else-if="newArrivalItems.length > 0" class="products-carousel">
        <v-btn 
          v-show="canScrollLeft"
          icon="mdi-chevron-left" 
          variant="outlined" 
          class="carousel-nav-btn prev-btn" 
          size="large"
          @click="scrollPrev" 
        />

        <div class="products-container" ref="containerRef" @scroll="updateScrollButtons">
          <ProductCard
            v-for="product in newArrivalProducts"
            :key="product.id"
            :product="product"
            :show-sale-tag="true"
            class="product-slide"
          />
        </div>

         <v-btn 
          v-show="canScrollRight"
          icon="mdi-chevron-right" 
          variant="outlined" 
          class="carousel-nav-btn next-btn" 
          size="large"
          @click="scrollNext" 
        />
      </div>

      <div v-else class="empty-state">
        <v-icon icon="mdi-package-variant" size="64" color="grey" />
        <p>No new arrivals available</p>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, nextTick } from 'vue';
import { useProductsStore } from '../../../stores/modules/products';
import ProductCard from '../../../components/ProductCard.vue';

import { Product } from '../../../stores/modules/products/products.interface';

const productsStore = useProductsStore();

// Container ref for scrolling
const containerRef = ref<HTMLElement | null>(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

// Fetch new arrival items on component mount
onMounted(async () => {
  try {
    await fetchNewArrivals();
    // Wait for DOM to update, then check scroll buttons
    await nextTick();
    updateScrollButtons();
  } catch (error) {
    // Failed to fetch new arrivals
  }
});

// Fetch new arrival items
const fetchNewArrivals = async () => {
  try {
    await productsStore.fetchProducts({ isFeatured: true, limit: 8 });
  } catch (error) {
    // Failed to fetch new arrivals
  }
};

// Get new arrival items from store
const newArrivalItems = computed(
  () => (productsStore.products || []) as unknown as Product[]
);

// Computed property for new arrival products
const newArrivalProducts = computed(() => productsStore.products || []);

// Loading state
const loading = computed(() => productsStore.loading);

// Error state
const error = computed(() => productsStore.error);

// Update scroll button visibility based on scroll position
const updateScrollButtons = () => {
  const container = containerRef.value;
  if (!container) return;
  
  // Check if we can scroll left (not at start)
  canScrollLeft.value = container.scrollLeft > 0;
  
  // Check if we can scroll right (not at end)
  const maxScrollLeft = container.scrollWidth - container.clientWidth;
  canScrollRight.value = container.scrollLeft < maxScrollLeft - 1;
};

// Scroll navigation functions
const scrollNext = () => {
  const container = containerRef.value;
  if (!container) return;
  
  // Scroll by one card width (320px) + gap (24px)
  const scrollAmount = 344;
  container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  
  // Update buttons after scroll animation
  setTimeout(updateScrollButtons, 350);
};

const scrollPrev = () => {
  const container = containerRef.value;
  if (!container) return;
  
  const scrollAmount = 344;
  container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  
  setTimeout(updateScrollButtons, 350);
};
</script>

<style scoped>
.new-arrival-section {
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
  background: #db4444;
  border-radius: 2px;
}

.section-title {
  font-size: 32px;
  font-weight: 600;
  color: #000;
  margin: 0;
}

.promo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 24px;
  height: 600px;
}

.promo-block {
  position: relative;
  background: #000;
  border-radius: 0px;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 40px;
  color: white;
}

.promo-block.large {
  grid-column: span 1;
  grid-row: span 2;
}

.promo-block.medium {
  grid-column: span 1;
  grid-row: span 1;
}

.promo-content {
  flex: 1;
  z-index: 2;
  position: relative;
}

.promo-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.promo-description {
  font-size: 14px;
  margin: 0 0 24px 0;
  opacity: 0.9;
  line-height: 1.4;
}

.shop-now-btn {
  color: #000 !important;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 6px !important;
  text-transform: none;
}

.promo-image {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  opacity: 0.8;
}

.promo-image img {
  max-width: 200px;
  height: auto;
}

.promo-block.large .promo-image img {
  max-width: 250px;
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
  width: 48px;
  height: 48px;
}


.carousel-nav-btn:hover {
  background: #f0f0f0;
  transform: scale(1.05);
}

.products-container {
  flex-grow: 1;
  display: flex;
  gap: 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding: 4px 0;
  scroll-behavior: smooth;
}

/* Hide scrollbar */
.products-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.products-container::-webkit-scrollbar {
  display: none;
}

.product-slide {
  flex: 0 0 320px;
  width: 320px;
  min-width: 320px;
  scroll-snap-align: start;
}

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
  font-size: 14px;
  color: #666;
  margin: 0;
}

.error-state .v-btn {
  margin-top: 8px;
}

/* Responsive Design */
@media (max-width: 960px) {
  .promo-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    height: auto;
    gap: 16px;
  }

  .promo-block {
    padding: 30px;
    min-height: 200px;
  }

  .promo-block.large {
    grid-column: span 1;
    grid-row: span 1;
  }

  .promo-image img {
    max-width: 150px;
  }

  .promo-block.large .promo-image img {
    max-width: 180px;
  }

  .product-slide {
    flex: 0 0 280px;
    width: 280px;
    min-width: 280px;
  }
}

@media (max-width: 600px) {
  .new-arrival-section {
    padding: 40px 0;
  }

  .section-title {
    font-size: 24px;
  }

  .promo-block {
    padding: 20px;
    min-height: 180px;
  }

  .promo-title {
    font-size: 20px;
  }

  .promo-description {
    font-size: 12px;
  }

  .shop-now-btn {
    padding: 10px 20px;
    font-size: 14px;
  }

  .promo-image img {
    max-width: 120px;
  }

  .promo-block.large .promo-image img {
    max-width: 150px;
  }

  .product-slide {
    flex: 0 0 260px;
    width: 260px;
    min-width: 260px;
  }

  .carousel-nav-btn {
    display: none;
  }
}
</style>
