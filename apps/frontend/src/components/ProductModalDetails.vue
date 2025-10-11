<template>
  <div class="details-section">
    <!-- Basic Info -->
    <div class="basic-info">
      <h1 class="product-name">{{ product.name }}</h1>
      
      <!-- Rating -->
      <div class="rating-section">
        <div class="stars">
          <v-icon 
            v-for="star in 5" 
            :key="star" 
            icon="mdi-star" 
            size="20" 
            :color="star <= getAverageRating(product) ? '#FFD700' : '#E0E0E0'"
          />
        </div>
        <span class="rating-text">
          {{ getAverageRating(product) }}/5 ({{ getReviewCount(product) }} reviews)
        </span>
      </div>

      <!-- Price -->
      <div class="price-section">
        <div v-if="isOnSale" class="price-row">
          <span class="current-price">${{ getSalePrice(product) }}</span>
          <span class="original-price">${{ getOriginalPrice(product) }}</span>
          <span class="discount-badge">
            - {{ Math.round(((getOriginalPrice(product) - getSalePrice(product)) / getOriginalPrice(product)) * 100) }}%
          </span>
        </div>
    
        <div v-else class="price-row">
          <span class="current-price">${{ getOriginalPrice(product) }}</span>
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
}

const props = defineProps<ProductModalDetailsProps>();

// Computed properties
const isOnSale = computed(() => {
  const salePrice = getSalePrice(props.product);
  const originalPrice = getOriginalPrice(props.product);
  return salePrice < originalPrice && salePrice > 0;
});

const isInStock = computed(() => {
  if (props.product.variants && props.product.variants.length > 0) {
    const defaultVariant = props.product.variants.find((v: any) => v.isDefault) || props.product.variants[0];
    const stock = defaultVariant.stock;
    return stock && stock.quantity > 0;
  }
  return false;
});

const availableStock = computed(() => {
  if (props.product.variants && props.product.variants.length > 0) {
    const defaultVariant = props.product.variants.find((v: any) => v.isDefault) || props.product.variants[0];
    const stock = defaultVariant.stock;
    return stock ? stock.quantity : 0;
  }
  return 0;
});

// Helper function to get original price from variant
const getOriginalPrice = (product: any) => {
  if (product.variants && product.variants.length > 0) {
    const defaultVariant = product.variants.find((v: any) => v.isDefault) || product.variants[0];
    if (defaultVariant.prices && defaultVariant.prices.length > 0) {
      const activePrice = defaultVariant.prices.find((price: any) => price.isActive);
      return activePrice ? activePrice.price : defaultVariant.prices[0].price;
    }
  }
  return 0;
};

const getSalePrice = (product: any) => {
  if (product.variants && product.variants.length > 0) {
    const defaultVariant = product.variants.find((v: any) => v.isDefault) || product.variants[0];
    if (defaultVariant.prices && defaultVariant.prices.length > 0) {
      const activePrice = defaultVariant.prices.find((price: any) => price.isActive);
      const salePrice = activePrice ? activePrice.salePrice : defaultVariant.prices[0].salePrice;
      return salePrice || getOriginalPrice(product);
    }
  }
  return getOriginalPrice(product);
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
  margin-top: 8px;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.current-price {
  font-size: 32px;
  font-weight: 700;
  color: #DB4444;
}

.original-price {
  font-size: 20px;
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

