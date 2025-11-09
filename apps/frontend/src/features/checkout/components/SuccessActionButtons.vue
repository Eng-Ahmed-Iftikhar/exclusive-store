<template>
  <div class="action-buttons">
    <v-btn
      to="/"
      color="error"
      size="large"
      class="mb-4 mb-sm-0 continue-shopping-btn"
      prepend-icon="mdi-shopping"
    >
      Continue Shopping
    </v-btn>

    <v-btn
      v-if="showViewOrders"
      :to="{ name: 'profile' }"
      variant="outlined"
      size="large"
      class="ms-sm-4 view-orders-btn"
      prepend-icon="mdi-account"
    >
      View Orders
    </v-btn>
  </div>
</template>

<script setup lang="ts">
interface SuccessActionButtonsProps {
  showViewOrders?: boolean;
}

withDefaults(defineProps<SuccessActionButtonsProps>(), {
  showViewOrders: false,
});
</script>

<style scoped>
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
}

.continue-shopping-btn {
  background-color: #f44336 !important;
  color: white !important;
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
}

.continue-shopping-btn:hover {
  background-color: #d32f2f !important;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
}

.view-orders-btn {
  border-color: #666 !important;
  color: #666 !important;
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
}

.view-orders-btn:hover {
  background-color: #f5f5f5 !important;
}

@media (min-width: 600px) {
  .action-buttons {
    flex-direction: row;
  }

  .action-buttons .v-btn:not(:first-child) {
    margin-left: 16px;
  }
}
</style>
