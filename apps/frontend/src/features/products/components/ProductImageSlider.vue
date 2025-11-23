<template>
  <div class="product-images-container">
    <!-- Main Image Slider -->
    <div class="main-image-slider">
      <img :src="currentImage.url" :alt="currentImage.altText || productName" class="main-image" />

      <!-- Navigation Arrows -->
      <button v-if="hasMultipleImages" @click="previousImage" class="nav-arrow nav-arrow-left" type="button">
        <v-icon icon="mdi-chevron-left" />
      </button>

      <button v-if="hasMultipleImages" @click="nextImage" class="nav-arrow nav-arrow-right" type="button">
        <v-icon icon="mdi-chevron-right" />
      </button>

      <!-- Image Indicators -->
      <div v-if="hasMultipleImages" class="image-indicators">
        <button v-for="(_, index) in images" :key="index" @click="goToImage(index)" class="indicator-dot"
          :class="{ active: currentImageIndex === index }" type="button" />
      </div>
    </div>

    <!-- Thumbnail Gallery -->
    <div v-if="hasMultipleImages" class="thumbnail-gallery">
      <button v-for="(image, index) in images" :key="index" @click="goToImage(index)" class="thumbnail-item"
        :class="{ active: currentImageIndex === index }" type="button">
        <img :src="image.url" :alt="image.altText || productName" class="thumbnail-image" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface ProductImage {
  url: string;
  altText?: string;
}

interface Props {
  images?: ProductImage[];
  productName: string;
}

const props = defineProps<Props>();

// Refs
const currentImageIndex = ref(0);

// Computed properties
const hasMultipleImages = computed(() => {
  return props.images && props.images.length > 1;
});

const currentImage = computed(() => {
  if (!props.images || props.images.length === 0) {
    return { url: import.meta.env.VITE_APP_PRODUCT_PLACEHOLDER_IMAGE, altText: 'Product Image' };
  }
  return props.images[currentImageIndex.value];
});

// Methods
const goToImage = (index: number) => {
  currentImageIndex.value = index;
};

const nextImage = () => {
  if (!props.images) return;
  currentImageIndex.value = (currentImageIndex.value + 1) % props.images.length;
};

const previousImage = () => {
  if (!props.images) return;
  currentImageIndex.value = currentImageIndex.value === 0
    ? props.images.length - 1
    : currentImageIndex.value - 1;
};
</script>

<style scoped>
.product-images-container {
  padding: 24px;
}

.main-image-slider {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f8f8;
  margin-bottom: 20px;
}

.main-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;



}

.thumbnail-item {
  width: 64px;
  height: 64px;
}


.thumbnail-item img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
}


.nav-arrow:hover {
  background: white;
  transform: translateY(-50%) scale(1.1);
}

.nav-arrow-left {
  left: 16px;
}

.nav-arrow-right {
  right: 16px;
}

.image-indicators {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 2;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator-dot:hover {
  background: rgba(255, 255, 255, 0.8);
}

.indicator-dot.active {
  background: var(--v-theme-primary);
  border-color: var(--v-theme-primary);
}

.thumbnail-gallery {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 8px 0;
}

.thumbnail-item {
  flex-shrink: 0;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.thumbnail-item:hover {
  border-color: var(--v-theme-primary);
}

.thumbnail-item.active {
  border-color: var(--v-theme-primary);
}

.thumbnail-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
}

/* Responsive Design */
@media (max-width: 960px) {
  .main-image {
    height: 300px;
  }

  .thumbnail-image {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 600px) {
  .main-image {
    height: 250px;
  }

  .nav-arrow {
    width: 40px;
    height: 40px;
  }
}
</style>
