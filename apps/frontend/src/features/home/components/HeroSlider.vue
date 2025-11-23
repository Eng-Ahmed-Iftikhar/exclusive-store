<template>
  <div class="hero-slider">
    <div class="slider-container">
      <!-- Slides -->
      <div 
        v-for="(slide, index) in slides" 
        :key="slide.id"
        class="slide"
        :class="{ 'active': currentSlide === index }"
        :style="{ backgroundImage: `url(${slide.image})` }"
      >
        <div class="slide-content">
          <h1 class="slide-title">{{ slide.title }}</h1>
          <p class="slide-subtitle">{{ slide.subtitle }}</p>
          <v-btn 
            color="white" 
            variant="flat" 
            class="shop-now-btn"
            size="large"
            :to="slide.link"
          >
            Shop Now
            <v-icon icon="mdi-arrow-right" class="ms-2" />
          </v-btn>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button 
        class="slider-nav prev-btn" 
        @click="previousSlide"
        aria-label="Previous slide"
      >
        <v-icon icon="mdi-chevron-left" size="24" />
      </button>
      
      <button 
        class="slider-nav next-btn" 
        @click="nextSlide"
        aria-label="Next slide"
      >
        <v-icon icon="mdi-chevron-right" size="24" />
      </button>

      <!-- Pagination Dots -->
      <div class="slider-pagination">
        <button 
          v-for="(slide, index) in slides" 
          :key="slide.id"
          class="pagination-dot"
          :class="{ 'active': currentSlide === index }"
          @click="goToSlide(index)"
          :aria-label="`Go to slide ${index + 1}`"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useProductsStore } from '../../../stores';
import type { IProducts } from '../../../stores/modules/products';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

const PLACEHOLDER_IMAGE = import.meta.env.VITE_APP_HERO_PLACEHOLDER_IMAGE
const productsStore = useProductsStore();
const heroProducts = ref<IProducts.Product[]>([]);
const currentSlide = ref(0);
let autoplayInterval: ReturnType<typeof setInterval> | null = null;

// Convert products to slides
const slides = computed<Slide[]>(() => {
  return heroProducts.value.map((product, index) => {
    // Get the first variant's first image, or product's first image, or placeholder
    const firstVariant = product.variants?.[0];
    const variantImage = firstVariant?.images?.[0]?.file?.secureUrl || firstVariant?.images?.[0]?.file?.url;
    const productImage = variantImage || PLACEHOLDER_IMAGE;

    // Get the active price
    const activePrice = firstVariant?.prices?.find((p) => p.isActive);
    const priceText = activePrice 
      ? `Starting at ${activePrice.currency} ${activePrice.salePrice || activePrice.price}`
      : 'View Product';

    // Create subtitle based on product index (top sale, newest, random)
    let subtitle = '';
    if (index === 0) {
      subtitle = `🔥 Top Selling - ${priceText}`;
    } else if (index === 1) {
      subtitle = `✨ New Arrival - ${priceText}`;
    } else {
      subtitle = `⭐ Featured - ${priceText}`;
    }

    return {
      id: product.id,
      title: product.name,
      subtitle,
      image: productImage,
      link: `/products/${product.id}`,
    };
  });
});

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const previousSlide = () => {
  currentSlide.value = currentSlide.value === 0 
    ? slides.value.length - 1 
    : currentSlide.value - 1;
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

const startAutoplay = () => {
  autoplayInterval = setInterval(() => {
    nextSlide();
  }, 5000); // Change slide every 5 seconds
};

const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
};

onMounted(async () => {
  // Fetch hero slider products
  try {
    const products = await productsStore.fetchHeroSliderProducts();
    heroProducts.value = products;
    
    // Start autoplay only if we have slides
    if (products.length > 0) {
      startAutoplay();
    }
  } catch (error) {
    console.error('Failed to load hero slider products:', error);
    // Optionally show a fallback or error message
  }
});

onUnmounted(() => {
  stopAutoplay();
});
</script>

<style scoped>
.hero-slider {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  background: #000;
}

.slider-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
  display: flex;
  align-items: center;
  padding: 40px;
}

.slide.active {
  opacity: 1;
}

.slide-content {
  color: white;
  z-index: 2;
  position: relative;
  max-width: 400px;
}

.slide-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 16px 0;
  line-height: 1.1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.slide-subtitle {
  font-size: 18px;
  margin: 0 0 32px 0;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.shop-now-btn {
  color: #000 !important;
  font-weight: 600;
  padding: 16px 32px;
  border-radius: 0px !important;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Navigation Arrows */
.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 0px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 3;
}

.slider-nav:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.1);
}

.prev-btn {
  left: 20px;
}

.next-btn {
  right: 20px;
}

/* Pagination Dots */
.slider-pagination {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 3;
}

.pagination-dot {
  width: 12px;
  height: 12px;
  border-radius: 0px;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-dot:hover {
  background: rgba(255, 255, 255, 0.6);
}

.pagination-dot.active {
  background: white;
  transform: scale(1.2);
}

/* Responsive Design */
@media (max-width: 960px) {
  .hero-slider {
    height: 350px;
  }
  
  .slide {
    padding: 30px;
  }
  
  .slide-content {
    max-width: 100%;
    text-align: center;
  }
  
  .slide-title {
    font-size: 36px;
  }
  
  .slide-subtitle {
    font-size: 16px;
  }
  
  .slider-nav {
    width: 40px;
    height: 40px;
  }
  
  .prev-btn {
    left: 15px;
  }
  
  .next-btn {
    right: 15px;
  }
}

@media (max-width: 600px) {
  .hero-slider {
    height: 300px;
  }
  
  .slide {
    padding: 20px;
  }
  
  .slide-title {
    font-size: 28px;
  }
  
  .slide-subtitle {
    font-size: 14px;
  }
  
  .shop-now-btn {
    padding: 12px 24px;
    font-size: 14px;
  }
  
  .slider-nav {
    width: 36px;
    height: 36px;
  }
  
  .prev-btn {
    left: 10px;
  }
  
  .next-btn {
    right: 10px;
  }
}
</style>
