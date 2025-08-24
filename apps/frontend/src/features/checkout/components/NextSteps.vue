<template>
  <v-card class="next-steps-card mb-8 pa-6" color="info" variant="tonal">
    <h3 class="text-h6 font-weight-semibold text-info-darken-1 mb-4 text-center">What happens next?</h3>
    <div class="steps-list">
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="step-item"
      >
        <div class="step-content">
          <div class="step-indicator">
            <v-icon color="info" size="16">mdi-circle</v-icon>
          </div>
          <span class="step-text">{{ step }}</span>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
interface NextStepsProps {
  steps?: string[];
}

const props = withDefaults(defineProps<NextStepsProps>(), {
  steps: () => [
    "You'll receive an order confirmation email shortly",
    "We'll process your order and prepare it for shipping",
    "You'll receive tracking information once your order ships"
  ]
});
</script>

<style scoped>
.next-steps-card {
  margin-bottom: 32px;
  border-radius: 8px;
  border: 1px solid rgba(33, 150, 243, 0.2);
}

.steps-list {
  text-align: left;
}

.step-item {
  margin-bottom: 16px;
}

.step-item:last-child {
  margin-bottom: 0;
}

.step-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.step-text {
  color: #1976d2;
  font-size: 14px;
  line-height: 1.4;
  flex: 1;
}
</style>
