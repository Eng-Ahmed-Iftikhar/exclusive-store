<template>
  <div class="images-section">
    <!-- Main Image -->
    <div class="main-image-container">
      <img 
        :src="currentImage.url" 
        :alt="currentImage.altText || item.name"
        class="main-image"
      />
      
      <!-- Navigation Arrows -->
      <v-btn 
        v-if="hasMultipleImages"
        icon="mdi-chevron-left" 
        variant="text" 
        class="nav-arrow left-arrow"
        @click="previousImage"
      />
      <v-btn 
        v-if="hasMultipleImages"
        icon="mdi-chevron-right" 
        variant="text" 
        class="nav-arrow right-arrow"
        @click="nextImage"
      />
    </div>

    <!-- Thumbnail Images -->
    <div v-if="hasMultipleImages" class="thumbnail-images">
      <div
        v-for="(image, index) in itemImages"
        :key="index"
        class="thumbnail-item"
        :class="{ active: currentImageIndex === index }"
        @click="goToImage(index)"
      >
        <img 
          :src="image.url" 
          :alt="image.altText || 'Product image'"
          class="thumbnail-image"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface ItemModalImagesProps {
  item: any;
  currentImageIndex: number;
}

const props = defineProps<ItemModalImagesProps>();
const emit = defineEmits<{
  'update:currentImageIndex': [index: number];
  'next-image': [];
  'previous-image': [];
}>();

// Computed properties
const itemImages = computed(() => {
  return props.item.images || [];
});

const hasMultipleImages = computed(() => {
  return itemImages.value.length > 1;
});

const currentImage = computed(() => {
  if (itemImages.value.length > 0) {
    return itemImages.value[props.currentImageIndex];
  }
  return { 
    url: 'https://picsum.photos/400/300?random=16', 
    altText: props.item.name 
  };
});

// Methods
const nextImage = () => {
  if (hasMultipleImages.value) {
    const newIndex = (props.currentImageIndex + 1) % itemImages.value.length;
    emit('update:currentImageIndex', newIndex);
  }
};

const previousImage = () => {
  if (hasMultipleImages.value) {
    const newIndex = props.currentImageIndex === 0 
      ? itemImages.value.length - 1 
      : props.currentImageIndex - 1;
    emit('update:currentImageIndex', newIndex);
  }
};

const goToImage = (index: number) => {
  if (index >= 0 && index < itemImages.value.length) {
    emit('update:currentImageIndex', index);
  }
};
</script>

<style scoped>
.images-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-image-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f8f8;
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
  color: #333;
}

.left-arrow {
  left: 16px;
}

.right-arrow {
  right: 16px;
}

.thumbnail-images {
  display: flex;
  gap: 12px;
  overflow-x: auto;
}

.thumbnail-item {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s ease;
}

.thumbnail-item.active {
  border-color: #1976d2;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-image {
    height: 300px;
  }
}
</style>
