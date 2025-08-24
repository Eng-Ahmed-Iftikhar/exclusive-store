<template>
  <section class="story-section py-16 bg-grey-lighten-5">
    <v-container>
      <v-row align="center">
        <v-col cols="12" md="6">
          <h2 class="text-h3 font-weight-bold mb-6">{{ title }}</h2>
          <div v-for="(paragraph, index) in paragraphs" :key="index" class="mb-4">
            <p class="text-body-1 text-medium-emphasis">{{ paragraph }}</p>
          </div>
        </v-col>
        <v-col cols="12" md="6" class="text-center">
          <v-img
            :src="imageSrc"
            :alt="imageAlt"
            class="rounded-lg"
            max-height="400"
            cover
          />
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
interface StorySectionProps {
  title: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
}

defineProps<StorySectionProps>();
</script>

<style scoped>
.story-section {
  background: #f8f9fa;
}
</style>
