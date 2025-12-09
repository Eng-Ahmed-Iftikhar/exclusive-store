<template>
  <div class="info-section">
    <h2 class="section-title">{{ title }}</h2>
    <div class="section-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface InfoSectionProps {
  title: string;
}

defineProps<InfoSectionProps>();
</script>

<style scoped>
.info-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #DB4444;
}

.section-content {
  font-size: 15px;
  line-height: 1.8;
  color: #444;
}

.section-content :deep(p) {
  margin: 0 0 16px 0;
}

.section-content :deep(ul),
.section-content :deep(ol) {
  margin: 0 0 16px 0;
  padding-left: 24px;
}

.section-content :deep(li) {
  margin-bottom: 8px;
}

.section-content :deep(strong) {
  color: #1a1a1a;
  font-weight: 600;
}

.section-content :deep(a) {
  color: #DB4444;
  text-decoration: none;
  font-weight: 500;
}

.section-content :deep(a:hover) {
  text-decoration: underline;
}
</style>
