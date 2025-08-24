<script setup lang="ts">
import { computed } from 'vue';
import BrandLogo from '@components/BrandLogo.vue';
import CartBasket from './CartBasket.vue';
import { useAuthStore } from '../../stores/index';
import UserDropdown from './UserDropdown.vue';
import SearchInput from '../search/SearchInput.vue';

const authStore = useAuthStore();

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>

<template>
  <header class="w-full bg-white border-b">
    <v-container class="py-3" >
      <div class="d-flex align-center w-100">
        <div class="me-6"><BrandLogo /></div>

        <nav class="d-flex align-center justify-center ">
          <v-btn to="/" variant="text" class="nav-link mx-4">{{ $t('nav.home') }}</v-btn>
          <v-btn to="/products" variant="text" class="nav-link mx-4">Products</v-btn>
          <v-btn to="/contact" variant="text" class="nav-link mx-4">{{ $t('nav.contact') }}</v-btn>
          <v-btn to="/about" variant="text" class="nav-link mx-4">{{ $t('nav.about') }}</v-btn>
        </nav>

        <!-- New Search Input with Dropdown -->
        <div class="ms-auto me-4 search-container">
          <SearchInput :placeholder="String($t('nav.searchPlaceholder'))" />
        </div>

        <!-- Cart Basket -->
        <div class="me-4">
          <CartBasket />
        </div>

        <!-- User Authentication Section -->
        <div v-if="!isAuthenticated" class="d-flex align-center">
          <v-btn to="/login" variant="text" class="nav-link me-2">Login</v-btn>
          <v-btn to="/signup" color="primary" variant="flat" class="btn-cap nav-link">Sign Up</v-btn>
        </div>

        <!-- User Profile Section -->
        <UserDropdown v-else />
      </div>
    </v-container>
  </header>
</template>

.style1{}
<style scoped>
.nav-link {
  color: rgb(var(--v-theme-secondary)) !important;
  text-transform: none;
  border-radius: 6px !important;
}
.nav-link:hover,
.nav-link:focus-visible {
  color: rgb(var(--v-theme-primary)) !important;
  background-color: rgb(var(--v-theme-secondary)) !important;
}

.search-container {
  min-width: 300px;
  max-width: 500px;
  flex: 1;
}

/* User Menu Styles */
.user-menu-btn {
  color: rgb(var(--v-theme-secondary)) !important;
  text-transform: none;
  padding: 8px 12px;
}

.user-menu-btn:hover {
  color: rgb(var(--v-theme-primary)) !important;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: rgb(var(--v-theme-secondary));
}

.user-dropdown {
  border-radius: 0px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.user-info-item {
  padding: 16px;
}

.dropdown-item {
  cursor: pointer;
  padding: 12px 16px;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: rgb(var(--v-theme-primary));
  color: white !important;
}

.dropdown-item:hover .v-list-item-title {
  color: white !important;
}

.dropdown-item:hover .v-icon {
  color: white !important;
}

/* Chevron rotation animation */
.chevron-icon {
  transition: transform 0.3s ease;
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

.btn-cap {
  text-transform: none;
  border-radius: 6px !important;
}

</style>


