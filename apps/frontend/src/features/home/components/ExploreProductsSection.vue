<template>
  <section class="explore-products-section">
    <v-container>
      <!-- Section Header -->
      <div class="section-header">
        <div class="header-content">
          <div class="red-bar"></div>
          <h2 class="section-title">Our Products</h2>
        </div>
      </div>

      <!-- Products Carousel -->
      <div class="products-carousel">
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
            v-for="product in exploreItems" 
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
import { onMounted, computed, ref, nextTick } from 'vue';
import { IProducts, useProductsStore } from '../../../stores/modules/products';
import ProductCard from '../../../components/ProductCard.vue';

const productsStore = useProductsStore();

// Container ref for scrolling
const containerRef = ref<HTMLElement | null>(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

// Fetch featured products on component mount
onMounted(async () => {
  try {
    await productsStore.fetchFeaturedProducts();
    // Wait for DOM to update, then check scroll buttons
    await nextTick();
    updateScrollButtons();
  } catch (error) {
    // Failed to fetch featured products
  }
});

// Get featured products from store
const exploreItems = computed(() => productsStore.featuredProducts as unknown as IProducts.Product[]);

// Update scroll button visibility based on scroll position
const updateScrollButtons = () => {
  const container = containerRef.value;
  if (!container) return;
  
  // Check if we can scroll left (not at start)
  canScrollLeft.value = container.scrollLeft > 0;
  
  // Check if we can scroll right (not at end)
  // Add small threshold (1px) to account for rounding errors
  const maxScrollLeft = container.scrollWidth - container.clientWidth;
  canScrollRight.value = container.scrollLeft < maxScrollLeft - 1;
};

// Scroll navigation functions
const scrollNext = () => {
  const container = containerRef.value;
  if (!container) return;
  
  // Scroll by one card width (320px) + gap (24px)
  const scrollAmount = 344; // 320px card + 24px gap
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
.explore-products-section {
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
  width: 48px;
  height: 48px;
}

.carousel-nav-btn:hover:not(:disabled) {
  border-color: #000;
  color: #000;
}

.carousel-nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.product-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 0px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.product-image {
  position: relative;
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

.new-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #00FF66;
  color: white;
  padding: 4px 8px;
  border-radius: 0px;
  font-size: 12px;
  font-weight: 600;
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
  margin-bottom: 16px;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #DB4444;
}

.product-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  color: #666;
  min-width: 32px;
  height: 32px;
}

.action-btn:hover {
  color: #000;
}

.add-to-cart-btn {
  font-size: 12px;
  padding: 8px 16px;
  height: 32px;
  text-transform: none;
  border-radius: 8px !important;
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

/* Responsive Design */
@media (max-width: 960px) {
  .product-slide {
    flex: 0 0 280px;
    width: 280px;
    min-width: 280px;
  }
}

@media (max-width: 600px) {
  .explore-products-section {
    padding: 40px 0;
  }

  .section-title {
    font-size: 24px;
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
