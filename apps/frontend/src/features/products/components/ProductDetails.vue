<template>
  <div class="product-details">
    <!-- Category Badge -->
    <div class="category-badge mb-3">
      <v-chip :to="`/products?category=${product.category?.slug}`" color="primary" variant="outlined" size="small"
        class="category-chip">
        <v-icon icon="mdi-tag" size="16" class="me-1" />
        {{ product.category?.name }}
      </v-chip>
    </div>

    <!-- Product Title -->
    <h1 class="product-title mb-3">{{ product.name }}</h1>

    <!-- Rating and Reviews -->
    <div class="rating-section mb-4">
      <div class="stars">
        <v-icon v-for="star in 5" :key="star" icon="mdi-star" size="20"
          :color="star <= getAverageRating(product) ? '#FFD700' : '#E0E0E0'" />
      </div>
      <span class="rating-text">
        {{ getAverageRating(product) }} ({{ getReviewCount(product) }} reviews)
      </span>
    </div>

    <!-- Price Section -->
    <div class="price-section mb-4">
      <div class="price-display">
        <span v-if="isOnSale" class="sale-price">${{ getSalePrice(product) }}</span>
        <span class="current-price">${{ getCurrentPrice(product) }}</span>
        <span v-if="isOnSale" class="original-price">${{ getOriginalPrice(product) }}</span>
      </div>
      <v-chip v-if="isOnSale" color="error" size="small" class="sale-badge">
        SALE
      </v-chip>
    </div>

    <!-- Product Description -->
    <div v-if="product.description" class="description-section mb-4">
      <h3 class="section-title">Description</h3>
      <p class="description-text">{{ product.description }}</p>
    </div>

    <!-- Product Actions -->
    <div class="actions-section mb-4">
      <!-- Add to Cart Button -->
      <v-btn v-if="!isInCart" color="primary" variant="flat" size="large" class="add-to-cart-btn"
        @click="$emit('add-to-cart')" block>
        <v-icon icon="mdi-cart-plus" size="20" class="me-2" />
        Add to Cart
      </v-btn>

      <!-- Cart Actions (when in cart) -->
      <div v-else class="cart-actions">
        <v-btn color="success" variant="flat" size="large" class="in-cart-btn" disabled block>
          <v-icon icon="mdi-check" size="20" class="me-2" />
          In Cart
        </v-btn>
        <v-btn color="error" variant="outlined" size="large" class="remove-from-cart-btn"
          @click="$emit('remove-from-cart')" block>
          <v-icon icon="mdi-cart-minus" size="20" class="me-2" />
          Remove from Cart
        </v-btn>
      </div>

      <!-- Favorite Button -->
      <v-btn :icon="isFavorited ? 'mdi-heart' : 'mdi-heart-outline'" variant="outlined" size="large"
        class="favorite-btn" :class="{ 'favorited': isFavorited }" @click="$emit('toggle-favorite')" />
    </div>

    <!-- Product Meta -->
    <div class="product-meta">
      <div class="meta-item">
        <span class="meta-label">SKU:</span>
        <span class="meta-value">{{ product.sku || 'N/A' }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Category:</span>
        <span class="meta-value">{{ product.category?.name || 'N/A' }}</span>
      </div>
      <div v-if="product.subcategory" class="meta-item">
        <span class="meta-label">Subcategory:</span>
        <span class="meta-value">{{ product.subcategory.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

interface ProductSubcategory {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  prices?: ProductPrice[];
  reviews?: ProductReview[];
  category?: ProductCategory;
  subcategory?: ProductSubcategory;
}

interface Props {
  product: Product;
  isInCart: boolean;
  isFavorited: boolean;
  isOnSale: boolean;
}

defineProps<Props>();

defineEmits<{
  'add-to-cart': [];
  'remove-from-cart': [];
  'toggle-favorite': [];
}>();

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
</script>

<style scoped>
.product-details {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.category-badge {
  display: flex;
  align-items: center;
}

.category-chip {
  text-decoration: none;
}

.product-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.2;
  margin: 0;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stars {
  display: flex;
  gap: 2px;
}

.rating-text {
  font-size: 16px;
  color: #666;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.price-display {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.current-price {
  font-size: 32px;
  font-weight: 700;
  color: var(--v-theme-primary);
}

.sale-price {
  font-size: 28px;
  font-weight: 700;
  color: #DB4444;
}

.original-price {
  font-size: 20px;
  color: #999;
  text-decoration: line-through;
}

.sale-badge {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.description-section {
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.description-text {
  font-size: 16px;
  line-height: 1.6;
  color: #555;
  margin: 0;
}

.actions-section {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.add-to-cart-btn,
.in-cart-btn,
.remove-from-cart-btn {


  font-size: 16px;
  font-weight: 600;
  text-transform: none;
  border-radius: 8px !important;
}

.favorite-btn {
  width: 48px;

  border-radius: 8px !important;
}

.favorite-btn.favorited {
  color: #DB4444;
  border-color: #DB4444;
}

.cart-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.product-meta {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f8f8f8;
}

.meta-label {
  font-weight: 600;
  color: #666;
}

.meta-value {
  color: #333;
}

/* Responsive Design */
@media (max-width: 960px) {
  .product-title {
    font-size: 28px;
  }

  .current-price {
    font-size: 28px;
  }
}

@media (max-width: 600px) {
  .product-title {
    font-size: 24px;
  }

  .current-price {
    font-size: 24px;
  }

  .actions-section {
    flex-direction: column;
  }

  .favorite-btn {
    width: 100%;
    height: 48px;
  }
}
</style>
