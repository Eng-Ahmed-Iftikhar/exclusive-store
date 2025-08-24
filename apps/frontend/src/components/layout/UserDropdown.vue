<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/index';

const router = useRouter();
const authStore = useAuthStore();

// Computed properties
const user = computed(() => authStore.getUser);
const isLoading = computed(() => authStore.getIsLoading);

// Dropdown and logout confirmation
const isDropdownOpen = ref(false);
const showLogoutDialog = ref(false);

// Methods
const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

const goToProfile = () => {
  router.push('/profile');
};

const goToFavorites = () => {
  router.push('/favorites');
  isDropdownOpen.value = false;
};

const confirmLogout = async () => {
  showLogoutDialog.value = false;
  await handleLogout();
};
</script>

<template>
  <div class="d-flex align-center">
    <v-menu 
      location="bottom end" 
      offset="8"
      v-model="isDropdownOpen"
    >
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          variant="text"
          class="user-menu-btn d-flex align-center"
        >
          <v-avatar size="32" class="me-2">
            <v-img
              v-if="user?.avatar"
              :src="user.avatar"
              :alt="user?.name || 'User'"
            />
            <span v-else class="text-h6 text-black">
              {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
            </span>
          </v-avatar>
          <span class="user-name">{{ user?.name || 'User' }}</span>
          <v-icon 
            icon="mdi-chevron-down" 
            class="ms-1 chevron-icon"
            :class="{ 'rotated': isDropdownOpen }"
          />
        </v-btn>
      </template>

      <v-card min-width="250" class="user-dropdown">
        <v-list>
          <v-list-item class="user-info-item">
            <template #prepend>
              <v-avatar size="40">
                <v-img
                  v-if="user?.avatar"
                  :src="user.avatar"
                  :alt="user?.name || 'User'"
                />
                <span v-else class="text-h6 text-black">
                  {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                </span>
              </v-avatar>
            </template>
            <v-list-item-title class="text-body-1 font-weight-medium">
              {{ user?.name || 'User' }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-body-2">
              {{ user?.email }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-divider />

          <v-list-item @click="goToProfile" class="dropdown-item">
            <template #prepend>
              <v-icon icon="mdi-account" size="20" />
            </template>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>

          <v-list-item @click="goToFavorites" class="dropdown-item">
            <template #prepend>
              <v-icon icon="mdi-heart" size="20" />
            </template>
            <v-list-item-title>Favorites</v-list-item-title>
          </v-list-item>

          <v-list-item @click="() => { showLogoutDialog = true; isDropdownOpen = false; }" class="dropdown-item">
            <template #prepend>
              <v-icon icon="mdi-logout" size="20" />
            </template>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <!-- Logout Confirmation Dialog -->
    <v-dialog v-model="showLogoutDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6 pa-4">
          Confirm Logout
        </v-card-title>
        <v-card-text class="pa-4">
          Are you sure you want to logout? You will need to login again to access your account.
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn
            variant="outlined"
            @click="showLogoutDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            @click="confirmLogout"
            :loading="isLoading"
          >
            Logout
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
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
</style>
