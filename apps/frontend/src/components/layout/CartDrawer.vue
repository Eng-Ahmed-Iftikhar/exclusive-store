<template>
  <v-navigation-drawer :model-value="isOpen" @update:model-value="$emit('update:modelValue', $event)" location="right"
    temporary overlay width="400" class="cart-drawer" @click:overlay="$emit('update:modelValue', false)">
    <v-card ref="drawerContent" class="cart-drawer-content" flat @click.stop>
      <v-card-title class="cart-drawer-header">
        <h3 class="cart-title">{{ $t('cart.title') }}</h3>
        <v-btn icon="mdi-close" variant="text" size="small" @click="closeDrawer" />
      </v-card-title>

      <v-card-text class="cart-drawer-content-body">
        <!-- Empty Cart State -->
        <div v-if="cartStore.isEmpty" class="empty-cart">
          <v-icon icon="mdi-cart-outline" size="48" color="grey" />
          <p class="empty-cart-text">{{ $t('cart.empty') }}</p>
          <v-btn color="primary" variant="flat" @click="goToProducts" class="shop-now-btn">
            {{ $t('cart.startShopping') }}
          </v-btn>
        </div>

        <!-- Cart Items -->
        <div v-else class="cart-items">
          <div v-for="cartItem in cartStore.cartItems" :key="`${cartItem.id}-${cartItem.quantity}`" class="cart-item">
            <div class="cart-item-image">
              <img :src="getItemImage(cartItem)" :alt="getItemName(cartItem)" class="item-image"
                @error="handleImageError" />
              <div v-if="isItemOnSale(cartItem)" class="cart-sale-badge">Sale</div>
            </div>

            <div class="cart-item-details">
              <h4 class="item-name">{{ getItemName(cartItem) }}</h4>
              <div class="item-price-container">
                <p v-if="isItemOnSale(cartItem)" class="item-price sale-price">
                  ${{ getSalePrice(cartItem) }}
                </p>
                <p v-else class="item-price">
                  ${{ cartItem.price }}
                </p>
                <p v-if="isItemOnSale(cartItem)" class="item-original-price">
                  ${{ getOriginalPrice(cartItem) }}
                </p>
              </div>

              <div class="quantity-controls">
                <v-btn icon="mdi-minus" variant="outlined" size="x-small" rounded="sm"
                  @click="decreaseQuantity(cartItem)" :disabled="cartItem.quantity <= 1" />
                <span class="quantity">{{ cartItem.quantity }}</span>
                <v-btn icon="mdi-plus" variant="outlined" rounded="sm" size="x-small"
                  @click="increaseQuantity(cartItem)" :disabled="cartItem.quantity >= 10" />
              </div>
            </div>

            <div class="cart-item-actions">
              <v-btn icon="mdi-delete" variant="text" size="small" rounded="sm" color="error"
                @click="removeItem(cartItem)" :loading="removingItemId === cartItem.id" />
            </div>
          </div>
        </div>
      </v-card-text>

      <!-- Cart Footer -->
      <v-card-actions v-if="!cartStore.isEmpty" class="cart-drawer-footer">
        <div class="cart-summary">
          <div class="cart-total">
            <span class="total-label">{{ $t('cart.total') }}</span>
            <span class="total-amount">${{ cartStore.cartTotal }}</span>
          </div>
          <span class="total-separator">
            |
          </span>
          <span class="item-count">{{ cartStore.cartItemsCount }} {{ $t('cart.items') }}</span>
        </div>

        <div class="cart-actions">
          <v-btn color="error" variant="outlined" size="small" rounded="sm" @click="clearCart"
            :loading="cartStore.loading">
            {{ $t('cart.clearCart') }}
          </v-btn>
          <v-btn color="primary" variant="flat" size="small" rounded="sm" @click="goToCheckout"
            :loading="cartStore.loading">
            {{ $t('cart.checkout') }}
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../../stores/modules/cart';
import { CartItem } from '../../stores/modules/cart/cart.interface';

interface CartDrawerProps {
  modelValue: boolean;
}

const props = defineProps<CartDrawerProps>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const router = useRouter();
const cartStore = useCartStore();

// Local state
const removingItemId = ref<string | null>(null);
const drawerContent = ref<any>();

// Computed
const isOpen = computed(() => props.modelValue);

// Watch for drawer open to initialize cart
watch(isOpen, async (newValue) => {
  if (newValue) {
    // Refresh cart data when drawer opens
    await refreshCartData();
  }
});

// Methods
const closeDrawer = () => {
  emit('update:modelValue', false);
};

const refreshCartData = async () => {
  try {
    if (!cartStore.cart) {
      // Initialize cart if not loaded
      await cartStore.initializeCart();
    }
  } catch (error) {
    // Handle error silently
  }
};

// Helper methods for cart items
const getItemName = (cartItem: CartItem): string => {
  const productName = cartItem.product?.name || 'Unknown Product';

  // If variant exists, show both product and variant name
  if (cartItem.variant && cartItem.variant.name) {
    return `${productName} - ${cartItem.variant.name}`;
  }

  return productName;
};

const getItemImage = (cartItem: CartItem): string => {
  // Helper function to extract image URL from different possible structures
  const extractImageUrl = (image: any): string | null => {
    if (!image) return null;

    // Try different possible URL structures
    if (image.file?.secureUrl) return image.file.secureUrl;
    if (image.file?.url) return image.file.url;
    if (image.url) return image.url;
    if (typeof image === 'string') return image;

    return null;
  };

  // Try variant images first
  if (cartItem.variant && cartItem.variant.images && cartItem.variant.images.length > 0) {
    // Find primary image first
    const primaryImage = cartItem.variant.images.find((img: any) => img.isPrimary);
    if (primaryImage) {
      const url = extractImageUrl(primaryImage);
      if (url) return url;
    }

    // Fallback to first image
    const firstImage = cartItem.variant.images[0];
    const url = extractImageUrl(firstImage);
    if (url) return url;
  }

  // Fallback to product images
  if (cartItem.product && cartItem.product.images && cartItem.product.images.length > 0) {
    // Find primary image first
    const primaryImage = cartItem.product.images.find((img: any) => img.isPrimary);
    if (primaryImage) {
      const url = extractImageUrl(primaryImage);
      if (url) return url;
    }

    // Fallback to first image
    const firstImage = cartItem.product.images[0];
    const url = extractImageUrl(firstImage);
    if (url) return url;
  }

  // Default fallback
  return 'https://picsum.photos/60/60?random=1';
};

const isItemOnSale = (cartItem: CartItem): boolean => {
  // Check variant sale price first
  if (cartItem.variant && cartItem.variant.prices && cartItem.variant.prices.length > 0) {
    const price = cartItem.variant.prices[0];
    return price.salePrice && price.salePrice < price.price && price.salePrice > 0 ? true : false;
  }

  // Check product sale price
  if (cartItem.product && cartItem.product.salePrice && cartItem.product.price) {
    return cartItem.product.salePrice < cartItem.product.price && cartItem.product.salePrice > 0 ? true : false;
  }

  return false;
};

const getSalePrice = (cartItem: CartItem): number => {
  // The cart item price is already the total price (product + variant if applicable)
  // So we should display the cart item price directly
  return Number(cartItem.product.salePrice) || 0;
};

const getOriginalPrice = (cartItem: CartItem): number => {
  // Calculate the original price by adding product and variant original prices
  let totalOriginalPrice = 0;

  // Add product original price
  if (cartItem.product && cartItem.product.price) {
    totalOriginalPrice += Number(cartItem.product.price);
  }

  // Add variant original price if variant exists
  if (cartItem.variant && cartItem.variant.prices && cartItem.variant.prices.length > 0) {
    const variantPrice = cartItem.variant.prices[0];
    totalOriginalPrice += Number(variantPrice.price);
  }

  // If we couldn't calculate original price, use the cart item price
  return totalOriginalPrice > 0 ? totalOriginalPrice : Number(cartItem.price) || 0;
};

const increaseQuantity = async (cartItem: CartItem) => {
  if (cartItem.quantity < 10) {
    await cartStore.updateCartItemQuantity(cartItem.id, cartItem.quantity + 1);

  }
};

const decreaseQuantity = async (cartItem: CartItem) => {
  if (cartItem.quantity > 1) {
    await cartStore.updateCartItemQuantity(cartItem.id, cartItem.quantity - 1);

  }
};

const removeItem = async (cartItem: CartItem) => {
  removingItemId.value = cartItem.id;
  try {
    await cartStore.removeFromCart(cartItem.id);
  } finally {
    removingItemId.value = null;
  }
};

const clearCart = async () => {
  await cartStore.clearCart();
  closeDrawer();
};

const goToProducts = () => {
  router.push('/products');
  closeDrawer();
};

const goToCheckout = () => {
  // TODO: Implement checkout page
  router.push('/checkout');
  closeDrawer();
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src =
    'https://picsum.photos/60/60?random=1';
};
</script>

<style scoped>
.cart-drawer {
  z-index: 1000;
}

.cart-drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cart-drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.total-separator {
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.5);
  margin: 0 5px;
}

.cart-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #000;
}

.cart-drawer-content-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-cart-text {
  margin: 20px 0;
  color: #666;
  font-size: 16px;
}

.shop-now-btn {
  margin-top: 20px;
}

.cart-items {
  padding: 0;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  gap: 16px;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-image {
  flex-shrink: 0;
  position: relative;
  /* Added for sale badge positioning */
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.cart-sale-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #DB4444;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 8px;
  border-bottom-left-radius: 6px;
  z-index: 1;
}

.cart-item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #000;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-price-container {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
}

.sale-price {
  font-size: 16px;
  font-weight: 700;
  color: #DB4444;
  margin: 0;
}

.item-price {
  font-size: 16px;
  font-weight: 700;
  color: #000;
  margin: 0;
}

.item-original-price {
  font-size: 12px;
  color: #666;
  text-decoration: line-through;
  margin: 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity {
  font-size: 14px;
  font-weight: 600;
  color: #000;
  min-width: 20px;
  text-align: center;
}

.cart-item-actions {
  flex-shrink: 0;
}

.cart-drawer-footer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 24px;
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.cart-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-total {
  display: flex;
  align-items: center;
  gap: 8px;
}

.total-label {
  font-size: 16px;
  font-weight: 600;
  color: #000;
}

.total-amount {
  font-size: 20px;
  font-weight: 700;
  color: #DB4444;
}

.item-count {
  font-size: 14px;
  color: #666;
}

.cart-actions {
  display: flex;
  gap: 12px;
}

/* Responsive Design */
@media (max-width: 600px) {
  .cart-drawer {
    width: 100vw !important;
  }

  .cart-item {
    padding: 12px 16px;
    gap: 12px;
  }

  .item-image {
    width: 50px;
    height: 50px;
  }

  .cart-drawer-footer {
    padding: 16px 20px;
  }
}
</style>
