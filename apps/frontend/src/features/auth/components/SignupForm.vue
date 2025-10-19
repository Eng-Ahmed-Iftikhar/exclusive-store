<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

import googleIcon from '@frontend/assets/icons/Icon-Google.svg';
import { useAuthStore } from '@frontend/stores';

const router = useRouter();
const authStore = useAuthStore();

// Form refs
const form = ref();
const name = ref('');
const email = ref('');
const password = ref('');
const showPassword = ref(false);

// Computed
const isLoading = computed(() => authStore.getIsLoading);
const errorMessage = computed(() => authStore.getErrorMessage);

// Validation rules
const nameRules = [
  (v: string) => !!v || 'Name is required',
  (v: string) => v.length >= 2 || 'Name must be at least 2 characters',
];

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Please enter a valid email',
];

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 6 || 'Password must be at least 6 characters',
];

// Methods
const handleSignup = async () => {
  const { valid } = await form.value.validate();

  if (!valid) return;

  authStore.clearError();

  // Get redirect URL from query params and store it
  const urlParams = new URLSearchParams(window.location.search);
  const redirectTo = urlParams.get('redirectTo');
  if (redirectTo) {
    localStorage.setItem('redirectAfterLogin', redirectTo);
  }

  const success = await authStore.register({
    name: name.value,
    email: email.value,
    password: password.value,
  });

  if (success) {
    authStore.handlePostAuthRedirect(router);
  }
};

const handleGoogleSignup = async () => {
  authStore.clearError();

  try {
    const success = await authStore.googleSignup();
    console.log({ success });

    if (success) {
      // Redirect to the appropriate page after successful authentication
      router.push('/');
    }
  } catch (error) {
    console.error('Google signup error:', error);
  }
};
</script>

<template>
  <v-form ref="form" @submit.prevent="handleSignup">
    <!-- Error Alert -->
    <v-alert v-if="errorMessage" type="error" class="mb-4" closable @click:close="authStore.clearError()">
      {{ errorMessage }}
    </v-alert>

    <!-- Name Field -->
    <v-text-field v-model="name" label="Name" variant="underlined" class="mb-4" :rules="nameRules" :disabled="isLoading"
      required />

    <!-- Email Field -->
    <v-text-field v-model="email" label="Email" type="email" variant="underlined" class="mb-4" :rules="emailRules"
      :disabled="isLoading" required />

    <!-- Password Field -->
    <v-text-field v-model="password" label="Password" :type="showPassword ? 'text' : 'password'" variant="underlined"
      class="mb-6" :rules="passwordRules" :disabled="isLoading"
      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="showPassword = !showPassword"
      required />

    <!-- Create Account Button -->
    <v-btn type="submit" color="primary" block rounded="0" class="btn-cap mb-3" :loading="isLoading"
      :disabled="isLoading">
      Create account
    </v-btn>

    <!-- Google Signup Button -->
    <v-btn class="google-btn btn-cap" variant="outlined" color="secondary" block rounded="0" :disabled="isLoading"
      @click="handleGoogleSignup">
      <template #prepend>
        <v-img :src="googleIcon" width="18" height="18" class="me-2" alt="Google" />
      </template>
      Sign up with Google
    </v-btn>

    <!-- Login Link -->
    <div class="login-foot text-center">
      Already have account?
      <RouterLink to="/login" class="text-primary text-decoration-none">Log in</RouterLink>
    </div>
  </v-form>
</template>

<style scoped>
.google-btn {
  margin-top: 12px;
  border: 1px solid #BDBDBD !important;
  color: rgb(var(--v-theme-secondary));
}

.btn-cap {
  text-transform: none;
}

.login-foot {
  margin-top: 24px;
  font-size: 14px;
}
</style>
