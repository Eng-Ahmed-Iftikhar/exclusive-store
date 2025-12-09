<template>
  <div class="empty-wishlist">
    <div class="empty-icon">
      <v-icon icon="mdi-heart-outline" size="120" color="grey-lighten-1" />
    </div>
    <h2 class="empty-title">Your Wishlist is Empty</h2>
    <p class="empty-text">
      Save your favorite items to your wishlist and shop them anytime
    </p>
    <v-btn
      color="error"
      size="large"
      variant="flat"
      class="explore-btn"
      to="/products"
    >
      <v-icon icon="mdi-heart" start />
      Explore Products
    </v-btn>
  </div>
</template>

<style scoped>
.empty-wishlist {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  min-height: 400px;
}

.empty-icon {
  margin-bottom: 24px;
  opacity: 0.6;
}

.empty-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.empty-text {
  font-size: 16px;
  color: #666;
  margin: 0 0 32px 0;
  max-width: 400px;
}

.explore-btn {
  text-transform: none;
  font-weight: 600;
  padding: 24px 40px !important;
  font-size: 16px;
}
</style>
