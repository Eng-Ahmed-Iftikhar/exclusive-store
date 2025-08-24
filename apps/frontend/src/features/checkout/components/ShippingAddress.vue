<template>
  <div class="shipping-address">
    <div class="section-header">
      <div class="section-icon">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h2 class="section-title">Shipping Address</h2>
    </div>

    <v-form ref="form" @submit.prevent>
      <div class="form-grid">
        <div class="form-group full-width">
          <v-text-field v-model="formData.address" label="Street Address" variant="outlined" density="comfortable"
            :rules="addressRules" required prepend-inner-icon="mdi-map-marker" hide-details="auto"
            placeholder="Enter your street address" :error-messages="getFieldError('address')" />
        </div>

        <div class="form-group">
          <v-select v-model="formData.country" label="Country" variant="outlined" density="comfortable"
            :items="countries" :rules="countryRules" required prepend-inner-icon="mdi-flag" hide-details="auto"
            placeholder="Select country" :error-messages="getFieldError('country')"
            @update:model-value="onCountryChange" />
        </div>

        <div class="form-group">
          <v-select v-model="formData.state" label="State/Province" variant="outlined" density="comfortable"
            :items="states" :rules="stateRules" required prepend-inner-icon="mdi-map" hide-details="auto"
            placeholder="Select state" :disabled="!formData.country" :loading="loadingStates"
            :error-messages="getFieldError('state')" @update:model-value="onStateChange" />
        </div>

        <div class="form-group">
          <v-select v-model="formData.city" label="City" variant="outlined" density="comfortable" :items="cities"
            :rules="cityRules" required prepend-inner-icon="mdi-city" hide-details="auto" placeholder="Select city"
            :disabled="!formData.state" :loading="loadingCities" :error-messages="getFieldError('city')" />
        </div>

        <div class="form-group">
          <v-text-field v-model="formData.postalCode" label="Postal Code" variant="outlined" density="comfortable"
            :rules="postalCodeRules" required prepend-inner-icon="mdi-postage-stamp" hide-details="auto"
            placeholder="Enter postal code" :error-messages="getFieldError('postalCode')" />
        </div>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Country, State, City } from 'country-state-city'

interface FormData {
  address: string
  city: string
  state: string
  country: string
  postalCode: string
}

interface Props {
  modelValue: FormData
  errors?: string[]
}

interface Emits {
  (e: 'update:modelValue', value: FormData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = ref()

// Form data
const formData = computed({
  get: () => props.modelValue,
  set: (value: FormData) => emit('update:modelValue', value)
})

// Helper function to get field-specific errors
const getFieldError = (fieldName: string): string => {
  if (!props.errors || props.errors.length === 0) return ''

  // Map field names to error messages
  const fieldErrorMap: Record<string, string> = {
    address: props.errors.find(err => err.includes('Address')) || '',
    city: props.errors.find(err => err.includes('City')) || '',
    state: props.errors.find(err => err.includes('State')) || '',
    country: props.errors.find(err => err.includes('Country')) || '',
    postalCode: props.errors.find(err => err.includes('Postal code')) || ''
  }

  return fieldErrorMap[fieldName] || ''
}

// Country, state, and city data
const countries = Country.getAllCountries().map(country => ({
  title: country.name,
  value: country.isoCode,
  flag: country.flag
}))

const states = ref<Array<{ title: string; value: string }>>([])
const cities = ref<Array<{ title: string; value: string }>>([])

// Loading states
const loadingStates = ref(false)
const loadingCities = ref(false)

// Validation rules
const addressRules = [
  (v: string) => !!v || 'Address is required',
  (v: string) => v.length >= 5 || 'Address must be at least 5 characters',
  (v: string) => v.length <= 200 || 'Address must be less than 200 characters'
]

const cityRules = [
  (v: string) => !!v || 'City is required'
]

const stateRules = [
  (v: string) => !!v || 'State/Province is required'
]

const countryRules = [
  (v: string) => !!v || 'Country is required'
]

const postalCodeRules = [
  (v: string) => !!v || 'Postal code is required',
  (v: string) => v.length >= 3 || 'Postal code must be at least 3 characters',
  (v: string) => v.length <= 10 || 'Postal code must be less than 10 characters'
]

// Watch for form changes to clear validation errors
watch(() => formData.value, (newFormData) => {
  // Clear validation errors when user types
  if (props.errors && props.errors.length > 0) {
    // This will trigger a re-render and clear errors
  }
}, { deep: true })

// Methods
const onCountryChange = async (countryCode: string) => {
  if (countryCode) {
    loadingStates.value = true
    try {
      const countryStates = State.getStatesOfCountry(countryCode)
      states.value = countryStates.map(state => ({
        title: state.name,
        value: state.isoCode
      }))
      // Reset state and city when country changes
      formData.value.state = ''
      formData.value.city = ''
      cities.value = []
    } catch (error) {
      // Error loading states
    } finally {
      loadingStates.value = false
    }
  } else {
    states.value = []
    cities.value = []
    formData.value.state = ''
    formData.value.city = ''
  }
}

const onStateChange = async (stateCode: string) => {
  if (stateCode && formData.value.country) {
    loadingCities.value = true
    try {
      const stateCities = City.getCitiesOfState(formData.value.country, stateCode)
      cities.value = stateCities.map(city => ({
        title: city.name,
        value: city.name
      }))
      // Reset city when state changes
      formData.value.city = ''
    } catch (error) {
      // Error loading cities
    } finally {
      loadingCities.value = false
    }
  } else {
    cities.value = []
    formData.value.city = ''
  }
}

// Watch for country changes
watch(() => formData.value.country, (newCountry) => {
  if (newCountry) {
    onCountryChange(newCountry)
  }
})

// Watch for state changes
watch(() => formData.value.state, (newState) => {
  if (newState) {
    onStateChange(newState)
  }
})

// Expose form validation method
defineExpose({
  validate: () => form.value?.validate()
})
</script>

<style scoped>
.shipping-address {
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

/* Loading and disabled states */
.v-select:deep(.v-field--disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}

.v-select:deep(.v-field--loading) {
  position: relative;
}

.v-select:deep(.v-field--loading::after) {
  content: '';
  position: absolute;
  top: 50%;
  right: 1rem;
  width: 1rem;
  height: 1rem;
  border: 2px solid #DB4444;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  transform: translateY(-50%);
}

@keyframes spin {
  0% {
    transform: translateY(-50%) rotate(0deg);
  }

  100% {
    transform: translateY(-50%) rotate(360deg);
  }
}

/* Fixed height for all form fields */
.v-text-field:deep(.v-field),
.v-select:deep(.v-field) {
  min-height: 56px !important;
  max-height: 56px !important;
  height: 56px !important;
}

.v-text-field:deep(.v-field__input),
.v-select:deep(.v-field__input) {
  min-height: 56px !important;
  max-height: 56px !important;
  height: 56px !important;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
}

.v-text-field:deep(.v-field__outline),
.v-select:deep(.v-field__outline) {
  min-height: 56px !important;
  max-height: 56px !important;
  height: 56px !important;
}

/* Ensure consistent spacing for labels and placeholders */
.v-text-field:deep(.v-field__label),
.v-select:deep(.v-field__label) {
  top: 16px !important;
  transform: translateY(-50%) !important;
}

.v-text-field:deep(.v-field--focused .v-field__label),
.v-select:deep(.v-field--focused .v-field__label),
.v-text-field:deep(.v-field--variant-outlined .v-field__label),
.v-select:deep(.v-field--variant-outlined .v-field__label) {
  top: 8px !important;
  transform: translateY(0) !important;
}

/* Prevent height changes on error states */
.v-text-field:deep(.v-field--error),
.v-select:deep(.v-field--error) {
  min-height: 56px !important;
  max-height: 56px !important;
  height: 56px !important;
}

/* Ensure consistent height for prepend icons */
.v-text-field:deep(.v-field__prepend-inner),
.v-select:deep(.v-field__prepend-inner) {
  height: 56px !important;
  display: flex !important;
  align-items: center !important;
}

/* Fix height for append icons (loading spinner) */
.v-select:deep(.v-field__append-inner) {
  height: 56px !important;
  display: flex !important;
  align-items: center !important;
}

/* Fix error message layout disruption */
.v-text-field:deep(.v-messages),
.v-select:deep(.v-messages) {
  position: relative !important;
  margin-top: 4px !important;
  min-height: 20px !important;
  max-height: none !important;
  height: auto !important;
  display: block !important;
}

.v-text-field:deep(.v-messages__message),
.v-select:deep(.v-messages__message) {
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

/* Ensure form grid maintains consistent spacing */
.form-grid {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 1rem !important;
  align-items: start !important;
}

.form-grid .form-group {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
  /* Remove extra padding since errors are now properly positioned */
}

.form-group.full-width {
  grid-column: 1 / -1 !important;
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}

/* Ensure proper spacing between form groups */
.form-group {
  margin-bottom: 1.5rem !important;
}

.form-group:last-child {
  margin-bottom: 0 !important;
}

/* Form field focus states */
.v-text-field:deep(.v-field--focused),
.v-select:deep(.v-field--focused) {
  border-color: #DB4444 !important;
  box-shadow: 0 0 0 4px rgba(219, 68, 68, 0.1) !important;
}

/* Placeholder styling */
.v-text-field:deep(.v-field__input::placeholder),
.v-select:deep(.v-field__input::placeholder) {
  color: #9ca3af;
  opacity: 0.7;
}

/* Error states */
.v-text-field:deep(.v-field--error),
.v-select:deep(.v-field--error) {
  border-color: #dc2626 !important;
}

.v-text-field:deep(.v-field--error .v-field__outline),
.v-select:deep(.v-field--error .v-field__outline) {
  border-color: #dc2626 !important;
}

@media (max-width: 768px) {
  .shipping-address {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .form-grid {
    gap: 1rem;
  }
}
</style>
