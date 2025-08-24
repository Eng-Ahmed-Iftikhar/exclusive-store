<template>
  <div class="phone-input-component">
    <div class="phone-input-container">
      <v-text-field
        v-model="phoneNumber"
        label="Phone Number"
        variant="outlined"
        density="comfortable"
        type="tel"
        :rules="phoneRules"
        required
        hide-details="auto"
        prepend-inner-icon="mdi-phone"
        placeholder="Enter phone number"
        @input="onPhoneInput"
      />
    </div>

   
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue?: string
  required?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  required: false
})

const emit = defineEmits<Emits>()

// Component state
const phoneNumber = ref('')
const validationMessage = ref('')
const isValid = ref(false)

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue !== phoneNumber.value) {
    phoneNumber.value = newValue
  }
}, { immediate: true })

// Watch for internal changes and emit updates
watch(phoneNumber, (newValue) => {
  emit('update:modelValue', newValue)
  validatePhoneNumber()
})

// Handle phone input
const onPhoneInput = () => {
  validatePhoneNumber()
}

// Validate phone number
const validatePhoneNumber = () => {
  if (!phoneNumber.value) {
    validationMessage.value = ''
    isValid.value = false
    return
  }

  // Basic phone number validation
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  if (phoneRegex.test(phoneNumber.value.replace(/\s/g, ''))) {
    isValid.value = true
    validationMessage.value = '✓ Valid phone number'
  } else {
    isValid.value = false
    validationMessage.value = 'Please enter a valid phone number'
  }
}

// Validation rules
const phoneRules = computed(() => [
  (v: string) => !!v || 'Phone number is required',
  () => isValid.value || 'Please enter a valid phone number'
])

// Expose validation method
defineExpose({
  validate: () => isValid.value,
  getPhoneNumber: () => phoneNumber.value
})
</script>

<style scoped>
.phone-input-component {
  width: 100%;
}

.phone-input-container {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.phone-input-container .v-input {
  width: 100%;
}

/* Phone validation message */
.phone-validation-message {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem;
  border-radius: 8px;
  background-color: #f9fafb;
}

.phone-validation-message.valid {
  color: #10b981;
  background-color: #ecfdf5;
  border-left: 4px solid #10b981;
}

.phone-validation-message.invalid {
  color: #ef4444;
  background-color: #fef2f2;
  border-left: 4px solid #ef4444;
}

/* Responsive design */
@media (max-width: 768px) {
  .phone-input-container {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .phone-input-container {
    gap: 0.75rem;
  }
}
</style>
