<template>
  <div class="success-message">
    <v-alert type="success" variant="tonal" class="mb-4">
      <template #prepend>
        <v-icon size="24">mdi-check-circle</v-icon>
      </template>
      <div class="success-content">
        <h4 class="success-title">Order Placed Successfully!</h4>
        <p class="success-description">
          Your order has been confirmed and will be processed shortly.
        </p>
        <div class="order-details">
          <p><strong>Order ID:</strong> {{ orderId }}</p>
          <p><strong>Total:</strong> ${{ orderTotal }}</p>
        </div>
      </div>
    </v-alert>
  </div>
</template>

<script setup lang="ts">
interface Props {
  orderId?: string;
  orderTotal?: string;
}

withDefaults(defineProps<Props>(), {
  orderId: '',
  orderTotal: '0.00',
});
</script>

<style scoped>
.success-message {
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 12px;
}

.success-content {
  text-align: center;
}

.success-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #1f2937;
}

.success-description {
  margin: 0 0 1rem 0;
  color: #6b7280;
}

.order-details {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.order-details p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
}
</style>
