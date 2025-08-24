<template>
  <div class="submit-button-section">
    <button type="submit" :disabled="isProcessing" class="submit-button" :class="{ 'processing': isProcessing }">
      <span v-if="isProcessing" class="button-content processing">
        <svg class="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="spinner-path" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        Processing Payment...
      </span>
      <span v-else class="button-content">
        <svg class="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        Complete Order - ${{ Number(total).toFixed(2) }}
      </span>
    </button>





    <div class="terms-section">
      <p class="terms-text">
        By completing your order, you agree to our
        <a href="#" class="terms-link">Terms of Service</a> and
        <a href="#" class="terms-link">Privacy Policy</a>.
      </p>

      <!-- Trust Badges -->
      <div class="trust-badges">
        <div class="trust-badge">
          <svg class="badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          SSL Secure
        </div>
        <div class="trust-badge">
          <svg class="badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          PCI Compliant
        </div>
        <div class="trust-badge">
          <svg class="badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Stripe Powered
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isProcessing: boolean
  total: number
}

defineProps<Props>()
</script>

<style scoped>
.submit-button-section {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem;
  margin-top: 1rem;
}

.submit-button {
  width: 100%;
  background: linear-gradient(135deg, #DB4444 0%, #000000 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 1.125rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: scale(1);
  box-shadow: 0 10px 25px rgba(219, 68, 68, 0.3);
}

.submit-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #b91c1c 0%, #1f2937 100%);
  transform: scale(1.02);
}

.submit-button:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(219, 68, 68, 0.3);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: scale(1);
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-content.processing {
  gap: 0.75rem;
}

.button-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
}

.spinner {
  width: 1.5rem;
  height: 1.5rem;
  animation: spin 1s linear infinite;
}

.spinner-circle {
  opacity: 0.25;
}

.spinner-path {
  opacity: 0.75;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.total-breakdown {
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.breakdown-item.total {
  font-weight: 700;
  color: #111827;
  font-size: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 0.5rem;
  margin-top: 0.5rem;
}

.terms-section {
  margin-top: 1.5rem;
  text-align: center;
}

.terms-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.terms-link {
  color: #DB4444;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.terms-link:hover {
  color: #b91c1c;
}

.trust-badges {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
}

.trust-badge {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: #6b7280;
}

.badge-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.25rem;
}

.trust-badge:nth-child(1) .badge-icon {
  color: #059669;
}

.trust-badge:nth-child(2) .badge-icon {
  color: #DB4444;
}

.trust-badge:nth-child(3) .badge-icon {
  color: #000000;
}

@media (max-width: 768px) {
  .submit-button-section {
    padding: 1.5rem;
  }

  .submit-button {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }

  .trust-badges {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
