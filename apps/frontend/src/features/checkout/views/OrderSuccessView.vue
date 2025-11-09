<template>
  <div class="order-success-page">
    <v-container class="py-16">
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <!-- Loading State -->
          <v-card v-if="loading" class="text-center pa-8 main-card">
            <v-progress-circular indeterminate size="64" color="primary" />
            <div class="mt-4 text-h6">Loading order details...</div>
          </v-card>

          <!-- Error State -->
          <v-card v-else-if="error" class="text-center pa-8 main-card">
            <v-icon size="64" color="error" class="mb-4"
              >mdi-alert-circle</v-icon
            >
            <div class="text-h6 text-error mb-2">Error Loading Order</div>
            <div class="text-body-1 text-medium-emphasis">{{ error }}</div>
            <v-btn @click="retryLoadOrder" class="mt-4" color="primary">
              Try Again
            </v-btn>
          </v-card>

          <!-- Success State -->
          <v-card v-else-if="order" class="text-center pa-8 main-card">
            <SuccessIcon />
            <SuccessMessage
              title="Order Confirmed!"
              message="Thank you for your purchase. Your order has been successfully placed and confirmed."
            />
            <OrderDetails
              :order-items="orderItems"
              :order-total="orderTotal"
              :shipping-cost="shippingCost"
              :tax="tax"
              :payment-method="paymentMethod"
              :payment-status="paymentStatus"
              :order-status="orderStatus"
            />
            <NextSteps />
            <SuccessActionButtons
              :show-view-orders="authStore.isAuthenticated"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../../stores/modules/auth/auth.store';
import { useCheckoutStore } from '../../../stores/modules/checkout/checkout.store';
import {
  SuccessIcon,
  SuccessMessage,
  OrderDetails,
  NextSteps,
  SuccessActionButtons,
} from '../components';

const route = useRoute();
const authStore = useAuthStore();
const checkoutStore = useCheckoutStore();

const orderId = computed(() => route.params.orderId as string);

// Order data state
const order = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Computed values from order data
const orderItems = computed(() => order.value?.items || []);
const orderTotal = computed(() => order.value?.total || 0);
const shippingCost = computed(() => order.value?.shippingCost || 0);
const tax = computed(() => order.value?.tax || 0);

// Payment information from order data
const paymentMethod = computed(() => {
  if (order.value?.stripePaymentIntentId) {
    return 'Credit Card (**** **** **** ****)';
  }
  return order.value?.paymentMethod || 'Credit Card';
});

const paymentStatus = computed(() => {
  return order.value?.paymentStatus || 'Not Paid';
});

const orderStatus = computed(() => {
  return order.value?.status || 'Confirmed';
});

const loadOrder = async () => {
  try {
    loading.value = true;
    error.value = null;

    if (orderId.value) {
      const orderData = await checkoutStore.getOrderById(orderId.value);
      order.value = orderData;
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load order details';
    console.error('Error loading order:', err);
  } finally {
    loading.value = false;
  }
};

const retryLoadOrder = () => {
  loadOrder();
};

onMounted(() => {
  loadOrder();
});
</script>

<style scoped>
.order-success-page {
  min-height: 100vh;
  background-color: #f8fafc;
}

.main-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: white;
}
</style>
