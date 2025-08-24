<template>
  <div class="details-section">
    <!-- Basic Info -->
    <div class="basic-info">
      <h1 class="item-name">{{ item.name }}</h1>
      
      <!-- Rating -->
      <div class="rating-section">
        <div class="stars">
          <v-icon 
            v-for="star in 5" 
            :key="star" 
            icon="mdi-star" 
            size="20" 
            :color="star <= getAverageRating(item) ? '#FFD700' : '#E0E0E0'"
          />
        </div>
        <span class="rating-text">
          {{ getAverageRating(item) }}/5 ({{ getReviewCount(item) }} reviews)
        </span>
      </div>

      <!-- Price -->
      <div class="price-section">
        <div v-if="isOnSale" class="price-row">
          <span class="current-price">${{ getSalePrice(item) }}</span>
          <span class="original-price">${{ getOriginalPrice(item) }}</span>
          <span class="discount-badge">
            - {{ Math.round(((getOriginalPrice(item) - getSalePrice(item)) / getOriginalPrice(item)) * 100) }}%
          </span>
        </div>
    
        <div v-else class="price-row">
          <span class="current-price">${{ getOriginalPrice(item) }}</span>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div class="description-section">
      <h3>Description</h3>
      <p class="description-text">
        {{ item.description || 'No description available.' }}
      </p>
    </div>

    <!-- Category Info -->
    <div class="category-section">
      <div class="category-item">
        <span class="label">Category:</span>
        <span class="value">{{ item.category?.name || 'N/A' }}</span>
      </div>
      <div v-if="item.subcategory?.name" class="category-item">
        <span class="label">Subcategory:</span>
        <span class="value">{{ item.subcategory.name }}</span>
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

interface ItemModalDetailsProps {
  item: any;
}

const props = defineProps<ItemModalDetailsProps>();

// Computed properties
const isOnSale = computed(() => {
  if (props.item.isOnSale !== undefined) {
    return props.item.isOnSale;
  }
  const salePrice = getSalePrice(props.item);
  const originalPrice = getOriginalPrice(props.item);
  return salePrice < originalPrice && salePrice > 0;
});

const isInStock = computed(() => {
  const stock = props.item.stock;
  return stock && stock.quantity > 0;
});

const availableStock = computed(() => {
  const stock = props.item.stock;
  return stock ? stock.quantity : 0;
});

// Helper function to get original price (regular price)
const getOriginalPrice = (item: any) => {
  if (item.currentPrice) {
    return item.currentPrice;
  }
  if (item.prices && item.prices.length > 0) {
    const activePrice = item.prices.find((price: any) => price.isActive);
    return activePrice ? activePrice.price : item.prices[0].price;
  }
  return 0;
};

const getSalePrice = (item: any) => {
  if (item.salePrice) {
    return item.salePrice;
  }
  if (item.prices && item.prices.length > 0) {
    const activePrice = item.prices.find((price: any) => price.isActive);
    return activePrice ? activePrice.salePrice : item.prices[0].salePrice;
  }
  // If no sale price, return original price
  return getOriginalPrice(item);
};

const getAverageRating = (item: any) => {
  if (item.averageRating !== undefined) {
    return item.averageRating;
  }
  if (item.reviews && item.reviews.length > 0) {
    const totalRating = item.reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
    return Math.round(totalRating / item.reviews.length);
  }
  return 0;
};

const getReviewCount = (item: any) => {
  if (item.totalReviews !== undefined) {
    return item.totalReviews;
  }
  return item.reviews?.length || 0;
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

.item-name {
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
  .item-name {
    font-size: 24px;
  }
  
  .current-price {
    font-size: 28px;
  }
}
</style>
