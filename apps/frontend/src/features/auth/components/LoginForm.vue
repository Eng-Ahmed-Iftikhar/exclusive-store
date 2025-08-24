<script setup lang="ts">
import { useAuthStore } from '../../../stores/index';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();
const authStore = useAuthStore();

// Form refs
const form = ref();
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const remember = ref(false);

// Computed
const isLoading = computed(() => authStore.getIsLoading);
const errorMessage = computed(() => authStore.getErrorMessage);

// Validation rules
const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Please enter a valid email',
];

const passwordRules = [
  (v: string) => !!v || 'Password is required',
];

// Methods
const handleLogin = async () => {
  console.log('Login button clicked');

  try {
    const { valid } = await form.value.validate();
    console.log('Form validation result:', valid);

    if (!valid) {
      console.log('Form validation failed, returning');
      return;
    }
  } catch (error) {
    console.error('Form validation error:', error);
    return;
  }

  authStore.clearError();

  // Get redirect URL from query params and store it
  const urlParams = new URLSearchParams(window.location.search);
  const redirectTo = urlParams.get('redirectTo');
  if (redirectTo) {
    localStorage.setItem('redirectAfterLogin', redirectTo);
    console.log('Stored redirect URL:', redirectTo);
  }

  console.log('Attempting login...');
  const success = await authStore.login({
    email: email.value,
    password: password.value,
    rememberMe: remember.value,
  });
  console.log('Login result:', { success });

  if (success) {
    console.log('Login successful, redirecting...');
    authStore.handlePostAuthRedirect(router);
  } else {
    console.log('Login failed');
  }
};
</script>

<template>
  <v-form ref="form" class="login-form">
    <!-- Error Alert -->
    <v-alert v-if="errorMessage" type="error" class="mb-4" closable @click:close="authStore.clearError()">
      {{ errorMessage }}
    </v-alert>

    <!-- Email Field -->
    <v-text-field v-model="email" label="Email or Phone Number" type="email" variant="underlined" density="comfortable"
      class="mb-4" :rules="emailRules" :disabled="isLoading" required />

    <!-- Password Field -->
    <v-text-field v-model="password" label="Password" :type="showPassword ? 'text' : 'password'" variant="underlined"
      density="comfortable" class="mb-6" :rules="passwordRules" :disabled="isLoading"
      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="showPassword = !showPassword"
      required />

    <!-- Remember Me and Forgot Password -->
    <div class="d-flex align-center justify-space-between mb-6">
      <v-checkbox v-model="remember" density="comfortable" hide-details label="Remember me" :disabled="isLoading" />
      <RouterLink to="/forgot-password" class="text-primary text-decoration-none">
        Forgot Password?
      </RouterLink>
    </div>

    <!-- Login Button -->
    <v-btn type="button" color="primary" block rounded="0" class="btn-cap" :loading="isLoading" :disabled="isLoading"
      @click="handleLogin">
      Log In
    </v-btn>

    <!-- Signup Link -->
    <div class="login-foot text-center">
      Don't have an account?
      <RouterLink to="/signup" class="text-primary text-decoration-none">Sign up</RouterLink>
    </div>
  </v-form>
</template>

<style scoped>
.login-form {
  max-width: 440px;
  width: 100%;
  margin: 0 auto;
}

.btn-cap {
  text-transform: none;
}

.login-foot {
  margin-top: 24px;
  font-size: 14px;
}
</style>
