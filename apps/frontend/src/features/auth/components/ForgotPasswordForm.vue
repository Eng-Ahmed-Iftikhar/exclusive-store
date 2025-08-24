<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../../../stores/index';

const authStore = useAuthStore();

// Form refs
const form = ref();
const email = ref('');
const isSubmitted = ref(false);

// Computed
const isLoading = computed(() => authStore.getIsLoading);
const errorMessage = computed(() => authStore.getErrorMessage);

// Validation rules
const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Please enter a valid email',
];

// Methods
const handleSubmit = async () => {
  const { valid } = await form.value.validate();
  
  if (!valid) return;

  authStore.clearError();
  
  try {
    // Call the forgot password API through the store
    const success = await authStore.forgotPassword(email.value);
    if (success) {
      isSubmitted.value = true;
    }
  } catch (error) {
    // Forgot password error
  }
};
</script>

<template>
  <v-form ref="form" @submit.prevent="handleSubmit" class="forgot-password-form">
    <!-- Success Alert -->
    <v-alert
      v-if="isSubmitted"
      type="success"
      class="mb-4"
      closable
    >
      If an account with that email exists, we've sent a password reset link. Please check your email.
    </v-alert>

    <!-- Error Alert -->
    <v-alert
      v-if="errorMessage"
      type="error"
      class="mb-4"
      closable
      @click:close="authStore.clearError()"
    >
      {{ errorMessage }}
    </v-alert>

    <!-- Email Field -->
    <v-text-field
      v-model="email"
      label="Email Address"
      type="email"
      variant="underlined"
      density="comfortable"
      class="mb-6"
      :rules="emailRules"
      :disabled="isLoading || isSubmitted"
      required
    />

    <!-- Submit Button -->
    <v-btn 
      type="submit" 
      color="primary"
      block
      rounded="0"
      class="btn-cap mb-4"
      :loading="isLoading" 
      :disabled="isLoading || isSubmitted"
    >
      Send Reset Link
    </v-btn>

    <!-- Back to Login Link -->
    <div class="text-center">
      <RouterLink to="/login" class="text-primary text-decoration-none">
        Back to Login
      </RouterLink>
    </div>
  </v-form>
</template>

<style scoped>
.forgot-password-form {
  max-width: 440px;
  width: 100%;
  margin: 0 auto;
}

.btn-cap {
  text-transform: none;
}
</style>
