<script setup lang="ts">
import sideImgUrl from '@features/auth/assets/login-side-image.png';
import ForgotPasswordForm from '../components/ForgotPasswordForm.vue';
</script>

<template>
  <v-row align="center" class="login-container">
    <v-col cols="12" md="7" class="d-none d-md-flex align-center justify-center">
      <v-img :src="sideImgUrl" class="login-side-img" cover alt="Forgot Password side" />
    </v-col>
    <v-col cols="12" md="5">
      <div class="login-panel">
        <div class="login-head">
          <h1 class="login-title">Forgot password</h1>
          <p class="login-sub">Enter your email to reset your password</p>
        </div>
        <ForgotPasswordForm />
      </div>
    </v-col>
  </v-row>
</template>

<style scoped>
.login-container {
  padding-top: 40px;
  padding-bottom: 40px;
}
.login-side-img {
  height: 781px;
}
.login-panel {
  max-width: 440px;
  margin: 0 auto;
}
.login-head { margin-bottom: 24px; }
.login-title {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.2px;
  margin: 0 0 8px 0;
}
.login-sub { font-size: 14px; opacity: 0.8; }
.login-foot { margin-top: 24px; font-size: 14px; }
</style>


