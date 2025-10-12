<template>
  <div class="details-section">
    <!-- Basic Info -->
    <div class="basic-info">
      <h1 class="product-name">{{ product.name }}</h1>

      <!-- Rating -->
      <div class="rating-section">
        <div class="stars">
          <v-icon v-for="star in 5" :key="star" icon="mdi-star" size="20"
            :color="star <= getAverageRating(product) ? '#FFD700' : '#E0E0E0'" />
        </div>
        <span class="rating-text">
          {{ getAverageRating(product) }}/5 ({{ getReviewCount(product) }} reviews)
        </span>
      </div>

      <!-- Price -->
      <div class="price-section">
        <!-- Product Base Price -->
        <div class="base-price-row">
          <span class="price-label">Product Price:</span>
          <div class="price-values">
            <template v-if="hasProductSalePrice">
              <span class="current-price">${{ getProductSalePrice().toFixed(2) }}</span>
              <span class="original-price">${{ getProductPrice().toFixed(2) }}</span>
            </template>
            <template v-else>
              <span class="current-price">${{ getProductPrice().toFixed(2) }}</span>
            </template>
          </div>
        </div>

        <!-- Selected Variant Price (if variant selected) -->
        <div v-if="selectedVariant" class="variant-price-row-detail">
          <span class="price-label">Variant Price:</span>
          <div class="price-values">
            <template v-if="hasVariantSalePrice">
              <span class="current-price">${{ getSelectedVariantSalePrice().toFixed(2) }}</span>
              <span class="original-price">${{ getSelectedVariantPrice().toFixed(2) }}</span>
            </template>
            <template v-else>
              <span class="current-price">${{ getSelectedVariantPrice().toFixed(2) }}</span>
            </template>
          </div>
        </div>

        <!-- Total Price -->
        <div class="total-price-row">
          <span class="price-label">Total Price:</span>
          <div class="price-values">
            <span class="total-price">${{ getTotalPrice().toFixed(2) }}</span>
            <span v-if="getTotalDiscount() > 0" class="discount-badge">-{{ getTotalDiscount() }}%</span>
          </div>
        </div>

        <!-- Variant Selection Required Message -->
        <div v-if="!selectedVariant" class="variant-required-message">
          <v-icon icon="mdi-information-outline" size="16" />
          Please select a variant below
        </div>
      </div>

      <!-- Variant Selector -->
      <div v-if="product.variants && product.variants.length > 0" class="variant-selector">
        <h4 class="variant-title">Select Variant</h4>
        <div class="variant-cards">
          <div v-for="variant in product.variants" :key="variant.id" class="variant-card" :class="{
            'selected': selectedVariantId === variant.id,
            'out-of-stock': !isVariantInStock(variant)
          }" @click="handleVariantChange(variant.id)">
            <!-- Variant Image -->
            <div class="variant-image-container">
              <img :src="getVariantImage(variant)" :alt="variant.name" class="variant-image"
                @error="handleImageError" />

              <!-- Stock Badge -->
              <div v-if="!isVariantInStock(variant)" class="stock-badge out-of-stock-badge">
                Out of Stock
              </div>
              <div v-else-if="getVariantStock(variant) < 5" class="stock-badge low-stock-badge">
                Only {{ getVariantStock(variant) }} left
              </div>
            </div>

            <!-- Variant Info -->
            <div class="variant-info">
              <h5 class="variant-name">{{ variant.name }}</h5>

              <!-- Price -->
              <div class="variant-price-row">
                <template v-if="getVariantSalePrice(variant) < getVariantPrice(variant)">
                  <span class="variant-sale-price">${{ getVariantSalePrice(variant).toFixed(2) }}</span>
                  <span class="variant-original-price">${{ getVariantPrice(variant).toFixed(2) }}</span>
                </template>
                <template v-else>
                  <span class="variant-current-price">${{ getVariantPrice(variant).toFixed(2) }}</span>
                </template>
              </div>

              <!-- SKU -->
              <div v-if="variant.sku" class="variant-sku">
                SKU: {{ variant.sku }}
              </div>
            </div>

            <!-- Selected Checkmark -->
            <div v-if="selectedVariantId === variant.id" class="selected-badge">
              <v-icon icon="mdi-check-circle" size="24" color="white" />
            </div>

            <!-- Unselect Hint -->
            <div v-if="selectedVariantId === variant.id" class="unselect-hint">
              Click to unselect
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div class="description-section">
      <h3>Description</h3>
      <p class="description-text">
        {{ product.description || 'No description available.' }}
      </p>
    </div>

    <!-- Category Info -->
    <div class="category-section">
      <div class="category-item">
        <span class="label">Category:</span>
        <span class="value">{{ product.category?.name || 'N/A' }}</span>
      </div>
      <div v-if="product.subcategory?.name" class="category-item">
        <span class="label">Subcategory:</span>
        <span class="value">{{ product.subcategory.name }}</span>
      </div>
    </div>

    <!-- Stock Info -->
    <div class="stock-section">
      <div class="stock-item">
        <span class="label">Availability:</span>
        <span class="value" :class="{ 'in-stock': isInStock, 'out-of-stock': !isInStock }">
          {{ isInStock ? 'In Stock' : 'Out of Stock' }}
        </span>
      </div>
      <div v-if="isInStock" class="stock-item">
        <span class="label">Quantity:</span>
        <span class="value">{{ availableStock }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface ProductModalDetailsProps {
  product: any;
  selectedVariantId: string | null;
}

const props = defineProps<ProductModalDetailsProps>();

const emit = defineEmits<{
  'variant-change': [variantId: string];
}>();

// Get selected variant or default
const selectedVariant = computed(() => {
  if (!props.selectedVariantId) return null;
  return props.product.variants?.find((v: any) => v.id === props.selectedVariantId);
});

// Product base price helpers
const getProductPrice = () => {
  return Number(props.product.price) || 0;
};

const getProductSalePrice = () => {
  return Number(props.product.salePrice) || 0;
};

const hasProductSalePrice = computed(() => {
  const salePrice = getProductSalePrice();
  const regularPrice = getProductPrice();
  return salePrice > 0 && salePrice < regularPrice;
});

// Selected variant price helpers
const getSelectedVariantPrice = () => {
  if (!selectedVariant.value) return 0;
  return getVariantPrice(selectedVariant.value);
};

const getSelectedVariantSalePrice = () => {
  if (!selectedVariant.value) return 0;
  return getVariantSalePrice(selectedVariant.value);
};

const hasVariantSalePrice = computed(() => {
  if (!selectedVariant.value) return false;
  const salePrice = getSelectedVariantSalePrice();
  const regularPrice = getSelectedVariantPrice();
  return salePrice > 0 && salePrice < regularPrice;
});

// Total price calculation
const getTotalPrice = () => {
  let total = 0;

  // Add product price (sale price if available)
  if (hasProductSalePrice.value) {
    total += getProductSalePrice();
  } else {
    total += getProductPrice();
  }

  // Add variant price (sale price if available) if variant is selected
  if (selectedVariant.value) {
    if (hasVariantSalePrice.value) {
      total += getSelectedVariantSalePrice();
    } else {
      total += getSelectedVariantPrice();
    }
  }

  return total;
};

// Calculate total discount percentage
const getTotalDiscount = () => {
  const totalRegular = getProductPrice() + (selectedVariant.value ? getSelectedVariantPrice() : 0);
  const totalSale = getTotalPrice();

  if (totalRegular > 0 && totalSale < totalRegular) {
    return Math.round(((totalRegular - totalSale) / totalRegular) * 100);
  }
  return 0;
};

// Computed properties
const isInStock = computed(() => {
  if (selectedVariant.value?.stock) {
    return selectedVariant.value.stock.quantity > 0;
  }
  return false;
});

const availableStock = computed(() => {
  if (selectedVariant.value?.stock) {
    return selectedVariant.value.stock.quantity;
  }
  return 0;
});

// Handle variant selection
const handleVariantChange = (variantId: string) => {
  // If clicking the same variant, unselect it
  if (props.selectedVariantId === variantId) {
    emit('variant-change', '');
    return;
  }

  // Find the variant to check stock
  const variant = props.product.variants?.find((v: any) => v.id === variantId);
  if (variant && !isVariantInStock(variant)) {
    // Don't allow selection of out-of-stock variants
    return;
  }
  emit('variant-change', variantId);
};

// Helper functions to get individual variant prices for cards
const getVariantPrice = (variant: any) => {
  if (variant.prices && variant.prices.length > 0) {
    const activePrice = variant.prices.find((p: any) => p.isActive);
    return activePrice ? Number(activePrice.price) : Number(variant.prices[0].price);
  }
  return 0;
};

const getVariantSalePrice = (variant: any) => {
  if (variant.prices && variant.prices.length > 0) {
    const activePrice = variant.prices.find((p: any) => p.isActive);
    if (activePrice?.salePrice && Number(activePrice.salePrice) > 0) {
      return Number(activePrice.salePrice);
    }
  }
  return getVariantPrice(variant);
};

// Get variant stock
const getVariantStock = (variant: any) => {
  if (variant.stock) {
    return variant.stock.quantity || 0;
  }
  return 0;
};

const isVariantInStock = (variant: any) => {
  return getVariantStock(variant) > 0;
};

// Get variant image
const getVariantImage = (variant: any) => {
  if (variant.images && variant.images.length > 0) {
    const primaryImage = variant.images.find((img: any) => img.isPrimary);
    if (primaryImage) {
      return primaryImage.file?.secureUrl || primaryImage.file?.url || '';
    }
    const firstImage = variant.images[0];
    return firstImage.file?.secureUrl || firstImage.file?.url || '';
  }
  return 'https://via.placeholder.com/150?text=No+Image';
};

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.src = 'https://via.placeholder.com/150?text=No+Image';
};

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

const getReviewCount = (product: any) => {
  if (product.totalReviews !== undefined) {
    return product.totalReviews;
  }
  return product.reviews?.length || 0;
};
</script>

<style scoped>
.details-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.basic-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-name {
  font-size: 28px;
  font-weight: 700;
  color: #000;
  margin: 0;
  line-height: 1.2;
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
  font-size: 14px;
  color: #666;
}

.price-section {
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.base-price-row,
.variant-price-row-detail,
.total-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.base-price-row,
.variant-price-row-detail {
  border-bottom: 1px solid #e0e0e0;
}

.total-price-row {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 2px solid #DB4444;
}

.price-label {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.price-values {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.current-price {
  font-size: 16px;
  font-weight: 600;
  color: #DB4444;
}

.total-price {
  font-size: 24px;
  font-weight: 700;
  color: #DB4444;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.discount-badge {
  background: #DB4444;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.variant-required-message {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 10px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 6px;
  color: #856404;
  font-size: 13px;
  font-weight: 500;
}

.variant-selector {
  margin-top: 20px;
}

.variant-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.variant-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.variant-card {
  position: relative;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
  overflow: hidden;
}

.variant-card:hover {
  border-color: #DB4444;
  box-shadow: 0 4px 12px rgba(219, 68, 68, 0.15);
  transform: translateY(-2px);
}

.variant-card.selected {
  border-color: #DB4444;
  background: #fff5f5;
  box-shadow: 0 4px 16px rgba(219, 68, 68, 0.25);
}

.variant-card.out-of-stock {
  opacity: 0.6;
  cursor: not-allowed;
}

.variant-card.out-of-stock:hover {
  border-color: #e0e0e0;
  box-shadow: none;
  transform: none;
}

.variant-image-container {
  position: relative;
  width: 100%;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f8f8;
  margin-bottom: 8px;
}

.variant-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stock-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.out-of-stock-badge {
  background: rgba(0, 0, 0, 0.8);
  color: white;
}

.low-stock-badge {
  background: rgba(255, 152, 0, 0.9);
  color: white;
}

.variant-info {
  padding: 4px 0;
}

.variant-name {
  font-size: 13px;
  color: #333;
  font-weight: 600;
  margin: 0 0 6px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.variant-price-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.variant-sale-price {
  font-size: 14px;
  font-weight: 700;
  color: #DB4444;
}

.variant-original-price {
  font-size: 11px;
  color: #999;
  text-decoration: line-through;
  font-weight: 400;
}

.variant-current-price {
  font-size: 14px;
  font-weight: 700;
  color: #333;
}

.variant-sku {
  font-size: 10px;
  color: #666;
  margin-top: 2px;
}

.selected-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #DB4444;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.unselect-hint {
  position: absolute;
  bottom: 4px;
  left: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 9px;
  text-align: center;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.variant-card.selected:hover .unselect-hint {
  opacity: 1;
}

/* Responsive for smaller screens */
@media (max-width: 768px) {
  .variant-cards {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }

  .variant-image-container {
    height: 100px;
  }
}

.description-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #000;
  margin: 0 0 12px 0;
}

.description-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.category-section,
.stock-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item,
.stock-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.value {
  font-size: 14px;
  color: #000;
  font-weight: 600;
}

.in-stock {
  color: #4caf50;
}

.out-of-stock {
  color: #f44336;
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-name {
    font-size: 24px;
  }

  .current-price {
    font-size: 28px;
  }
}
</style>
