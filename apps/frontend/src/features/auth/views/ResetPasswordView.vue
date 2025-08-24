<template>
  <div class="reset-password-view">
    <div class="container">
      <div class="row justify-center">
        <div class="col-12 col-md-8 col-lg-6">
          <div class="auth-card">
            <div class="text-center mb-6">
              <h1 class="text-h4 font-weight-bold mb-2">Reset Password</h1>
              <p class="text-body-1 text-medium-emphasis">
                Enter your new password below
              </p>
            </div>
            
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ResetPasswordForm from '../components/ResetPasswordForm.vue';
</script>

<style scoped>
.reset-password-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.auth-card {
  background: white;
  border-radius: 12px;
  padding: 3rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .auth-card {
    padding: 2rem 1.5rem;
  }
}
</style>
