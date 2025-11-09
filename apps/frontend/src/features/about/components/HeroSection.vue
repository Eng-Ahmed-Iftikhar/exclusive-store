<template>
  <section class="hero-section">
    <v-container class="py-16">
      <v-row justify="center" align="center">
        <v-col cols="12" md="8" class="text-center">
          <h1 class="text-h2 font-weight-bold text-white mb-6">
            {{ title }}
          </h1>
          <p class="text-h5 text-white text-opacity-90 mb-8">
            {{ subtitle }}
          </p>
          <v-btn
            v-if="showButton"
            color="primary"
            size="large"
            class="px-8"
            :prepend-icon="buttonIcon"
            @click="$emit('buttonClick')"
          >
            {{ buttonText }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
interface HeroSectionProps {
  title: string;
  subtitle: string;
  showButton?: boolean;
  buttonText?: string;
  buttonIcon?: string;
}

withDefaults(defineProps<HeroSectionProps>(), {
  showButton: true,
  buttonText: 'Learn More',
  buttonIcon: 'mdi-arrow-right',
});

defineEmits<{
  buttonClick: [];
}>();
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 60vh;
  display: flex;
  align-items: center;
}

@media (max-width: 600px) {
  .hero-section {
    min-height: 50vh;
  }

  .text-h2 {
    font-size: 2.5rem !important;
  }
}
</style>
