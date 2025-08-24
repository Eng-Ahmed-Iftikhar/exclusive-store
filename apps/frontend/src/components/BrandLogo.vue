<template>
  <div class="flex items-center gap-2 select-none">
    <img :src="logoWhite" alt="Exclusive Logo" class="brand-logo" />
  </div>
</template>

<script setup lang="ts">
import logoWhite from '../assets/images/logo-white.png'
</script>

<style scoped>
.brand-logo {
  height: 60px;
  width: auto;
  object-fit: contain;
}
</style>
