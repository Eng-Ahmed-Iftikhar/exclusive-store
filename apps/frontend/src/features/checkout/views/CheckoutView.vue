<template>
  <div class="checkout-container">
    <CheckoutHeader />

    <v-container class="checkout-content">
      <v-row>
        <!-- Checkout Form -->
        <v-col cols="12" lg="8">
          <v-card class="checkout-form-card">
            <v-card-title class="form-title">
              <h2>Complete Your Order</h2>
            </v-card-title>

            <v-card-text>
              <v-form ref="checkoutForm" @submit.prevent="handleSubmit">
                <!-- Contact Information -->
                <ContactInformation :is-logged-in="!formData.isGuestOrder" :user-info="null"
                  :errors="validationErrors.guestUserInfo || []" @update="updateGuestUserInfo" />

                <!-- Shipping Address -->
                <ShippingAddress v-model="formData.shippingAddress" :errors="validationErrors.shippingAddress || []" />


                <!-- Payment Method -->
                <PaymentMethod ref="paymentForm" @update:model-value="handlePaymentUpdate" />

                <!-- Order Notes -->
                <OrderNotes v-model="formData.notes" />

                <!-- Submit Button -->
                <SubmitButton :is-processing="checkoutStore.loading" :total="cartStore.totalWithShipping"
                  :disabled="!isFormValid" />
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>


        <!-- Order Summary -->
        <v-col cols="12" lg="4">
          <CartSummary />
        </v-col>
      </v-row>
    </v-container>

    <!-- Checkout Progress Modal -->
    <CheckoutProgressModal v-model="showProgressModal" :current-step="currentStep" :error-step="errorStep"
      :error-message="errorMessage" :order-id="orderId" :order-total="orderTotal" @retry="handleRetry"
      @cancel="handleCancel" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useCartStore } from '../../../stores/modules/cart/cart.store'
import { useCheckoutStore } from '../../../stores/modules/checkout/checkout.store'


import CartSummary from '../components/CartSummary.vue'
import CheckoutHeader from '../components/CheckoutHeader.vue'
import CheckoutProgressModal from '../components/CheckoutProgressModal.vue'
import ContactInformation from '../components/ContactInformation.vue'
import OrderNotes from '../components/OrderNotes.vue'
import PaymentMethod from '../components/PaymentMethod.vue'
import ShippingAddress from '../components/ShippingAddress.vue'
import SubmitButton from '../components/SubmitButton.vue'
import { Cart } from '../../../stores/modules/cart/cart.interface'
import { useRouter } from 'vue-router'
import * as ICheckout from '../../../stores/modules/checkout/checkout.interface'


const checkoutStore = useCheckoutStore()
const cartStore = useCartStore()

// Refs
const checkoutForm = ref()
const paymentForm = ref()

// Progress modal state
const showProgressModal = ref(false)
const currentStep = ref(1)
const errorStep = ref<number | undefined>(undefined)
const errorMessage = ref('')
const orderId = ref('')
const orderTotal = ref('')
const router = useRouter()

// Form data
const formData = ref({
  cartId: '',
  isGuestOrder: true,
  guestUserInfo: {
    name: '',
    email: '',
    phone: ''
  },
  shippingAddress: {
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  },
  billingAddress: {
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  },
  notes: ''
})

// Validation state
const validationErrors = ref<Record<string, string[]>>({})

// Validation function
const validateForm = () => {
  const errors: Record<string, string[]> = {}

  // Check contact information
  const contactErrors = []
  if (!formData.value.guestUserInfo?.name) contactErrors.push('Name is required')
  if (!formData.value.guestUserInfo?.email) contactErrors.push('Email is required')
  if (!formData.value.guestUserInfo?.phone) contactErrors.push('Phone is required')
  if (contactErrors.length > 0) errors.guestUserInfo = contactErrors

  // Check shipping address
  const shippingErrors = []
  if (!formData.value.shippingAddress?.address) shippingErrors.push('Address is required')
  if (!formData.value.shippingAddress?.city) shippingErrors.push('City is required')
  if (!formData.value.shippingAddress?.state) shippingErrors.push('State is required')
  if (!formData.value.shippingAddress?.country) shippingErrors.push('Country is required')
  if (!formData.value.shippingAddress?.postalCode) shippingErrors.push('Postal code is required')
  if (shippingErrors.length > 0) errors.shippingAddress = shippingErrors

  validationErrors.value = errors

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

const total = computed(() => {
  return cartStore.totalWithShipping
})

// Computed
const isFormValid = computed(() => {
  return validateForm().isValid
})

// Methods
const useShippingAsBilling = () => {
  formData.value.billingAddress = { ...formData.value.shippingAddress }
}

const updateGuestUserInfo = (userInfo: any) => {
  // Received user info
  formData.value.guestUserInfo = {
    name: userInfo.name || '',
    email: userInfo.email || '',
    phone: userInfo.phone || ''
  }
  // Updated formData.guestUserInfo

  // Clear validation errors for contact info when user types
  if (validationErrors.value.guestUserInfo) {
    delete validationErrors.value.guestUserInfo
  }
}

const handlePaymentUpdate = (paymentData: any) => {
  // Payment data is handled by the PaymentMethod component
  // We'll get the paymentMethodId when submitting
}

// Watch for shipping address changes to clear validation errors
watch(() => formData.value.shippingAddress, (newShippingAddress) => {
  if (validationErrors.value.shippingAddress) {
    delete validationErrors.value.shippingAddress
  }
}, { deep: true })

const resetProgress = () => {
  currentStep.value = 1
  errorStep.value = undefined
  errorMessage.value = ''
  orderId.value = ''
  orderTotal.value = ''
}

const cart = computed(() => cartStore.cart as unknown as Cart)

const handleSubmit = async () => {
  try {


    // Validate form using our custom validation
    const validation = validateForm()
    if (!validation.isValid) {
      // Form validation failed
      return
    }


    if (!cart?.value?.id) {
      // Cart not found or no ID
      throw new Error('Cart not found')
    }

    formData.value.cartId = cart.value.id
    // Set cart ID

    // Show progress modal
    showProgressModal.value = true
    resetProgress()
    // Progress modal shown

    // Step 1: Create Payment Intent (Backend)
    currentStep.value = 1
    // Step 1: Creating payment intent...
    const paymentIntentResponse = await checkoutStore.createPaymentIntent(formData.value as ICheckout.CreateOrderRequest)

    if (!paymentIntentResponse?.paymentIntentId || !paymentIntentResponse?.clientSecret) {
      throw new Error('Failed to create payment intent')
    }
    // Payment intent created

    // Step 2: Confirm Payment Directly (Frontend - Stripe Elements)
    currentStep.value = 2
    // Step 2: Confirming payment directly...

    // Use the existing confirmPayment method
    const confirmResult = await paymentForm.value?.confirmPayment(paymentIntentResponse.clientSecret)

    if (confirmResult?.error) {
      throw new Error(confirmResult.error.message)
    }
    // Payment confirmed successfully

    // Step 3: Payment confirmed, proceed to order creation
    currentStep.value = 3
    // Step 3: Payment confirmed, proceeding to order creation...

    // Step 4: Create Order (Backend)
    currentStep.value = 4
    // Step 4: Creating order...

    // Use the order details from the payment intent response
    const orderResponse = await checkoutStore.createOrderFromPaymentIntent({
      paymentIntentId: paymentIntentResponse.paymentIntentId,
      orderDetails: paymentIntentResponse.orderDetails
    })

    if (orderResponse) {
      // Success - Order Created
      orderId.value = orderResponse.id as string
      orderTotal.value = `$${orderResponse.total.toFixed(2)}`
      router.push(`/order-success/${orderResponse.id}`)
    } else {
      throw new Error('Failed to create order')
    }

  } catch (error: any) {
    // Checkout error
    errorStep.value = currentStep.value
    errorMessage.value = error.response?.data?.message || error.message || 'An unexpected error occurred'
  }
}

const handleRetry = () => {
  resetProgress()
  showProgressModal.value = false
}

const handleCancel = () => {
  showProgressModal.value = false
  resetProgress()
}

// Watch for cart changes (shipping and tax are calculated in backend)
watch(() => cartStore.cart, (newCart) => {
  // Cart data is handled by the backend cart API
}, { deep: true })

// Watch for form data changes
watch(formData, (newFormData) => {
  // Form data changed
  // Guest user info
}, { deep: true })

// Initialize
onMounted(() => {
  // Set billing address to shipping address by default
  if (formData.value.shippingAddress) {
    formData.value.billingAddress = { ...formData.value.shippingAddress }
  }
})
</script>

<style scoped>
.checkout-container {
  min-height: 100vh;
  background-color: #f8fafc;
}

.checkout-content {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.checkout-form-card {
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.form-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}

.form-title h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .checkout-content {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
}
</style>
