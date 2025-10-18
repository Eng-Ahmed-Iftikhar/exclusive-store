<script setup lang="ts">
import { computed, ref } from 'vue';
import BrandLogo from '@components/BrandLogo.vue';
import CartBasket from './CartBasket.vue';
import { useAuthStore } from '../../stores/index';
import UserDropdown from './UserDropdown.vue';
import SearchInput from '../search/SearchInput.vue';

const authStore = useAuthStore();

// Reactive state
const mobileMenuOpen = ref(false);

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated);

// Methods
const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};
</script>

<template>
  <header class="w-full bg-white border-b">
    <v-container class="py-3">
      <!-- Desktop Layout -->
      <div class="d-flex align-center w-100 desktop-nav">
        <div class="me-6">
          <BrandLogo />
        </div>

        <nav class="d-flex align-center justify-center desktop-nav-links">
          <v-btn to="/" variant="text" class="nav-link mx-4">{{ $t('nav.home') }}</v-btn>
          <v-btn to="/products" variant="text" class="nav-link mx-4">Products</v-btn>
          <v-btn to="/contact" variant="text" class="nav-link mx-4">{{ $t('nav.contact') }}</v-btn>
          <v-btn to="/about" variant="text" class="nav-link mx-4">{{ $t('nav.about') }}</v-btn>
        </nav>

        <!-- Search Input -->
        <div class="ms-auto me-4 search-container">
          <SearchInput :placeholder="String($t('nav.searchPlaceholder'))" />
        </div>

        <!-- Cart Basket -->
        <div class="me-4">
          <CartBasket />
        </div>

        <!-- User Authentication Section -->
        <div v-if="!isAuthenticated" class="d-flex align-center desktop-auth">
          <v-btn to="/login" variant="text" class="nav-link me-2">Login</v-btn>
          <v-btn to="/signup" color="primary" variant="flat" class="btn-cap nav-link">Sign Up</v-btn>
        </div>

        <!-- User Profile Section -->
        <UserDropdown v-else class="desktop-user" />
      </div>

      <!-- Mobile Layout -->
      <div class="mobile-nav">
        <!-- Mobile Header Row -->
        <div class="d-flex align-center justify-space-between w-100 mb-3">
          <div>
            <BrandLogo />
          </div>

          <div class="d-flex align-center">
            <!-- Mobile Search -->
            <div class="me-3 mobile-search">
              <SearchInput :placeholder="String($t('nav.searchPlaceholder'))" />
            </div>

            <!-- Mobile Cart -->
            <div class="me-3">
              <CartBasket />
            </div>

            <!-- Mobile Menu Button -->
            <v-btn icon="mdi-menu" variant="text" @click="mobileMenuOpen = !mobileMenuOpen" class="mobile-menu-btn" />
          </div>
        </div>

        <!-- Mobile Menu -->
        <v-expand-transition>
          <div v-show="mobileMenuOpen" class="mobile-menu">
            <!-- Navigation Links -->
            <nav class="mobile-nav-links">
              <v-btn to="/" variant="text" class="mobile-nav-link" @click="closeMobileMenu">
                {{ $t('nav.home') }}
              </v-btn>
              <v-btn to="/products" variant="text" class="mobile-nav-link" @click="closeMobileMenu">
                Products
              </v-btn>
              <v-btn to="/contact" variant="text" class="mobile-nav-link" @click="closeMobileMenu">
                {{ $t('nav.contact') }}
              </v-btn>
              <v-btn to="/about" variant="text" class="mobile-nav-link" @click="closeMobileMenu">
                {{ $t('nav.about') }}
              </v-btn>
            </nav>

            <!-- Mobile Authentication -->
            <div v-if="!isAuthenticated" class="mobile-auth">
              <v-btn to="/login" variant="text" class="mobile-nav-link me-2" @click="closeMobileMenu">
                Login
              </v-btn>
              <v-btn to="/signup" color="primary" variant="flat" class="btn-cap mobile-nav-link"
                @click="closeMobileMenu">
                Sign Up
              </v-btn>
            </div>

            <!-- Mobile User Profile -->
            <div v-else class="mobile-user">
              <UserDropdown @click="closeMobileMenu" />
            </div>
          </div>
        </v-expand-transition>
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

/* Responsive Design */
@media (min-width: 1024px) {
  .desktop-nav {
    display: flex !important;
  }

  .mobile-nav {
    display: none !important;
  }
}

@media (max-width: 1023px) {
  .desktop-nav {
    display: none !important;
  }

  .mobile-nav {
    display: block !important;
  }
}

/* Mobile Styles */
.mobile-nav {
  width: 100%;
}

.mobile-search {
  min-width: 200px;
  max-width: 250px;
}

.mobile-menu-btn {
  color: rgb(var(--v-theme-secondary)) !important;
}

.mobile-menu {
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
  margin-top: 8px;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.mobile-nav-link {
  color: rgb(var(--v-theme-secondary)) !important;
  text-transform: none;
  border-radius: 6px !important;
  justify-content: flex-start !important;
  width: 100%;
  padding: 12px 16px !important;
}

.mobile-nav-link:hover,
.mobile-nav-link:focus-visible {
  color: rgb(var(--v-theme-primary)) !important;
  background-color: rgb(var(--v-theme-secondary)) !important;
}

.mobile-auth {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.mobile-auth .mobile-nav-link {
  width: 100%;
  justify-content: center !important;
}

.mobile-user {
  margin-bottom: 16px;
}

/* Tablet Styles */
@media (min-width: 768px) and (max-width: 1023px) {
  .mobile-search {
    min-width: 250px;
    max-width: 300px;
  }

  .mobile-nav-links {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px;
  }

  .mobile-nav-link {
    width: auto;
    min-width: 120px;
  }

  .mobile-auth {
    flex-direction: row;
    gap: 16px;
  }

  .mobile-auth .mobile-nav-link {
    width: auto;
    min-width: 100px;
  }
}

/* Small Mobile Styles */
@media (max-width: 480px) {
  .mobile-search {
    min-width: 150px;
    max-width: 200px;
  }

  .mobile-nav-links {
    gap: 4px;
  }

  .mobile-nav-link {
    padding: 8px 12px !important;
    font-size: 14px;
  }

  .mobile-auth {
    gap: 8px;
  }
}
</style>
