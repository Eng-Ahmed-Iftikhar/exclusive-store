<template>
  <div class="contact-information">
    <div class="section-header">
      <div class="section-icon">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <h2 class="section-title">Contact Information</h2>
    </div>

    <v-form ref="form" @submit.prevent>
      <div class="form-grid">
        <div class="form-group">
          <v-text-field v-model="formData.name" label="Full Name" variant="outlined" density="comfortable"
            :rules="nameRules" required prepend-inner-icon="mdi-account" hide-details="auto"
            :error-messages="getFieldError('name')" />
        </div>

        <div class="form-group">
          <v-text-field v-model="formData.email" label="Email Address" variant="outlined" density="comfortable"
            type="email" :rules="emailRules" required prepend-inner-icon="mdi-email" hide-details="auto"
            :error-messages="getFieldError('email')" />
        </div>

        <div class="form-group phone-group">
          <PhoneNumberInput v-model="formData.phone" required :error-messages="getFieldError('phone')" />
        </div>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PhoneNumberInput from './PhoneNumberInput.vue'

interface FormData {
  name: string
  email: string
  phone: string
}

interface UserInfo {
  id: string
  name: string
  email: string
}

interface Props {
  isLoggedIn: boolean
  userInfo: UserInfo | null
  errors?: string[]
}

interface Emits {
  (e: 'update', value: FormData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = ref()

// Form data
const formData = ref<FormData>({
  name: '',
  email: '',
  phone: ''
})

// Helper function to get field-specific errors
const getFieldError = (fieldName: string): string => {
  if (!props.errors || props.errors.length === 0) return ''

  // Map field names to error messages
  const fieldErrorMap: Record<string, string> = {
    name: props.errors.find(err => err.includes('Name')) || '',
    email: props.errors.find(err => err.includes('Email')) || '',
    phone: props.errors.find(err => err.includes('Phone')) || ''
  }

  return fieldErrorMap[fieldName] || ''
}

// Watch for user info changes and pre-fill form
watch(() => props.userInfo, (newUserInfo) => {
  if (newUserInfo && props.isLoggedIn) {
    formData.value = {
      name: newUserInfo.name || '',
      email: newUserInfo.email || '',
      phone: ''
    }
    emitUpdate()
  }
}, { immediate: true })

// Watch for form data changes and emit updates
watch(formData, () => {
  emitUpdate()
}, { deep: true })

// Emit update to parent
const emitUpdate = () => {
  emit('update', { ...formData.value })
}

// Validation rules
const nameRules = [
  (v: string) => !!v || 'Name is required',
  (v: string) => v.length >= 2 || 'Name must be at least 2 characters',
  (v: string) => v.length <= 50 || 'Name must be less than 50 characters',
  (v: string) => /^[a-zA-Z\s]*$/.test(v) || 'Name can only contain letters and spaces'
]

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Please enter a valid email address',
  (v: string) => v.length <= 100 || 'Email must be less than 100 characters'
]

// Expose form validation method
defineExpose({
  validate: async () => {
    if (form.value) {
      const { valid } = await form.value.validate()
      return valid
    }
    return false
  }
})
</script>

<style scoped>
.contact-information {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  margin-top: 1rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.section-icon {
  width: 40px;
  height: 40px;
  color: #dc2626;
}

.section-icon .icon {
  width: 100%;
  height: 100%;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  position: relative;
}

/* General form field styling */
.form-group :deep(.v-field) {
  min-height: 56px !important;
  max-height: 56px !important;
  height: 56px !important;
}

.form-group :deep(.v-field__input) {
  min-height: 56px !important;
  max-height: 56px !important;
  height: 56px !important;
}

.form-group :deep(.v-field__outline) {
  min-height: 56px !important;
  max-height: 56px !important;
  height: 56px !important;
}

.form-group :deep(.v-field__label) {
  top: 16px !important;
  transform: translateY(-50%) !important;
}

.form-group :deep(.v-field--focused .v-field__label),
.form-group :deep(.v-field--variant-outlined .v-field__label) {
  top: 8px !important;
  transform: translateY(0) !important;
}

.form-group :deep(.v-field__prepend-inner) {
  height: 56px !important;
  display: flex !important;
  align-items: center !important;
}

/* Phone section specific styling */
.phone-group {
  margin-bottom: 1rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .contact-information {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .contact-information {
    padding: 1rem;
  }

  .section-header {
    margin-bottom: 1.5rem;
  }

  .form-grid {
    gap: 1rem;
  }
}
</style>
