<template>
  <div class="cart-summary">
    <h3 class="summary-title">Order Summary</h3>

    <div class="summary-row">
      <span class="label">Subtotal:</span>
      <span class="value">${{ subtotal.toFixed(2) }}</span>
    </div>

    <div class="summary-row">
      <span class="label">Shipping:</span>
      <span class="value">{{ shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'Free' }}</span>
    </div>

    <div v-if="discount > 0" class="summary-row discount-row">
      <span class="label">Discount:</span>
      <span class="value">-${{ discount.toFixed(2) }}</span>
    </div>

    <div class="summary-divider"></div>

    <div class="summary-row total-row">
      <span class="label">Total:</span>
      <span class="value">${{ total.toFixed(2) }}</span>
    </div>

    <v-btn
      color="error"
      size="large"
      block
      variant="flat"
      class="checkout-btn"
      :disabled="disabled"
      @click="$emit('checkout')"
    >
      Proceed to Checkout
    </v-btn>

    <div class="continue-shopping">
      <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        to="/products"
        class="continue-btn"
      >
        Continue Shopping
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface CartSummaryProps {
  subtotal: number;
  shippingCost?: number;
  discount?: number;
  disabled?: boolean;
}

const props = withDefaults(defineProps<CartSummaryProps>(), {
  shippingCost: 0,
  discount: 0,
  disabled: false,
});

defineEmits<{
  checkout: [];
}>();

const total = computed(() => props.subtotal + props.shippingCost - props.discount);
</script>

<style scoped>
.cart-summary {
  padding: 24px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  position: sticky;
  top: 20px;
}

.summary-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 20px 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  font-size: 15px;
}

.summary-row .label {
  color: #666;
  font-weight: 500;
}

.summary-row .value {
  color: #1a1a1a;
  font-weight: 600;
}

.discount-row {
  color: #4caf50;
}

.discount-row .value {
  color: #4caf50;
}

.summary-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 16px 0;
}

.total-row {
  padding: 16px 0;
}

.total-row .label {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}

.total-row .value {
  font-size: 24px;
  font-weight: 700;
  color: #DB4444;
}

.checkout-btn {
  margin-top: 20px;
  text-transform: none;
  font-weight: 600;
  font-size: 16px;
  padding: 24px !important;
}

.continue-shopping {
  margin-top: 16px;
  text-align: center;
}

.continue-btn {
  text-transform: none;
  color: #666;
}
</style>
