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
        <span v-if="isOnSale" class="original-price">${{ getOriginalPrice(product) }}</span>
      </div>
      <v-chip v-if="isOnSale" color="error" size="small" class="sale-badge">
        SALE
      </v-chip>
    </div>

    <!-- Variant Selection -->
    <div v-if="product.variants && product.variants.length > 0" class="variant-section mb-4">
      <h3 class="section-title">Select Variant (Optional)</h3>
      <div class="variant-grid">
        <div v-for="variant in product.variants" :key="variant.id" class="variant-card"
          :class="{ 'selected': selectedVariantId === variant.id }" @click="selectVariant(variant.id)">
          <div class="variant-image">
            <img v-if="getVariantImage(variant)" :src="getVariantImage(variant) || ''" :alt="variant.name"
              class="variant-img" @error="handleImageError" />
            <div v-else class="no-image-placeholder">
              <v-icon icon="mdi-image" size="24" />
            </div>
          </div>
          <div class="variant-info">
            <h4 class="variant-name">{{ variant.name }}</h4>
            <div class="variant-price">
              <span v-if="getVariantSalePrice(variant)" class="variant-sale-price">
                ${{ getVariantSalePrice(variant) }}
              </span>
              <span class="variant-regular-price" :class="{ 'sale-price': getVariantSalePrice(variant) }">
                ${{ getVariantPrice(variant) }}
              </span>
            </div>
            <div class="variant-stock">
              <v-chip :color="isVariantInStock(variant) ? 'success' : 'error'" size="x-small" variant="outlined">
                {{ isVariantInStock(variant) ? 'In Stock' : 'Out of Stock' }}
              </v-chip>
            </div>
          </div>
        </div>
      </div>

      <!-- Variant Selection Info -->
      <div v-if="!selectedVariantId && product.variants.length > 0" class="variant-info-message">
        <v-icon icon="mdi-information-outline" size="16" />
        Optional: Select a variant to add its price to the product price
      </div>
    </div>

    <!-- Product Description -->
    <div v-if="product.description" class="description-section mb-4">
      <h3 class="section-title">Description</h3>
      <p class="description-text">{{ product.description }}</p>
    </div>

    <!-- Product Actions -->
    <div class="actions-section mb-4">
      <!-- Add to Cart Button -->
      <v-btn v-if="!isInCart" color="primary" variant="flat" size="large" class="add-to-cart-btn" :disabled="!isInStock"
        @click="$emit('add-to-cart', selectedVariantId ?? undefined)" block>
        <v-icon icon="mdi-cart-plus" size="20" class="me-2" />
        {{ isInStock ? 'Add to Cart' : 'Out of Stock' }}
      </v-btn>

      <!-- Cart Actions (when in cart) -->
      <div v-else class="cart-actions">
        <v-btn color="success" variant="flat" size="large" class="in-cart-btn" disabled block>
          <v-icon icon="mdi-check" size="20" class="me-2" />
          In Cart
        </v-btn>
        <v-btn color="error" variant="outlined" size="large" class="remove-from-cart-btn"
          @click="$emit('remove-from-cart', selectedVariantId ?? undefined)" block>
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
import { ref } from 'vue';

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

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  isDefault?: boolean;
  prices?: ProductPrice[];
  stock?: Array<{
    id: string;
    quantity: number;
    reserved: number;
    minThreshold: number;
    maxThreshold?: number;
    isInStock: boolean;
  }>;
  images?: Array<{
    id: string;
    productId?: string;
    variantId?: string;
    fileId: string;
    altText?: string;
    isPrimary: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
    file?: {
      id: string;
      url: string;
      secureUrl: string;
      originalName: string;
    };
  }>;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  prices?: ProductPrice[];
  stock?: Array<{
    id: string;
    quantity: number;
    reserved: number;
    minThreshold: number;
    maxThreshold?: number;
    isInStock: boolean;
  }>;
  variants?: ProductVariant[];
  reviews?: ProductReview[];
  category?: ProductCategory;
  subcategory?: ProductSubcategory;
}

interface Props {
  product: Product;
  isInCart: boolean;
  isFavorited: boolean;
  isOnSale: boolean;
  isInStock?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'add-to-cart': [variantId?: string];
  'remove-from-cart': [variantId?: string];
  'toggle-favorite': [];
  'variant-change': [variantId: string];
}>();

// Variant selection state
const selectedVariantId = ref<string | null>(null);

// Helper methods
const getAverageRating = (item: Product) => {
  if (!item.reviews || item.reviews.length === 0) return 0;
  const avgRating = item.reviews.reduce((sum, review) => sum + review.rating, 0) / item.reviews.length;
  return Math.round(avgRating * 10) / 10;
};

const getReviewCount = (item: Product) => {
  return item.reviews?.length || 0;
};


const getOriginalPrice = (item: Product) => {
  // First check if product has prices array
  if (item.prices && item.prices.length > 0) {
    const activePrice = item.prices.find(p => p.isActive);
    return activePrice?.price || item.prices[0].price || 0;
  }

  // Fallback to variant prices
  if (item.variants && item.variants.length > 0) {
    const defaultVariant = item.variants.find(v => v.isDefault) || item.variants[0];
    if (defaultVariant?.prices && defaultVariant.prices.length > 0) {
      const activePrice = defaultVariant.prices.find(p => p.isActive);
      return activePrice?.price || defaultVariant.prices[0].price || 0;
    }
  }

  return 0;
};

const getSalePrice = (item: Product) => {
  // First check if product has prices array with sale price
  if (item.prices && item.prices.length > 0) {
    const activePrice = item.prices.find(p => p.isActive);
    if (activePrice?.salePrice && activePrice.salePrice > 0 && activePrice.salePrice < activePrice.price) {
      return activePrice.salePrice;
    }
  }

  // Fallback to variant prices
  if (item.variants && item.variants.length > 0) {
    const defaultVariant = item.variants.find(v => v.isDefault) || item.variants[0];
    if (defaultVariant?.prices && defaultVariant.prices.length > 0) {
      const activePrice = defaultVariant.prices.find(p => p.isActive);
      if (activePrice?.salePrice && activePrice.salePrice > 0 && activePrice.salePrice < activePrice.price) {
        return activePrice.salePrice;
      }
    }
  }

  return getOriginalPrice(item);
};

// Variant-related methods
const selectVariant = (variantId: string) => {
  // If clicking the same variant, unselect it
  if (selectedVariantId.value === variantId) {
    selectedVariantId.value = null;
    emit('variant-change', '');
    return;
  }

  // Find the variant to check stock
  const variant = props.product.variants?.find((v: any) => v.id === variantId);
  if (variant && !isVariantInStock(variant)) {
    // Don't allow selection of out-of-stock variants
    return;
  }

  selectedVariantId.value = variantId;
  emit('variant-change', variantId);
};

const getVariantImage = (variant: ProductVariant): string | null => {
  if (variant.images && variant.images.length > 0) {
    // Find primary image first, then first available image
    const primaryImage = variant.images.find((img: any) => img.isPrimary);
    const image = primaryImage || variant.images[0];
    return image.file?.secureUrl || image.file?.url || null;
  }
  return null;
};

const getVariantPrice = (variant: ProductVariant): number => {
  if (variant.prices && variant.prices.length > 0) {
    const activePrice = variant.prices.find((p: any) => p.isActive);
    return activePrice?.price || variant.prices[0].price || 0;
  }
  return 0;
};

const getVariantSalePrice = (variant: ProductVariant): number => {
  if (variant.prices && variant.prices.length > 0) {
    const activePrice = variant.prices.find((p: any) => p.isActive);
    if (activePrice?.salePrice && activePrice.salePrice > 0 && activePrice.salePrice < activePrice.price) {
      return activePrice.salePrice;
    }
  }
  return 0;
};

const isVariantInStock = (variant: ProductVariant): boolean => {
  if (variant.stock && variant.stock.length > 0) {
    return variant.stock[0].quantity > 0;
  }
  return false;
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = 'https://via.placeholder.com/80x80/e0e0e0/666666?text=N/A';
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

/* Variant Selection Styles */
.variant-section {
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
}

.variant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.variant-card {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.variant-card:hover {
  border-color: #1976d2;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
}

.variant-card.selected {
  border-color: #1976d2;
  background: #f3f8ff;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2);
}

.variant-image {
  width: 100%;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.variant-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image-placeholder {
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.variant-info {
  text-align: center;
}

.variant-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.variant-price {
  margin-bottom: 8px;
}

.variant-sale-price {
  font-size: 16px;
  font-weight: 700;
  color: #DB4444;
  margin-right: 8px;
}

.variant-regular-price {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.variant-regular-price.sale-price {
  text-decoration: line-through;
  color: #999;
}

.variant-stock {
  display: flex;
  justify-content: center;
}

.variant-info-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #e3f2fd;
  border: 1px solid #2196f3;
  border-radius: 6px;
  color: #1565c0;
  font-size: 13px;
  font-weight: 500;
}

/* Responsive Design for Variants */
@media (max-width: 768px) {
  .variant-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }

  .variant-card {
    padding: 8px;
  }

  .variant-image {
    height: 60px;
  }

  .variant-name {
    font-size: 13px;
  }
}
</style>
