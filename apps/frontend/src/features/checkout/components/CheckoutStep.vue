<template>
  <div class="step-item" :class="stepClasses">
    <div class="step-icon">
      <v-icon v-if="isCompleted" color="success">mdi-check-circle</v-icon>
      <v-icon v-else-if="isCurrent" color="primary">mdi-loading mdi-spin</v-icon>
      <v-icon v-else-if="hasError" color="error">mdi-alert-circle</v-icon>
      <v-icon v-else color="grey">{{ defaultIcon }}</v-icon>
    </div>
    <div class="step-content">
      <h4 class="step-title">{{ title }}</h4>
      <p class="step-description">{{ description }}</p>
      <div v-if="hasError" class="step-error">
        <v-alert type="error" variant="tonal" density="compact">
          {{ errorMessage }}
        </v-alert>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  stepNumber: number
  currentStep: number
  errorStep?: number
  errorMessage?: string
  title: string
  description: string
  defaultIcon: string
}

const props = defineProps<Props>()

// Computed
const isCompleted = computed(() => props.currentStep > props.stepNumber)
const isCurrent = computed(() => props.currentStep === props.stepNumber)
const hasError = computed(() => props.errorStep === props.stepNumber)

const stepClasses = computed(() => ({
  'completed': isCompleted.value,
  'current': isCurrent.value,
  'error': hasError.value
}))
</script>

<style scoped>
.step-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.step-item.completed {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.step-item.current {
  background: rgba(33, 150, 243, 0.1);
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.step-item.error {
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.step-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #1f2937;
}

.step-description {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.step-error {
  margin-top: 0.75rem;
}
</style>
