<template>
  <div class="actions-section">
    <!-- Quantity Selector -->
    <div class="quantity-section">
      <label class="quantity-label">Quantity:</label>
      <div class="quantity-controls">
        <v-btn 
          icon="mdi-minus" 
          variant="outlined" 
          size="small"
          @click="decreaseQuantity"
          :disabled="quantity <= 1"
        />
        <span class="quantity-display">{{ quantity }}</span>
        <v-btn 
          icon="mdi-plus" 
          variant="outlined" 
          size="small"
          @click="increaseQuantity"
          :disabled="quantity >= maxQuantity"
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="buttons-section">
      <v-btn 
        :color="isInCart ? 'success' : 'primary'" 
        variant="flat" 
        size="large"
        class="add-to-cart-btn"
        :disabled="!isInStock || addToCartLoading"
        :loading="addToCartLoading"
        @click="handleAddToCart"
      >
        <v-icon :icon="isInCart ? 'mdi-check' : 'mdi-cart-plus'" class="me-2" />
        {{ isInCart ? 'Update Cart' : 'Add to Cart' }}
      </v-btn>

      <v-btn 
        :icon="isFavorited ? 'mdi-heart' : 'mdi-heart-outline'" 
        variant="outlined" 
        size="large"
        class="favorite-btn"
        :class="{ 'favorited': isFavorited }"
        @click="handleFavoriteClick"
        :loading="favoriteLoading"
      />
    </div>

    <!-- Cart Status Info -->
    <div v-if="isInCart" class="cart-status">
      <v-alert
        type="info"
        variant="tonal"
        density="compact"
        class="cart-status-alert"
      >
        <template #prepend>
          <v-icon icon="mdi-cart-check" size="16" />
        </template>
        This product is already in your cart ({{ cartProductQuantity }} {{ cartProductQuantity === 1 ? 'item' : 'items' }})
      </v-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface ProductModalActionsProps {
  product: any;
  selectedVariant: any;
  quantity: number;
  isInStock: boolean;
  isFavorited: boolean;
  addToCartLoading: boolean;
  favoriteLoading: boolean;
}

const props = defineProps<ProductModalActionsProps>();
const emit = defineEmits<{
  'update:quantity': [quantity: number];
  'add-to-cart': [product: any, quantity: number];
  'favorite-click': [];
}>();

// Computed properties
const maxQuantity = computed(() => {
  // If we have a selected variant, use its stock
  if (props.selectedVariant && props.selectedVariant.stock && props.selectedVariant.stock.length > 0) {
    const availableStock = props.selectedVariant.stock[0].quantity;
    return Math.min(availableStock, 10); // Max 10 items per order
  }
  
  // If no variant selected, use product stock
  if (props.product.stock && props.product.stock.length > 0) {
    const availableStock = props.product.stock[0].quantity;
    return Math.min(availableStock, 10); // Max 10 items per order
  }
  
  return 0;
});

const isInCart = computed(() => {
  // This will be passed from parent component
  return false; // Placeholder, will be overridden by parent
});

const cartProductQuantity = computed(() => {
  // This will be passed from parent component
  return 0; // Placeholder, will be overridden by parent
});

// Methods
const increaseQuantity = () => {
  if (props.quantity < maxQuantity.value) {
    emit('update:quantity', props.quantity + 1);
  }
};

const decreaseQuantity = () => {
  if (props.quantity > 1) {
    emit('update:quantity', props.quantity - 1);
  }
};

const handleAddToCart = () => {
  emit('add-to-cart', props.product, props.quantity);
};

const handleFavoriteClick = () => {
  emit('favorite-click');
};
</script>

<style scoped>
.actions-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.quantity-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quantity-label {
  font-size: 16px;
  font-weight: 600;
  color: #000;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.quantity-controls button {
  width: 30px;
  height: 30px;
  border-radius: 6px !important;
}

.quantity-display {
  font-size: 18px;
  font-weight: 600;
  color: #000;
  min-width: 40px;
  text-align: center;
}

.buttons-section {
  display: flex;
  gap: 16px;
}

.add-to-cart-btn {
  flex: 1;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 6px !important;
}

.favorite-btn {
  width: 48px;
  height: 48px;
  border-radius: 6px !important;
}

.favorite-btn.favorited {
  color: #DB4444 !important;
  border-color: #DB4444 !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .buttons-section {
    flex-direction: column;
  }
  
  .add-to-cart-btn {
    width: 100%;
  }
}
</style>

