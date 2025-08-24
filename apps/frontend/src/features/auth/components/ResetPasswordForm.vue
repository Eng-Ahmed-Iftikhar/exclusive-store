<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../../stores/index';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Form refs
const form = ref();
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isSubmitted = ref(false);

// Computed
const isLoading = computed(() => authStore.getIsLoading);
const errorMessage = computed(() => authStore.getErrorMessage);

// Get token from URL
const resetToken = computed(() => route.query.token as string);

// Validation rules
const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 6 || 'Password must be at least 6 characters',
];

const confirmPasswordRules = [
  (v: string) => !!v || 'Please confirm your password',
  (v: string) => v === password.value || 'Passwords do not match',
];

// Check if token exists
onMounted(() => {
  if (!resetToken.value) {
    authStore.setErrorMessage('Invalid reset link. Please request a new password reset.');
  }
});

// Methods
const handleSubmit = async () => {
  const { valid } = await form.value.validate();
  
  if (!valid || !resetToken.value) return;

  authStore.clearError();
  
  try {
    // Call the reset password API through the store
    const success = await authStore.resetPassword(resetToken.value, password.value);
    if (success) {
      isSubmitted.value = true;
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  } catch (error) {
    // Reset password error
  }
};
</script>

<template>
  <v-form ref="form" @submit.prevent="handleSubmit" class="reset-password-form">
    <!-- Success Alert -->
    <v-alert
      v-if="isSubmitted"
      type="success"
      class="mb-4"
      closable
    >
      Password reset successfully! Redirecting to login page...
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

    <!-- Password Field -->
    <v-text-field
      v-model="password"
      label="New Password"
      :type="showPassword ? 'text' : 'password'"
      variant="underlined"
      density="comfortable"
      class="mb-4"
      :rules="passwordRules"
      :disabled="isLoading || isSubmitted"
      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="showPassword = !showPassword"
      required
    />

    <!-- Confirm Password Field -->
    <v-text-field
      v-model="confirmPassword"
      label="Confirm New Password"
      :type="showConfirmPassword ? 'text' : 'password'"
      variant="underlined"
      density="comfortable"
      class="mb-6"
      :rules="confirmPasswordRules"
      :disabled="isLoading || isSubmitted"
      :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="showConfirmPassword = !showConfirmPassword"
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
      :disabled="isLoading || isSubmitted || !resetToken"
    >
      Reset Password
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
.reset-password-form {
  max-width: 440px;
  width: 100%;
  margin: 0 auto;
}

.btn-cap {
  text-transform: none;
}
</style>
