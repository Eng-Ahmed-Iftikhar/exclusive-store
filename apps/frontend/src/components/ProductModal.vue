<template>
  <v-dialog v-model="isOpen" max-width="900" persistent>
    <v-card class="product-modal">
      <!-- Header -->
      <v-card-title class="modal-header">
        <h2 class="modal-title">Product Details</h2>
        <v-btn icon="mdi-close" variant="text" @click="closeModal" />
      </v-card-title>

      <v-card-text class="modal-content">
        <div class="product-details">
          <!-- Left Side - Images -->
          <ProductModalImages :product="product" :selected-variant="selectedVariant"
            :current-image-index="currentImageIndex" @update:current-image-index="updateCurrentImageIndex" />

          <!-- Right Side - Details and Actions -->
          <div class="right-section">
            <!-- Product Details -->
            <ProductModalDetails :product="product" :selected-variant-id="selectedVariantId"
              @variant-change="handleVariantChange" />

            <!-- Actions (Quantity + Buttons) -->
            <ProductModalActions :product="product" :selected-variant="selectedVariant" :quantity="quantity"
              :is-in-stock="isInStock" :is-favorited="isFavorited" :add-to-cart-loading="addToCartLoading"
              :favorite-loading="favoriteLoading" @update:quantity="updateQuantity" @add-to-cart="handleAddToCart"
              @favorite-click="handleFavoriteClick" />
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useFavoritesStore, useCartStore } from '../stores/index';
import ProductModalImages from './ProductModalImages.vue';
import ProductModalDetails from './ProductModalDetails.vue';
import ProductModalActions from './ProductModalActions.vue';

interface ProductModalProps {
  modelValue: boolean;
  product: any;
}

const props = defineProps<ProductModalProps>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'add-to-cart': [product: any, quantity: number];
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
const selectedVariantId = ref<string | null>(null);
const addToCartLoading = ref(false);
const favoriteLoading = ref(false);

// Don't initialize selected variant - user must choose

// Computed properties
const selectedVariant = computed(() => {
  if (!selectedVariantId.value) return null;
  return props.product.variants?.find((v: any) => v.id === selectedVariantId.value);
});

const isInStock = computed(() => {
  // If variant is selected, check variant stock
  if (selectedVariantId.value && selectedVariant.value?.stock && selectedVariant.value.stock.length > 0) {
    return selectedVariant.value.stock[0].quantity > 0;
  }
  
  // If no variant selected, check if any variant is in stock
  if (!selectedVariantId.value && props.product.variants && props.product.variants.length > 0) {
    return props.product.variants.some((v: any) => {
      if (v.stock && v.stock.length > 0) {
        return v.stock[0].quantity > 0;
      }
      return false;
    });
  }
  
  // Check product-level stock if no variants
  if (props.product.stock && props.product.stock.length > 0) {
    return props.product.stock[0].quantity > 0;
  }
  
  return false;
});

const isFavorited = computed(() => {
  return favoritesStore.isItemFavorite(props.product.id);
});

const isInCart = computed(() => {
  return cartStore.isItemInCart(props.product.id, selectedVariantId.value || undefined);
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

const handleVariantChange = (variantId: string) => {
  selectedVariantId.value = variantId || null;
  // Update images when variant changes
  currentImageIndex.value = 0;
};

const handleAddToCart = async () => {
  try {
    addToCartLoading.value = true;

    // Stock validation before adding to cart
    const availableStock = getAvailableStock();
    if (quantity.value > availableStock) {
      console.error(`Cannot add ${quantity.value} items. Only ${availableStock} available in stock.`);
      // You could show a toast notification here
      return;
    }

    if (isInCart.value) {
      // Update existing cart item
      const cartItem = cartStore.getCartItem(props.product.id, selectedVariantId.value || undefined);
      if (cartItem) {
        const newTotalQuantity = cartItem.quantity + quantity.value;
        if (newTotalQuantity > availableStock) {
          console.error(`Cannot update cart. Total quantity (${newTotalQuantity}) exceeds available stock (${availableStock}).`);
          return;
        }
        await cartStore.updateCartItemQuantity(cartItem.id, newTotalQuantity);
      }
    } else {
      // Add product or variant to cart
      await cartStore.addToCart(props.product.id, selectedVariantId.value || undefined, quantity.value);
    }

    // Close modal after adding to cart
    closeModal();
  } catch (error) {
    console.error('Error adding to cart:', error);
  } finally {
    addToCartLoading.value = false;
  }
};

// Helper function to get available stock
const getAvailableStock = () => {
  // If variant is selected, return variant stock
  if (selectedVariantId.value && selectedVariant.value?.stock && selectedVariant.value.stock.length > 0) {
    return selectedVariant.value.stock[0].quantity;
  }
  
  // If no variant selected, return product stock
  if (props.product.stock && props.product.stock.length > 0) {
    return props.product.stock[0].quantity;
  }
  
  return 0;
};

const handleFavoriteClick = async () => {
  try {
    favoriteLoading.value = true;
    await favoritesStore.toggleFavorite(props.product.id);
  } catch (error) {
    // Error toggling favorite
  } finally {
    favoriteLoading.value = false;
  }
};

// Watch for modal open to reset state
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    // Don't auto-select variant - user must choose
    selectedVariantId.value = null;
    currentImageIndex.value = 0;
    quantity.value = 1;
  }
});
</script>

<style scoped>
.product-modal {
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

.product-details {
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
  .product-details {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .modal-content {
    padding: 16px;
  }
}
</style>
