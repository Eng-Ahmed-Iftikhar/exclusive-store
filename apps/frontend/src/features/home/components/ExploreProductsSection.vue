<template>
  <section class="explore-products-section">
    <v-container>
      <!-- Section Header -->
      <div class="section-header">
        <div class="header-content">
          <div class="red-bar"></div>
          <h2 class="section-title">Our Products Explore Our Products</h2>
        </div>
      </div>

      <!-- Products Carousel -->
      <div class="products-carousel">
        <v-btn icon="mdi-chevron-left" variant="outlined" class="carousel-nav-btn prev-btn" size="large"
          @click="prevSlide" :disabled="currentIndex === 0" />

        <div class="products-container">
          <div class="products-slider" ref="sliderRef">
            <ItemCard v-for="product in exploreItems" :key="product.id" :item="product" :show-sale-tag="true"
              class="product-slide" />
          </div>
        </div>

        <v-btn icon="mdi-chevron-right" variant="outlined" class="carousel-nav-btn next-btn" size="large"
          @click="nextSlide" :disabled="currentIndex >= maxIndex" />
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
import { onMounted, computed, ref, watch } from 'vue';
import { IItems, useItemsStore } from '../../../stores/modules/items';
import { ItemCard } from '../../shared/components';

const itemsStore = useItemsStore();

// Carousel functionality
const sliderRef = ref<HTMLElement | null>(null);
const currentIndex = ref(0);
const productsPerView = 3;

// Fetch featured items on component mount
onMounted(async () => {
  try {
    await itemsStore.fetchFeaturedItems();
  } catch (error) {
    // Failed to fetch featured items
  }
});

// Get featured items from store
const exploreItems = computed(() => itemsStore.featuredItems as unknown as IItems.Item[]);

// Computed properties for carousel
const maxIndex = computed(() => {
  if (!exploreItems.value || exploreItems.value.length <= productsPerView) return 0;
  return Math.ceil(exploreItems.value.length / productsPerView) - 1;
});

const canSlideNext = computed(() => currentIndex.value < maxIndex.value);
const canSlidePrev = computed(() => currentIndex.value > 0);

// Navigation functions
const nextSlide = () => {
  if (canSlideNext.value) {
    currentIndex.value++;
    updateSliderPosition();
  }
};

const prevSlide = () => {
  if (canSlidePrev.value) {
    currentIndex.value--;
    updateSliderPosition();
  }
};

const updateSliderPosition = () => {
  if (sliderRef.value) {
    const slideWidth = 100 / productsPerView; // Each slide takes 1/3 of the container width
    const translateX = -(currentIndex.value * slideWidth);
    sliderRef.value.style.transform = `translateX(${translateX}%)`;
  }
};

// Reset slider position when products change
watch(exploreItems, () => {
  currentIndex.value = 0;
  updateSliderPosition();
}, { immediate: true });
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
  overflow: hidden;
  padding: 4px 0;
}

.products-slider {
  display: flex;
  gap: 24px;
  transition: transform 0.3s ease;
  min-width: max-content;
}

.product-slide {
  flex: 0 0 calc(33.333% - 16px);
  width: 100%;
  max-width: 280px !important;
  min-width: 200px;
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
  .products-container {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}

@media (max-width: 600px) {
  .explore-products-section {
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
