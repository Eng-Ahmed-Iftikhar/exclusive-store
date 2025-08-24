<template>
  <div class="order-notes">
    <div class="section-header">
      <div class="section-icon">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </div>
      <h2 class="section-title">Order Notes</h2>
    </div>

    <v-form ref="form" @submit.prevent>
      <div class="notes-section">
        <v-textarea v-model="formData.notes" label="Additional Notes (Optional)" variant="outlined"
          density="comfortable" :rules="notesRules" rows="4" auto-grow prepend-inner-icon="mdi-note-text"
          hide-details="auto" placeholder="Add any special instructions or notes for your order..." />
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = ref()

// Form data
const formData = computed({
  get: () => ({ notes: props.modelValue }),
  set: (value: { notes: string }) => emit('update:modelValue', value.notes)
})

// Validation rules
const notesRules = [
  (v: string) => !v || v.length <= 500 || 'Notes must be less than 500 characters'
]

// Expose form validation method
defineExpose({
  validate: () => form.value?.validate()
})
</script>

<style scoped>
.order-notes {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem;
  margin-top: 1rem;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #DB4444 0%, #000000 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  color: white;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.notes-section {
  display: flex;
  flex-direction: column;
}

.notes-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.notes-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
  resize: none;
  font-family: inherit;
  line-height: 1.5;
}

.notes-textarea:focus {
  outline: none;
  border-color: #DB4444;
  box-shadow: 0 0 0 4px rgba(219, 68, 68, 0.1);
}

.notes-textarea::placeholder {
  color: #9ca3af;
}

/* Fixed height for textarea field */
.v-textarea:deep(.v-field) {
  min-height: 120px !important;
  max-height: 120px !important;
  height: 120px !important;
}

.v-textarea:deep(.v-field__input) {
  min-height: 120px !important;
  max-height: 120px !important;
  height: 120px !important;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
}

.v-textarea:deep(.v-field__outline) {
  min-height: 120px !important;
  max-height: 120px !important;
  height: 120px !important;
}

/* Ensure consistent spacing for labels */
.v-textarea:deep(.v-field__label) {
  top: 16px !important;
  transform: translateY(-50%) !important;
}

.v-textarea:deep(.v-field--focused .v-field__label),
.v-textarea:deep(.v-field--variant-outlined .v-field__label) {
  top: 8px !important;
  transform: translateY(0) !important;
}

/* Prevent height changes on error states */
.v-textarea:deep(.v-field--error) {
  min-height: 120px !important;
  max-height: 120px !important;
  height: 120px !important;
}

/* Ensure consistent height for prepend icons */
.v-textarea:deep(.v-field__prepend-inner) {
  height: 56px !important;
  display: flex !important;
  align-items: flex-start !important;
  padding-top: 16px !important;
}

/* Fix error message layout disruption */
.v-textarea:deep(.v-messages) {
  position: relative !important;
  margin-top: 4px !important;
  min-height: 20px !important;
  max-height: none !important;
  height: auto !important;
  display: block !important;
}

.v-textarea:deep(.v-messages__message) {
  font-size: 12px !important;
  line-height: 16px !important;
  margin: 0 !important;
  padding: 0 !important;
  min-height: 16px !important;
  max-height: none !important;
  height: auto !important;
  color: #dc2626 !important;
  font-weight: 500 !important;
}

/* Ensure consistent spacing for notes section */
.notes-section {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
  /* Remove extra padding since errors are now properly positioned */
}

@media (max-width: 768px) {
  .order-notes {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.25rem;
  }
}
</style>
