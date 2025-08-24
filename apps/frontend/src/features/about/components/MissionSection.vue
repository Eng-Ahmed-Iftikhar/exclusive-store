<template>
  <section class="mission-section py-16">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" lg="8" class="text-center">
          <h2 class="text-h3 font-weight-bold mb-6">{{ title }}</h2>
          <p class="text-h6 text-medium-emphasis mb-8">
            {{ description }}
          </p>
          <div class="mission-stats">
            <v-row>
              <v-col cols="12" sm="4" v-for="stat in stats" :key="stat.label">
                <div class="stat-item">
                  <div class="stat-number">{{ stat.value }}</div>
                  <div class="stat-label">{{ stat.label }}</div>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
interface Stat {
  value: string;
  label: string;
}

interface MissionSectionProps {
  title: string;
  description: string;
  stats: Stat[];
}

defineProps<MissionSectionProps>();
</script>

<style scoped>
.mission-section {
  background: white;
}

.mission-stats {
  margin-top: 48px;
}

.stat-item {
  text-align: center;
  padding: 24px;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 1.1rem;
  color: #666;
  font-weight: 500;
}
</style>
