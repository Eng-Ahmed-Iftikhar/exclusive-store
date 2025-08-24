<template>
  <div class="cart-summary">
    <div class="summary-header">
      <div class="summary-icon">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h2 class="summary-title">Cart Summary</h2>
    </div>

    <!-- Cart Items -->
    <div class="cart-items">
      <div v-for="item in cart?.items" :key="item.id" class="cart-item">
        <div class="item-image-container">
          <img :src="item.item.images[0]?.url || '/placeholder-image.jpg'" :alt="item.item.name" class="item-image" />
          <div class="item-quantity">
            {{ item.quantity }}
          </div>
        </div>
        <div class="item-details">
          <h4 class="item-name">{{ item.item.name }}</h4>
          <p class="item-price">${{ item.price.toFixed(2) }} each</p>
          <p class="item-total">${{ (item.price * item.quantity).toFixed(2) }}</p>
        </div>
      </div>
    </div>

    <!-- Cost Breakdown -->
    <div class="cost-breakdown">
      <div class="cost-row">
        <span class="cost-label">
          <svg class="cost-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Subtotal
        </span>
        <span class="cost-value">${{ Number(cart?.subtotal || 0).toFixed(2) }}</span>
      </div>

      <div class="cost-row">
        <span class="cost-label">
          <svg class="cost-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Shipping
        </span>
        <span class="cost-value shipping-cost">
          {{ shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}` }}
        </span>
      </div>

      <div class="cost-row">
        <span class="cost-label">
          <svg class="cost-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Tax
        </span>
        <span class="cost-value">${{ tax.toFixed(2) }}</span>
      </div>

      <div class="total-row">
        <span class="total-label">Total</span>
        <span class="total-value">
          ${{ Number(total).toFixed(2) }}
        </span>
      </div>
    </div>

    <!-- Security Badge -->
    <div class="security-badge">
      <div class="security-content">
        <svg class="security-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span class="security-text">Secure Payment with Stripe</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '../../../stores/modules/cart/cart.store'
import { ICart } from '../../../stores/modules/cart'

const cartStore = useCartStore()

const cart = computed(() => cartStore.cart as unknown as ICart.Cart)

// Use shipping cost and tax from cart store
const shippingCost = computed(() => cartStore.shippingCost)
const tax = computed(() => cartStore.tax)
const total = computed(() => cartStore.totalWithShipping)
</script>

<style scoped>
.cart-summary {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem;
  position: sticky;
  top: 1rem;
}

.summary-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.summary-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #DB4444 0%, #000000 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  color: white;
}

.summary-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
  border-radius: 0.75rem;
  border: 1px solid #f3f4f6;
  transition: all 0.3s ease;
}

.cart-item:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.item-image-container {
  position: relative;
}

.item-image {
  width: 4rem;
  height: 4rem;
  object-fit: cover;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.item-quantity {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background: #DB4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-details {
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
  line-height: 1.25;
  margin: 0 0 0.25rem 0;
}

.item-price {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
}

.item-total {
  font-size: 1.125rem;
  font-weight: 700;
  color: #DB4444;
  margin: 0;
}

.cost-breakdown {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cost-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}

.cost-label {
  color: #6b7280;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
}

.cost-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  color: #9ca3af;
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
  padding: 1rem;
  background: linear-gradient(135deg, #fef2f2 0%, #f3f4f6 100%);
  border-radius: 0.75rem;
  margin-top: 0.5rem;
}

.total-label {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.total-value {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #DB4444 0%, #000000 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.security-badge {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f0fdf4;
  border-radius: 0.75rem;
  border: 1px solid #bbf7d0;
}

.security-content {
  display: flex;
  align-items: center;
}

.security-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #059669;
  margin-right: 0.5rem;
}

.security-text {
  font-size: 0.875rem;
  color: #065f46;
  font-weight: 500;
}

@media (max-width: 768px) {
  .cart-summary {
    padding: 1.5rem;
  }

  .summary-title {
    font-size: 1.25rem;
  }

  .item-image {
    width: 3rem;
    height: 3rem;
  }

  .total-label {
    font-size: 1.125rem;
  }

  .total-value {
    font-size: 1.25rem;
  }
}
</style>
