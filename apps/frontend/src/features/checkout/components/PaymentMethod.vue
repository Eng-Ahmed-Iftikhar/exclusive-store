<template>
  <div class="payment-method">
    <div class="section-header">
      <div class="section-icon">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 10h18M7 15h1m2 0h5m-1 4l2-2m-2 2l-2-2m2-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2z" />
        </svg>
      </div>
      <h2 class="section-title">Payment Method</h2>
    </div>

    <v-form ref="form" @submit.prevent>
      <div class="payment-option">
        <v-radio-group v-model="selectedPaymentMethod" :rules="paymentMethodRules" required hide-details="auto">
          <v-radio value="card" label="Credit/Debit Card" class="payment-radio">
            <template #label>
              <div class="radio-label">
                <div class="payment-icon">
                  <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 10h18M7 15h1m2 0h5m-1 4l2-2m-2 2l-2-2m2-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2z" />
                  </svg>
                </div>
                <span class="payment-text">Credit/Debit Card</span>
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </div>

      <div v-if="selectedPaymentMethod === 'card'" class="card-element-section">
        <!-- Stripe Card Element -->
        <div ref="cardElementContainer" class="stripe-card-element"></div>

        <!-- Cardholder Name -->
        <v-text-field v-model="cardholderName" label="Cardholder Name" variant="outlined" density="compact"
          :rules="cardholderNameRules" required prepend-inner-icon="mdi-account" hide-details="auto"
          placeholder="Name on card" class="cardholder-name-field" />
      </div>

      <div class="security-info">
        <div class="security-content">
          <svg class="security-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div class="security-text">
            <div class="security-title">Secure Payment</div>
            <div class="security-description">
              Your payment information is encrypted and secure. We never store your card details.
            </div>
          </div>
        </div>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { loadStripe } from '@stripe/stripe-js'

interface Props {
  modelValue?: {
    paymentMethodId?: string
    cardholderName: string
  }
}

interface Emits {
  (e: 'update:modelValue', value: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = ref()
const cardElementContainer = ref()
let stripe: any = null
let elements: any = null
let cardElement: any = null

// Form data
const selectedPaymentMethod = ref('card')
const cardholderName = ref('')

// Validation rules
const paymentMethodRules = [
  (v: string) => !!v || 'Please select a payment method'
]

const cardholderNameRules = [
  (v: string) => !!v || 'Cardholder name is required',
  (v: string) => v.length >= 2 || 'Name must be at least 2 characters',
  (v: string) => /^[a-zA-Z\s]*$/.test(v) || 'Name can only contain letters and spaces'
]

// Initialize Stripe
const initializeStripe = async () => {
  try {
    // Load Stripe (you'll need to add your publishable key)
    stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

    if (!stripe) {
      throw new Error('Failed to load Stripe')
    }

    // Create elements
    elements = stripe.elements()

    // Create card element
    cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#9e2146',
        },
      },
    })

    // Mount card element
    if (cardElementContainer.value) {
      cardElement.mount(cardElementContainer.value)
    }
  } catch (error) {
    // Failed to initialize Stripe
  }
}

// Create payment method
const createPaymentMethod = async () => {
  if (!stripe || !cardElement) {
    throw new Error('Stripe not initialized')
  }

  const { paymentMethod, error } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
    billing_details: {
      name: cardholderName.value,
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  return paymentMethod
}

// Confirm payment using client secret
const confirmPayment = async (clientSecret: string) => {
  if (!stripe || !cardElement) {
    throw new Error('Stripe not initialized')
  }

  // Stripe Configuration
  const stripeConfig = {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.substring(0, 7),
    clientSecret: clientSecret?.substring(0, 20) + '...',
    stripeInstance: !!stripe,
    cardElement: !!cardElement
  }

  const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: cardElement,
    },
  })

  if (result.error) {
    throw new Error(result.error.message)
  }

  return result
}

// Confirm payment with client secret (alternative method)
const confirmPaymentWithClientSecret = async (clientSecret: string) => {
  if (!stripe || !cardElement) {
    throw new Error('Stripe not initialized')
  }

  // This method directly confirms the payment using the client secret
  // without needing to create a payment method first
  const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: cardElement,
    },
  })

  if (result.error) {
    throw new Error(result.error.message)
  }

  return result
}

// Watch for changes and emit updates
watch([cardholderName], () => {
  emit('update:modelValue', {
    paymentMethodId: undefined, // Will be set when form is submitted
    cardholderName: cardholderName.value
  })
})

// Expose form validation and payment method creation
defineExpose({
  validate: () => form.value?.validate(),
  createPaymentMethod,
  confirmPayment,
  confirmPaymentWithClientSecret
})

// Initialize Stripe on mount
onMounted(() => {
  initializeStripe()
})
</script>

<style scoped>
.payment-method {
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

.payment-option {
  margin-bottom: 1.5rem;
}

.payment-radio {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #fecaca;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #fef2f2 0%, #f3f4f6 100%);
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0.75rem;
}

.payment-icon {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #DB4444 0%, #000000 100%);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.payment-text {
  font-weight: 600;
  color: #1f2937;
}

.card-element-section {
  margin-bottom: 1.5rem;
}

.card-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.cardholder-name-field {
  margin-top: 1rem;
}

.security-info {
  padding: 1rem;
  background: #eff6ff;
  border-radius: 0.75rem;
  border: 1px solid #bfdbfe;
}

.security-content {
  display: flex;
  align-items: flex-start;
}

.security-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #DB4444;
  margin-right: 0.75rem;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.security-text {
  flex: 1;
}

.security-title {
  font-size: 0.875rem;
  color: #1e40af;
  font-weight: 500;
  margin: 0 0 0.25rem 0;
}

.security-description {
  font-size: 0.75rem;
  color: #1d4ed8;
  margin: 0;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .payment-method {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .payment-radio {
    padding: 0.75rem;
  }

  .payment-icon {
    width: 1.75rem;
    height: 1.75rem;
  }

  .card-details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
