<template>
  <div class="checkout-header">
    <div class="header-icon">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    </div>
    <h1 class="header-title">
      Secure Checkout
    </h1>
    <p class="header-description">
      Complete your purchase with our secure payment system. Your information is protected with bank-level security.
    </p>
  </div>
</template>

<style scoped>
.checkout-header {
  text-align: center;
  padding-block: 3rem;
}

.header-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  background: linear-gradient(135deg, #DB4444 0%, #000000 100%);
  border-radius: 50%;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 25px rgba(219, 68, 68, 0.3);
}

.icon {
  width: 2.5rem;
  height: 2.5rem;
  color: white;
}

.header-title {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #DB4444 0%, #000000 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.header-description {
  font-size: 1.25rem;
  color: #4b5563;
  max-width: 42rem;
  margin: 0 auto;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .header-title {
    font-size: 2rem;
  }

  .header-description {
    font-size: 1.125rem;
  }

  .header-icon {
    width: 4rem;
    height: 4rem;
  }

  .icon {
    width: 2rem;
    height: 2rem;
  }
}
</style>

<script setup lang="ts">
// This component is purely presentational
</script>
