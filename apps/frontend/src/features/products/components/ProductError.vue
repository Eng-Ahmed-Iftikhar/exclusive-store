<template>
  <div class="error-container">
    <v-icon icon="mdi-alert-circle" size="64" color="error" />
    <h2 class="error-title">Product Not Found</h2>
    <p class="error-message">{{ error }}</p>
    <v-btn 
      color="primary" 
      variant="flat"
      class="mt-4"
      @click="$emit('go-back')"
    >
      Back to Products
    </v-btn>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error: string;
}

defineProps<Props>();

defineEmits<{
  'go-back': [];
}>();
</script>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.error-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 16px 0 8px 0;
}

.error-message {
  font-size: 16px;
  color: #666;
  margin-bottom: 16px;
}
</style>
