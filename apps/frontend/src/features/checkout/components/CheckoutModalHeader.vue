<template>
  <v-card-title class="modal-header">
    <div class="header-content">
      <div class="header-icon">
        <v-icon size="32" color="primary">mdi-cart-check</v-icon>
      </div>
      <div class="header-text">
        <h2 class="modal-title">{{ title }}</h2>
        <p class="modal-subtitle">{{ subtitle }}</p>
      </div>
    </div>
  </v-card-title>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
}

defineProps<Props>()
</script>

<style scoped>
.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 0.5rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.modal-subtitle {
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .modal-header {
    padding: 1.5rem;
  }
}
</style>
