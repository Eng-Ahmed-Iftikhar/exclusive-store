<template>
  <v-dialog v-model="isOpen" max-width="900" persistent>
    <v-card class="item-modal">
      <!-- Header -->
      <v-card-title class="modal-header">
        <h2 class="modal-title">Product Details</h2>
        <v-btn icon="mdi-close" variant="text" @click="closeModal" />
      </v-card-title>

      <v-card-text class="modal-content">
        <div class="item-details">
          <!-- Left Side - Images -->
          <ItemModalImages 
            :item="item"
            :current-image-index="currentImageIndex"
            @update:current-image-index="updateCurrentImageIndex"
          />

          <!-- Right Side - Details and Actions -->
          <div class="right-section">
            <!-- Product Details -->
            <ItemModalDetails :item="item" />
            
            <!-- Actions (Quantity + Buttons) -->
            <ItemModalActions
              :item="item"
              :quantity="quantity"
              :is-in-stock="isInStock"
              :is-favorited="isFavorited"
              :add-to-cart-loading="addToCartLoading"
              :favorite-loading="favoriteLoading"
              @update:quantity="updateQuantity"
              @add-to-cart="handleAddToCart"
              @favorite-click="handleFavoriteClick"
            />
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useFavoritesStore, useCartStore } from '../stores/index';
import ItemModalImages from './ItemModalImages.vue';
import ItemModalDetails from './ItemModalDetails.vue';
import ItemModalActions from './ItemModalActions.vue';

interface ItemModalProps {
  modelValue: boolean;
  item: any;
}

const props = defineProps<ItemModalProps>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'add-to-cart': [item: any, quantity: number];
}>();

const favoritesStore = useFavoritesStore();
const cartStore = useCartStore();

// Modal state
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Local state
const currentImageIndex = ref(0);
const quantity = ref(1);
const addToCartLoading = ref(false);
const favoriteLoading = ref(false);

// Computed properties
const isInStock = computed(() => {
  const stock = props.item.stock;
  return stock && stock.quantity > 0;
});

const isFavorited = computed(() => {
  return favoritesStore.isItemFavorite(props.item.id);
});

const isInCart = computed(() => {
  return cartStore.isItemInCart(props.item.id);
});

const cartItemQuantity = computed(() => {
  return cartStore.getItemQuantity(props.item.id);
});

// Methods
const closeModal = () => {
  isOpen.value = false;
  // Reset state
  currentImageIndex.value = 0;
  quantity.value = 1;
};

const updateCurrentImageIndex = (index: number) => {
  currentImageIndex.value = index;
};

const updateQuantity = (newQuantity: number) => {
  quantity.value = newQuantity;
};

const handleAddToCart = async () => {
  try {
    addToCartLoading.value = true;
    
    if (isInCart.value) {
      // Update existing cart item
      const cartItem = cartStore.getCartItem(props.item.id);
      if (cartItem) {
        await cartStore.updateCartItemQuantity(cartItem.id, quantity.value);
      }
    } else {
      // Add new item to cart
      await cartStore.addToCart(props.item.id, quantity.value);
    }
    
    emit('add-to-cart', props.item, quantity.value);
    // Close modal after adding to cart
    closeModal();
  } catch (error) {
    // Error adding to cart
  } finally {
    addToCartLoading.value = false;
  }
};

const handleFavoriteClick = async () => {
  try {
    favoriteLoading.value = true;
    await favoritesStore.toggleFavorite(props.item.id);
  } catch (error) {
    // Error toggling favorite
  } finally {
    favoriteLoading.value = false;
  }
};

// Watch for modal open to reset state
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    currentImageIndex.value = 0;
    // Set quantity to current cart quantity if item is in cart
    if (isInCart.value) {
      quantity.value = cartItemQuantity.value;
    } else {
      quantity.value = 1;
    }
  }
});
</script>

<style scoped>
.item-modal {
  border-radius: 0px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-title {
  font-size: 24px;
  font-weight: 600;
  color: #000;
  margin: 0;
}

.modal-content {
  padding: 24px;
}

.item-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.right-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .item-details {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .modal-content {
    padding: 16px;
  }
}
</style>
