<template>
  <div class="shipping-info-component">
    <h4 class="shipping-title">Shipping Address</h4>
    <div class="address-details">
      <p class="address-line">{{ address?.address || 'Address not available' }}</p>
      <p class="address-city-state">
        {{ address?.city || 'City' }}, {{ address?.state || 'State' }} {{ address?.postalCode || 'Postal Code' }}
      </p>
      <p class="address-country">{{ address?.country || 'Country' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AddressInfo {
  address: string
  city: string
  state: string
  country: string
  postalCode: string
}

interface Props {
  address?: AddressInfo
}

defineProps<Props>()
</script>

<style scoped>
.shipping-info-component {
  background: #f3f4f6;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.shipping-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.address-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.address-line {
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

.address-city-state {
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

.address-country {
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}
</style>
