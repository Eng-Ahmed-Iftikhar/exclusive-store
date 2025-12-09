<template>
  <div class="cart-item">
    <div class="item-image">
      <img :src="itemImage" :alt="item.product.name" @error="handleImageError" />
    </div>

    <div class="item-details">
      <h3 class="item-name">{{ item.product.name }}</h3>
      <p v-if="item.variant" class="item-variant">{{ item.variant.name }}</p>
      <div class="item-price">
        <span class="price">${{ itemPrice.toFixed(2) }}</span>
        <span v-if="hasDiscount" class="original-price">${{ originalPrice.toFixed(2) }}</span>
      </div>
    </div>

    <div class="item-actions">
      <div class="quantity-controls">
        <v-btn
          icon="mdi-minus"
          size="small"
          variant="outlined"
          :disabled="item.quantity <= 1 || updating"
          @click="decreaseQuantity"
        />
        <span class="quantity">{{ item.quantity }}</span>
        <v-btn
          icon="mdi-plus"
          size="small"
          variant="outlined"
          :disabled="updating || item.quantity >= maxStock"
          @click="increaseQuantity"
        />
      </div>

      <div class="item-total">
        <span class="total-label">Total:</span>
        <span class="total-price">${{ (itemPrice * item.quantity).toFixed(2) }}</span>
      </div>

      <v-btn
        icon="mdi-delete-outline"
        size="small"
        variant="text"
        color="error"
        :loading="removing"
        @click="removeItem"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface CartItemProps {
  item: any;
}

const props = defineProps<CartItemProps>();
const emit = defineEmits<{
  'update-quantity': [itemId: string, quantity: number];
  'remove': [itemId: string];
}>();

const updating = ref(false);
const removing = ref(false);

const itemImage = computed(() => {
  // Try variant image first
  if (props.item.variant?.images?.length > 0) {
    const primaryImg = props.item.variant.images.find((img: any) => img.isPrimary);
    if (primaryImg) return primaryImg.file?.secureUrl || primaryImg.file?.url;
    return props.item.variant.images[0].file?.secureUrl || props.item.variant.images[0].file?.url;
  }
  
  // Fallback to product image
  if (props.item.product?.images?.length > 0) {
    const primaryImg = props.item.product.images.find((img: any) => img.isPrimary);
    if (primaryImg) return primaryImg.file?.secureUrl || primaryImg.file?.url;
    return props.item.product.images[0].file?.secureUrl || props.item.product.images[0].file?.url;
  }
  
  return 'https://placehold.co/600x400.png';
});

const itemPrice = computed(() => {
  let price = 0;
  
  // Add product price
  if (props.item.product?.prices?.length > 0) {
    const activePrice = props.item.product.prices.find((p: any) => p.isActive);
    const productPrice = activePrice || props.item.product.prices[0];
    price += Number(productPrice.salePrice || productPrice.price);
  }
  
  // Add variant price if exists
  if (props.item.variant?.prices?.length > 0) {
    const activePrice = props.item.variant.prices.find((p: any) => p.isActive);
    const variantPrice = activePrice || props.item.variant.prices[0];
    price += Number(variantPrice.salePrice || variantPrice.price);
  }
  
  return price;
});

const originalPrice = computed(() => {
  let price = 0;
  
  if (props.item.product?.prices?.length > 0) {
    const activePrice = props.item.product.prices.find((p: any) => p.isActive);
    const productPrice = activePrice || props.item.product.prices[0];
    price += Number(productPrice.price);
  }
  
  if (props.item.variant?.prices?.length > 0) {
    const activePrice = props.item.variant.prices.find((p: any) => p.isActive);
    const variantPrice = activePrice || props.item.variant.prices[0];
    price += Number(variantPrice.price);
  }
  
  return price;
});

const hasDiscount = computed(() => itemPrice.value < originalPrice.value);

const maxStock = computed(() => {
  if (props.item.variant?.stock?.length > 0) {
    return props.item.variant.stock[0].quantity;
  }
  if (props.item.product?.stock?.length > 0) {
    return props.item.product.stock[0].quantity;
  }
  return 99;
});

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.src = 'https://placehold.co/600x400.png';
};

const increaseQuantity = async () => {
  updating.value = true;
  emit('update-quantity', props.item.id, props.item.quantity + 1);
  setTimeout(() => updating.value = false, 500);
};

const decreaseQuantity = async () => {
  updating.value = true;
  emit('update-quantity', props.item.id, props.item.quantity - 1);
  setTimeout(() => updating.value = false, 500);
};

const removeItem = async () => {
  removing.value = true;
  emit('remove', props.item.id);
};
</script>

<style scoped>
.cart-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
}

.cart-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f8f8;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;
}

.item-variant {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.item-price {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #DB4444;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quantity {
  font-size: 16px;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.item-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.total-label {
  font-size: 12px;
  color: #666;
}

.total-price {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
}

@media (max-width: 768px) {
  .cart-item {
    flex-direction: column;
  }

  .item-actions {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .item-total {
    align-items: flex-start;
  }
}
</style>
