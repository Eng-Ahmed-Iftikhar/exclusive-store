<template>
  <div class="cart-summary">
    <div class="summary-header">
      <h2 class="summary-title">Cart Summary</h2>
    </div>

    <!-- Cart Items -->
    <div class="cart-items">
      <div v-for="item in cart?.items" :key="item.id" class="cart-item">
        <div class="item-images-container">
          <!-- Product Image -->
          <div class="product-image-container">
            <img :src="getProductImage(item)" :alt="item.product.name" class="item-image product-image"
              @error="handleImageError" />
            <div class="image-label">Product</div>
          </div>

          <!-- Variant Image (if available) -->
          <div v-if="item.variant" class="variant-image-container">
            <img :src="getVariantImage(item)" :alt="item.variant.name" class="item-image variant-image"
              @error="handleImageError" />
            <div class="image-label">Variant</div>
          </div>

          <div class="item-quantity">
            {{ item.quantity }}
          </div>
        </div>

        <div class="item-details">
          <h4 class="item-name">{{ item.product.name }}</h4>
          <p v-if="item.variant" class="item-variant">{{ item.variant.name }}</p>

          <!-- Variant Attributes -->
          <div v-if="item.variant?.attributes" class="variant-attributes">
            <span v-for="(value, key) in item.variant.attributes" :key="key" class="attribute-tag">
              {{ key }}: {{ value }}
            </span>
          </div>

          <!-- Pricing Information -->
          <div class="pricing-info">
            <p v-if="item.variant" class="variant-price">
              Variant Price: ${{ getVariantPrice(item).toFixed(2) }}
              <span v-if="getVariantOriginalPrice(item) > getVariantPrice(item)" class="original-price">
                (was ${{ getVariantOriginalPrice(item).toFixed(2) }})
              </span>
            </p>
            <p v-if="!item.variant" class="product-price">
              Product Price: ${{ getProductOriginalPrice(item).toFixed(2) }}
            </p>
            <p class="item-price">Final Price: ${{ Number(item.price).toFixed(2) }}</p>
            <p class="item-total">Total: ${{ (Number(item.price) * item.quantity).toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Cost Breakdown -->
    <div class="cost-breakdown">
      <div class="cost-row">
        <span class="cost-label">Subtotal</span>
        <span class="cost-value">${{ Number(cart?.subtotal || 0).toFixed(2) }}</span>
      </div>

      <div class="cost-row">
        <span class="cost-label">Shipping</span>
        <span class="cost-value shipping-cost">
          {{ shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}` }}
        </span>
      </div>

      <div class="cost-row">
        <span class="cost-label">Tax</span>
        <span class="cost-value">${{ tax.toFixed(2) }}</span>
      </div>

      <div class="total-row">
        <span class="total-label">Total</span>
        <span class="total-value">
          ${{ Number(total).toFixed(2) }}
        </span>
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

// Helper functions for cart items
const getProductImage = (item: ICart.CartItem): string => {
  if (item.product?.images && item.product.images.length > 0) {
    // Find the primary image first, then fall back to first image
    const primaryImage = item.product.images.find(img => img.isPrimary)
    const imageToUse = primaryImage || item.product.images[0]
    return imageToUse.file?.secureUrl || imageToUse.file?.url || 'https://placehold.co/600x400'
  }
  return 'https://placehold.co/600x400'
}

const getVariantImage = (item: ICart.CartItem): string => {
  if (item.variant?.images && item.variant.images.length > 0) {
    // Find the primary image first, then fall back to first image
    const primaryImage = item.variant.images.find(img => img.isPrimary)
    const imageToUse = primaryImage || item.variant.images[0]
    return imageToUse.file?.secureUrl || imageToUse.file?.url || 'https://placehold.co/600x400'
  }
  return 'https://placehold.co/600x400'
}

const getProductOriginalPrice = (item: ICart.CartItem): number => {
  // Get product pricing from the prices array
  const product = item.product as any
  if (product?.prices && product.prices.length > 0) {
    const activePrice = product.prices.find((price: any) => price.isActive)
    if (activePrice) {
      // Use sale price if available and valid, otherwise use regular price
      if (activePrice.salePrice && Number(activePrice.salePrice) > 0 && Number(activePrice.salePrice) < Number(activePrice.price)) {
        return Number(activePrice.salePrice)
      }
      return Number(activePrice.price)
    }
    return Number(product.prices[0].price)
  }
  return 0
}

const getVariantPrice = (item: ICart.CartItem): number => {
  // Get variant pricing from the prices array
  const variant = item.variant as any
  if (variant?.prices && variant.prices.length > 0) {
    const activePrice = variant.prices.find((price: any) => price.isActive)
    if (activePrice) {
      // Use sale price if available and valid, otherwise use regular price
      if (activePrice.salePrice && Number(activePrice.salePrice) > 0 && Number(activePrice.salePrice) < Number(activePrice.price)) {
        return Number(activePrice.salePrice)
      }
      return Number(activePrice.price)
    }
  }
  return 0
}

const getVariantOriginalPrice = (item: ICart.CartItem): number => {
  // Get the original price (before any sale) for variant
  const variant = item.variant as any
  if (variant?.prices && variant.prices.length > 0) {
    const activePrice = variant.prices.find((price: any) => price.isActive)
    if (activePrice) {
      return Number(activePrice.price)
    }
  }
  return 0
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (img.src !== 'https://placehold.co/600x400') {
    img.src = 'https://placehold.co/600x400'
  }
}
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
  margin-bottom: 1.5rem;
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

.item-images-container {
  position: relative;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.product-image-container,
.variant-image-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item-image {
  width: 3.5rem;
  height: 3.5rem;
  object-fit: cover;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
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
  font-size: 0.625rem;
  font-weight: 600;
  color: #6b7280;
  margin-top: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
  margin-top: 0.5rem;
}

.variant-price {
  font-size: 0.75rem;
  color: #059669;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  background: #f0fdf4;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border-left: 3px solid #10b981;
}

.product-price {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  margin: 0 0 0.25rem 0;
  background: #f9fafb;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border-left: 3px solid #d1d5db;
}

.original-price {
  color: #9ca3af;
  text-decoration: line-through;
  font-weight: 400;
  margin-left: 0.25rem;
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

@media (max-width: 768px) {
  .cart-summary {
    padding: 1.5rem;
  }

  .summary-title {
    font-size: 1.25rem;
  }

  .item-image {
    width: 2.5rem;
    height: 2.5rem;
  }

  .item-images-container {
    gap: 0.25rem;
  }

  .image-label {
    font-size: 0.5rem;
  }

  .total-label {
    font-size: 1.125rem;
  }

  .total-value {
    font-size: 1.25rem;
  }
}
</style>