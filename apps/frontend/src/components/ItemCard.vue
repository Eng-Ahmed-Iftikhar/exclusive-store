<template>
  <div class="item-card" @click="navigateToProduct">
    <div class="item-image">
      <!-- Image Slideshow -->
      <div v-if="hasMultipleImages" class="image-slideshow">
        <img :src="currentImage.url" :alt="currentImage.altText || item.name" class="slideshow-image" />

        <!-- Image Indicators -->
        <div v-if="hasMultipleImages" class="image-indicators">
          <button v-for="(image, index) in itemImages" :key="index" @click.stop="goToImage(index)" class="indicator-dot"
            :class="{ active: currentImageIndex === index }" type="button" />
        </div>
      </div>

      <!-- Single Image Display -->
      <img v-else :src="getPrimaryImage(item)" :alt="item.name" class="single-image" />

      <!-- Action Icons Overlay -->
      <div class="action-overlay">
        <v-btn :icon="isFavorited ? 'mdi-heart' : 'mdi-heart-outline'" variant="text" size="small"
          class="overlay-btn favorite-btn" :class="{ 'favorited': isFavorited }" @click.stop="handleFavoriteClick"
          :loading="favoriteLoading" />
        <v-btn icon="mdi-eye" variant="text" size="small" class="overlay-btn" @click.stop="openItemModal" />
      </div>

      <div v-if="showSaleTag && isOnSale" class="sale-badge">Sale</div>
    </div>

    <div class="item-info">
      <div class="item-header">
        <h3 class="item-name">{{ item.name }}</h3>
        <div class="item-rating">
          <div class="stars">
            <v-icon v-for="star in 5" :key="star" icon="mdi-star" size="14"
              :color="star <= getAverageRating(item) ? '#FFD700' : '#E0E0E0'" />
          </div>
          <span class="rating-count">({{ getReviewCount(item) }} reviews)</span>
        </div>
      </div>

      <div class="item-price">
        <span v-if="isOnSale" class="current-price">${{ getSalePrice(item) }}</span>
        <span v-else class="current-price">${{ getOriginalPrice(item) }}</span>
        <span v-if="isOnSale" class="original-price">${{ getOriginalPrice(item) }}</span>
      </div>

      <div class="item-actions">
        <!-- Add to Cart Button (when not in cart) -->
        <v-btn v-if="!isInCart" color="primary" variant="flat" size="small" class="add-to-cart-btn"
          :loading="cartLoading" @click.stop="handleAddToCart" block>
          <v-icon icon="mdi-cart-plus" size="16" class="me-1" />
          Add To Cart
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

  <!-- Item Modal -->
  <ItemModal v-model="showItemModal" :item="item" @add-to-cart="handleAddToCart" />
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useFavoritesStore, useNotificationsStore, useCartStore, useAuthStore } from '../stores/index';
import ItemModal from './ItemModal.vue';

interface ItemCardProps {
  item: any;
  showSaleTag?: boolean;
}

const props = withDefaults(defineProps<ItemCardProps>(), {
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
const showItemModal = ref(false);
let autoSlideInterval: ReturnType<typeof setInterval> | null = null;

// Computed properties
const isOnSale = computed(() => {
  // Check if the API provides computed isOnSale
  if (props.item.isOnSale !== undefined) {
    return props.item.isOnSale;
  }
  // Fallback to price comparison
  const salePrice = getSalePrice(props.item);
  const originalPrice = getOriginalPrice(props.item);
  return salePrice < originalPrice && salePrice > 0;
});

const itemImages = computed(() => {
  return props.item.images || [];
});

const hasMultipleImages = computed(() => {
  return itemImages.value.length > 1;
});

const currentImage = computed(() => {
  if (itemImages.value.length > 0) {
    return itemImages.value[currentImageIndex.value];
  }
  return { url: 'https://picsum.photos/400/300?random=16', altText: props.item.name };
});

// Favorite functionality
const isFavorited = computed(() => {
  // First check local state, then fallback to store
  return localFavoriteStatus.value || favoritesStore.isItemFavorite(props.item.id);
});

// Cart functionality
const isInCart = computed(() => {
  return cartStore.isItemInCart(props.item.id);
});

// Check favorite status for this item
const checkFavoriteStatus = async () => {
  if (!authStore.isAuthenticated) {
    localFavoriteStatus.value = false;
    return;
  }

  try {
    const status = await favoritesStore.checkFavoriteStatus(props.item.id);

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

    await favoritesStore.toggleFavorite(props.item.id);
    // Update local state after toggle
    localFavoriteStatus.value = !localFavoriteStatus.value;

    // Show notification
    if (localFavoriteStatus.value) {
      notificationsStore.showSuccess(`${props.item.name} ${t('notifications.favorites.added')}`);
    } else {
      notificationsStore.showInfo(`${props.item.name} ${t('notifications.favorites.removed')}`);
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
    await cartStore.addToCart(props.item.id, 1);
    showItemModal.value = false;
  } catch (error) {
    // Error adding to cart
  } finally {
    cartLoading.value = false;
  }
};

// Remove from cart handler
const handleRemoveFromCart = async () => {
  try {
    cartLoading.value = true;
    const cartItem = cartStore.getCartItem(props.item.id);
    if (cartItem) {
      await cartStore.removeFromCart(cartItem.id);
    }
  } catch (error) {
    // Handle error silently
  } finally {
    cartLoading.value = false;
  }
};

const openItemModal = () => {
  showItemModal.value = true;
};

const navigateToProduct = () => {
  router.push({ name: 'single-product', params: { id: props.item.id } });
};

// Slideshow functions
const nextImage = () => {
  if (hasMultipleImages.value) {
    currentImageIndex.value = (currentImageIndex.value + 1) % itemImages.value.length;
  }
};



const goToImage = (index: number) => {
  if (index >= 0 && index < itemImages.value.length) {
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

// Helper function to get primary image
const getPrimaryImage = (item: any) => {
  // Check if images are at root level first
  if (item.images && item.images.length > 0) {
    const primaryImage = item.images.find((img: any) => img.isPrimary);
    return primaryImage ? primaryImage.url : item.images[0].url;
  }
  return 'https://picsum.photos/400/300?random=16';
};

// Helper function to get average rating
const getAverageRating = (item: any) => {
  // Check if the API provides computed averageRating
  if (item.averageRating !== undefined) {
    return item.averageRating;
  }
  // Check if reviews are at root level first
  if (item.reviews && item.reviews.length > 0) {
    const totalRating = item.reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
    return Math.round(totalRating / item.reviews.length);
  }
  return 0;
};

// Helper function to get review count
const getReviewCount = (item: any) => {
  // Check if the API provides computed totalReviews
  if (item.totalReviews !== undefined) {
    return item.totalReviews;
  }
  // Check if reviews are at root level first
  if (item.reviews) {
    return item.reviews.length;
  }
  return 0;
};

// Helper function to get original price (regular price)
const getOriginalPrice = (item: any) => {
  // Check if the API provides computed currentPrice
  if (item.currentPrice) {
    return item.currentPrice;
  }
  // Fallback to prices array
  if (item.prices && item.prices.length > 0) {
    const activePrice = item.prices.find((price: any) => price.isActive);
    return activePrice ? activePrice.price : item.prices[0].price;
  }
  return 0;
};

// Helper function to get sale price
const getSalePrice = (item: any) => {
  // Check if the API provides computed salePrice
  if (item.salePrice) {
    return item.salePrice;
  }
  // Fallback to prices array
  if (item.prices && item.prices.length > 0) {
    const activePrice = item.prices.find((price: any) => price.isActive);
    return activePrice ? activePrice.salePrice : item.prices[0].salePrice;
  }
  // If no sale price, return original price
  return getOriginalPrice(item);
};
</script>

<style scoped>
.item-card {
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

.item-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.item-image {
  position: relative;
  height: 220px;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.item-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover !important;
  transition: transform 0.3s ease;
}

.item-card:hover .item-image img {
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

.item-card:hover .action-overlay {
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

/* Slideshow Styles */
.image-slideshow {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slideshow-image {
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  object-fit: cover !important;
  transition: opacity 0.3s ease;
}

.single-image {
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  object-fit: cover !important;
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

.item-info {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
}

.item-name {
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

.item-rating {
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

.item-price {
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

.item-actions {
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
  .item-image {
    height: 160px;
  }

  .item-info {
    padding: 16px;
  }

  .item-name {
    font-size: 14px;
  }

  .current-price {
    font-size: 16px;
  }
}
</style>
