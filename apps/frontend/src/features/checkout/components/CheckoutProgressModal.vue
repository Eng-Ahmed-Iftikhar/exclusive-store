<template>
  <v-dialog v-model="isOpen" persistent max-width="600" class="checkout-progress-modal">
    <v-card class="checkout-progress-card">
      <!-- Header -->
      <CheckoutModalHeader 
        title="Processing Your Order"
        subtitle="Please wait while we complete your purchase"
      />

      <!-- Progress Steps -->
      <v-card-text class="progress-content">
        <div class="progress-steps">
          <!-- Step 1: Creating Payment Intent -->
          <CheckoutStep
            :step-number="1"
            :current-step="currentStep"
            :error-step="errorStep"
            :error-message="errorMessage"
            title="Creating Payment Intent"
            description="Setting up secure payment processing"
            default-icon="mdi-credit-card-outline"
          />

          <!-- Step 2: Creating Payment Method -->
          <CheckoutStep
            :step-number="2"
            :current-step="currentStep"
            :error-step="errorStep"
            :error-message="errorMessage"
            title="Creating Payment Method"
            description="Securely processing your card information"
            default-icon="mdi-credit-card"
          />

          <!-- Step 3: Confirming Payment -->
          <CheckoutStep
            :step-number="3"
            :current-step="currentStep"
            :error-step="errorStep"
            :error-message="errorMessage"
            title="Confirming Payment"
            description="Verifying payment with your bank"
            default-icon="mdi-shield-check"
          />

          <!-- Step 4: Creating Order -->
          <CheckoutStep
            :step-number="4"
            :current-step="currentStep"
            :error-step="errorStep"
            :error-message="errorMessage"
            title="Creating Order"
            description="Finalizing your order details"
            default-icon="mdi-package-variant"
          />
        </div>

        <!-- Success Message -->
        <CheckoutSuccessMessage
          v-if="isSuccess"
          :order-id="orderId"
          :order-total="orderTotal"
        />
      </v-card-text>

      <!-- Actions -->
      <CheckoutModalActions
        :is-success="isSuccess"
        :has-error="hasError"
        @success="handleSuccess"
        @retry="handleRetry"
        @close="handleClose"
        @cancel="handleCancel"
      />
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import CheckoutModalHeader from './CheckoutModalHeader.vue'
import CheckoutStep from './CheckoutStep.vue'
import CheckoutSuccessMessage from './CheckoutSuccessMessage.vue'
import CheckoutModalActions from './CheckoutModalActions.vue'

interface Props {
  modelValue: boolean
  currentStep: number
  errorStep?: number
  errorMessage?: string
  orderId?: string
  orderTotal?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'retry'): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = useRouter()

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isSuccess = computed(() => props.currentStep > 4 && !props.errorStep)
const hasError = computed(() => props.errorStep !== undefined)

// Methods
const handleSuccess = () => {
  isOpen.value = false
  router.push('/')
}

const handleRetry = () => {
  emit('retry')
}

const handleClose = () => {
  isOpen.value = false
}

const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}
</script>

<style scoped>
.checkout-progress-modal {
  z-index: 9999;
}

.checkout-progress-card {
  border-radius: 16px;
  overflow: hidden;
}

.progress-content {
  padding: 2rem;
}

.progress-steps {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .progress-content {
    padding: 1.5rem;
  }
}
</style>
