<template>
  <v-card-actions class="modal-actions">
    <!-- Success Actions -->
    <div v-if="isSuccess" class="success-actions">
      <v-btn
        color="primary"
        variant="elevated"
        size="large"
        @click="handleSuccess"
        class="success-btn"
      >
        Continue Shopping
      </v-btn>
    </div>

    <!-- Error Actions -->
    <div v-else-if="hasError" class="error-actions">
      <v-btn
        color="error"
        variant="outlined"
        @click="handleRetry"
        class="retry-btn"
      >
        Try Again
      </v-btn>
      <v-btn
        color="secondary"
        variant="outlined"
        @click="handleClose"
        class="close-btn"
      >
        Close
      </v-btn>
    </div>

    <!-- Loading Actions -->
    <!-- <div v-else class="loading-actions">
      <v-btn
        color="error"
        variant="outlined"
        @click="handleCancel"
        class="cancel-btn"
      >
        Cancel Order
      </v-btn>
    </div> -->
  </v-card-actions>
</template>

<script setup lang="ts">
interface Props {
  isSuccess: boolean;
  hasError: boolean;
}

interface Emits {
  (e: 'success'): void;
  (e: 'retry'): void;
  (e: 'close'): void;
  (e: 'cancel'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

// Methods
const handleSuccess = () => {
  emit('success');
};

const handleRetry = () => {
  emit('retry');
};

const handleClose = () => {
  emit('close');
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.modal-actions {
  padding: 1.5rem 2rem;
  justify-content: center;
  gap: 1rem;
}

.success-actions,
.error-actions,
.loading-actions {
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
}

.success-btn {
  min-width: 200px;
}

.retry-btn,
.close-btn,
.cancel-btn {
  min-width: 120px;
}

@media (max-width: 768px) {
  .modal-actions {
    padding: 1rem 1.5rem;
  }

  .success-actions,
  .error-actions,
  .loading-actions {
    flex-direction: column;
  }

  .success-btn,
  .retry-btn,
  .close-btn,
  .cancel-btn {
    min-width: 100%;
  }
}
</style>
