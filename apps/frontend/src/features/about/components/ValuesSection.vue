<template>
  <section class="values-section py-16">
    <v-container>
      <v-row justify="center" class="mb-12">
        <v-col cols="12" class="text-center">
          <h2 class="text-h3 font-weight-bold mb-6">{{ title }}</h2>
          <p class="text-h6 text-medium-emphasis">
            {{ subtitle }}
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" lg="3" v-for="value in values" :key="value.title">
          <v-card class="value-card text-center pa-6 h-100" variant="outlined">
            <v-avatar size="80" color="primary" class="mb-4">
              <v-icon size="40" color="white">{{ value.icon }}</v-icon>
            </v-avatar>
            <h3 class="text-h6 font-weight-semibold mb-3">{{ value.title }}</h3>
            <p class="text-body-2 text-medium-emphasis">{{ value.description }}</p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
interface Value {
  icon: string;
  title: string;
  description: string;
}

interface ValuesSectionProps {
  title: string;
  subtitle: string;
  values: Value[];
}

defineProps<ValuesSectionProps>();
</script>

<style scoped>
.values-section {
  background: white;
}

.value-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e0e0e0;
}

.value-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
</style>
