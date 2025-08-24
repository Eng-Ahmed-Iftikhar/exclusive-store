<script setup lang="ts">
import SiteFooter from '@components/layout/SiteFooter.vue';
import SiteHeader from '@components/layout/SiteHeader.vue';
import TopPromoBar from '@components/layout/TopPromoBar.vue';
import NotificationToast from '@components/NotificationToast.vue';
import { usePageTitle } from '../composables/usePageTitle';
import { RouterView } from 'vue-router';

// Initialize page title management
usePageTitle();
</script>

<template>
  <v-app>
    <TopPromoBar />
    <SiteHeader />
    <v-main>
      <RouterView />
    </v-main>
    <SiteFooter />
    <NotificationToast />
  </v-app>

</template>

<style scoped></style>
