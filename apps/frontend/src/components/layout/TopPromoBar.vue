<template>
  <v-sheet color="black" class="text-white text-caption " elevation="0">
      <v-container class="top-promo-bar">
    <div class="d-flex align-center w-100 promo-inner">
      <div class="text-center flex-grow-1">
        <span class="o-80">{{ $t('promo.message') }}</span>
        <RouterLink to="/products" class="text-white text-decoration-underline ms-2">{{ $t('promo.shopNow') }}</RouterLink>
      </div>
      <div>
        <v-select
        class="lang-select"
        :items="languages"
        v-model="current"
        density="compact"
        hide-details
        variant="outlined"
        item-title="label"
        item-value="value"
      />
      </div>
 
    </div>
  </v-container>
  </v-sheet>
 
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, watch } from 'vue';

const { locale } = useI18n();

const languages = [
  { label: 'English', value: 'en' },
  { label: 'Français', value: 'fr' },
];
const current = ref(locale.value);
watch(current, (val) => {
  locale.value = val;
  if (typeof window !== 'undefined') localStorage.setItem('locale', val);
});
</script>

<style scoped>


.lang-select {
  min-width: 120px;

}

.o-80 {
  opacity: 0.8;
}
</style>


