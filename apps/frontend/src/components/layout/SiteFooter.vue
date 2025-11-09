<template>
  <v-footer color="black" class="text-white pt-12" elevation="0">
    <v-container class="py-0 footer-container">
      <v-row class="text-body-2" no-gutters>
        <v-col cols="12" sm="6" lg="3">
          <div class="mb-4">
            <BrandLogo />
          </div>
          <p class="mb-3" style="opacity: 0.8">{{ $t('footer.subscribe') }}</p>
          <p class="mb-3" style="opacity: 0.6">{{ $t('footer.offer') }}</p>
          <div class="d-flex align-center">
            <v-text-field
              variant="outlined"
              density="compact"
              hide-details
              placeholder="Enter your email"
              class="me-2"
              style="max-width: 190px"
            />
            <v-btn color="white" text="→" variant="flat" size="small" />
          </div>
        </v-col>
        <v-col cols="12" sm="6" lg="3" class="mt-8 mt-lg-0">
          <h3 class="text-h6 mb-4">{{ $t('footer.support') }}</h3>
          <p style="opacity: 0.6">{{ $t('footer.address') }}</p>
          <p class="mt-2" style="opacity: 0.6">{{ $t('footer.email') }}</p>
          <p class="mt-2" style="opacity: 0.6">{{ $t('footer.phone') }}</p>
        </v-col>
        <v-col cols="12" sm="6" lg="3" class="mt-8 mt-lg-0">
          <h3 class="text-h6 mb-4">{{ $t('footer.account') }}</h3>
          <div class="d-flex flex-column footer-links">
            <RouterLink to="/login">{{
              $t('footer.loginRegister')
            }}</RouterLink>
            <RouterLink to="/cart">{{ $t('footer.cart') }}</RouterLink>
            <RouterLink to="/wishlist">{{ $t('footer.wishlist') }}</RouterLink>
            <RouterLink to="/products">{{ $t('footer.shop') }}</RouterLink>
          </div>
        </v-col>
        <v-col cols="12" sm="6" lg="3" class="mt-8 mt-lg-0">
          <h3 class="text-h6 mb-4">{{ $t('footer.quickLink') }}</h3>
          <div class="d-flex flex-column footer-links">
            <RouterLink to="/privacy">{{ $t('footer.privacy') }}</RouterLink>
            <RouterLink to="/terms">{{ $t('footer.terms') }}</RouterLink>
            <RouterLink to="/faq">{{ $t('footer.faq') }}</RouterLink>
            <RouterLink to="/contact">{{ $t('footer.contact') }}</RouterLink>
          </div>
        </v-col>
      </v-row>
      <v-divider class="my-4 low-opacity" />
      <div class="text-center text-caption o-60">
        {{ $t('footer.copyright') }}
      </div>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
import BrandLogo from '../BrandLogo.vue';
</script>

<style scoped>
.footer-container {
  padding-left: 16px;
  padding-right: 16px;
}

@media (min-width: 1024px) {
  .footer-container {
    padding-left: 135px;
    padding-right: 135px;
  }
}

.o-60 {
  opacity: 0.6;
}

.low-opacity {
  opacity: 0.1;
}

.footer-links {
  color: #ffffff;
}

.footer-links a {
  color: inherit;
  text-decoration: none;
  margin-bottom: 8px;
}

.footer-links a:hover {
  text-decoration: none;
}

.footer-logo {
  height: 35px;
  width: auto;
  object-fit: contain;
}
</style>
