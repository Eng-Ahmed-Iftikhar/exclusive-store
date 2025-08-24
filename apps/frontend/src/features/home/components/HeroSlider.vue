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
            to="/products"
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
import { ref, onMounted, onUnmounted } from 'vue';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

const slides = ref<Slide[]>([
  {
    id: 1,
    title: "iPhone 14 Series",
    subtitle: "Up to 10% off Voucher",
    image: "@assets/images/hero_section.png"
  },
  {
    id: 2,
    title: "New Collection",
    subtitle: "Discover the latest trends",
    image: "/src/features/home/assets/images/hero_endframe__cvklg0xk3w6e_large 2.png"
  },
  {
    id: 3,
    title: "Summer Sale",
    subtitle: "Up to 50% off selected items",
    image: "/src/features/home/assets/images/hero_endframe__cvklg0xk3w6e_large 2.png"
  }
]);

const currentSlide = ref(0);
let autoplayInterval: ReturnType<typeof setInterval> | null = null;

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

onMounted(() => {
  startAutoplay();
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
