<template>
  <v-card class="item-card" elevation="2" @click="navigateToProduct">
    <!-- Image Container with Overlay -->
    <div class="image-container">
      <img :src="item.images?.[0]?.url || '/placeholder-product.jpg'" :alt="item.name" class="item-image" />

      <!-- Overlay with Heart and Eye Icons -->
      <div class="image-overlay">
        <v-btn :icon="isFavorited ? 'mdi-heart' : 'mdi-heart-outline'" variant="text" size="small"
          class="overlay-btn favorite-btn" :class="{ 'favorited': isFavorited }" @click.stop="handleFavoriteClick" />
        <v-btn icon="mdi-eye" variant="text" size="small" class="overlay-btn view-btn"
          @click.stop="navigateToProduct" />
      </div>

      <!-- Sale Badge -->
      <v-chip v-if="isOnSale" color="error" size="small" class="sale-badge">
        SALE
      </v-chip>
    </div>

    <!-- Content -->
    <div class="card-content">
      <!-- Category -->
      <div class="category-section">
        <v-chip :to="`/products?category=${item.category?.slug}`" color="primary" variant="outlined" size="x-small"
          class="category-chip">
          {{ item.category?.name || 'Uncategorized' }}
        </v-chip>
      </div>

      <!-- Title -->
      <h3 class="item-title" :title="item.name">
        {{ item.name }}
      </h3>

      <!-- Rating -->
      <div class="rating-section">
        <div class="stars">
          <v-icon v-for="star in 5" :key="star" icon="mdi-star" size="16"
            :color="star <= getAverageRating(item) ? '#FFD700' : '#E0E0E0'" />
        </div>
        <span class="rating-text">
          {{ getAverageRating(item) }} ({{ getReviewCount(item) }})
        </span>
      </div>

      <!-- Price -->
      <div class="price-section">
        <div class="price-display">
          <span v-if="isOnSale" class="sale-price">
            ${{ getSalePrice(item) }}
          </span>
          <span class="current-price">
            ${{ getCurrentPrice(item) }}
          </span>
          <span v-if="isOnSale" class="original-price">
            ${{ getOriginalPrice(item) }}
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions-section">
        <v-btn v-if="!isInCart" color="primary" variant="flat" size="small" class="add-to-cart-btn"
          @click.stop="handleAddToCart" block>
          <v-icon icon="mdi-cart-plus" size="16" class="me-1" />
          Add to Cart
        </v-btn>

        <v-btn v-else color="success" variant="flat" size="small" class="in-cart-btn" disabled block>
          <v-icon icon="mdi-check" size="16" class="me-1" />
          In Cart
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore, useFavoritesStore } from '../../../stores';

interface ProductPrice {
  price: number;
  salePrice?: number;
  isActive: boolean;
}

interface ProductReview {
  rating: number;
}

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

interface ProductImage {
  url: string;
  altText?: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  images?: ProductImage[];
  prices?: ProductPrice[];
  reviews?: ProductReview[];
  category?: ProductCategory;
}

interface Props {
  item: Product;
}

const props = defineProps<Props>();
const router = useRouter();
const cartStore = useCartStore();
const favoritesStore = useFavoritesStore();

// Computed properties
const isInCart = computed(() => {
  return cartStore.isItemInCart(props.item.id);
});

const isFavorited = computed(() => {
  return favoritesStore.isItemFavorite(props.item.id);
});

const isOnSale = computed(() => {
  if (!props.item.prices) return false;
  const price = props.item.prices.find(p => p.isActive);
  return price?.salePrice && price.salePrice < price.price;
});

// Helper methods
const getAverageRating = (item: Product) => {
  if (!item.reviews || item.reviews.length === 0) return 0;
  const avgRating = item.reviews.reduce((sum, review) => sum + review.rating, 0) / item.reviews.length;
  return Math.round(avgRating * 10) / 10;
};

const getReviewCount = (item: Product) => {
  return item.reviews?.length || 0;
};

const getCurrentPrice = (item: Product) => {
  if (!item.prices) return 0;
  const price = item.prices.find(p => p.isActive);
  return price?.salePrice || price?.price || 0;
};

const getOriginalPrice = (item: Product) => {
  if (!item.prices) return 0;
  const price = item.prices.find(p => p.isActive);
  return price?.price || 0;
};

const getSalePrice = (item: Product) => {
  if (!item.prices) return 0;
  const price = item.prices.find(p => p.isActive);
  return price?.salePrice || 0;
};

// Event handlers
const navigateToProduct = () => {
  router.push({ name: 'single-product', params: { id: props.item.id } });
};

const handleAddToCart = async () => {
  try {
    await cartStore.addToCart(props.item.id, 1);
  } catch (err) {
    console.error('Error adding to cart:', err);
  }
};

const handleFavoriteClick = async () => {
  try {
    if (isFavorited.value) {
      await favoritesStore.removeFromFavorites(props.item.id);
    } else {
      await favoritesStore.addToFavorites(props.item.id);
    }
  } catch (err) {
    console.error('Error toggling favorite:', err);
  }
};
</script>

<style scoped>
.item-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  width: 100%;
  max-width: 300px;
  min-width: 200px;
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.item-card:hover .item-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.item-card:hover .image-overlay {
  opacity: 1;
}

.overlay-btn {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  color: #333;
}

.overlay-btn:hover {
  background: white;
  transform: scale(1.1);
}

.favorite-btn.favorited {
  color: #DB4444;
}

.sale-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #DB4444;
  color: white !important;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 8px;
}

.category-section {
  display: flex;
  align-items: center;
}

.category-chip {
  text-decoration: none;
  font-size: 11px;
}

.item-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.3;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 36px;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 1px;
}

.rating-text {
  font-size: 12px;
  color: #666;
}

.price-section {
  margin-top: auto;
}

.price-display {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--v-theme-primary);
}

.sale-price {
  font-size: 16px;
  font-weight: 700;
  color: #DB4444;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.actions-section {
  margin-top: 12px;
}

.add-to-cart-btn,
.in-cart-btn {
  height: 40px;
  font-size: 14px;
  font-weight: 600;
  text-transform: none;
  border-radius: 8px !important;
}

/* Responsive Design */
@media (max-width: 960px) {
  .image-container {
    height: 180px;
  }

  .item-title {
    font-size: 13px;
    min-height: 34px;
  }

  .current-price {
    font-size: 16px;
  }
}

@media (max-width: 600px) {
  .image-container {
    height: 160px;
  }

  .card-content {
    padding: 12px;
  }

  .item-title {
    font-size: 12px;
    min-height: 32px;
  }

  .current-price {
    font-size: 15px;
  }

  .add-to-cart-btn,
  .in-cart-btn {
    height: 36px;
    font-size: 13px;
  }
}
</style>
