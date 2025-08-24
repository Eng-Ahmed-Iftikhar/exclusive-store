<template>
  <div class="success-message">
    <h1 class="text-h3 font-weight-bold text-primary mb-4">{{ title }}</h1>
    <p class="text-h6 text-medium-emphasis mb-8">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
interface SuccessMessageProps {
  title: string;
  message: string;
}

defineProps<SuccessMessageProps>();
</script>

<style scoped>
.success-message {
  margin-bottom: 32px;
}
</style>
