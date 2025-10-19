<template>
  <div class="product-card" :class="{ 'out-of-stock': !isInStock }" @click="navigateToProduct">
    <div class="product-image">
      <!-- Image Display -->
      <div class="image-container">
        <img v-if="productImages.length > 0" :src="currentImage.url" :alt="currentImage.altText || product.name"
          class="product-image-img" @error="handleImageError" />
        <img v-else src="https://picsum.photos/400/300?random=16" :alt="product.name"
          class="product-image-img placeholder-image" />

        <!-- Image Indicators -->
        <div v-if="hasMultipleImages" class="image-indicators">
          <button v-for="(image, index) in productImages" :key="index" @click.stop="goToImage(index)"
            class="indicator-dot" :class="{ active: currentImageIndex === index }" type="button" />
        </div>
      </div>

      <!-- Action Icons Overlay -->
      <div class="action-overlay">
        <v-btn :icon="isFavorited ? 'mdi-heart' : 'mdi-heart-outline'" variant="text" size="small"
          class="overlay-btn favorite-btn" :class="{ 'favorited': isFavorited }" @click.stop="handleFavoriteClick"
          :loading="favoriteLoading" />
        <v-btn icon="mdi-eye" variant="text" size="small" class="overlay-btn" @click.stop="openProductModal" />
      </div>

      <div v-if="showSaleTag && isOnSale" class="sale-badge">Sale</div>
      <div v-if="!isInStock" class="out-of-stock-badge">Out of Stock</div>
    </div>

    <div class="product-info">
      <div class="product-header">
        <h3 class="product-name">{{ product.name }}</h3>
        <div class="product-rating">
          <div class="stars">
            <v-icon v-for="star in 5" :key="star" icon="mdi-star" size="14"
              :color="star <= getAverageRating(product) ? '#FFD700' : '#E0E0E0'" />
          </div>
          <span class="rating-count">({{ getReviewCount(product) }} reviews)</span>
        </div>
      </div>

      <div class="product-price">
        <span v-if="isOnSale" class="current-price">${{ getSalePrice(product).toFixed(2) }}</span>
        <span v-else class="current-price">${{ getOriginalPrice(product).toFixed(2) }}</span>
        <span v-if="isOnSale" class="original-price">${{ getOriginalPrice(product).toFixed(2) }}</span>
      </div>

      <div class="product-actions">
        <!-- Add to Cart Button (when not in cart) -->
        <v-btn v-if="!isInCart" color="primary" variant="flat" size="small" class="add-to-cart-btn"
          :loading="cartLoading" :disabled="!isInStock" @click.stop="handleAddToCart" block>
          <v-icon icon="mdi-cart-plus" size="16" class="me-1" />
          {{ isInStock ? 'Add To Cart' : 'Out of Stock' }}
        </v-btn>

        <!-- Cart Actions (when in cart) -->
        <div v-else class="cart-actions">
          <v-btn color="success" variant="flat" size="small" class="in-cart-btn" disabled>
            <v-icon icon="mdi-check" size="16" class="me-1" />
            In Cart
          </v-btn>
          <v-btn color="error" variant="outlined" size="small" class="remove-from-cart-btn" :loading="cartLoading"
            @click.stop="handleRemoveFromCart">
            <v-icon icon="mdi-cart-minus" size="16" class="me-1" />
            Remove
          </v-btn>
        </div>
      </div>

      <!-- View Details Button -->
      <v-btn variant="text" size="small" class="view-details-btn" @click.stop="navigateToProduct" block>
        <v-icon icon="mdi-eye" size="16" class="me-1" />
        View Details
      </v-btn>
    </div>
  </div>

  <!-- Product Modal -->
  <ProductModal v-model="showProductModal" :product="product" @add-to-cart="handleAddToCart" />
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useFavoritesStore, useNotificationsStore, useCartStore, useAuthStore } from '../stores/index';
import ProductModal from './ProductModal.vue';

interface ProductCardProps {
  product: any;
  showSaleTag?: boolean;
}

const props = withDefaults(defineProps<ProductCardProps>(), {
  showSaleTag: true
});

const router = useRouter();
const { t } = useI18n();
const favoritesStore = useFavoritesStore();
const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();
const cartStore = useCartStore();

// Slideshow state
const currentImageIndex = ref(0);
const favoriteLoading = ref(false);
const cartLoading = ref(false);
const localFavoriteStatus = ref(false);
const showProductModal = ref(false);
let autoSlideInterval: ReturnType<typeof setInterval> | null = null;

// Computed properties
const isOnSale = computed(() => {
  // Check if the API provides computed isOnSale
  if (props.product.isOnSale !== undefined) {
    return props.product.isOnSale;
  }
  // Fallback to price comparison
  const salePrice = getSalePrice(props.product);
  const originalPrice = getOriginalPrice(props.product);
  return salePrice < originalPrice && salePrice > 0;
});

const productImages = computed(() => {
  return getProductImages(props.product);
});

const hasMultipleImages = computed(() => {
  return productImages.value.length > 1;
});

const currentImage = computed(() => {
  if (productImages.value.length > 0 && productImages.value[currentImageIndex.value]) {
    return productImages.value[currentImageIndex.value];
  }
  return { url: 'https://picsum.photos/400/300?random=16', altText: props.product.name };
});

// Handle image load errors
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = 'https://picsum.photos/400/300?random=' + props.product.id;
};

// Favorite functionality
const isFavorited = computed(() => {
  // First check local state, then fallback to store
  return localFavoriteStatus.value || favoritesStore.isItemFavorite(props.product.id);
});

// Cart functionality
const isInCart = computed(() => {
  // Check if product (without variant) is in cart
  return cartStore.isItemInCart(props.product.id, undefined);
});

// Stock functionality
const isInStock = computed(() => {
  return getAvailableStock(props.product) > 0;
});

// Check favorite status for this product
const checkFavoriteStatus = async () => {
  if (!authStore.isAuthenticated) {
    localFavoriteStatus.value = false;
    return;
  }

  try {
    const status = await favoritesStore.checkFavoriteStatus(props.product.id);
    localFavoriteStatus.value = status;
  } catch (error) {
    // Error checking favorite status
  }
};

// Favorite click handler
const handleFavoriteClick = async () => {
  if (!favoritesStore.isLoggedIn) {
    // Redirect to login page
    router.push('/login');
    return;
  }

  try {
    favoriteLoading.value = true;

    await favoritesStore.toggleFavorite(props.product.id);
    // Update local state after toggle
    localFavoriteStatus.value = !localFavoriteStatus.value;

    // Show notification
    if (localFavoriteStatus.value) {
      notificationsStore.showSuccess(`${props.product.name} ${t('notifications.favorites.added')}`);
    } else {
      notificationsStore.showInfo(`${props.product.name} ${t('notifications.favorites.removed')}`);
    }
  } catch (error) {
    // Error toggling favorite
  } finally {
    favoriteLoading.value = false;
  }
};

// Add to cart handler
const handleAddToCart = async () => {
  try {
    cartLoading.value = true;

    // Check stock before adding to cart
    const availableStock = getAvailableStock(props.product);
    if (availableStock <= 0) {
      notificationsStore.showError('This product is currently out of stock');
      return;
    }

    // Add product without variant - let user choose variant in modal if needed
    await cartStore.addToCart(props.product.id, undefined, 1);
    showProductModal.value = false;
  } catch (error) {
    // Error adding to cart
    notificationsStore.showError('Failed to add product to cart');
  } finally {
    cartLoading.value = false;
  }
};

// Remove from cart handler
const handleRemoveFromCart = async () => {
  try {
    cartLoading.value = true;

    // Remove product without variant
    const cartItem = cartStore.getCartItem(props.product.id, undefined);
    if (cartItem) {
      await cartStore.removeFromCart(cartItem.id);
    }
  } catch (error) {
    // Handle error silently
  } finally {
    cartLoading.value = false;
  }
};

const openProductModal = () => {
  showProductModal.value = true;
};

const navigateToProduct = () => {
  router.push({ name: 'single-product', params: { id: props.product.id } });
};

// Slideshow functions
const nextImage = () => {
  if (hasMultipleImages.value) {
    currentImageIndex.value = (currentImageIndex.value + 1) % productImages.value.length;
  }
};

const goToImage = (index: number) => {
  if (index >= 0 && index < productImages.value.length) {
    currentImageIndex.value = index;
  }
};

// Auto-slide functionality
const startAutoSlide = () => {
  if (hasMultipleImages.value) {
    autoSlideInterval = setInterval(() => {
      nextImage();
    }, 3000); // Change image every 3 seconds
  }
};

const stopAutoSlide = () => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  }
};

// Lifecycle hooks
onMounted(async () => {
  startAutoSlide();
  // Check favorite status when component mounts
  await checkFavoriteStatus();
});

onUnmounted(() => {
  stopAutoSlide();
});

// Get default variant for the product
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

// Helper function to get product images (prioritize variant images, then product images)
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

// Helper function to get primary image
const getPrimaryImage = (product: any) => {
  const images = getProductImages(product);
  if (images.length > 0) {
    return images[0].url;
  }
  return 'https://picsum.photos/400/300?random=16';
};

// Helper function to get average rating
const getAverageRating = (product: any) => {
  if (product.averageRating !== undefined) {
    return product.averageRating;
  }
  if (product.reviews && product.reviews.length > 0) {
    const totalRating = product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
    return Math.round(totalRating / product.reviews.length);
  }
  return 0;
};

// Helper function to get review count
const getReviewCount = (product: any) => {
  if (product.totalReviews !== undefined) {
    return product.totalReviews;
  }
  if (product.reviews) {
    return product.reviews.length;
  }
  return 0;
};

// Helper function to get original price (product price or variant price)
const getOriginalPrice = (product: any) => {
  // First check if product has prices array
  if (product.prices && product.prices.length > 0) {
    const activePrice = product.prices.find((price: any) => price.isActive);
    if (activePrice) {
      return Number(activePrice.price);
    }
    return Number(product.prices[0].price);
  }

  // Otherwise get price from default variant
  const defaultVariant = getDefaultVariant(product);
  if (defaultVariant?.prices && defaultVariant.prices.length > 0) {
    const activePrice = defaultVariant.prices.find((price: any) => price.isActive);
    if (activePrice) {
      return Number(activePrice.price);
    }
    return Number(defaultVariant.prices[0].price);
  }

  return 0;
};

// Helper function to get sale price (product sale price or variant sale price)
const getSalePrice = (product: any) => {
  // First check if product has prices array with sale price
  if (product.prices && product.prices.length > 0) {
    const activePrice = product.prices.find((price: any) => price.isActive);
    if (activePrice?.salePrice && Number(activePrice.salePrice) > 0) {
      return Number(activePrice.salePrice);
    }
  }

  // Otherwise get sale price from default variant
  const defaultVariant = getDefaultVariant(product);
  if (defaultVariant?.prices && defaultVariant.prices.length > 0) {
    const activePrice = defaultVariant.prices.find((price: any) => price.isActive);
    if (activePrice?.salePrice && Number(activePrice.salePrice) > 0) {
      return Number(activePrice.salePrice);
    }
  }

  return getOriginalPrice(product);
};

// Helper function to get available stock
const getAvailableStock = (product: any) => {
  // First check if product has stock array
  if (product.stock && product.stock.length > 0) {
    return product.stock[0].quantity || 0;
  }

  // Otherwise get stock from default variant
  const defaultVariant = getDefaultVariant(product);
  if (defaultVariant?.stock && defaultVariant.stock.length > 0) {
    return defaultVariant.stock[0].quantity || 0;
  }

  return 0;
};
</script>

<style scoped>
.product-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
  max-width: 280px !important;
  min-width: 200px !important;
  height: fit-content;
  min-height: 380px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.product-card.out-of-stock {
  opacity: 0.7;
  filter: grayscale(0.3);
}

.product-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.product-image {
  position: relative;
  height: 220px;
  background: #f8f8f8;
  flex-shrink: 0;
  overflow: hidden;
}

.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.product-image-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-image-img.placeholder-image {
  object-fit: contain;
  padding: 20px;
}

.product-card:hover .product-image-img {
  transform: scale(1.05);
}

/* Action Overlay */
.action-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .action-overlay {
  opacity: 1;
}

.overlay-btn {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(4px);
  border-radius: 50% !important;
  width: 36px !important;
  height: 36px !important;
  min-width: 36px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.overlay-btn:hover {
  background: rgba(255, 255, 255, 1) !important;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.overlay-btn.favorite-btn.favorited {
  color: #DB4444 !important;
  background: rgba(219, 68, 68, 0.1) !important;
}

.overlay-btn.favorite-btn.favorited:hover {
  background: rgba(219, 68, 68, 0.2) !important;
}


.image-indicators {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  z-index: 2;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator-dot:hover {
  background: rgba(255, 255, 255, 0.8);
}

.indicator-dot.active {
  background: #DB4444;
  border-color: #DB4444;
}

.sale-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #DB4444;
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(219, 68, 68, 0.3);
}

.out-of-stock-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #666;
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(102, 102, 102, 0.3);
}

.product-info {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
}

.product-name {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.product-rating {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}

.stars {
  display: flex;
  gap: 1px;
}

.rating-count {
  font-size: 10px;
  color: #888;
  white-space: nowrap;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #DB4444;
}

.original-price {
  font-size: 13px;
  color: #999;
  text-decoration: line-through;
}

.product-actions {
  margin-top: auto;
}

.add-to-cart-btn {
  font-size: 13px;
  padding: 10px 16px;
  height: 40px;
  text-transform: none;
  border-radius: 8px !important;
  font-weight: 600;
  letter-spacing: 0.3px;

}

.cart-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.in-cart-btn {
  font-size: 13px;
  padding: 10px 16px;
  height: 40px;
  text-transform: none;
  border-radius: 8px !important;
  background-color: #4CAF50 !important;
  color: white !important;
  cursor: default;
  flex: 1;
  font-weight: 600;
  border-radius: 8px !important;

}

.remove-from-cart-btn {
  font-size: 13px;
  padding: 10px 16px;
  height: 40px;
  text-transform: none;
  border-radius: 8px !important;
  border-color: #DB4444 !important;
  color: #DB4444 !important;
  flex: 1;
  font-weight: 600;
}

.remove-from-cart-btn:hover {
  background-color: #DB4444 !important;
  color: white !important;
}

.view-details-btn {
  margin-top: 10px;
  font-size: 13px;
  padding: 10px 16px;
  height: 40px;
  text-transform: none;
  border-radius: 8px !important;
  border-color: #DB4444 !important;
  color: #DB4444 !important;
  flex: 1;
  font-weight: 600;
}

.view-details-btn:hover {
  background-color: #DB4444 !important;
  color: white !important;
}

/* Responsive Design */
@media (max-width: 600px) {
  .product-image {
    height: 160px;
  }

  .product-info {
    padding: 16px;
  }

  .product-name {
    font-size: 14px;
  }

  .current-price {
    font-size: 16px;
  }
}
</style>
