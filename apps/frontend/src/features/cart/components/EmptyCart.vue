<template>
  <div class="empty-cart">
    <div class="empty-cart-icon">
      <v-icon icon="mdi-cart-outline" size="120" color="grey-lighten-1" />
    </div>
    <h2 class="empty-cart-title">Your Cart is Empty</h2>
    <p class="empty-cart-text">
      Looks like you haven't added anything to your cart yet
    </p>
    <v-btn
      color="error"
      size="large"
      variant="flat"
      class="shop-now-btn"
      to="/products"
    >
      <v-icon icon="mdi-shopping" start />
      Start Shopping
    </v-btn>
  </div>
</template>

<style scoped>
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  min-height: 400px;
}

.empty-cart-icon {
  margin-bottom: 24px;
  opacity: 0.6;
}

.empty-cart-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.empty-cart-text {
  font-size: 16px;
  color: #666;
  margin: 0 0 32px 0;
  max-width: 400px;
}

.shop-now-btn {
  text-transform: none;
  font-weight: 600;
  padding: 24px 40px !important;
  font-size: 16px;
}
</style>
