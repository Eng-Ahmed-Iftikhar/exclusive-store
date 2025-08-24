<template>
  <div class="cart-basket">
    <!-- Cart Icon with Badge -->
    <v-btn
      icon="mdi-cart-outline"
      variant="text"
      size="small"
      class="cart-icon-btn"
      @click="showCartDrawer = true"
      :loading="cartStore.loading.value"
    >
      <v-badge
        :content="cartStore.cartItemsCount"
        :model-value="cartStore.cartItemsCount > 0"
        color="error"
        location="top end"
        offset-x="8"
        offset-y="-8"
      />
      <v-icon class="cart-icon" name="mdi-cart-outline" size="24" />
    </v-btn>

    <!-- Cart Drawer Component -->
    <CartDrawer
      v-model="showCartDrawer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCartStore } from '../../stores/modules/cart';
import CartDrawer from './CartDrawer.vue';

const cartStore = useCartStore();

// Local state
const showCartDrawer = ref(false);

// Initialize cart when component mounts
onMounted(async () => {
  try {
    await cartStore.initializeCart();
  } catch (error) {
    // Handle error silently
  }
});
</script>

<style scoped>
.cart-basket {
  position: relative;
}

.cart-icon-btn {
  color: #666;
  min-width: 32px;
  height: 32px;
}

.cart-icon {
  color: #666;
}

.cart-icon-btn:hover {
  color: #000;
}
</style>
