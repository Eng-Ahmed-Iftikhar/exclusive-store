<template>
  <section class="cta-section py-16">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8" class="text-center">
          <h2 class="text-h3 font-weight-bold text-white mb-6">
            {{ title }}
          </h2>
          <p class="text-h6 text-white text-opacity-90 mb-8">
            {{ subtitle }}
          </p>
          <div class="cta-buttons">
            <v-btn
              v-for="button in buttons"
              :key="button.text"
              :to="button.to"
              :color="button.color"
              :variant="button.variant"
              size="large"
              class="px-8 me-4 mb-2"
              :prepend-icon="button.icon"
            >
              {{ button.text }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
interface CTAButton {
  text: string;
  to: string;
  color: string;
  variant: string;
  icon: string;
}

interface CTASectionProps {
  title: string;
  subtitle: string;
  buttons: CTAButton[];
}

defineProps<CTASectionProps>();
</script>

<style scoped>
.cta-section {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}

.cta-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

@media (max-width: 600px) {
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-buttons .v-btn {
    margin: 0 0 16px 0 !important;
  }
}
</style>
