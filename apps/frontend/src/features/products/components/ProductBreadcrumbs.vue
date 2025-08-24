<template>
  <div class="breadcrumbs mb-4">
    <v-breadcrumbs :items="breadcrumbItems" class="px-0">
      <template #divider>
        <v-icon icon="mdi-chevron-right" size="16" />
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  title: string;
  to?: string;
  disabled?: boolean;
}

interface Props {
  breadcrumbItems: BreadcrumbItem[];
}

defineProps<Props>();
</script>

<style scoped>
.breadcrumbs {
  background: white;
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
</style>
