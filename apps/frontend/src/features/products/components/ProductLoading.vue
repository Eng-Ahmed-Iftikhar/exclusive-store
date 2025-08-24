<template>
  <div class="loading-container">
    <v-progress-circular indeterminate color="primary" size="64" />
    <p class="loading-text mt-4">Loading product details...</p>
  </div>
</template>

<script setup lang="ts">
// No props or logic needed for this component
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.loading-text {
  font-size: 18px;
  color: #666;
}
</style>
