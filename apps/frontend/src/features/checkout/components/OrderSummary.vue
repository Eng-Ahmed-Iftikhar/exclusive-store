<template>
  <div class="order-summary-component">
    <h4 class="summary-title">Order Summary</h4>
    <div class="summary-item">
      <span>Subtotal:</span>
      <span>${{ order?.subtotal?.toFixed(2) || '0.00' }}</span>
    </div>
    <div class="summary-item">
      <span>Shipping:</span>
      <span>${{ order?.shippingCost?.toFixed(2) || '0.00' }}</span>
    </div>
    <div class="summary-item">
      <span>Tax:</span>
      <span>${{ order?.tax?.toFixed(2) || '0.00' }}</span>
    </div>
    <div class="summary-item total">
      <span>Total:</span>
      <span>${{ order?.total?.toFixed(2) || '0.00' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ICheckout } from '../../../stores/modules/checkout/checkout.types'

interface Props {
  order?: ICheckout.OrderResponse
}

defineProps<Props>()
</script>

<style scoped>
.order-summary-component {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-item span:first-child {
  font-weight: 500;
  color: #4b5563;
}

.summary-item span:last-child {
  font-weight: 600;
  color: #1f2937;
}

.summary-item.total {
  border-top: 1px solid #e5e7eb;
  padding-top: 0.75rem;
}

.summary-item.total span:first-child {
  font-weight: 500;
  color: #4b5563;
}

.summary-item.total span:last-child {
  font-weight: 600;
  color: #1f2937;
}
</style>
