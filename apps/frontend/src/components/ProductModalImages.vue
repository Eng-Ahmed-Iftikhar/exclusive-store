<template>
  <div class="images-section">
    <!-- Main Image -->
    <div class="main-image-container">
      <img :src="currentImage.url" :alt="currentImage.altText || product.name" class="main-image"
        @error="handleImageError" />

      <!-- Navigation Arrows -->
      <v-btn v-if="hasMultipleImages" icon="mdi-chevron-left" variant="text" class="nav-arrow left-arrow"
        @click="previousImage" />
      <v-btn v-if="hasMultipleImages" icon="mdi-chevron-right" variant="text" class="nav-arrow right-arrow"
        @click="nextImage" />

      <!-- Image Counter -->
      <div v-if="hasMultipleImages" class="image-counter">
        {{ currentImageIndex + 1 }} / {{ productImages.length }}
      </div>
    </div>

    <!-- Thumbnail Images -->
    <div class="thumbnail-images">
      <div v-for="(image, index) in productImages" :key="index" class="thumbnail-item"
        :class="{ active: currentImageIndex === index }" @click="goToImage(index)">
        <img :src="image.url" :alt="image.altText || 'Product image'" class="thumbnail-image"
          @error="handleThumbnailError" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface ProductModalImagesProps {
  product: any;
  selectedVariant: any;
  currentImageIndex: number;
}

const props = defineProps<ProductModalImagesProps>();
const emit = defineEmits<{
  'update:currentImageIndex': [index: number];
  'next-image': [];
  'previous-image': [];
}>();

// Helper function to get default variant (same as ProductCard.vue)
const getDefaultVariant = (product: any) => {
  if (!product.variants || product.variants.length === 0) return null;

  // First try to find the default variant
  const defaultVariant = product.variants.find((v: any) => v.isDefault);
  if (defaultVariant) return defaultVariant;

  // If no default, find the first variant with images
  const variantWithImages = product.variants.find((v: any) => v.images && v.images.length > 0);
  if (variantWithImages) return variantWithImages;

  // Otherwise return the first variant
  return product.variants[0];
};

// Helper function to get product images (same logic as ProductCard.vue)
const getProductImages = (product: any) => {
  const images: any[] = [];

  // First, try to get images from the default variant
  const defaultVariant = getDefaultVariant(product);
  if (defaultVariant?.images && defaultVariant.images.length > 0) {
    images.push(...defaultVariant.images.map((img: any) => ({
      url: img.file?.secureUrl || img.file?.url || '',
      altText: img.altText || product.name,
      isPrimary: img.isPrimary,
      sortOrder: img.sortOrder
    })));
  }

  // If no variant images, try product-level images
  if (images.length === 0 && product.images && product.images.length > 0) {
    images.push(...product.images.map((img: any) => ({
      url: img.file?.secureUrl || img.file?.url || '',
      altText: img.altText || product.name,
      isPrimary: img.isPrimary,
      sortOrder: img.sortOrder
    })));
  }

  // Filter out invalid images and sort
  return images
    .filter(img => img.url && img.url.trim() !== '')
    .sort((a, b) => {
      if (a.isPrimary && !b.isPrimary) return -1;
      if (!a.isPrimary && b.isPrimary) return 1;
      return (a.sortOrder || 0) - (b.sortOrder || 0);
    });
};

// Computed properties - Get images from selected variant or product
const productImages = computed(() => {
  // If variant is selected, show variant images
  if (props.selectedVariant?.images && props.selectedVariant.images.length > 0) {
    return props.selectedVariant.images
      .map((img: any) => ({
        url: img.file?.secureUrl || img.file?.url || '',
        altText: img.altText || props.selectedVariant.name || props.product.name,
        isPrimary: img.isPrimary || false,
        sortOrder: img.sortOrder || 0
      }))
      .filter((img: any) => img.url && img.url.trim() !== '')
      .sort((a: any, b: any) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return a.sortOrder - b.sortOrder;
      });
  }

  // Otherwise, use the same logic as ProductCard.vue
  return getProductImages(props.product);
});

const hasMultipleImages = computed(() => {
  return productImages.value.length > 1;
});

const currentImage = computed(() => {
  if (productImages.value.length > 0 && props.currentImageIndex < productImages.value.length) {
    return productImages.value[props.currentImageIndex];
  }
  // Fallback to same logic as ProductCard.vue
  return {
    url: import.meta.env.VITE_APP_PRODUCT_PLACEHOLDER_IMAGE,
    altText: props.product.name
  };
});

// Methods
const nextImage = () => {
  if (hasMultipleImages.value) {
    const newIndex = (props.currentImageIndex + 1) % productImages.value.length;
    emit('update:currentImageIndex', newIndex);
  }
};

const previousImage = () => {
  if (hasMultipleImages.value) {
    const newIndex = props.currentImageIndex === 0
      ? productImages.value.length - 1
      : props.currentImageIndex - 1;
    emit('update:currentImageIndex', newIndex);
  }
};

const goToImage = (index: number) => {
  if (index >= 0 && index < productImages.value.length) {
    emit('update:currentImageIndex', index);
  }
};

// Handle image loading errors
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = 'https://via.placeholder.com/400x300/e0e0e0/666666?text=Image+Not+Available';
};

const handleThumbnailError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = 'https://via.placeholder.com/80x80/e0e0e0/666666?text=N/A';
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

.image-counter {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  backdrop-filter: blur(4px);
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
