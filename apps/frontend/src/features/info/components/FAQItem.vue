<template>
  <div class="faq-item">
    <button class="faq-question" @click="toggle">
      <span>{{ question }}</span>
      <v-icon :icon="isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
    </button>
    <transition name="fade-slide">
      <div v-show="isOpen" class="faq-answer">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface FAQItemProps {
  question: string;
}

defineProps<FAQItemProps>();

const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.faq-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
  background: white;
}

.faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  text-align: left;
  transition: background-color 0.3s ease;
}

.faq-question:hover {
  background-color: #f8f9fa;
}

.faq-answer {
  padding: 0 24px 20px 24px;
  font-size: 15px;
  line-height: 1.8;
  color: #444;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
