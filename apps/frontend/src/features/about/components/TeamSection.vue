<template>
  <section class="team-section py-16 bg-grey-lighten-5">
    <v-container>
      <v-row justify="center" class="mb-12">
        <v-col cols="12" class="text-center">
          <h2 class="text-h3 font-weight-bold mb-6">Meet Our Team</h2>
          <p class="text-h6 text-medium-emphasis">
            The passionate people behind Exclusive
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" lg="3" v-for="member in team" :key="member.name">
          <TeamMember :member="member" />
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import TeamMember from './TeamMember.vue'

interface TeamMember {
  name: string;
  position: string;
  bio: string;
  image: string;
}

interface TeamSectionProps {
  team: TeamMember[];
}

defineProps<TeamSectionProps>();
</script>

<style scoped>
.team-section {
  background: #f8f9fa;
}
</style>
