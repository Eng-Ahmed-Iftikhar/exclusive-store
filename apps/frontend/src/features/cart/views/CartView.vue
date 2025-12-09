<template>
  <div class="cart-view">
    <v-container>
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">Shopping Cart</h1>
        <p class="page-subtitle">{{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }} in your cart</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p>Loading your cart...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <v-icon icon="mdi-alert-circle" size="64" color="error" />
        <p>{{ error }}</p>
        <v-btn @click="loadCart" color="primary" variant="outlined">Retry</v-btn>
      </div>

      <!-- Empty Cart -->
      <EmptyCart v-else-if="!cartItems.length" />

      <!-- Cart Content -->
      <div v-else class="cart-content">
        <div class="cart-items">
          <CartItem
            v-for="item in cartItems"
            :key="item.id"
            :item="item"
            @update-quantity="handleUpdateQuantity"
            @remove="handleRemoveItem"
          />
        </div>

        <div class="cart-sidebar">
          <CartSummary
            :subtotal="subtotal"
            :shipping-cost="shippingCost"
            :discount="discount"
            @checkout="goToCheckout"
          />
        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../../../stores';
import EmptyCart from '../components/EmptyCart.vue';
import CartItem from '../components/CartItem.vue';
import CartSummary from '../components/CartSummary.vue';

const router = useRouter();
const cartStore = useCartStore();

const loading = ref(true);
const error = ref('');

const cartItems = computed(() => cartStore.cartItems || []);
const itemCount = computed(() => cartItems.value.length);

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    let itemPrice = 0;
    
    // Product price
    if (item.product?.prices?.length > 0) {
      const activePrice = item.product.prices.find((p: any) => p.isActive);
      const productPrice = activePrice || item.product.prices[0];
      itemPrice += Number(productPrice.salePrice || productPrice.price);
    }
    
    // Variant price
    if (item.variant?.prices?.length > 0) {
      const activePrice = item.variant.prices.find((p: any) => p.isActive);
      const variantPrice = activePrice || item.variant.prices[0];
      itemPrice += Number(variantPrice.salePrice || variantPrice.price);
    }
    
    return sum + (itemPrice * item.quantity);
  }, 0);
});

const shippingCost = computed(() => {
  // Free shipping over $100
  return subtotal.value >= 100 ? 0 : 10;
});

const discount = computed(() => 0); // Can be extended for promo codes

const loadCart = async () => {
  try {
    loading.value = true;
    error.value = '';
    await cartStore.initializeCart();
  } catch (err: any) {
    error.value = err.message || 'Failed to load cart';
  } finally {
    loading.value = false;
  }
};

const handleUpdateQuantity = async (itemId: string, quantity: number) => {
  try {
    await cartStore.updateCartItem(itemId, quantity);
  } catch (err: any) {
    console.error('Failed to update quantity:', err);
  }
};

const handleRemoveItem = async (itemId: string) => {
  try {
    await cartStore.removeFromCart(itemId);
  } catch (err: any) {
    console.error('Failed to remove item:', err);
  }
};

const goToCheckout = () => {
  router.push('/checkout');
};

onMounted(() => {
  loadCart();
});
</script>

<style scoped>
.cart-view {
  min-height: calc(100vh - 200px);
  padding: 40px 0;
  background: #f8f9fa;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  gap: 20px;
}

.loading-state p,
.error-state p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-sidebar {
    position: sticky;
    bottom: 0;
    background: white;
    padding: 16px;
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
    margin: 0 -16px;
    border-radius: 16px 16px 0 0;
  }
}

@media (max-width: 768px) {
  .cart-view {
    padding: 20px 0;
  }

  .page-title {
    font-size: 24px;
  }
}
</style>
