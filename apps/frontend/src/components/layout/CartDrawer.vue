<template>
  <v-navigation-drawer :model-value="isOpen" @update:model-value="$emit('update:modelValue', $event)" location="right"
    temporary width="400" class="cart-drawer" @click:overlay="$emit('update:modelValue', false)">
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
            <div class="cart-item-images">
              <!-- Product Image -->
              <div class="product-image-container">
                <img :src="getProductImage(cartItem)" :alt="cartItem.product?.name" class="item-image product-image"
                  @error="handleImageError" />
                <div class="image-label">Product</div>
              </div>

              <!-- Variant Image (if available) -->
              <div v-if="cartItem.variant" class="variant-image-container">
                <img :src="getVariantImage(cartItem)" :alt="cartItem.variant?.name" class="item-image variant-image"
                  @error="handleImageError" />
                <div class="image-label">Variant</div>
              </div>

              <div class="item-quantity-badge">
                {{ cartItem.quantity }}
              </div>
            </div>

            <div class="cart-item-details">
              <h4 class="item-name">{{ cartItem.product?.name }}</h4>
              <p v-if="cartItem.variant" class="item-variant">{{ cartItem.variant.name }}</p>

              <!-- Variant Attributes -->
              <div v-if="cartItem.variant?.attributes" class="variant-attributes">
                <span v-for="(value, key) in cartItem.variant.attributes" :key="key" class="attribute-tag">
                  {{ key }}: {{ value }}
                </span>
              </div>

              <!-- Pricing Information -->
              <div class="pricing-info">
                <p v-if="cartItem.variant" class="variant-price">
                  Variant Price: ${{ getVariantPrice(cartItem).toFixed(2) }}
                  <span v-if="getVariantOriginalPrice(cartItem) > getVariantPrice(cartItem)" class="original-price">
                    (was ${{ getVariantOriginalPrice(cartItem).toFixed(2) }})
                  </span>
                </p>
                <p v-if="!cartItem.variant" class="product-price">
                  Product Price: ${{ getProductOriginalPrice(cartItem).toFixed(2) }}
                </p>
                <p class="item-price">Final Price: ${{ Number(cartItem.price).toFixed(2) }}</p>
                <p class="item-total">Total: ${{ (Number(cartItem.price) * cartItem.quantity).toFixed(2) }}</p>
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
        <!-- Cost Breakdown -->
        <div class="cost-breakdown">
          <div class="cost-row">
            <span class="cost-label">Subtotal:</span>
            <span class="cost-value">${{ Number(cartStore.cart?.subtotal || 0).toFixed(2) }}</span>
          </div>

          <div class="cost-row">
            <span class="cost-label">Shipping: </span>
            <span class="cost-value shipping-cost">
              {{ cartStore.shippingCost === 0 ? 'FREE' : `$${cartStore.shippingCost.toFixed(2)}` }}
            </span>
          </div>

          <div class="cost-row">
            <span class="cost-label">Tax: </span>
            <span class="cost-value">${{ cartStore.tax.toFixed(2) }}</span>
          </div>



        </div>

        <div class="total-row">
          <div class="total-row">
            <span class="total-label">{{ $t('cart.total') }} </span>
            <span class="total-value">${{ Number(cartStore.totalWithShipping).toFixed(2) }}</span>
          </div>
          <div class="item-count-row">
            <span class="item-count">{{ cartStore.cartItemsCount }} {{ $t('cart.items') }}</span>
          </div>
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

const getProductImage = (cartItem: CartItem): string => {
  if (cartItem.product?.images && cartItem.product.images.length > 0) {
    // Find the primary image first, then fall back to first image
    const primaryImage = cartItem.product.images.find((img: any) => img.isPrimary);
    const imageToUse = primaryImage || cartItem.product.images[0];
    return imageToUse.file?.secureUrl || imageToUse.file?.url || 'https://placehold.co/60x60';
  }
  return 'https://placehold.co/60x60';
};

const getVariantImage = (cartItem: CartItem): string => {
  if (cartItem.variant?.images && cartItem.variant.images.length > 0) {
    // Find the primary image first, then fall back to first image
    const primaryImage = cartItem.variant.images.find((img: any) => img.isPrimary);
    const imageToUse = primaryImage || cartItem.variant.images[0];
    return imageToUse.file?.secureUrl || imageToUse.file?.url || 'https://placehold.co/60x60';
  }
  return 'https://placehold.co/60x60';
};

const getProductOriginalPrice = (cartItem: CartItem): number => {
  // Show the product's original price (sale price if available, otherwise regular price)
  const product = cartItem.product;
  if (product?.salePrice) {
    return parseFloat(product.salePrice);
  }
  if (product?.price) {
    return parseFloat(product.price);
  }
  return 0;
};

const getVariantPrice = (cartItem: CartItem): number => {
  // Get variant pricing from the prices array
  const variant = cartItem.variant as any;
  if (variant?.prices && variant.prices.length > 0) {
    const activePrice = variant.prices.find((price: any) => price.isActive);
    if (activePrice) {
      // Use sale price if available and valid, otherwise use regular price
      if (activePrice.salePrice && Number(activePrice.salePrice) > 0 && Number(activePrice.salePrice) < Number(activePrice.price)) {
        return Number(activePrice.salePrice);
      }
      return Number(activePrice.price);
    }
  }
  return 0;
};

const getVariantOriginalPrice = (cartItem: CartItem): number => {
  // Get the original price (before any sale) for variant
  const variant = cartItem.variant as any;
  if (variant?.prices && variant.prices.length > 0) {
    const activePrice = variant.prices.find((price: any) => price.isActive);
    if (activePrice) {
      return Number(activePrice.price);
    }
  }
  return 0;
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
  max-height: 100vh;
  overflow-y: auto;
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
  /* flex: 1; */
  /* overflow-y: auto; */

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
  align-items: flex-start;
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
  gap: 12px;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-images {
  flex-shrink: 0;
  position: relative;
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  margin-top: 4px;
}

.product-image-container,
.variant-image-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item-image {
  width: 45px;
  height: 45px;
  object-fit: cover;
  border-radius: 6px;
  border: 2px solid transparent;
  transition: border-color 0.2s ease;
}

.product-image {
  border-color: #3b82f6;
}

.variant-image {
  border-color: #10b981;
}

.image-label {
  font-size: 0.5rem;
  font-weight: 600;
  color: #6b7280;
  margin-top: 0.125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1;
}

.item-quantity-badge {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  background: #DB4444;
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  border-radius: 50%;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-item-details {
  flex: 1;
  min-width: 0;
  padding-top: 2px;
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

.item-variant {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  margin: 0 0 0.25rem 0;
  background: #f3f4f6;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  display: inline-block;
}

.variant-attributes {
  margin: 0.25rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.attribute-tag {
  font-size: 0.625rem;
  color: #374151;
  font-weight: 500;
  background: #e5e7eb;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
}

.pricing-info {
  margin-top: 0.25rem;
}

.variant-price {
  font-size: 0.7rem;
  color: #059669;
  font-weight: 600;
  margin: 0 0 0.125rem 0;
  background: #f0fdf4;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  border-left: 2px solid #10b981;
  line-height: 1.2;
}

.product-price {
  font-size: 0.7rem;
  color: #6b7280;
  font-weight: 500;
  margin: 0 0 0.125rem 0;
  background: #f9fafb;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  border-left: 2px solid #d1d5db;
  line-height: 1.2;
}

.original-price {
  color: #9ca3af;
  text-decoration: line-through;
  font-weight: 400;
  margin-left: 0.25rem;
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
  font-size: 0.75rem;
  font-weight: 600;
  color: #000;
  margin: 0.125rem 0;
  line-height: 1.2;
}

.item-total {
  font-size: 0.75rem;
  font-weight: 600;
  color: #000;
  margin: 0.125rem 0 0 0;
  line-height: 1.2;
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
  gap: 6px;
  margin-top: 0.25rem;
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
  gap: 12px;
  /* padding: 16px 24px; */
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
  margin-top: auto;
}

.cost-breakdown {
  display: flex;
  /* flex-direction: column; */
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.cost-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
}

.cost-label {
  color: #6b7280;
  font-size: 0.875rem;
}

.cost-value {
  font-weight: 600;
  color: #111827;
}

.shipping-cost {
  color: #059669;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #fef2f2 0%, #f3f4f6 100%);
  border-radius: 0.5rem;
  margin-top: 0.25rem;
  padding: 0.5rem 0.75rem;
}

.total-label {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
}

.total-value {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #DB4444 0%, #000000 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.item-count-row {
  text-align: center;
  padding: 0.25rem 0;
}

.item-count {
  font-size: 0.875rem;
  color: #6b7280;
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
    padding: 10px 16px;
    gap: 10px;
  }

  .item-image {
    width: 35px;
    height: 35px;
  }

  .cart-item-images {
    gap: 0.25rem;
  }

  .image-label {
    font-size: 0.4rem;
  }

  .cart-drawer-footer {
    padding: 12px 16px;
  }
}
</style>
