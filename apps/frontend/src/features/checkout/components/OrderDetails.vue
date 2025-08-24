<template>
  <v-card class="order-details-card mb-8 pa-6 text-left" variant="outlined">
    <h2 class="text-h5 font-weight-semibold mb-4">Order Summary</h2>
    <div class="order-details">

      <div class="d-flex justify-space-between align-center mb-3">
        <span class="text-medium-emphasis">Items:</span>
        <span class="font-weight-medium">{{ orderItems.length }} items</span>
      </div>
      <div class="d-flex justify-space-between align-center mb-3">
        <span class="text-medium-emphasis">Subtotal:</span>
        <span class="font-weight-medium">${{ subtotal }}</span>
      </div>
      <div class="d-flex justify-space-between align-center mb-3">
        <span class="text-medium-emphasis">Shipping:</span>
        <span class="font-weight-medium">${{ shippingCost }}</span>
      </div>
      <div class="d-flex justify-space-between align-center mb-3">
        <span class="text-medium-emphasis">Tax:</span>
        <span class="font-weight-medium">${{ tax }}</span>
      </div>
      <div class="d-flex justify-space-between align-center mb-3">
        <span class="text-medium-emphasis">Total:</span>
        <span class="font-weight-medium text-primary">${{ orderTotal }}</span>
      </div>
      <div class="d-flex justify-space-between align-center mb-3">
        <span class="text-medium-emphasis">Status:</span>
        <v-chip :color="orderStatusColor" size="small" class="text-uppercase">{{ orderStatus }}</v-chip>
      </div>
      <div class="d-flex justify-space-between align-center mb-3">
        <span class="text-medium-emphasis">Payment Method:</span>
        <span class="font-weight-medium">{{ paymentMethod }}</span>
      </div>
      <div class="d-flex justify-space-between align-center">
        <span class="text-medium-emphasis">Payment Status:</span>
        <v-chip :color="paymentStatusColor" size="small" class="text-uppercase">{{ paymentStatus }}</v-chip>
      </div>
    </div>

    <!-- Order Items List -->
    <div class="order-items mt-4">
      <h3 class="text-h6 font-weight-medium mb-3">Items Ordered:</h3>
      <div class="order-item" v-for="item in orderItems" :key="item.id">
        <div class="d-flex align-center">
          <v-avatar size="40" class="mr-3">
            <v-img :src="getItemImage(item)" :alt="item.name" />
          </v-avatar>
          <div class="flex-grow-1">
            <div class="font-weight-medium">{{ item.name }}</div>
            <div class="text-caption text-medium-emphasis">Qty: {{ item.quantity }}</div>
          </div>
          <div class="text-right">
            <div class="font-weight-medium">${{ item.price }}</div>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  images?: Array<{ url: string; isPrimary?: boolean }>;
}

interface OrderDetailsProps {
  orderId?: string;
  orderItems?: OrderItem[];
  orderTotal?: string | number;
  shippingCost?: number;
  tax?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  orderStatus?: string;
}

const props = withDefaults(defineProps<OrderDetailsProps>(), {
  orderItems: () => [],
  orderTotal: 0,
  shippingCost: 0,
  tax: 0,
  paymentMethod: '',
  paymentStatus: '',
  orderStatus: ''
});

const subtotal = computed(() => {
  return props.orderItems?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
});

const orderStatusColor = computed(() => {
  switch (props.orderStatus?.toLowerCase()) {
    case 'confirmed':
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
    case 'failed':
      return 'error';
    default:
      return 'info';
  }
});

const paymentStatusColor = computed(() => {
  switch (props.paymentStatus?.toLowerCase()) {
    case 'completed':
    case 'paid':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
    case 'declined':
      return 'error';
    default:
      return 'info';
  }
});

const getItemImage = (item: OrderItem) => {
  if (item.images && item.images.length > 0) {
    const primaryImage = item.images.find(img => img.isPrimary);
    return primaryImage ? primaryImage.url : item.images[0].url;
  }
  return 'https://picsum.photos/40/40?random=1';
};
</script>

<style scoped>
.order-details-card {
  margin-bottom: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-details>*+* {
  margin-top: 12px;
}

.order-items {
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
}

.order-item {
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.order-item:last-child {
  border-bottom: none;
}

.order-item .v-avatar {
  border-radius: 6px;
  overflow: hidden;
}
</style>
