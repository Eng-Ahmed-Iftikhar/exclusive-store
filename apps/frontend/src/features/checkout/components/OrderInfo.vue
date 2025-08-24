<template>
  <div class="order-info-component">
    <h3 class="order-info-title">Order Details</h3>
    <div class="order-info-grid">
      <div class="info-item">
        <span class="info-label">Order ID:</span>
        <span class="info-value">{{ orderId }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Order Date:</span>
        <span class="info-value">{{ orderDate }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  orderId: string
  orderDate: string
}

defineProps<Props>()
</script>

<style scoped>
.order-info-component {
  margin-bottom: 1.5rem;
}

.order-info-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.order-info-grid {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  font-size: 1.1rem;
  color: #374151;
  font-weight: 600;
}

@media (max-width: 768px) {
  .order-info-grid {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
